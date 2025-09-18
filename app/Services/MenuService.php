<?php

namespace App\Services;

use App\Repositories\MenuRepositoryInterface;
use App\Models\Menu;
use App\Exceptions\MenuNotFoundException;
use App\Exceptions\MenuValidationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MenuService
{
    protected MenuRepositoryInterface $menuRepository;

    public function __construct(MenuRepositoryInterface $menuRepository)
    {
        $this->menuRepository = $menuRepository;
    }

    public function getAllMenus(): Collection
    {
        return $this->menuRepository->all();
    }

    public function getMenuTree(int $depth = 3, bool $useCache = true): Collection
    {
        if ($useCache) {
            return Cache::remember("menu_tree_depth_{$depth}", 3600, function () use ($depth) {
                return $this->menuRepository->getTreeWithDepth($depth);
            });
        }

        return $this->menuRepository->getTreeWithDepth($depth);
    }

    public function findMenu(int $id): ?Menu
    {
        return $this->menuRepository->find($id);
    }

    public function createMenu(array $data): Menu
    {
        return DB::transaction(function () use ($data) {
            $this->validateMenuData($data);

            if (!isset($data['order'])) {
                $data['order'] = $this->getNextOrder($data['parent_id'] ?? null);
            }

            $menu = $this->menuRepository->create($data);

            // Clear cache after creation
            $this->clearMenuCache();

            return $menu;
        });
    }

    public function updateMenu(int $id, array $data): Menu
    {
        return DB::transaction(function () use ($id, $data) {
            $menu = $this->menuRepository->find($id);

            if (!$menu) {
                throw new MenuNotFoundException("Menu with ID {$id} not found");
            }

            $this->validateMenuData($data, $id);

            $updated = $this->menuRepository->update($id, $data);

            if (!$updated) {
                throw new \RuntimeException("Failed to update menu with ID {$id}");
            }

            // Clear cache after update
            $this->clearMenuCache();

            return $this->menuRepository->find($id);
        });
    }

    public function deleteMenu(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $menu = $this->menuRepository->find($id);

            if (!$menu) {
                throw new MenuNotFoundException("Menu with ID {$id} not found");
            }

            if ($menu->children()->count() > 0) {
                throw new \RuntimeException("Cannot delete menu with children. Please delete children first.");
            }

            $deleted = $this->menuRepository->delete($id);

            if ($deleted) {
                $this->clearMenuCache();
            }

            return $deleted;
        });
    }

    public function getMenuChildren(int $parentId): Collection
    {
        return $this->menuRepository->getChildren($parentId);
    }

    public function reorderMenus(array $orderData): bool
    {
        return DB::transaction(function () use ($orderData) {
            $reordered = $this->menuRepository->reorder($orderData);

            if ($reordered) {
                $this->clearMenuCache();
            }

            return $reordered;
        });
    }

    public function paginateMenus(int $perPage = 15): LengthAwarePaginator
    {
        return $this->menuRepository->paginate($perPage);
    }

    private function validateMenuData(array $data, ?int $id = null): void
    {
        $rules = [
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'integer|min:0',
        ];

        if ($id) {
            $rules['parent_id'] = 'nullable|exists:menus,id|not_in:' . $id;
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new MenuValidationException($validator->errors()->first());
        }
    }

    private function getNextOrder(?int $parentId = null): int
    {
        $lastOrder = Menu::where('parent_id', $parentId)->max('order');
        return ($lastOrder ?? 0) + 1;
    }


    private function clearMenuCache(): void
    {
        for ($depth = 1; $depth <= 5; $depth++) {
            Cache::forget("menu_tree_depth_{$depth}");
        }
    }
}
