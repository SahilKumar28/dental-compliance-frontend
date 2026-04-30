"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Shield, Edit2, ChevronRight, Check, Loader2, AlertCircle, Plus } from 'lucide-react';
import { rolePermissionService } from '@/lib/api/role-permission-service';
import RolePermissionModal from './RolePermissionModal';
import { toast } from 'react-hot-toast';

type Permission = {
  id: number;
  title: string;
};

type Role = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  permissions: Permission[];
};

export default function TeamRolePermission() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const fetchRoles = async (isRefresh = false) => {
    if (hasFetched.current &&!isRefresh) return;
    try {
      if (!isRefresh) hasFetched.current = true;
      setLoading(true);
      setError(null);

      // ⚠️ Check: tumhare service me method ka naam kya hai?
      const response = await rolePermissionService.getRolePermission(); // ya getAllRoles()
      let data = response.data || response;

      let finalData: Role[] = [];
      if (Array.isArray(data)) {
        finalData = data;
      } else if (typeof data === 'object' && data!== null) {
        finalData = Object.keys(data)
         .filter(key => key!== 'message' &&!isNaN(Number(key))) // sirf numeric keys lo
         .map(key => data[key]);
      }

      setRoles(finalData);

      if (finalData.length > 0) {
        const updatedSelected = isRefresh
         ? finalData.find(r => r.id === selectedRole?.id) || finalData[0]
          : finalData[0];
        setSelectedRole(updatedSelected);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch roles");
      toast.error("Could not load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openAddModal = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (roleToEdit: Role) => {
    try {
      const loadingToast = toast.loading("Loading role...");
      const res = await rolePermissionService.getRolesById(roleToEdit.id); // getRolesById -> getRoleById
      const freshRole = res.data || res;
      setEditingRole(freshRole);
      setIsModalOpen(true);
      toast.dismiss(loadingToast);
    } catch (e) {
      toast.error("Could not load role details");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleRoleSubmit = async (formData: { name: string; description: string; permission_ids: number[] }) => {
    const roleId = editingRole?.id;
    const isEditing =!!roleId;
    const loadingToast = toast.loading(isEditing? "Updating role..." : "Creating role...");

    try {
      if (isEditing) {
        await rolePermissionService.updateRole(roleId, formData);
        toast.success("Role updated successfully!", { id: loadingToast });
      } else {
        await rolePermissionService.createRole(formData);
        toast.success("New role created successfully!", { id: loadingToast });
      }

      handleCloseModal();
      fetchRoles(true);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong!", { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h- text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading Permissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 m-6">
        <AlertCircle size={20} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Team Roles</h1>
        <button
          onClick={openAddModal}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded- flex items-center justify-center gap-2 transition-all font-medium text-sm"
        >
          <Plus size={18} /> Add Roles
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-3">
          {roles.map((role) => {
            const isActive = selectedRole?.id === role.id; // id se compare karo, name se nahi

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded- border cursor-pointer transition-all duration-200 ${
                  isActive
                   ? 'bg-secondary border-secondary shadow-lg shadow-indigo-500/20'
                    : 'bg-primary border-secondary hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Shield
                      size={20}
                      className={isActive? 'text-white' : 'text-secondary'}
                    />
                    <div>
                      <h3 className={`font-semibold ${isActive? 'text-white' : 'text-secondary'}`}>
                        {role.name}
                      </h3>
                      <p className={`text-xs mt-1 line-clamp-1 ${isActive? 'text-white' : 'text-gray-800'}`}>
                        {role.description || "System Role"}
                      </p>
                      <p className={`text-xs mt-3 font-medium ${isActive? 'text-white' : 'text-gray-800'}`}>
                        {role.permissions?.length || 0} permissions
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Edit2
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(role);
                      }}
                      size={16}
                      className={`${isActive? 'text-white' : 'text-secondary'} hover:scale-110 transition-transform`}
                    />
                    <ChevronRight size={16} className={isActive? 'text-white' : 'text-secondary'} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-span-12 lg:col-span-8 bg-secondary rounded- border border-secondary p-6">
          {selectedRole? (
            <>
              <h2 className="text-xl font-bold text-white mb-1">{selectedRole.name}</h2>
              <p className="text-sm text-white mb-8">{selectedRole.description || "No description provided."}</p>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Active Permissions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRole.permissions?.map((perm) => (
                    <div key={perm.id} className="flex items-center gap-3 p-4 bg-primary border border-primary rounded-">
                      <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center">
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                      <p className="text-sm font-medium text-secondary">{perm.title}</p>
                    </div>
                  ))}
                  {(!selectedRole.permissions || selectedRole.permissions.length === 0) && (
                    <p className="text-slate-500 text-sm italic">No permissions assigned to this role.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Shield size={48} className="mb-4 opacity-20" />
              <p>Select a role from the left to view detailed permissions</p>
            </div>
          )}
        </div>
      </div>

      <RolePermissionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleRoleSubmit}
        role={editingRole}
      />
    </div>
  );
}