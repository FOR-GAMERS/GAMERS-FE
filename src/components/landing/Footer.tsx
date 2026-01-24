"use client";

import { Instagram, Twitter } from "lucide-react";
import { Koulen } from "next/font/google";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
});

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="absolute bottom-0 w-full border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2">
            <span className={cn("text-3xl tracking-wider text-white", koulen.className)}>
                GAMERS
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('landing.footer.copyright')}
          </p>

          <div className="flex items-center gap-4">
            <a href="#" aria-label="X (Twitter)" className="text-muted-foreground hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
