"use client";
import React, { useState } from 'react';
import TeamMember from './TeamMember';
import TeamRolePermission from './TeamRoleAndPermission';
import { Users, Shield } from 'lucide-react';


export default function Staff() {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="bg-[var(--site-bg)] min-h-screen text-slate-300 p-8">
      <h1 className="text-2xl font-bold text-[var(--text-color)]">Team Management</h1>
      <p className="text-sm text-gray-600 mb-6">Manage roles, permissions, and team member access</p>

      <div className="flex gap-2 mb-8 bg-[var(--site-bg)] border border-[var(--text-color)] w-fit p-1 rounded-[18px]">
        <button 
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[18px] transition-all ${
            activeTab === 'members' 
            ? 'bg-[var(--text-color)] text-white border border-[var(--text-color)] shadow-lg shadow-indigo-500/10' 
            : 'text-[var(--text-color)] border border-[var(--text-color)] hover:text-white hover:bg-[var(--text-color)]'
          }`}
        >
          <Users size={18} /> Members
        </button>
        
        <button 
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[18px] transition-all ${
            activeTab === 'roles' 
            ? 'bg-[var(--text-color)] text-white border border-[var(--text-color)] shadow-lg shadow-indigo-500/10' 
            : 'text-[var(--text-color)] border border-[var(--text-color)] hover:text-white hover:bg-[var(--text-color)]'
          }`}
        >
          <Shield size={18} /> Roles & Permissions
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'members' ? (
          <TeamMember />
        ) : (
          <TeamRolePermission />
        )}
      </div>
    </div>
  );
}

