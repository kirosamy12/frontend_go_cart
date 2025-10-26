import Link from "next/link";
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';

const ModernFooter = () => {
    const linkSections = [
        {
            title: "SHOP",
            links: [
                { text: "All Products", path: '/shop' },
                { text: "New Arrivals", path: '/shop?sort=newest' },
                { text: "Best Sellers", path: '/shop?sort=rating' },
                { text: "Sale Items", path: '/shop?sort=sale' },
            ]
        },
        {
            title: "COMPANY",
            links: [
                { text: "About Us", path: '/about' },
                { text: "Contact", path: '/contact' },
                { text: "Careers", path: '/careers' },
                { text: "Blog", path: '/blog' },
            ]
        },
        {
            title: "SUPPORT",
            links: [
                { text: "Help Center", path: '/help' },
                { text: "Shipping Info", path: '/shipping' },
                { text: "Returns", path: '/returns' },
                { text: "Privacy Policy", path: '/privacy' },
            ]
        },
        {
            title: "CONTACT",
            links: [
                { text: "support@shopverse.com", path: 'mailto:support@shopverse.com', icon: MailIcon },
                { text: "+20 1557075589", path: 'tel:+01557075589', icon: PhoneIcon },
                { text: "Alex", path: '/', icon: MapPinIcon }
            ]
        }
    ];

    const socialIcons = [
        { icon: FacebookIcon, link: "https://www.facebook.com" },
        { icon: InstagramIcon, link: "https://www.instagram.com" },
        { icon: TwitterIcon, link: "https://twitter.com" },
        { icon: LinkedinIcon, link: "https://www.linkedin.com" },
    ]

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16">
                    <div className="lg:col-span-2">
                        <Link href="/" className="text-3xl font-bold text-white mb-4 block">
                            <span className="text-indigo-400">shop</span>verse<span className="text-indigo-400">.</span>
                        </Link>
                        <p className="max-w-md mb-6">
                            Your ultimate destination for the latest and smartest gadgets. From smartphones and smartwatches to essential accessories, we bring you the best in innovation.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialIcons.map((item, i) => (
                                <Link 
                                    href={item.link} 
                                    key={i} 
                                    className="flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-indigo-600 transition rounded-full"
                                >
                                    <item.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-white text-lg mb-5">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link 
                                            href={link.path} 
                                            className="flex items-center gap-2 hover:text-white transition group"
                                        >
                                            {link.icon && <link.icon size={16} className="text-slate-500 group-hover:text-indigo-400" />}
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-slate-800 py-8 text-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>
                            Copyright © 2025 ShopVerse. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/terms" className="hover:text-white transition">Terms</Link>
                            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
                            <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ModernFooter;