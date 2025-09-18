<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class MenuRepository implements MenuRepositoryInterface
{
    public function all(): Collection
    {
        return Menu::all();
    }

    public function find(int $id): ?Menu
    {
        return Menu::find($id);
    }

    public function create(array $data): Menu
    {
        return Menu::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $menu = $this->find($id);
        return $menu ? $menu->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $menu = $this->find($id);
        return $menu ? $menu->delete() : false;
    }

    public function getTree(): Collection
    {
        return $this->getTreeWithDepth(3); // Default 3 levels deep
    }

    public function getTreeWithDepth(int $depth = 3): Collection
    {
        $query = Menu::with($this->buildEagerLoadString($depth))
                   ->root()
                   ->orderBy('order');

        return $query->get();
    }

    public function getChildren(int $parentId): Collection
    {
        return Menu::where('parent_id', $parentId)
                   ->orderBy('order')
                   ->get();
    }

    public function getRootMenus(): Collection
    {
        return Menu::root()->orderBy('order')->get();
    }

    public function reorder(array $orderData): bool
    {
        foreach ($orderData as $item) {
            Menu::where('id', $item['id'])->update(['order' => $item['order']]);

            if (isset($item['children'])) {
                $this->reorder($item['children']);
            }
        }

        return true;
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Menu::paginate($perPage);
    }

    private function buildEagerLoadString(int $depth, string $relation = 'children'): string
    {
        if ($depth <= 1) {
            return $relation;
        }

        $result = $relation;
        for ($i = 1; $i < $depth; $i++) {
            $result .= ".{$relation}";
        }

        return $result;
    }

}
