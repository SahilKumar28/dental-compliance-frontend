"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, Loader2, Edit, Trash2 } from 'lucide-react';
import { memberService } from '@/lib/api/member-service';
import MemberModal from './MemberModal';
import toast, { Toaster } from 'react-hot-toast';
import { rolePermissionService } from '@/lib/api/role-permission-service';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

type Role = {
    id: number;
    name: string;
    description?: string | null;
};

type Member = {
    id: number;
    user_id?: number;
    name: string;
    email: string;
    roles?: Role[];
    role?: Role;
    status?: string;
    created_at?: string;
    first_name?: string;
    last_name?: string;
    role_ids?: number[];
};

export default function TeamMember() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [fetchingMember, setFetchingMember] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        roles: '',
        status: '',
        order_by: 'name',
        order: 'asc',
        page: 1,
        per_page: 10
    });

    const hasFetchedRef = useRef(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await rolePermissionService.getRolePermission();
                setRoles(Array.isArray(rolesData)? rolesData : []);
            } catch (error) {
                console.error("Roles fetch error:", error);
                toast.error("Could not load roles");
                setRoles([]);
            }
        };
        fetchRoles();
    }, []);

    const fetchMembers = async (currentFilters: typeof filters) => {
        setLoading(true);
        try {
            const response = await memberService.getPractices(currentFilters);
            setMembers(response?.data || []);
            setTotalResults(response?.total || 0);
        } catch (error) {
            console.error("Failed to fetch:", error);
            setMembers([]);
            setTotalResults(0);
            toast.error("Failed to fetch members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchMembers(filters);
        }
    }, []);

    useEffect(() => {
        if (hasFetchedRef.current) {
            const delayDebounceFn = setTimeout(() => {
                fetchMembers(filters);
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [filters.search, filters.page, filters.roles, filters.status, filters.order_by, filters.order]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({...prev, search: e.target.value, page: 1 }));
    };

    const openAddModal = () => {
        setSelectedMember(null);
        setIsModalOpen(true);
    };

    const openEditModal = async (memberId: number) => {
        setFetchingMember(true);
        const loadingToast = toast.loading("Loading member details...");

        try {
            const response = await memberService.getMemberById(memberId);
            const memberData = response?.data || response;

            let roleIds: number[] = [];
            if (memberData?.role?.id) {
                roleIds = [memberData.role.id];
            } else if (memberData?.roles?.length > 0) {
                roleIds = memberData.roles.map((r: Role) => r.id);
            }

            const finalMember: Member = {
         ...memberData,
                id: memberData.user_id || memberData.id,
                user_id: memberData.user_id || memberData.id,
                role_ids: roleIds,
                name: `${memberData.first_name || ''} ${memberData.last_name || ''}`.trim(),
            };

            setSelectedMember(finalMember);
            setIsModalOpen(true);
            toast.dismiss(loadingToast);
        } catch (error) {
            console.error("Failed to fetch member:", error);
            toast.error("Failed to load member details", { id: loadingToast });
        } finally {
            setFetchingMember(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        memberToDelete: null as Member | null,
        loading: false
    });

    const openDeleteModal = (member: Member) => {
        setDeleteModal({
            isOpen: true,
            memberToDelete: member,
            loading: false
        });
    };

    const handleDeleteMember = async () => {
        if (!deleteModal.memberToDelete?.id) {
            toast.error("Invalid member selected");
            return;
        }

        try {
            setDeleteModal(prev => ({...prev, loading: true }));
            await memberService.deleteMember(deleteModal.memberToDelete.id);
            toast.success("Member deleted successfully!");
            setDeleteModal({ isOpen: false, memberToDelete: null, loading: false });
            fetchMembers(filters);
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Admins can not be deleted");
            setDeleteModal(prev => ({...prev, loading: false }));
        }
    };

    const handleMemberSubmit = async (formData: any) => {
        const memberId = formData.memberId || selectedMember?.id || selectedMember?.user_id;
        const isEditing =!!memberId;
        const loadingToast = toast.loading(isEditing? "Updating roles..." : "Creating member...");

        try {
            if (isEditing) {
                await memberService.updateMember(memberId, {
                    role_ids: formData.role_ids
                });
                toast.success("Roles updated successfully!", { id: loadingToast });
            } else {
                const payload = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    role_ids: formData.role_ids,
                };
                await memberService.createMember(payload);
                toast.success("New member created successfully!", { id: loadingToast });
            }

            handleCloseModal();
            fetchMembers(filters);
        } catch (error: any) {
            console.error("API Error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong!", { id: loadingToast });
        }
    };

    return (
        <div className="min-h-screen text-slate-300">
            <Toaster position="top-right" />
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-wrap gap-3 flex-1 w-full">
                    <div className="relative flex-1 min-w- max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-color)]" size={18} />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={handleSearch}
                            placeholder="Search members..."
                            className="w-full bg-[var(--site-bg)] border border-[var(--text-color)] rounded-lg placeholder:text-[var(--text-color)] text-[var(--text-color)] py-2 pl-10 pr-4 focus:outline-none focus:border-indigo-500 text-sm"
                        />
                    </div>

                    <select
                        value={filters.roles}
                        onChange={(e) => setFilters(p => ({...p, roles: e.target.value, page: 1 }))}
                        className="bg-[var(--site-bg)] border border-[var(--text-color)] rounded-lg px-4 py-2 outline-none cursor-pointer text-sm text-[var(--text-color)] focus:border-indigo-500"
                    >
                        <option value="">All Roles</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                                {role.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(p => ({...p, status: e.target.value, page: 1 }))}
                        className="bg-[var(--site-bg)] border border-[var(--text-color)] rounded-lg px-4 py-2 outline-none cursor-pointer text-sm text-[var(--text-color)] focus:border-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <button
                    onClick={openAddModal}
                    className="w-full md:w-auto bg-[var(--text-color)] hover:bg-indigo-500 text-white px-4 py-2 border border-[var(--text-color)] rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm"
                >
                    <Plus size={18} /> Add Member
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-[var(--text-color)] bg-[var(--site-bg)] relative">
                {loading && (
                    <div className="absolute inset-0 bg-[#0f111a]/60 backdrop-blur-sm z-20 flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[var(--text-color)] text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Name</th>
                                <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Email</th>
                                <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Role</th>
                                <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Status</th>
                                <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Created At</th>
                                <th className="p-4 font-semibold text-right border-b border-slate-800 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {!loading && members.length === 0? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-500 italic">
                                        No members found in the records.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member.id} className="hover:bg-[var(--text-color)]/20 transition-colors group">
                                        <td className="p-4 font-medium text-[var(--text-color)] whitespace-nowrap">
                                            {member.name || 'N/A'}
                                        </td>
                                        <td className="p-4 text-[var(--text-color)] text-sm">{member.email}</td>
                                        <td className="p-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {member.roles?.length > 0? (
                                                    member.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="bg-[var(--text-color)] text-white px-2.5 py-0.5 rounded-md text-xs font-bold border border-indigo-500/20 uppercase tracking-tighter"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-500 text-xs italic">No Role</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'inactive'? 'bg-slate-500' : 'bg-emerald-500'}`} />
                                                <span className={`text-xs capitalize ${member.status === 'inactive'? 'text-slate-400' : 'text-emerald-400'}`}>
                                                    {member.status || 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[var(--text-color)] text-sm whitespace-nowrap">
                                            {member.created_at? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => openEditModal(member.id)}
                                                    disabled={fetchingMember}
                                                    className="p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors rounded-lg disabled:opacity-50"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(member)}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-[var(--text-color)] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800">
                    <p className="text-xs text-white">
                        Showing <span className="text-white">{totalResults > 0? (filters.page - 1) * filters.per_page + 1 : 0}</span> to <span className="text-white">{Math.min(filters.page * filters.per_page, totalResults)}</span> of <span className="text-white">{totalResults}</span> results
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={filters.page === 1 || loading}
                            onClick={() => setFilters(f => ({...f, page: f.page - 1 }))}
                            className="p-1.5 rounded-lg border border-white text-white hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="bg-[var(--site-bg)] px-3 py-2 rounded-lg border border-slate-700 text-xs font-bold text-[var(--text-color)]">
                            {filters.page}
                        </div>

                        <button
                            disabled={members.length < filters.per_page || loading}
                            onClick={() => setFilters(f => ({...f, page: f.page + 1 }))}
                            className="p-1.5 rounded-lg border border-white text-white hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <MemberModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleMemberSubmit}
                member={selectedMember}
                roles={roles}
            />
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, memberToDelete: null, loading: false })}
                onConfirm={handleDeleteMember}
                title="Delete Member"
                description="Are you sure you want to remove this team member?"
                itemName={deleteModal.memberToDelete?.name}
                loading={deleteModal.loading}
                confirmText="Delete Member"
            />
        </div>
    );
}