import React, { useState, useEffect } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import PageHeader from "../../Components/PageHeader";
import MenuTreePanel from "../../Components/MenuTree/MenuTreePanel";
import MenuFormPanel from "../../Components/MenuTree/MenuFormPanel";
import MobileMenuView from "../../Components/MenuTree/MobileMenuView";

const MenusIndex = () => {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formMode, setFormMode] = useState("edit"); // 'edit' or 'create-child'

    useEffect(() => {
        const initialize = async () => {
            try {
                await fetchMenus();
                const handleResize = () => setIsMobile(window.innerWidth < 768);
                handleResize();
                window.addEventListener("resize", handleResize);

                return () => window.removeEventListener("resize", handleResize);
            } catch (err) {
                console.error("Initialization error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/menus");
            const data = await response.json();
            if (data.success) {
                setMenus(data.data);
            } else {
                throw new Error(data.message || "Failed to fetch menus");
            }
        } catch (error) {
            console.error("Error fetching menus:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExpandAll = () => {
        const allIds = new Set();
        const collectIds = (items) => {
            items.forEach((item) => {
                allIds.add(item.id);
                if (item.children) collectIds(item.children);
            });
        };
        collectIds(menus);
        setExpandedItems(allIds);
    };

    const handleCollapseAll = () => {
        setExpandedItems(new Set());
    };

    const handleMenuSelect = (menu) => {
        setSelectedMenu(menu);
        setFormMode("edit"); // Set mode ke edit saat menu dipilih
    };

    const handleAddChild = (parentMenu) => {
        setSelectedMenu(parentMenu);
        setFormMode("create-child"); // Set mode ke create-child saat + diklik
    };

    const handleCancelForm = () => {
        setSelectedMenu(null);
        setFormMode("edit");
    };

    const handleSaveSuccess = () => {
        fetchMenus();
        setFormMode("edit");
        setSelectedMenu(null);
    };

    // Tampilkan loading state
    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading menus...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Tampilkan error jika ada
    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-xl text-red-600 mb-4">
                            Error Loading Page
                        </h2>
                        <p className="text-gray-600">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // For mobile view
    if (isMobile) {
        return (
            <DashboardLayout>
                <div className="flex-1 overflow-auto">
                    <MobileMenuView
                        menus={menus}
                        selectedMenu={selectedMenu}
                        onMenuSelect={handleMenuSelect}
                        expandedItems={expandedItems}
                        onToggleExpand={(id) => {
                            const newExpanded = new Set(expandedItems);
                            if (newExpanded.has(id)) {
                                newExpanded.delete(id);
                            } else {
                                newExpanded.add(id);
                            }
                            setExpandedItems(newExpanded);
                        }}
                    />
                </div>
            </DashboardLayout>
        );
    }

    // Desktop view - 50:50 layout
    return (
        <DashboardLayout>
            <div className="flex-1 flex flex-col overflow-hidden">
                <PageHeader
                    title="Menus"
                    onExpandAll={handleExpandAll}
                    onCollapseAll={handleCollapseAll}
                />

                <div className="flex-1 flex overflow-hidden">
                    {/* Tree Panel - 50% width */}
                    <div className="w-1/2 overflow-auto">
                        <MenuTreePanel
                            menus={menus}
                            selectedMenu={selectedMenu}
                            onMenuSelect={handleMenuSelect}
                            expandedItems={expandedItems}
                            onToggleExpand={(id) => {
                                const newExpanded = new Set(expandedItems);
                                if (newExpanded.has(id)) {
                                    newExpanded.delete(id);
                                } else {
                                    newExpanded.add(id);
                                }
                                setExpandedItems(newExpanded);
                            }}
                            onAddChild={handleAddChild}
                        />
                    </div>

                    {/* Form Panel - 50% width */}
                    <div className="w-1/2 overflow-auto">
                        <MenuFormPanel
                            menu={selectedMenu}
                            onSave={handleSaveSuccess}
                            onCancel={handleCancelForm}
                            isCreatingChild={formMode === "create-child"}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MenusIndex;
