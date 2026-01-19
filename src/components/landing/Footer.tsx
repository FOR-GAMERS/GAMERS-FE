import { Gamepad2, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="GAMERS Logo" className="h-8 w-auto" loading="lazy" />
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gamers Inc. 無断転載を禁じます。
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
