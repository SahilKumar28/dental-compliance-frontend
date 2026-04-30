"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreHorizontal, Plus, ChevronLeft, ChevronRight, Loader2, Edit, Trash2 } from 'lucide-react';
import { paraticeService } from '@/lib/api/practices-service';
import PracticeModal from './PracticeModal';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

export default function Practice() {
    const [practices, setPractices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPractice, setSelectedPractice] = useState<any>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [fetchingPractice, setFetchingPractice] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const hasFetchedRef = useRef(false);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        order_by: 'legal_name',
        order: 'asc',
        page: 1,
        per_page: 10
    });

    const fetchPractices = async (currentFilters: typeof filters) => {
        setLoading(true);
        try {
            const response = await paraticeService.getPractices(currentFilters);
            const practiceList = Object.keys(response)
                .filter(key => !isNaN(Number(key)))
                .map(key => response[key]);

            const total = response?.total || practiceList.length;

            setPractices(practiceList);
            setTotalResults(total);
        } catch (error) {
            console.error("Failed to fetch:", error);
            setPractices([]);
            toast.error("Failed to fetch practices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchPractices(filters);
        }
    }, []);

    useEffect(() => {
        if (hasFetchedRef.current) {
            const delayDebounceFn = setTimeout(() => {
                fetchPractices(filters);
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [filters.search, filters.page, filters.status, filters.order_by, filters.order]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const openAddModal = () => {
        setSelectedPractice(null);
        setIsModalOpen(true);
    };

    const openEditModal = async (practiceId: number) => {
        setFetchingPractice(true);
        setOpenMenuId(null);
        const loadingToast = toast.loading("Loading practice details...");

        try {
            const response = await paraticeService.getPracticeById(practiceId);
            const practiceData = response?.data || response;
            setSelectedPractice(practiceData);
            setIsModalOpen(true);
            toast.dismiss(loadingToast);
        } catch (error) {
            console.error("Failed to fetch practice:", error);
            toast.error("Failed to load practice details", { id: loadingToast });
        } finally {
            setFetchingPractice(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPractice(null);
    };

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        practiceToDelete: null as any,
        loading: false
    });

    const openDeleteModal = (practice: any) => {
        setOpenMenuId(null);
        setDeleteModal({
            isOpen: true,
            practiceToDelete: practice,
            loading: false
        });
    };

    const handleDeletePractice = async () => {
        if (!deleteModal.practiceToDelete?.id) {
            toast.error("Invalid practice selected");
            return;
        }

        try {
            setDeleteModal(prev => ({ ...prev, loading: true }));
            await paraticeService.deletePractice(deleteModal.practiceToDelete.id);
            toast.success("Practice deleted successfully!");
            setDeleteModal({ isOpen: false, practiceToDelete: null, loading: false });
            fetchPractices(filters);
        } catch (error: any) {
            console.error("Delete Error:", error);
            toast.error(error?.response?.data?.message || "Failed to delete practice");
            setDeleteModal(prev => ({ ...prev, loading: false }));
        }
    };

    const handlePracticeSubmit = async (formData: any) => {
        const practiceId = formData.id || selectedPractice?.id;
        const isEditing = !!practiceId;
        const loadingToast = toast.loading(isEditing ? "Updating practice..." : "Creating practice...");

        try {
            if (isEditing) {
                await paraticeService.updatePractice(practiceId, formData);
                toast.success("Practice updated successfully!", { id: loadingToast });
                console.log("Updated Practice ID:", practiceId, "Form Data:", formData);
            } else {
                await paraticeService.createPractice(formData);
                toast.success("Practice created successfully!", { id: loadingToast });
            }

            handleCloseModal();
            fetchPractices(filters);
        } catch (error: any) {
            console.error("API Error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong!", { id: loadingToast });
        }
    };

    return (
        <div className="text-slate-300">
            <Toaster position="top-right" />
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded- border border-secondary bg-primary min-h-[90dvh]">
                    <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                    <p className="text-sm text-slate-400">Loading practices...</p>
                </div>
            ) : practices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded- border border-secondary bg-primary min-h-[90dvh]">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                        <Search className="text-indigo-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Manage Practices</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-md">
                        You haven't added any practices yet. Create your first practice to get started.
                    </p>
                    <button
                        onClick={openAddModal}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded- flex items-center gap-2 transition-all font-medium text-sm"
                    >
                        <Plus size={18} /> Add New Practice
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex flex-wrap gap-3 flex-1 w-full">
                            <div className="relative flex-1 min-w- max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={handleSearch}
                                    placeholder="Search practices..."
                                    className="w-full bg-primary border border-secondary rounded- placeholder:text-secondary text-secondary py-2 pl-10 pr-4 focus:outline-none focus:border-indigo-500 text-sm"
                                />
                            </div>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="w-full md:w-auto bg-secondary hover:bg-indigo-500 hover:border-indigo-500 text-white px-4 py-2 border border-secondary rounded- flex items-center justify-center gap-2 transition-all font-medium text-sm"
                        >
                            <Plus size={18} /> Add Practice
                        </button>
                    </div>
                    <div className="overflow-hidden rounded- border border-secondary bg-primary relative">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-secondary text-white text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Legal Name</th>
                                        <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Abbreviated</th>
                                        <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Email</th>
                                        <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">City</th>
                                        <th className="p-4 font-semibold whitespace-nowrap border-b border-slate-800">Created At</th>
                                        <th className="p-4 font-semibold text-right border-b border-slate-800">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {practices.map((practice) => (
                                        <tr key={practice.id} className="hover:bg-secondary/20 transition-colors group">
                                            <td className="p-4 font-medium text-secondary whitespace-nowrap">
                                                {practice.legal_name || 'N/A'}
                                            </td>
                                            <td className="p-4 text-secondary text-sm">{practice.abbreviated_name}</td>
                                            <td className="p-4 text-secondary text-sm">{practice.primary_email}</td>
                                            <td className="p-4 text-secondary text-sm">{practice.city}</td>
                                            <td className="p-4 text-secondary text-sm whitespace-nowrap">
                                                {practice.created_at ? new Date(practice.created_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => openEditModal(practice.id)}
                                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors rounded-lg"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-primary p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800">
                            <p className="text-xs text-secondary">
                                Showing <span className="text-secondary">{totalResults > 0 ? (filters.page - 1) * filters.per_page + 1 : 0}</span> to <span className="text-secondary">{Math.min(filters.page * filters.per_page, totalResults)}</span> of <span className="text-secondary">{totalResults}</span> results
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={filters.page === 1}
                                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                                    className="p-1.5 rounded- border border-secondary text-secondary hover:text-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="bg-primary px-3 py-2 rounded- border border-slate-700 text-xs font-bold text-secondary">
                                    {filters.page}
                                </div>

                                <button
                                    disabled={filters.page * filters.per_page >= totalResults}
                                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                                    className="p-1.5 rounded- border border-secondary text-secondary hover:text-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <PracticeModal
                key={selectedPractice?.id || 'new'}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handlePracticeSubmit}
                practice={selectedPractice}
            />

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, practiceToDelete: null, loading: false })}
                onConfirm={handleDeletePractice}
                title="Delete Practice"
                description="Are you sure you want to remove this practice?"
                itemName={deleteModal.practiceToDelete?.legal_name || deleteModal.practiceToDelete?.abbreviated_name}
                loading={deleteModal.loading}
                confirmText="Delete Practice"
            />
        </div>
    );
}