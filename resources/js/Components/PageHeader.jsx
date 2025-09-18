import React from "react";
import { ChevronDown, Expand, Shrink } from "lucide-react";

const PageHeader = ({
    title,
    onExpandAll,
    onCollapseAll,
    showControls = true,
}) => {
    return (
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-1">
                            {[...Array(9)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 h-1 bg-blue-600 rounded"
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h1>
                        <nav className="text-sm text-gray-600">
                            <span>Menu</span>
                        </nav>
                    </div>
                </div>

                {showControls && (
                    <div className="flex items-center space-x-4">
                        <div className="hidden lg:block relative">
                            <select className="pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>system management</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={onExpandAll}
                                className="px-3 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 flex items-center space-x-1"
                            >
                                <Expand size={16} />
                                <span className="hidden lg:inline">
                                    Expand All
                                </span>
                            </button>
                            <button
                                onClick={onCollapseAll}
                                className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 flex items-center space-x-1"
                            >
                                <Shrink size={16} />
                                <span className="hidden lg:inline">
                                    Collapse All
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
