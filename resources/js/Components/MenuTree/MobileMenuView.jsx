import React, { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Folder,
    File,
    Edit,
    Plus,
    ArrowLeft,
    ChevronDown as ChevronDownIcon,
} from "lucide-react";

const MobileMenuView = ({
    menus,
    selectedMenu,
    onMenuSelect,
    expandedItems,
    onToggleExpand,
}) => {
    const [view, setView] = useState("tree"); // 'tree' or 'form'

    const renderMenuTree = (items, level = 0) => {
        return items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.id);
            const isSelected = selectedMenu?.id === item.id;

            return (
                <div key={item.id}>
                    <div
                        className={`flex items-center justify-between py-3 px-4 border-b border-gray-200 ${
                            isSelected ? "bg-blue-50" : "bg-white"
                        }`}
                        style={{ paddingLeft: `${level * 16 + 16}px` }}
                    >
                        <div className="flex items-center flex-1">
                            {hasChildren && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleExpand(item.id);
                                    }}
                                    className="p-1 mr-2 text-gray-500"
                                >
                                    {isExpanded ? (
                                        <ChevronDown size={18} />
                                    ) : (
                                        <ChevronRight size={18} />
                                    )}
                                </button>
                            )}

                            {!hasChildren && <div className="w-8" />}

                            <div
                                className="flex items-center flex-1"
                                onClick={() => onMenuSelect(item)}
                            >
                                <div className="mr-3 text-gray-500">
                                    {hasChildren ? (
                                        <Folder size={18} />
                                    ) : (
                                        <File size={18} />
                                    )}
                                </div>
                                <span className="text-gray-900">
                                    {item.name}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                onMenuSelect(item);
                                setView("form");
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                            <Edit size={16} />
                        </button>
                    </div>

                    {hasChildren && isExpanded && (
                        <div>{renderMenuTree(item.children, level + 1)}</div>
                    )}
                </div>
            );
        });
    };

    if (view === "form") {
        return (
            <div className="bg-white min-h-screen p-4">
                <button
                    onClick={() => {
                        setView("tree");
                        onMenuSelect(null);
                    }}
                    className="mb-4 flex items-center text-blue-600 font-medium"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Tree
                </button>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                        {selectedMenu ? "Edit Menu" : "Create Menu"}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                defaultValue={selectedMenu?.name || ""}
                                placeholder="Menu name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Order
                            </label>
                            <input
                                type="number"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                defaultValue={selectedMenu?.order || ""}
                                placeholder="Order"
                            />
                        </div>

                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Dropdown System Management - Dibawah Logo */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Menu Tree
                    </h2>
                    <button
                        onClick={() => {
                            onMenuSelect(null);
                            setView("form");
                        }}
                        className="p-2 bg-blue-600 text-white rounded-lg"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Dropdown System Management */}
                <div className="relative">
                    <select className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option>system management</option>
                        <option>Users & Groups</option>
                        <option>Competition</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Control Buttons */}
                <div className="flex space-x-2 mt-3">
                    <button className="flex-1 bg-gray-900 text-white py-2 px-3 text-sm rounded-md flex items-center justify-center">
                        <Plus size={16} className="mr-1" />
                        Expand All
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 text-sm rounded-md flex items-center justify-center">
                        <ChevronDown size={16} className="mr-1" />
                        Collapse All
                    </button>
                </div>
            </div>

            {/* Menu Tree Content */}
            <div>
                {menus.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No menus available</p>
                        <button
                            onClick={() => {
                                onMenuSelect(null);
                                setView("form");
                            }}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Create First Menu
                        </button>
                    </div>
                ) : (
                    renderMenuTree(menus)
                )}
            </div>
        </div>
    );
};

export default MobileMenuView;
