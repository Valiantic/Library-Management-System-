import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { MdAdd, MdEdit, MdDelete, MdBookmark, MdSearch } from "react-icons/md";

export default function Membership() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <TopBar />

                <div className="p-4">
                    <div className="flex flex-wrap gap-8 items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

                        <div className="grow flex flex-wrap gap-4 items-center space-x-3">
                            <div className="flex grow relative">
                                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search User..."
                                    className="grow pl-10 pr-4 py-2 text-black rounded-md border border-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <MdAdd className="mr-2" />
                                Add User
                            </button>
                        </div>
                    </div>

                    {/* Books Table */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}