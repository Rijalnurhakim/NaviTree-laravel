import React from "react";

const SimpleMobileView = () => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Mobile View</h2>
            <p className="text-gray-600">
                Mobile content will be displayed here
            </p>
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <p>
                    Check console for errors and ensure all components are
                    properly imported.
                </p>
            </div>
        </div>
    );
};

export default SimpleMobileView;
