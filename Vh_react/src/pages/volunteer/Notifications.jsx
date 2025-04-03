import React from "react";
import { FaCheckCircle } from "react-icons/fa";

function Notifications({ notifications, markAllAsRead }) {
    return (
        <div className="absolute z-20 top-12 right-0 bg-[#1E1E2E]/90 backdrop-blur-lg p-4 rounded-xl shadow-2xl w-80 text-white border border-gray-700">
            {/* Header Section */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-600">
                <h3 className="font-semibold text-lg text-gray-300">🔔 Notifications</h3>
                <button 
                    onClick={markAllAsRead} 
                    className="text-blue-400 text-sm hover:text-blue-300 transition duration-200"
                >
                    Mark all as read
                </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar mt-2 space-y-2">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div 
                            key={index} 
                            className="flex items-center p-3 bg-gray-800/50 hover:bg-gray-700 transition-all rounded-lg shadow-sm border border-gray-700"
                        >
                            <FaCheckCircle className="text-green-400 mr-3 text-lg" />
                            <p className="text-sm text-gray-300">{notification.message}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-4">No new notifications</p>
                )}
            </div>
        </div>
    );
}

export default Notifications;
