"use client";
import React, { useEffect, useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { rolePermissionService } from '@/lib/api/role-permission-service';

type Permission = {
  id: number;
  name: string;
  title: string;
  description: string | null;
};

type Role = {
  id?: number;
  name: string;
  description?: string | null;
  permissions?: Permission[];
};

type FormData = {
  name: string;
  description: string;
  permission_ids: number[];
};

interface RolePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  role?: Role | null;
}

export default function RolePermissionModal({
  isOpen,
  onClose,
  onSubmit,
  role = null
}: RolePermissionModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    permission_ids: [],
  });
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
  const [loadingPerms, setLoadingPerms] = useState(false);

  const groupData = (data: Permission[]) => {
    return data.reduce((acc: Record<string, Permission[]>, curr) => {
      const groupName = curr.name.split('.')[0];
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(curr);
      return acc;
    }, {});
  };

  useEffect(() => {
    if (isOpen) {
      const fetchPerms = async () => {
        try {
          setLoadingPerms(true);
          const response = await rolePermissionService.getPermissionsByRole(0);
          let perms = response.data || response;

          let permsArray: Permission[] = [];
          if (Array.isArray(perms)) {
            permsArray = perms;
          } else if (typeof perms === 'object' && perms!== null) {
            permsArray = Object.keys(perms)
        .filter(key =>!isNaN(Number(key)))
        .map(key => perms[key]);
          }

          setGroupedPermissions(groupData(permsArray));
        } catch (err) {
          console.error("Error:", err);
        } finally {
          setLoadingPerms(false);
        }
      };
      fetchPerms();

      if (role) {
        setFormData({
          name: role.name?? '',
          description: role.description?? '',
          permission_ids: role.permissions?.map((p) => p.id)?? [],
        });
      } else {
        setFormData({ name: '', description: '', permission_ids: [] });
      }
    }
  }, [role, isOpen]);

  const togglePermission = (id: number) => {
    setFormData(prev => ({
  ...prev,
      permission_ids: prev.permission_ids.includes(id)
  ? prev.permission_ids.filter(pid => pid!== id)
        : [...prev.permission_ids, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[var(--site-bg)] border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* HEADER - Fixed */}
        <div className="flex justify-between items-center p-5 border-b border-[var(--text-color)] bg-[var(--site-bg)]">
          <h3 className="text-xl font-bold text-[var(--text-color)]">
            {role? 'Edit Role Permissions' : 'Create New Role'}
          </h3>
          <button onClick={onClose} className="text-[var(--text-color)] hover:text-[var(--text-color)]/50">
            <X size={24} />
          </button>
        </div>

        {/* FORM - flex-1 flex flex-col min-h-0 */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">

          {/* SCROLLABLE CENTER - flex-1 overflow-y-auto */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-color)] uppercase tracking-widest">Role Title</label>
                <input
                  className="w-full bg-[var(--site-bg)] border border-slate-700 rounded- px-4 py-2.5 text-[var(--text-color)] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  placeholder="e.g. Admin Manager"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-color)] uppercase tracking-widest">Description</label>
                <input
                  className="w-full bg-[var(--site-bg)] border border-slate-700 rounded- px-4 py-2.5 text-[var(--text-color)] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.description}
                  placeholder="Brief role summary"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-8 pt-4">
              {loadingPerms? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" /></div>
              ) : (
                Object.entries(groupedPermissions).map(([category, perms]) => (
                  <div key={category} className="space-y-3">
                    <h5 className="text- font-black text-[var(--text-color)] uppercase tracking- border-l-2 border-indigo-500 pl-3">
                      {category} Management
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {perms.map((perm) => {
                        const active = formData.permission_ids.includes(perm.id);
                        return (
                          <div
                            key={perm.id}
                            onClick={() => togglePermission(perm.id)}
                            className={`group flex items-center gap-3 p-3.5 rounded- border cursor-pointer transition-all ${
                              active
                        ? 'bg-[var(--text-color)] border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                              : 'bg-[var(--site-bg)] border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              active? 'bg-[var(--text-white-color)] border-[var(--text-white-color)]' : 'border-slate-600 group-hover:border-slate-500'
                            }`}>
                              {active && <Check size={12} className="text-[var(--text-color)]" strokeWidth={4} />}
                            </div>
                            <span className={`text-sm font-medium ${active? 'text-white' : 'text-[var(--text-color)]'}`}>
                              {perm.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FOOTER - Fixed */}
          <div className="flex gap-4 p-6 border-t border-slate-800 bg-[var(--site-bg)] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded- border border-slate-700 text-[var(--text-color)] hover:text-white hover:bg-[var(--text-color)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded- bg-[var(--text-color)] text-white hover:bg-indigo-500 transition-all font-medium"
            >
              {role? 'Update Access' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}