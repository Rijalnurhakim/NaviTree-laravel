import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";

const MenuFormPanel = ({ menu, onSave, onCancel, isCreatingChild = false }) => {
    const [formData, setFormData] = useState({
        name: "",
        parent_id: "",
        order: "",
        depth: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (menu && isCreatingChild) {
            setFormData({
                name: "",
                parent_id: menu.id,
                order: "",
                depth: "2",
            });
        } else if (menu) {
            setFormData({
                name: menu.name || "",
                parent_id: menu.parent_id || "",
                order: menu.order || "",
                depth: "3",
            });
        } else {
            setFormData({
                name: "",
                parent_id: "",
                order: "",
                depth: "1",
            });
        }
        setError("");
    }, [menu, isCreatingChild]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = menu ? `/api/menus/${menu.id}` : "/api/menus";
            const method = menu ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({
                    name: formData.name,
                    parent_id: formData.parent_id || null,
                    order: parseInt(formData.order) || 0,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || `HTTP error! status: ${response.status}`
                );
            }

            if (data.success) {
                onSave();
                if (!menu) {
                    setFormData({
                        name: "",
                        parent_id: "",
                        order: "",
                        depth: "3",
                    });
                }
            } else {
                setError(data.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving menu:", error);
            setError(error.message || "Failed to save menu");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="h-full bg-white">
            {/* Hapus border dari header */}
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    {isCreatingChild
                        ? "Create Child Menu"
                        : menu
                        ? "Edit Menu"
                        : "Create New Menu"}
                </h2>
                {isCreatingChild && menu && (
                    <p className="text-sm text-gray-600 mt-1">
                        Parent: {menu.name}
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {" "}
                {/* Kurangi padding */}
                {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}
                {/* Menu ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        MenuID
                    </label>
                    <input
                        type="text"
                        value={menu?.id || "New Menu"}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-md"
                    />
                </div>
                {/* Depth */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Depth
                    </label>
                    <input
                        name="depth"
                        type="number"
                        value={formData.depth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        min="1"
                        max="10"
                    />
                </div>
                {/* Parent Data */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Data
                    </label>
                    <select
                        name="parent_id"
                        value={formData.parent_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isCreatingChild}
                    >
                        <option value="">Select Parent Menu</option>
                        <option value="1">Systems</option>
                        <option value="2">System Management</option>
                    </select>
                </div>
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                    </label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                        placeholder="Enter menu name"
                    />
                </div>
                {/* Order */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                    </label>
                    <input
                        name="order"
                        type="number"
                        value={formData.order}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        min="0"
                        placeholder="Display order"
                    />
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
                    >
                        <Save size={16} className="mr-2" />
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MenuFormPanel;
