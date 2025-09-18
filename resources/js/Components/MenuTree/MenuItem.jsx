import React, { useState } from "react";
import { ChevronRight, ChevronDown, Edit, Trash2, Plus } from "lucide-react";

const MenuItem = ({ menu, level, onEdit, onRefresh }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = menu.children && menu.children.length > 0;

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${menu.name}"?`)) {
            try {
                const response = await fetch(`/api/menus/${menu.id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    onRefresh();
                } else {
                    alert(data.message || "Failed to delete menu");
                }
            } catch (error) {
                console.error("Error deleting menu:", error);
                alert("Error deleting menu");
            }
        }
    };

    const handleAddChild = () => {
        // Kirim data untuk CREATE child menu, bukan EDIT
        onEdit({
            parent_id: menu.id,
            isNew: true, // Flag untuk menandakan ini create new child
        });
    };

    const handleEdit = () => {
        // Kirim data untuk EDIT menu yang ada
        onEdit({
            ...menu,
            isNew: false, // Flag untuk menandakan ini edit existing
        });
    };

    return (
        <div className="border border-gray-200 rounded-lg">
            <div
                className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                style={{ paddingLeft: `${level * 24 + 16}px` }}
            >
                <div className="flex items-center space-x-3">
                    {hasChildren && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>
                    )}
                    {!hasChildren && <div className="w-6" />}

                    <span className="font-medium text-gray-900">
                        {menu.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Order: {menu.order}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleEdit}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit menu"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete menu"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={handleAddChild}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Add child menu"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div className="pl-6 space-y-1">
                    {menu.children.map((child) => (
                        <MenuItem
                            key={child.id}
                            menu={child}
                            level={level + 1}
                            onEdit={onEdit}
                            onRefresh={onRefresh}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuItem;
