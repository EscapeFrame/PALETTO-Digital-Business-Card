'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { TeamMember } from '@/data/members';
import { getStoredMembers, addMember, updateMember, deleteMember, generateMemberId } from '@/lib/memberStore';
import BusinessCard3D from './BusinessCard3D';

const EMOJI_OPTIONS = ['👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔬', '👨‍🏫', '👩‍🏫', '🧑‍💻', '🧑‍🎨'];
const GRADIENT_PRESETS = [
  { from: '#87CEEB', to: '#5DADE2' },
  { from: '#B0E0E6', to: '#87CEEB' },
  { from: '#5DADE2', to: '#3498DB' },
  { from: '#E0F4FF', to: '#B0E0E6' },
  { from: '#87CEEB', to: '#B0E0E6' },
  { from: '#B0E0E6', to: '#5DADE2' },
];

const emptyMember: Omit<TeamMember, 'id'> = {
  name: '',
  nameEn: '',
  role: '',
  department: '',
  email: '',
  phone: '',
  bio: '',
  skills: [],
  social: {},
  avatar: '👨‍💻',
  gradientFrom: '#87CEEB',
  gradientTo: '#5DADE2',
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>(emptyMember);
  const [skillInput, setSkillInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setMembers(getStoredMembers());
  }, []);

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        nameEn: member.nameEn,
        role: member.role,
        department: member.department,
        email: member.email,
        phone: member.phone,
        bio: member.bio,
        skills: member.skills,
        social: member.social,
        avatar: member.avatar,
        gradientFrom: member.gradientFrom,
        gradientTo: member.gradientTo,
      });
    } else {
      setEditingMember(null);
      setFormData(emptyMember);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData(emptyMember);
    setSkillInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMember) {
      const updated = updateMember(editingMember.id, { ...formData, id: editingMember.id });
      setMembers(updated);
    } else {
      const newMember: TeamMember = {
        ...formData,
        id: generateMemberId(formData.name),
      };
      const updated = addMember(newMember);
      setMembers(updated);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const updated = deleteMember(id);
    setMembers(updated);
    setDeleteConfirm(null);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
            <p className="text-gray-500">팀원 명함을 추가하고 관리하세요</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-gradient-to-r from-paletto-sky to-paletto-sky-dark text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 팀원 추가
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-4">
                <div className="mb-4">
                  <BusinessCard3D member={member} isPreview={true} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(member)}
                    className="flex-1 py-2 px-3 bg-paletto-sky/10 text-paletto-sky-dark font-medium rounded-lg hover:bg-paletto-sky/20 transition-all text-sm"
                  >
                    수정
                  </button>
                  {deleteConfirm === member.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="py-2 px-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all text-sm"
                      >
                        확인
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="py-2 px-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all text-sm"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(member.id)}
                      className="py-2 px-3 bg-red-50 text-red-500 font-medium rounded-lg hover:bg-red-100 transition-all text-sm"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-paletto-sky/10 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-paletto-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">아직 팀원이 없습니다</h3>
            <p className="text-gray-500 mb-4">새 팀원을 추가해서 시작하세요</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-gradient-to-r from-paletto-sky to-paletto-sky-dark text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              첫 팀원 추가하기
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingMember ? '팀원 정보 수정' : '새 팀원 추가'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이름 (한글)</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이름 (영문)</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none"
                      placeholder="예: Frontend Developer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">부서</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none"
                      placeholder="예: Engineering"
                      required
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none"
                      placeholder="+82 10-1234-5678"
                      required
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none resize-none"
                    rows={3}
                    required
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">기술 스택</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none"
                      placeholder="기술 입력 후 추가"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-paletto-sky/10 text-paletto-sky-dark rounded-lg hover:bg-paletto-sky/20 transition-all"
                    >
                      추가
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-paletto-sky/20 text-paletto-sky-dark rounded-full text-sm flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="w-4 h-4 rounded-full bg-paletto-sky-dark/20 flex items-center justify-center hover:bg-paletto-sky-dark/40 transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">아바타</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: emoji })}
                        className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all ${
                          formData.avatar === emoji
                            ? 'bg-paletto-sky/30 ring-2 ring-paletto-sky'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gradient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카드 색상</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADIENT_PRESETS.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData({ ...formData, gradientFrom: preset.from, gradientTo: preset.to })}
                        className={`w-16 h-10 rounded-lg transition-all ${
                          formData.gradientFrom === preset.from && formData.gradientTo === preset.to
                            ? 'ring-2 ring-paletto-sky-dark ring-offset-2'
                            : ''
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">소셜 링크 (선택)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="url"
                      placeholder="GitHub URL"
                      value={formData.social.github || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, github: e.target.value || undefined } })}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none text-sm"
                    />
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={formData.social.linkedin || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value || undefined } })}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Twitter URL"
                      value={formData.social.twitter || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value || undefined } })}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={formData.social.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, instagram: e.target.value || undefined } })}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:border-paletto-sky focus:ring-2 focus:ring-paletto-sky/20 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-paletto-sky to-paletto-sky-dark text-white font-medium rounded-xl hover:shadow-lg transition-all"
                  >
                    {editingMember ? '수정 완료' : '추가하기'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
