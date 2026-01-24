import Cookies from 'js-cookie';

export interface BannerConfig {
  title: string;
  subtitle: string;
  slides: {
    id: number;
    color: string;
    image?: string;
  }[];
}

const DEFAULT_BANNER: BannerConfig = {
  title: "GAMERS 大会",
  subtitle: "最強を目指せ。頂点へ登り詰めろ。栄光を掴み取れ。",
  slides: [
    { id: 1, color: "from-blue-900 to-indigo-900" },
    { id: 2, color: "from-purple-900 to-fuchsia-900" },
    { id: 3, color: "from-emerald-900 to-teal-900" },
    { id: 4, color: "from-rose-900 to-red-900" }
  ]
};

const STORAGE_KEYS = {
  BANNER: 'admin_banner_config'
};

export const bannerConfigService = {
  getBannerConfig: (): BannerConfig => {
    if (typeof window === 'undefined') return DEFAULT_BANNER;
    const stored = localStorage.getItem(STORAGE_KEYS.BANNER);
    return stored ? JSON.parse(stored) : DEFAULT_BANNER;
  },

  saveBannerConfig: (config: BannerConfig) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(config));
    // Trigger storage event for cross-component updates if needed, though Context is better.
    // For simplicity, we might just rely on window reload or simple polling/hooks.
    window.dispatchEvent(new Event('banner-update'));
  },
  
  // Helper to subscribe
  subscribeToBanner: (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('banner-update', callback);
    return () => window.removeEventListener('banner-update', callback);
  }
};
