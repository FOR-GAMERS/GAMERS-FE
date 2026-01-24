"use client";

import { useState, useEffect } from "react";
import { bannerService, Banner, CreateBannerDto, UpdateBannerDto } from "@/services/banner-service";
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, Link as LinkIcon, Save, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Koulen } from "next/font/google";
import Image from "next/image";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
});

export default function BannerManagementPage() {
  const { addToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<CreateBannerDto>({
    title: "",
    link_url: "",
    image_key: "",
    is_active: true,
    display_order: 0,
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await bannerService.getAdminBanners();
      setBanners(res.data.banners);
    } catch (error) {
      console.error("Failed to fetch banners", error);
      // Determine if error is 401/403 or just empty
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        link_url: banner.link_url,
        image_key: banner.image_key,
        is_active: banner.is_active,
        display_order: banner.display_order,
      });
    } else {
        if (banners.length >= 5) {
            addToast("Maximum 5 banners allowed.", "error");
            return;
        }
      setEditingBanner(null);
      setFormData({
        title: "",
        link_url: "",
        image_key: "",
        is_active: true,
        display_order: banners.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
      if (!confirm("Are you sure you want to delete this banner?")) return;
      try {
          await bannerService.deleteBanner(id);
          addToast("Banner deleted successfully", "success");
          fetchBanners();
      } catch (error) {
          addToast("Failed to delete banner", "error");
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editingBanner) {
            await bannerService.updateBanner(editingBanner.id, formData);
            addToast("Banner updated successfully", "success");
        } else {
            await bannerService.createBanner(formData);
            addToast("Banner created successfully", "success");
        }
        setIsModalOpen(false);
        fetchBanners();
    } catch (error: any) {
        addToast(error.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      try {
          // This assumes the upload service returns a full URL or key. 
          // Based on swagger: /api/v1/storage/contest-banner returns { image_key, url }
          // Actually, swagger had /api/v1/storage/contest-banner. Let's assume we use that or similar.
          // For now, I'll assume the service handles it.
          const res = await bannerService.uploadBannerImage(file);
          setFormData(prev => ({ ...prev, image_key: res.data.image_key, imageUrl: res.data.url })); // Store URL for preview if needed
          addToast("Image uploaded successfully", "success");
      } catch (error) {
          addToast("Image upload failed", "error");
      }
  };

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center bg-black">
              <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
          </div>
      );
  }

  return (
    <div className="flex h-full flex-col bg-black text-white p-6 md:p-12 overflow-y-auto">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className={`text-3xl md:text-4xl font-bold tracking-wider text-white ${koulen.className}`}>
                    BANNER MANAGEMENT
                </h1>
                <p className="text-neutral-500 mt-2">Manage homepage banners. Maximum 5 active banners.</p>
            </div>
            <button 
                onClick={() => handleOpenModal()}
                disabled={banners.length >= 5}
                className="flex items-center gap-2 px-6 py-3 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            >
                <Plus size={20} /> ADD NEW BANNER
            </button>
        </header>

        {/* Banner List */}
        <div className="grid gap-6">
            {banners.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
                    <p className="text-neutral-500">No banners found. Create your first banner!</p>
                </div>
            ) : (
                banners.map((banner) => (
                    <div key={banner.id} className="group relative bg-neutral-900/50 border border-white/5 hover:border-neon-cyan/50 rounded-2xl p-6 transition-all flex flex-col md:flex-row gap-6 items-center">
                        {/* Image Preview */}
                        <div className="w-full md:w-64 h-32 bg-black rounded-xl overflow-hidden relative border border-white/10 shrink-0">
                            {/* Check if image_key is a full URL or needs a base URL. Assuming full URL or handled by Image component for now. 
                                Actually, checking swagger, it just says string. I'll assume it's a URL or I need to prepend something.
                                For now, imply it's a URL or use a placeholder if invalid. 
                            */}
                            {banner.image_key ? (
                                <img src={banner.image_key.startsWith('http') ? banner.image_key : `/api/storage/${banner.image_key}`} alt={banner.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-700">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur rounded text-xs font-mono border border-white/10">
                                ORDER: {banner.display_order}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 w-full text-left">
                            <h3 className="text-xl font-bold text-white mb-2">{banner.title}</h3>
                             <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
                                <LinkIcon size={14} />
                                <span className="truncate max-w-md">{banner.link_url || "No link"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${banner.is_active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                    {banner.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                            <button 
                                onClick={() => handleOpenModal(banner)}
                                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white hover:text-neon-cyan transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(banner.id)}
                                className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                         <h3 className="text-xl font-bold text-white">{editingBanner ? 'Edit Banner' : 'New Banner'}</h3>
                         <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                            <X size={20} />
                         </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                         
                         {/* Title */}
                         <div className="space-y-2">
                             <label className="text-sm font-bold text-neutral-400">Title</label>
                             <input 
                                required
                                value={formData.title} 
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                placeholder="Enter banner title"
                             />
                         </div>

                         {/* Link URL */}
                         <div className="space-y-2">
                             <label className="text-sm font-bold text-neutral-400">Link URL</label>
                             <input 
                                value={formData.link_url} 
                                onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                placeholder="https://..."
                             />
                         </div>

                         {/* Image Upload */}
                         <div className="space-y-2">
                             <label className="text-sm font-bold text-neutral-400">Banner Image</label>
                             <div className="flex items-center gap-4">
                                {formData.image_key && (
                                    <div className="w-20 h-12 bg-black rounded border border-white/10 overflow-hidden">
                                        <img src={formData.image_key.startsWith('http') ? formData.image_key : `/api/storage/${formData.image_key}`} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <label className="flex-1 cursor-pointer">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    <div className="w-full bg-white/5 border border-dashed border-white/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm text-neutral-400 transition-all">
                                        <ImageIcon size={16} />
                                        {formData.image_key ? 'Change Image' : 'Upload Image'}
                                    </div>
                                </label>
                             </div>
                             {/* As a fallback for manual key entry if upload fails or is not preferred */}
                             <input 
                                value={formData.image_key} 
                                onChange={(e) => setFormData(prev => ({ ...prev, image_key: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-neutral-500 focus:border-neon-cyan focus:outline-none transition-colors mt-2"
                                placeholder="Or enter image key/URL manually"
                             />
                         </div>

                         {/* Options */}
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-400">Display Order</label>
                                <input 
                                    type="number"
                                    value={formData.display_order} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-400">Status</label>
                                <div className="flex items-center gap-3 pt-3">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${formData.is_active ? 'bg-neon-cyan' : 'bg-neutral-800'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${formData.is_active ? 'left-7' : 'left-1'}`} />
                                    </button>
                                    <span className="text-sm text-white">{formData.is_active ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                         </div>

                         <div className="pt-4">
                            <button 
                                type="submit"
                                className="w-full py-4 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {editingBanner ? 'UPDATE BANNER' : 'CREATE BANNER'}
                            </button>
                         </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
