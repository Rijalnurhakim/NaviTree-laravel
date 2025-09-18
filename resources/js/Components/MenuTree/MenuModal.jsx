import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const MenuModal = ({ menu, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        parent_id: "",
        order: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (menu) {
            // Cek apakah ini edit existing menu atau create new child
            if (menu.isNew) {
                // CREATE NEW CHILD - hanya set parent_id
                setFormData({
                    name: "",
                    parent_id: menu.parent_id || "",
                    order: "",
                });
                setIsEditing(false);
            } else {
                // EDIT EXISTING MENU - set semua data
                setFormData({
                    name: menu.name || "",
                    parent_id: menu.parent_id || "",
                    order: menu.order || "",
                });
                setIsEditing(true);
            }
        } else {
            // CREATE NEW ROOT MENU
            setFormData({
                name: "",
                parent_id: "",
                order: "",
            });
            setIsEditing(false);
        }
        setError("");
    }, [menu, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let url, method;

            if (isEditing && menu && !menu.isNew) {
                // EDIT EXISTING MENU - pastikan menu.id adalah number
                url = `/api/menus/${Number(menu.id)}`;
                method = "PUT";
            } else {
                // CREATE NEW MENU (root atau child)
                url = "/api/menus";
                method = "POST";
            }

            console.log("Submitting:", { url, method, formData });

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("Response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || `HTTP error! status: ${response.status}`
                );
            }

            if (data.success) {
                onClose();
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
            [name]:
                name === "parent_id" || name === "order"
                    ? value === ""
                        ? ""
                        : Number(value)
                    : value,
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isEditing ? "Edit Menu" : "Create New Menu"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Menu Name *
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                            placeholder="Enter menu name"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="parent_id"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Parent Menu ID
                        </label>
                        <input
                            id="parent_id"
                            name="parent_id"
                            type="number"
                            value={formData.parent_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading || isEditing}
                            placeholder="Optional parent menu ID"
                            min="0"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="order"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Order
                        </label>
                        <input
                            id="order"
                            name="order"
                            type="number"
                            value={formData.order}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                            placeholder="Display order"
                            min="0"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                ? "Update"
                                : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuModal;
