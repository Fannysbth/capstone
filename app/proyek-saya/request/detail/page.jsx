"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FixLayout from "../../../../components/FixLayout";
import RequestAPI from "../../../../lib/request-api";
import ProjectAPI from "../../../../lib/project-api";

function formatDate(iso) {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
        return iso;
    }
}

const StatusBadge = ({ status }) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Approved</span>;
    if (s === "rejected") return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Rejected</span>;
    return <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Waiting for Response</span>;
};

const MemberCard = ({ member }) => {
    return (
        <div className="flex items-center justify-between gap-4 border-t border-gray-200 py-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0" />
                <div>
                    <div className="text-sm font-semibold text-[#004A74]">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.nim} • {member.major}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <a
                    href={member.portfolioUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-sm px-3 py-1 border rounded-md ${member.portfolioUrl ? 'bg-white border-gray-300 text-[#004A74]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    onClick={(e) => { if (!member.portfolioUrl) e.preventDefault(); }}
                >
                    <img src="/assets/icons/portfolio.png" alt="portfolio" className="w-4 h-4 inline mr-2" />
                    Lihat Portofolio
                </a>
                <a
                    href={member.linkedinUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-sm px-3 py-1 border rounded-md ${member.linkedinUrl ? 'bg-white border-gray-300 text-[#004A74]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    onClick={(e) => { if (!member.linkedinUrl) e.preventDefault(); }}
                >
                    <img src="/assets/icons/linkedin.png" alt="linkedin" className="w-4 h-4 inline mr-2" />
                    Lihat LinkedIn
                </a>
            </div>
        </div>
    );
};

export default function RequestDetailPage() {
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get("id");

    const [req, setReq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projectOwnerGroup, setProjectOwnerGroup] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const loadRequestDetail = async () => {
            if (!id) {
                setReq(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Load request detail from API
                const requestData = await RequestAPI.getRequestDetail(id);
                setReq(requestData);

                // Load project owner group info if projectId exists
                if (requestData?.projectId) {
                    try {
                        const project = await ProjectAPI.getMyProjectById(requestData.projectId);
                        // Since BE doesn't have group name in project, we'll use requester name
                        // You might need to adjust this based on your actual data structure
                        setProjectOwnerGroup(requestData.requesterName);
                    } catch (err) {
                        console.error("Failed to load project info:", err);
                        setProjectOwnerGroup(requestData.requesterName);
                    }
                }
            } catch (err) {
                console.error("Failed to load incoming request:", err);
                setReq(null);
            } finally {
                setLoading(false);
            }
        };

        loadRequestDetail();
    }, [id]);

    const handleApprove = async () => {
        if (!req) return;
        setIsProcessing(true);
        try {
            const updated = await RequestAPI.updateRequestStatus(req.id, "Approved");
            
            // Update local state with approved status
            setReq(prev => ({
                ...prev,
                status: 'Approved',
                approved: true,
                proposalLink: updated.proposalLink
            }));

            // Show success message
            if (updated.proposalLink) {
                alert(`Request berhasil disetujui! Link proposal: ${updated.proposalLink}`);
            } else {
                alert('Request berhasil disetujui!');
            }
        } catch (err) {
            console.error("Failed to approve request:", err);
            alert("Gagal menyetujui request: " + (err.message || err));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = () => {
        if (!req) return;
        setRejectReason("");
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (!req) return;
        setIsProcessing(true);
        try {
            await RequestAPI.updateRequestStatus(req.id, "Rejected", rejectReason || null);
            
            // Update local state with rejected status
            setReq(prev => ({
                ...prev,
                status: 'Rejected',
                approved: false
            }));
            
            setShowRejectModal(false);
            alert('Request berhasil ditolak!');
        } catch (err) {
            console.error("Failed to reject request:", err);
            alert("Gagal menolak request: " + (err.message || err));
        } finally {
            setIsProcessing(false);
        }
    };

    const cancelReject = () => {
        setShowRejectModal(false);
        setRejectReason("");
    };

    // Transform BE data to FE format for display
    const transformRequestData = (requestData) => {
        if (!requestData) return null;

        return {
            id: requestData.id,
            projectId: requestData.projectId,
            projectTitle: requestData.projectTitle,
            requesterName: requestData.requesterName,
            groupImage: requestData.teamPhotoUrl || "/assets/default-group.png",
            groupDescription: requestData.requesterDepartment 
                ? `Kelompok dari ${requestData.requesterDepartment} angkatan ${requestData.requesterYear || '2024'}`
                : "Kelompok pengembang proyek",
            status: requestData.status,
            createdAt: requestData.createdAt,
            subject: "Request untuk melanjutkan proyek",
            message: requestData.message,
            proposalLink: requestData.proposalLink,
            // Since BE doesn't provide member list, we'll create a single member from requester info
            members: [
                {
                    id: requestData.id + "-member",
                    name: requestData.requesterName,
                    nim: "N/A", // Not available from BE
                    major: requestData.requesterDepartment || "Teknik",
                    portfolioUrl: null, // Not available from BE
                    linkedinUrl: null // Not available from BE
                }
            ]
        };
    };

    const displayReq = transformRequestData(req);

    if (loading) {
        return (
            <FixLayout>
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
                    <div className="text-center py-24">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#004A74]"></div>
                        <p className="mt-4 text-gray-500">Memuat detail request...</p>
                    </div>
                </div>
            </FixLayout>
        );
    }

    if (!displayReq) {
        return (
            <FixLayout>
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
                    <div className="text-center py-24">
                        <p className="text-gray-600">Request tidak ditemukan.</p>
                        <button 
                            onClick={() => router.push('/proyek-saya/request/masuk')} 
                            className="mt-4 px-4 py-2 bg-[#004A74] text-white rounded"
                        >
                            Kembali ke Request Masuk
                        </button>
                    </div>
                </div>
            </FixLayout>
        );
    }

    return (
        <FixLayout>
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <span className="hover:text-[#004A74] cursor-pointer" onClick={() => router.push('/')}>Homepage</span>
                    <span>›</span>
                    <span className="hover:text-[#004A74] cursor-pointer" onClick={() => router.push('/proyek-saya')}>Proyek Saya</span>
                    {displayReq?.projectTitle && (
                        <>
                            <span>›</span>
                            <span
                                className="hover:text-[#004A74] cursor-pointer"
                                onClick={() => router.push(`/proyek-saya/detail?id=${displayReq.projectId}`)}
                            >
                                {displayReq.projectTitle}
                            </span>
                        </>
                    )}
                    <span>›</span>
                    <span 
                        className="hover:text-[#004A74] cursor-pointer" 
                        onClick={() => router.push('/proyek-saya/request/masuk' + (displayReq.projectId ? `?projectId=${displayReq.projectId}` : ''))}
                    >
                        Request Masuk
                    </span>
                    <span>›</span>
                    <span className="text-[#004A74] font-semibold">Detail Request</span>
                </div>

                {/* Header */}
                <section className="flex items-start gap-8 mb-10">
                    <div className="w-72 h-48 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                            src={displayReq.groupImage} 
                            alt={displayReq.requesterName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/assets/default-group.png";
                            }}
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl lg:text-4xl font-bold text-[#004A74] leading-tight">
                            {projectOwnerGroup || displayReq.requesterName}
                        </h1>
                        <p className="mt-2 text-base text-[#5B5858]">
                            {displayReq.requesterDepartment && `Jurusan ${displayReq.requesterDepartment}`}
                            {displayReq.requesterYear && ` • Angkatan ${displayReq.requesterYear}`}
                        </p>
                        <div className="mt-5">
                            <div className="flex items-center gap-4">
                                <StatusBadge status={displayReq.status} />
                            </div>

                            {displayReq.status === "Waiting for Response" && (
                                <div className="mt-3 flex items-center gap-3">
                                    <button
                                        onClick={handleReject}
                                        disabled={isProcessing}
                                        className="rounded-md border border-[#004A74] bg-white px-4 py-2 text-xs font-semibold text-[#004A74] transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Tolak
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        disabled={isProcessing}
                                        className="rounded-md bg-[#004A74] px-4 py-2 text-xs font-semibold text-white transition hover:bg-opacity-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="text-sm">✔</span>
                                        <span>Terima</span>
                                    </button>
                                </div>
                            )}

                            <div className="mt-3 text-sm text-gray-600">
                                <div>Dikirim: {formatDate(displayReq.createdAt)}</div>
                                <div>Project: <span className="font-medium text-gray-800">{displayReq.projectTitle}</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main content */}
                <main>
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-[#004A74] mb-2 pb-2 border-b-2 border-[#FED400] inline-block">
                                Deskripsi Kelompok
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">{displayReq.groupDescription}</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-[#004A74] mb-2 pb-2 border-b-2 border-[#FED400] inline-block">
                                Detail Anggota
                            </h2>
                            <div className="divide-y divide-gray-200">
                                {Array.isArray(displayReq.members) && displayReq.members.map((m) => (
                                    <div key={m.id} className="flex items-center justify-between gap-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0" />
                                            <div>
                                                <div className="text-sm font-semibold text-[#004A74]">{m.name}</div>
                                                <div className="text-xs text-[#5B5858]">{m.nim}</div>
                                                <div className="text-xs text-[#5B5858]">{m.major}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <a
                                                href={m.portfolioUrl || '#'}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`rounded-md border px-3 py-2 text-xs font-semibold transition flex items-center gap-2 ${m.portfolioUrl ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                                onClick={(e) => { if (!m.portfolioUrl) e.preventDefault(); }}
                                            >
                                                <img src="/assets/icons/portfolio.png" className="w-3 h-3" alt="portfolio" />
                                                <span>Lihat Portofolio</span>
                                            </a>
                                            <a
                                                href={m.linkedinUrl || '#'}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`rounded-md border px-3 py-2 text-xs font-semibold transition flex items-center gap-2 ${m.linkedinUrl ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                                onClick={(e) => { if (!m.linkedinUrl) e.preventDefault(); }}
                                            >
                                                <img src="/assets/icons/linkedin.png" className="w-3 h-3" alt="linkedin" />
                                                <span>Lihat LinkedIn</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-[#004A74] mb-2 pb-2 border-b-2 border-[#FED400] inline-block">
                                Pesan
                            </h2>
                            <div className="p-4 border rounded-md bg-gray-50">
                                <h3 className="font-bold text-[#004A74]">{displayReq.subject}</h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{displayReq.message}</p>
                            </div>
                        </div>

                        {/* Proposal Link - Show if approved */}
                        {displayReq.status === "Approved" && displayReq.proposalLink && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-[#004A74] mb-2 pb-2 border-b-2 border-[#FED400] inline-block">
                                    Link Proposal
                                </h2>
                                <div className="mt-2">
                                    <a 
                                        href={displayReq.proposalLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[#004A74] hover:underline break-all"
                                    >
                                        {displayReq.proposalLink}
                                    </a>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Link proposal asli dari proyek ini telah dibagikan kepada kelompok yang disetujui.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Reject Reason Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={cancelReject} />
                        <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg p-6 z-10">
                            <h2 className="text-xl font-bold text-[#004A74] mb-4">Tolak Request</h2>
                            <div className="mt-4 flex justify-end gap-3">
                                <button 
                                    onClick={cancelReject} 
                                    disabled={isProcessing}
                                    className="px-4 py-2 rounded-md border text-sm bg-white border-gray-300 disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmReject} 
                                    disabled={isProcessing}
                                    className="px-4 py-2 rounded-md bg-[#004A74] text-white text-sm disabled:opacity-50"
                                >
                                    {isProcessing ? "Memproses..." : "Tolak Request"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FixLayout>
    );
}