import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";

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
    <footer className="w-full bg-[#000] border-t border-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-8 pb-6">
              <span className="text-2xl font-bold tracking-tighter">
                IDE<span className="text-blue-500">xam</span>
              </span>
            </div>
            <div className="flex gap-4">
              <SocialIcon
                icon={<Github size={20} />}
                href="https://github.com"
              />
              <SocialIcon icon={<Twitter size={20} />} href="#" />
              <SocialIcon icon={<Linkedin size={20} />} href="#" />
              <SocialIcon icon={<Mail size={20} />} href="#" />
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
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

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {currentYear} tAhIni. All rights reserved. Built for
            secure technical assessments.
          </p>
          <div className="flex items-center gap-6">
            <select className="bg-transparent text-xs text-slate-500 border-none focus:ring-0 cursor-pointer hover:text-white transition">
              <option>English</option>
              <option>French</option>
              <option>Swahili</option>
            </select>
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
      className="p-2 bg-slate-900 rounded-full text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}
