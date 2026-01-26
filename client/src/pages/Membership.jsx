import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllUsers, addMember, editMember, toggleUserStatus } from "../services/userService";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { MdAdd, MdEdit, MdSearch } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { Archive } from "lucide-react";
import AddMemberModal from "../components/AddMemberModal";
import EditMemberModal from "../components/EditMemberModal";
import ViewMemberModal from "../components/ViewMemberModal";
import ArchiveMemberModal from "../components/ArchiveMemberModal";

export default function Membership() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { token, toastSuccess } = useContext(AuthContext);

    const fetchUsers = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await getAllUsers(token);
            if (res.success && Array.isArray(res.users)) {
                setUsers(res.users);
            }
        } catch (err) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col md:ml-72 lg:ml-72">
                <TopBar />

                <div className="p-2 md:p-4">
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8 items-start md:items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">User Management</h2>

                        <div className="w-full md:w-auto grow flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 items-stretch md:items-center md:space-x-3">
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
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
                                onClick={() => setShowAddModal(true)}
                            >
                                <MdAdd className="mr-2" />
                                Add User
                            </button>
                            {/* Add Member Modal */}
                            <AddMemberModal
                                open={showAddModal}
                                onClose={() => setShowAddModal(false)}
                                onAdd={async (form) => {
                                    const res = await addMember(form, token);
                                    if (res && res.success) {
                                        toast.success(res.message || "User added successfully", { ...toastSuccess });
                                    }
                                    await fetchUsers();
                                }}
                            />
                            {/* Edit Member Modal */}
                            <EditMemberModal
                                open={showEditModal}
                                onClose={() => setShowEditModal(false)}
                                member={selectedUser}
                                onEdit={async (form) => {
                                    const res = await editMember(selectedUser.userId, form, token);
                                    if (res && res.success) {
                                        toast.success(res.message || "User updated successfully", { ...toastSuccess });
                                    }
                                    await fetchUsers();
                                }}
                            />
                            <ViewMemberModal
                                open={showViewModal}
                                onClose={() => setShowViewModal(false)}
                                member={selectedUser}
                            />
                            <ArchiveMemberModal
                                isOpen={showArchiveModal}
                                onClose={() => setShowArchiveModal(false)}
                                member={selectedUser}
                                onToggleStatus={async () => {
                                    const res = await toggleUserStatus(selectedUser.userId, token);
                                    if (res && res.success) {
                                        toast.success(res.message, { ...toastSuccess });
                                    }
                                    await fetchUsers();
                                }}
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-[600px] w-full text-sm md:text-base">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-4">No users found.</td></tr>
                                ) : (
                                    users.filter(user => {
                                        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                                        return (
                                            fullName.includes(searchQuery.toLowerCase()) ||
                                            user.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            user.userName.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                    }).map(user => (
                                        <tr key={user.userId} className="hover:bg-gray-50">
                                            <td className="px-2 md:px-6 py-4 text-black whitespace-nowrap">{user.firstName} {user.lastName}</td>
                                            <td className="px-2 md:px-6 py-4 text-black whitespace-nowrap">{user.emailAddress}</td>
                                            <td className="px-2 md:px-6 py-4 text-black whitespace-nowrap">{user.userName}</td>
                                            <td className="px-2 md:px-6 py-4 text-black whitespace-nowrap capitalize">{user.role === 'admin' || user.role === 'superadmin' ? 'Admin' : 'User'}</td>
                                            <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'archived' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                    {user.status === 'archived' ? 'Archived' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-2 md:px-6 py-4 text-black whitespace-nowrap flex gap-2">
                                                <button className="text-gray-600 hover:text-gray-900" title="View" onClick={() => { setSelectedUser(user); setShowViewModal(true); }}>
                                                    <IoPersonSharp />
                                                </button>
                                                <button className="text-blue-600 hover:text-blue-900" title="Edit" onClick={() => { setSelectedUser(user); setShowEditModal(true); }}><MdEdit /></button>
                                                <button
                                                    className={`${user.status === 'archived' ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                                                    title={user.status === 'archived' ? 'Activate' : 'Archive'}
                                                    onClick={() => { setSelectedUser(user); setShowArchiveModal(true); }}
                                                >
                                                    <Archive size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}