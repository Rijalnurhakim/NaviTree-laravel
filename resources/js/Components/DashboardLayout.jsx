import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const DashboardLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:static
            `}
            >
                <div className="p-4 border-b border-blue-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-1">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 h-1 bg-blue-800 rounded"
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <span className="font-semibold">System_menus</span>
                    </div>

                    {isMobile && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 text-blue-200 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav className="p-4">
                    <div className="space-y-1">
                        {[
                            "Systems",
                            "System Code",
                            "Properties",
                            "Menus",
                            "API List",
                            "Users & Groups",
                            "Competition",
                        ].map((item) => (
                            <div
                                key={item}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    item === "Menus"
                                        ? "bg-white text-gray-900"
                                        : "text-blue-100 hover:bg-blue-700"
                                }`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header - Logo tetap visible */}
                {isMobile && (
                    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 text-gray-600 hover:text-gray-900"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <div className="grid grid-cols-3 gap-1">
                                        {[...Array(9)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 h-1 bg-blue-600 rounded"
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                <span className="font-semibold text-gray-900">
                                    Menus
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
