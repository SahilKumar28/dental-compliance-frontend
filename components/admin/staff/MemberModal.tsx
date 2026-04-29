import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Select from 'react-select';

export default function MemberModal({ isOpen, onClose, onSubmit, member = null, roles = [] }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_ids: []
  });
  const [showPassword, setShowPassword] = useState(false);

  const isEditing = !!member;

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name
  }));

  const selectedRoles = roleOptions.filter(option => 
    formData.role_ids.includes(option.value)
  );

  useEffect(() => {
    if (member) {
      setFormData({
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        password: '',
        role_ids: member.role_ids || []
      });
    } else {
      setFormData({ first_name: '', last_name: '', email: '', password: '', role_ids: [] });
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onSubmit({ 
        role_ids: formData.role_ids,
        memberId: member.id 
      });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--site-bg)] border border-slate-700 w-full max-w-md rounded-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[var(--text-color)]">
          <h3 className="text-xl font-semibold text-[var(--text-color)]">
            {isEditing ? 'Update Roles' : 'Add New Member'}
          </h3>
          <button onClick={onClose} className="text-[var(--text-color)] hover:text-[var(--text-color)]/50">
            <X size={20} />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {!isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  className="w-full bg-[var(--site-bg)] border border-slate-700 rounded-lg px-4 py-2.5 text-[var(--text-color)] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Last Name"
                  className="w-full bg-[var(--site-bg)] border border-slate-700 rounded-lg px-4 py-2.5 text-[var(--text-color)] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-[var(--site-bg)] border border-slate-700 rounded-lg px-4 py-2.5 text-[var(--text-color)] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-color)]">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value })}
                  required
                  placeholder="Enter password"
                  className="w-full bg-[var(--site-bg)] border border-slate-700 rounded-lg px-4 py-2.5 text-[var(--text-color)] focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </>
          )}
          
          {isEditing && (
            <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
              <p className="text-sm text-slate-400">Member</p>
              <p className="text-white font-medium">{member?.name}</p>
              <p className="text-xs text-slate-500">{member?.email}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">
              {isEditing ? 'Change Roles' : 'Roles'}
            </label>
            <Select
              isMulti
              options={roleOptions}
              value={selectedRoles}
              onChange={(selected) => {
                setFormData({
                  ...formData, 
                  role_ids: selected ? selected.map(s => s.value) : []
                });
              }}
              placeholder="Select Roles"
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: 'var(--site-bg)',
                  borderColor: 'rgb(51 65 85)',
                  borderRadius: '16px',
                  padding: '2px',
                  boxShadow: 'none',
                  '&:hover': { borderColor: 'rgb(99 102 241)' }
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: 'var(--site-bg)',
                  border: '1px solid rgb(51 65 85)',
                  borderRadius: '16px',
                  zIndex: 9999
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? 'rgb(51 65 85)' : 'var(--site-bg)',
                  color: 'var(--text-color)',
                  '&:active': { backgroundColor: 'rgb(99 102 241)' }
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: 'rgb(99 102 241)',
                  borderRadius: '8px'
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'white'
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgb(79 70 229)', color: 'white' }
                }),
                input: (base) => ({ ...base, color: 'var(--text-color)' }),
                placeholder: (base) => ({ ...base, color: 'rgb(148 163 184)' }),
                singleValue: (base) => ({ ...base, color: 'var(--text-color)' })
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-[var(--text-color)] hover:text-white hover:bg-[var(--text-color)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--text-color)] text-white hover:bg-indigo-500 transition-all font-medium"
            >
              {isEditing ? 'Update Roles' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}