import React, { useState, useEffect } from "react";
import MainLayout from "../../Components/MainLayout";
import MenuTree from "../../Components/MenuTree/MenuTree";
import MenuModal from "../../Components/MenuTree/MenuModal";
import { Plus } from "lucide-react";

const MenusIndex = () => {
    const [menus, setMenus] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/menus");
            const data = await response.json();
            if (data.success) {
                setMenus(data.data);
            }
        } catch (error) {
            console.error("Error fetching menus:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMenu = () => {
        setEditingMenu(null);
        setIsModalOpen(true);
    };

    const handleEditMenu = (menu) => {
        setEditingMenu(menu);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingMenu(null);
        fetchMenus(); // Refresh data after modal closes
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Menu Structure
                            </h2>
                            <p className="text-sm text-gray-600">
                                Manage your navigation menu hierarchy
                            </p>
                        </div>
                        <button
                            onClick={handleCreateMenu}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Menu</span>
                        </button>
                    </div>
                </div>

                {/* Menu Tree Content */}
                <div className="p-6">
                    {menus.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Plus size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No menus yet
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Get started by creating your first menu item
                            </p>
                            <button
                                onClick={handleCreateMenu}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            >
                                Create First Menu
                            </button>
                        </div>
                    ) : (
                        <MenuTree
                            menus={menus}
                            onEdit={handleEditMenu}
                            onRefresh={fetchMenus}
                        />
                    )}
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <MenuModal
                    menu={editingMenu}
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                />
            )}
        </MainLayout>
    );
};

export default MenusIndex;
