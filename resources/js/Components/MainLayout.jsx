import React from "react";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                NaviTree
                            </h1>
                            <p className="text-sm text-gray-600">
                                Menu Management System
                            </p>
                        </div>
                        <nav className="flex space-x-4">
                            {/* Navigation items can be added here */}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
