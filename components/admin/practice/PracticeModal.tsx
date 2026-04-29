import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  practice?: any;
}

interface FormErrors {
  [key: string]: string;
}

export default function PracticeModal({ isOpen, onClose, onSubmit, practice = null }: PracticeModalProps) {
  const [formData, setFormData] = useState({
    abbreviated_name: '',
    legal_name: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    start_date: '',
    addresses: [''],
    additional_emails: [''],
    websites: [''],
    primary_email: '',
    color_theme: '#6366f1',
    logo: null as File | null,
    owner_last_name: '',
    owner_first_name: '',
    owner_email: '',
    owner_password: '',
    domain_name: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditing = !!practice;

  useEffect(() => {
    if (practice) {
      let dateStr = '';
      if (practice.start_date) {
        if (typeof practice.start_date === 'string' && practice.start_date.includes('-')) {
          dateStr = practice.start_date;
        } else if (typeof practice.start_date === 'number') {
          dateStr = new Date(practice.start_date * 1000).toISOString().split('T')[0];
        } else if (typeof practice.start_date === 'string' && !isNaN(Number(practice.start_date))) {
          dateStr = new Date(Number(practice.start_date) * 1000).toISOString().split('T')[0];
        }
      }

      // Color theme se sirf hex nikalo
      let colorHex = '#6366f1';
      if (practice.color_theme) {
        if (typeof practice.color_theme === 'string') {
          colorHex = practice.color_theme;
        } else if (typeof practice.color_theme === 'object') {
          colorHex = practice.color_theme.hex || practice.color_theme.hex?.hex || '#6366f1';
        }
      }

      setFormData({
        abbreviated_name: practice.abbreviated_name || '',
        legal_name: practice.legal_name || '',
        city: practice.city || '',
        state: practice.state || '',
        postal_code: String(practice.postal_code || ''),
        country: practice.country || '',
        start_date: dateStr,
        addresses: practice.addresses?.length ? practice.addresses : [''],
        additional_emails: practice.additional_emails?.length ? practice.additional_emails : [''],
        websites: practice.websites?.length ? practice.websites : [''],
        primary_email: practice.primary_email || '',
        color_theme: colorHex, // Sirf hex string rakho state me
        logo: null,
        owner_last_name: practice.owner_last_name || '',
        owner_first_name: practice.owner_first_name || '',
        owner_email: practice.owner_email || '',
        owner_password: '',
        domain_name: practice.domain_name || ''
      });
      setLogoPreview(practice.logo_url || practice.logo || null);
    } else {
      // reset code same...
    }
    setErrors({});
  }, [practice, isOpen]);

  if (!isOpen) return null;

  const handleArrayChange = (field: 'addresses' | 'additional_emails' | 'websites', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'addresses' | 'additional_emails' | 'websites') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'addresses' | 'additional_emails' | 'websites', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
  };



  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.legal_name.trim()) newErrors.legal_name = 'Legal Name is required';
    if (!formData.abbreviated_name.trim()) newErrors.abbreviated_name = 'Abbreviated Name is required';
    if (!formData.domain_name.trim()) newErrors.domain_name = 'Domain Name is required';

    if (!isEditing) {
      if (!formData.owner_first_name.trim()) newErrors.owner_first_name = 'Owner First Name is required';
      if (!formData.owner_last_name.trim()) newErrors.owner_last_name = 'Owner Last Name is required';
      if (!formData.owner_email.trim()) newErrors.owner_email = 'Owner Email is required';
      if (!formData.owner_password.trim()) newErrors.owner_password = 'Owner Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file); // Ye check karo - File object aana chahiye
      setFormData(prev => ({ ...prev, logo: file })); // prev use karo
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // PracticeModal.tsx
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...formData,
      id: practice?.id,
      postal_code: String(formData.postal_code),
      start_date: formData.start_date, // "2026-04-30" string
      color_theme: { hex: formData.color_theme }, // Yahan object banao
      addresses: formData.addresses.filter(v => v.trim() !== ''),
      additional_emails: formData.additional_emails.filter(v => v.trim() !== ''),
      websites: formData.websites.filter(v => v.trim() !== '')
    };

    if (isEditing) {
    delete payload.owner_first_name;
    delete payload.owner_last_name;
    delete payload.owner_email;
    delete payload.owner_password;
    delete payload.domain_name;
  }

    if (!(payload.logo instanceof File)) {
      delete payload.logo;
    }

    onSubmit(payload);
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-[var(--site-bg)] border rounded-lg px-4 py-2.5 text-[var(--text-color)] focus:ring-2 focus:ring-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed ${hasError ? 'border-red-500' : 'border-slate-700'
    }`;

  const labelClass = "block text-sm font-medium text-[var(--text-color)] mb-1";
  const errorClass = "text-xs text-red-400 mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--site-bg)] border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-5 border-b border-[var(--text-color)] bg-[var(--site-bg)]">
          <h3 className="text-xl font-semibold text-[var(--text-color)]">
            {isEditing ? 'Update Practice' : 'Add New Practice'}
          </h3>
          <button onClick={onClose} className="text-[var(--text-color)] hover:text-[var(--text-color)]/50">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form className="p-6 space-y-5 overflow-y-auto flex-1" onSubmit={handleSubmit}>
          {/* Practice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Legal Name *</label>
              <input
                type="text"
                placeholder="Practice Legal Name"
                className={inputClass(!!errors.legal_name)}
                value={formData.legal_name}
                onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
              />
              {errors.legal_name && <p className={errorClass}>{errors.legal_name}</p>}
            </div>
            <div>
              <label className={labelClass}>Abbreviated Name *</label>
              <input
                type="text"
                placeholder="Short Name"
                className={inputClass(!!errors.abbreviated_name)}
                value={formData.abbreviated_name}
                onChange={(e) => setFormData({ ...formData, abbreviated_name: e.target.value })}
              />
              {errors.abbreviated_name && <p className={errorClass}>{errors.abbreviated_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Primary Email *</label>
              <input
                type="email"
                required
                placeholder="primary@example.com"
                className={inputClass(false)}
                value={formData.primary_email}
                onChange={(e) => setFormData({ ...formData, primary_email: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Domain Name *</label>
              <input
                type="text"
                placeholder="practice.com"
                className={inputClass(!!errors.domain_name)}
                value={formData.domain_name}
                onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
              />
              {errors.domain_name && <p className={errorClass}>{errors.domain_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Color Theme</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="h-10 w-16 bg-[var(--site-bg)] border border-slate-700 rounded-lg cursor-pointer"
                  value={formData.color_theme}
                  onChange={(e) => setFormData({ ...formData, color_theme: e.target.value })}
                />
                <input
                  type="text"
                  className={inputClass(false)}
                  value={formData.color_theme}
                  onChange={(e) => setFormData({ ...formData, color_theme: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Start Date *</label>
              <input
                type="date"
                required
                className={inputClass(false)}
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>City *</label>
              <input
                type="text"
                required
                placeholder="City"
                className={inputClass(false)}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>State *</label>
              <input
                type="text"
                required
                placeholder="State"
                className={inputClass(false)}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Postal Code *</label>
              <input
                type="number"
                required
                placeholder="12345"
                className={inputClass(false)}
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Country *</label>
              <input
                type="text"
                required
                placeholder="Country"
                className={inputClass(false)}
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className={labelClass}>Logo</label>
            <div className="flex items-center gap-3">
              {logoPreview && (
                <img src={logoPreview} alt="Logo" className="h-10 w-10 rounded object-cover border-slate-700" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full text-sm text-[var(--text-color)] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--text-color)] file:text-white hover:file:bg-indigo-500 file:cursor-pointer"
              />
            </div>
          </div>

          {/* Owner Details - Show in both modes, disabled in edit */}
          <div className="pt-4 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-[var(--text-color)] mb-3">
              Owner Details {isEditing && <span className="text-xs font-normal text-slate-400">(Read only)</span>}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Owner First Name *</label>
                <input
                  type="text"
                  placeholder="First Name"
                  disabled={isEditing}
                  className={inputClass(!!errors.owner_first_name)}
                  value={formData.owner_first_name}
                  onChange={(e) => setFormData({ ...formData, owner_first_name: e.target.value })}
                />
                {errors.owner_first_name && <p className={errorClass}>{errors.owner_first_name}</p>}
              </div>
              <div>
                <label className={labelClass}>Owner Last Name *</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  disabled={isEditing}
                  className={inputClass(!!errors.owner_last_name)}
                  value={formData.owner_last_name}
                  onChange={(e) => setFormData({ ...formData, owner_last_name: e.target.value })}
                />
                {errors.owner_last_name && <p className={errorClass}>{errors.owner_last_name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>Owner Email *</label>
                <input
                  type="email"
                  placeholder="owner@example.com"
                  disabled={isEditing}
                  className={inputClass(!!errors.owner_email)}
                  value={formData.owner_email}
                  onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                />
                {errors.owner_email && <p className={errorClass}>{errors.owner_email}</p>}
              </div>
              <div>
                <label className={labelClass}>Owner Password {!isEditing && '*'}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.owner_password}
                    disabled={isEditing}
                    onChange={(e) => setFormData({ ...formData, owner_password: e.target.value })}
                    placeholder={isEditing ? "Password hidden" : "Enter password"}
                    className={inputClass(!!errors.owner_password)}
                  />
                  <button
                    type="button"
                    disabled={isEditing}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.owner_password && <p className={errorClass}>{errors.owner_password}</p>}
              </div>
            </div>
          </div>

          {/* Arrays */}
          <div>
            <label className={labelClass}>Addresses</label>
            {formData.addresses.map((address, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Street address"
                  className={inputClass(false)}
                  value={address}
                  onChange={(e) => handleArrayChange('addresses', idx, e.target.value)}
                />
                {formData.addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('addresses', idx)}
                    className="p-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('addresses')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
            >
              <Plus size={16} /> Add Address
            </button>
          </div>

          <div>
            <label className={labelClass}>Additional Emails</label>
            {formData.additional_emails.map((email, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className={inputClass(false)}
                  value={email}
                  onChange={(e) => handleArrayChange('additional_emails', idx, e.target.value)}
                />
                {formData.additional_emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('additional_emails', idx)}
                    className="p-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('additional_emails')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
            >
              <Plus size={16} /> Add Email
            </button>
          </div>

          <div>
            <label className={labelClass}>Websites</label>
            {formData.websites.map((website, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="url"
                  placeholder="https://example.com"
                  className={inputClass(false)}
                  value={website}
                  onChange={(e) => handleArrayChange('websites', idx, e.target.value)}
                />
                {formData.websites.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('websites', idx)}
                    className="p-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('websites')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
            >
              <Plus size={16} /> Add Website
            </button>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex gap-4 px-6 py-6 sticky bottom-0 bg-[var(--site-bg)] border-t border-[var(--text-color)]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-[var(--text-color)] hover:text-white hover:bg-[var(--text-color)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--text-color)] text-white hover:bg-indigo-500 transition-all font-medium"
          >
            {isEditing ? 'Update Practice' : 'Create Practice'}
          </button>
        </div>
      </div>
    </div>
  );
}