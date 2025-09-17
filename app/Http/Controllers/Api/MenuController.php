<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MenuService;
use App\Exceptions\MenuNotFoundException;
use App\Exceptions\MenuValidationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class MenuController extends Controller
{
    /**
     * @var MenuService
     */
    protected $menuService;

    /**
     * MenuController constructor.
     */
    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    /**
     * Display a listing of the menus in tree structure.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $depth = $request->get('depth', 3);
            $useCache = $request->get('cache', true);

            $menus = $this->menuService->getMenuTree($depth, $useCache);

            return response()->json([
                'success' => true,
                'data' => $menus,
                'message' => 'Menus retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving menus: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve menus',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created menu in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'parent_id' => 'nullable|integer|exists:menus,id',
                'order' => 'sometimes|integer|min:0'
            ]);

            $menu = $this->menuService->createMenu($validatedData);

            return response()->json([
                'success' => true,
                'data' => $menu,
                'message' => 'Menu created successfully'
            ], Response::HTTP_CREATED);

        } catch (MenuValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => ['validation' => $e->getMessage()]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (\Exception $e) {
            Log::error('Error creating menu: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create menu',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified menu.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $menu = $this->menuService->findMenu($id);

            if (!$menu) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu not found'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $menu,
                'message' => 'Menu retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving menu: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve menu',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified menu in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'parent_id' => 'sometimes|nullable|integer|exists:menus,id',
                'order' => 'sometimes|integer|min:0'
            ]);

            $menu = $this->menuService->updateMenu($id, $validatedData);

            return response()->json([
                'success' => true,
                'data' => $menu,
                'message' => 'Menu updated successfully'
            ]);

        } catch (MenuNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);

        } catch (MenuValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => ['validation' => $e->getMessage()]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (\Exception $e) {
            Log::error('Error updating menu: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update menu',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified menu from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->menuService->deleteMenu($id);

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete menu'
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            return response()->json([
                'success' => true,
                'message' => 'Menu deleted successfully'
            ]);

        } catch (MenuNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);

        } catch (\Exception $e) {
            Log::error('Error deleting menu: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete menu: ' . $e->getMessage(),
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get children of a specific menu
     */
    public function children(int $id): JsonResponse
    {
        try {
            $children = $this->menuService->getMenuChildren($id);

            return response()->json([
                'success' => true,
                'data' => $children,
                'message' => 'Menu children retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving menu children: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve menu children',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Reorder menus
     */
    public function reorder(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'order' => 'required|array',
                'order.*.id' => 'required|integer|exists:menus,id',
                'order.*.order' => 'required|integer|min:0',
                'order.*.children' => 'sometimes|array'
            ]);

            $reordered = $this->menuService->reorderMenus($validatedData['order']);

            return response()->json([
                'success' => true,
                'message' => 'Menus reordered successfully'
            ]);

        } catch (MenuValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => ['validation' => $e->getMessage()]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (\Exception $e) {
            Log::error('Error reordering menus: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder menus',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
