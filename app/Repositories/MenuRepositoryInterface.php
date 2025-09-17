<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MenuRepositoryInterface
{
    /**
     * Get all menus with tree structure
     */
    public function all(): Collection;

    /**
     * Find menu by ID
     */
    public function find(int $id): ?Menu;

    /**
     * Create a new menu
     */
    public function create(array $data): Menu;

    /**
     * Update an existing menu
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete a menu
     */
    public function delete(int $id): bool;

    /**
     * Get menu tree hierarchy
     */
    public function getTree(): Collection;

    /**
     * Get children by parent ID
     */
    public function getChildren(int $parentId): Collection;

    /**
     * Get root menus (no parent)
     */
    public function getRootMenus(): Collection;

    /**
     * Reorder menus
     */
    public function reorder(array $orderData): bool;


    public function getTreeWithDepth(int $depth = 3): Collection;

    public function paginate(int $perPage = 15): LengthAwarePaginator;

}
