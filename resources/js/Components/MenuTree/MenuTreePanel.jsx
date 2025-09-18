import React, { useState } from "react";
import { ChevronDown, ChevronRight, Folder, File, Plus } from "lucide-react";

const MenuTreePanel = ({
    menus,
    selectedMenu,
    onMenuSelect,
    expandedItems,
    onToggleExpand,
    onAddChild,
}) => {
    const [hoveredItem, setHoveredItem] = useState(null);

    const renderMenuTree = (items, level = 0) => {
        return items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.id);
            const isSelected = selectedMenu?.id === item.id;
            const isHovered = hoveredItem === item.id;

            return (
                <div key={item.id}>
                    {/* Menu Item - Hapus border dari sini */}
                    <div
                        className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-50 group ${
                            isSelected ? "bg-blue-50" : ""
                        }`}
                        style={{ paddingLeft: `${level * 20 + 12}px` }}
                        onClick={() => onMenuSelect(item)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        {/* Expand/Collapse Icon */}
                        {hasChildren && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleExpand(item.id);
                                }}
                                className="p-1 mr-1 text-gray-500 hover:text-gray-700"
                            >
                                {isExpanded ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                        )}

                        {!hasChildren && <div className="w-6" />}

                        {/* Folder/File Icon */}
                        <div className="mr-2 text-gray-500">
                            {hasChildren ? (
                                <Folder size={16} />
                            ) : (
                                <File size={16} />
                            )}
                        </div>

                        {/* Menu Name */}
                        <span className="text-sm text-gray-900 flex-1">
                            {item.name}
                        </span>

                        {/* Order Badge */}
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {item.order}
                        </span>

                        {/* Add Child Button - Hanya muncul saat hover/selected */}
                        {(isSelected || isHovered) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddChild(item);
                                }}
                                className="ml-2 p-1 rounded-full transition-all hover:bg-blue-900"
                                title="Add child menu"
                            >
                                <div className="w-6 h-6 bg-blue-800 flex items-center justify-center rounded-full">
                                    <Plus size={12} className="text-white" />
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Children */}
                    {hasChildren && isExpanded && (
                        <div>{renderMenuTree(item.children, level + 1)}</div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="h-full bg-white">
            {/* Hapus border dari header */}
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    Menu Tree
                </h2>
            </div>

            <div className="px-2">
                {" "}
                {/* Hapus padding yang tidak perlu */}
                {menus.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No menus available</p>
                    </div>
                ) : (
                    renderMenuTree(menus)
                )}
            </div>
        </div>
    );
};

export default MenuTreePanel;
