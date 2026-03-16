import { Github, Twitter, Linkedin, Mail, Search, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "IDE Engine", href: "#" },
      { name: "Proctoring", href: "#" },
      { name: "Pricing", href: "#" },
    ],
    Resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Community", href: "#" },
      { name: "Academic Integrity", href: "#" },
    ],
    Company: [
      { name: "About tAhIni", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="w-full bg-[#000] border-t border-[#333] pt-16 pb-8 font-sans text-left">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand & Search Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter text-white">
                IDE<span className="text-blue-500">xam</span>
              </span>
            </div>
            
            {/* Dark Mode Search Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-[#111] border border-[#333] rounded-md py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex gap-4">
              <SocialIcon icon={<Github size={18} />} href="https://github.com" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
              <SocialIcon icon={<Mail size={18} />} href="#" />
            </div>
          </div>

          {/* Dynamic Link Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold mb-6 text-sm tracking-wide">
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {currentYear} tAhIni. All rights reserved. Built for secure technical assessments.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center text-sm text-slate-500 hover:text-slate-300 transition-colors group cursor-pointer">
              <Globe className="w-4 h-4 mr-2" />
              <select className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-slate-500 group-hover:text-slate-300 appearance-none">
                <option className="bg-[#111] text-white">English</option>
                <option className="bg-[#111] text-white">French</option>
                <option className="bg-[#111] text-white">Swahili</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="p-2.5 bg-[#111] border border-[#333] rounded-full text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
    >
      {icon}
    </a>
  );
}