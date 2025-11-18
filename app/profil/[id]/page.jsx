"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import FixLayout from "../../../components/FixLayout";

export default function ProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params?.id;
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const savedUserId = localStorage.getItem("userId");
    setCurrentUserId(savedUserId);

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

        // Determine which endpoint to use based on whether it's own profile or other profile
        const endpoint = profileId === savedUserId ? '/users/me' : `/users/${profileId}`;

        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        alert('Gagal memuat profil');
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Hapus anggota ini?')) return;

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiBaseUrl}/users/members/${memberId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete member');
      }

      // Refresh profile data
      const updatedResponse = await fetch(`${apiBaseUrl}/users/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const updatedData = await updatedResponse.json();
      setProfile(updatedData);
      
      alert('Anggota berhasil dihapus');
    } catch (err) {
      console.error('Error deleting member:', err);
      alert('Gagal menghapus anggota: ' + err.message);
    }
  };

  const handleEdit = () => {
    router.push('/profil/edit');
  };

  const handleAddMember = () => {
    router.push('/profil/addMember');
  };

  const handleEditMember = (memberId) => {
    router.push(`/profil/editMember/${memberId}`);
  };

  // Check if current user is viewing their own profile
  const isOwnProfile = profileId === currentUserId;

  if (loading) {
    return (
      <FixLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
            <p className="text-gray-500 mt-3">Memuat profil...</p>
          </div>
        </div>
      </FixLayout>
    );
  }

  if (!profile) {
    return (
      <FixLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
          <p className="text-gray-500">Profil tidak ditemukan</p>
        </div>
      </FixLayout>
    );
  }

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <span
              className="hover:text-[#004A74] cursor-pointer"
              onClick={() => router.push("/")}
            >
              Homepage
            </span>
            <span>›</span>
            <span className="text-[#004A74] font-semibold">Profil</span>
          </div>

          {/* Header + Edit Button */}
          <div className="mb-8 flex items-center justify-between">
            <div className="inline-block">
              <h1 className="text-3xl font-bold text-[#004A74]">Profil Kelompok</h1>
              <div className="h-1 bg-[#FED400] rounded mt-2"></div>
            </div>

            {isOwnProfile && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-[#004A74] text-white rounded-lg shadow hover:bg-[#003d5e] transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-semibold">Edit</span>
              </button>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col lg:flex-row gap-8 items-start mb-8">
            <div className="w-full lg:w-[420px] flex-shrink-0">
              <div className="rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-red-100 via-orange-50 to-pink-100">
                <img 
                  src={profile.teamPhotoUrl || "/assets/images/profile-banner-placeholder.png"} 
                  alt="banner" 
                  className="w-full h-44 object-cover" 
                  onError={(e) => {
                    e.target.src = "/assets/images/profile-banner-placeholder.png";
                  }}
                />
              </div>
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold text-[#004A74] leading-snug">{profile.groupName || 'Nama Kelompok'}</h2>

              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Email</span>
                  <div className="text-sm text-gray-600 mt-1">{profile.email || '-'}</div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Departemen</span>
                  <div className="text-sm text-gray-600 mt-1">{profile.department || '-'}</div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Tahun</span>
                  <div className="text-sm text-gray-600 mt-1">{profile.year || '-'}</div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Telepon</span>
                  <div className="text-sm text-gray-600 mt-1">{profile.phone || '-'}</div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-[#004A74] mb-3">Deskripsi Kelompok</h3>
                <p className="text-gray-700 text-justify leading-relaxed">
                  {profile.description || 'Belum ada deskripsi'}
                </p>
              </div>
            </div>
          </div>

          {/* Detail Anggota - Only show for own profile */}
          {isOwnProfile && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#004A74]">Detail Anggota</h3>

                <button
                  onClick={handleAddMember}
                  className="text-sm px-4 py-2 border border-[#004A74] text-[#004A74] font-semibold rounded-lg hover:bg-blue-50 transition"
                >
                  + Tambah Anggota
                </button>
              </div>

              <div className="space-y-4">
                {profile.members && profile.members.length > 0 ? (
                  profile.members.map((member) => (
                    <div key={member._id || member.id} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 flex-shrink-0 overflow-hidden">
                          {member.photoUrl ? (
                            <img 
                              src={member.photoUrl} 
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ display: member.photoUrl ? 'none' : 'block' }}>
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-[#004A74]">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.nim}</div>
                          <div className="text-sm text-gray-500">{member.major}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Lihat Portofolio */}
                        {member.portfolioUrl && (
                          <a 
                            href={member.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Portofolio
                          </a>
                        )}

                        {/* Lihat LinkedIn */}
                        {member.linkedinUrl && (
                          <a 
                            href={member.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none px-3 py-2 border border-[#004A74] text-[#004A74] rounded-lg text-sm font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zm-11.5 20h-3v-10h3v10zm-1.5-11.3a1.7 1.7 0 110-3.4 1.7 1.7 0 010 3.4zm13 11.3h-3v-5.5c0-1.3-.5-2.2-1.8-2.2-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9v5.4h-3v-10h3v1.4c.4-.6 1.3-1.4 3-1.4 2.2 0 3.8 1.4 3.8 4.4v5.6z" />
                            </svg>
                            LinkedIn
                          </a>
                        )}

                        {/* Edit Anggota */}
                        <button
                          onClick={() => handleEditMember(member._id || member.id)}
                          className="flex-1 md:flex-none px-3 py-2 bg-[#004A74] text-white rounded-lg text-sm font-medium hover:bg-[#003d5e] transition flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>

                        {/* Hapus Anggota */}
                        <button
                          onClick={() => handleDeleteMember(member._id || member.id)}
                          className="flex-1 md:flex-none px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada anggota yang ditambahkan
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </FixLayout>
  );
}