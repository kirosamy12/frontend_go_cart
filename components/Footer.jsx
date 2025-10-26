import Link from "next/link";
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, MailIcon, PhoneIcon, MapPinIcon, StoreIcon } from 'lucide-react';

const Footer = () => {

    const MailIconComponent = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.6654 4.66699L8.67136 8.48499C8.46796 8.60313 8.23692 8.66536 8.0017 8.66536C7.76647 8.66536 7.53544 8.60313 7.33203 8.48499L1.33203 4.66699M2.66536 2.66699H13.332C14.0684 2.66699 14.6654 3.26395 14.6654 4.00033V12.0003C14.6654 12.7367 14.0684 13.3337 13.332 13.3337H2.66536C1.92898 13.3337 1.33203 12.7367 1.33203 12.0003V4.00033C1.33203 3.26395 1.92898 2.66699 2.66536 2.66699Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
    const PhoneIconComponent = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.22003 11.045C9.35772 11.1082 9.51283 11.1227 9.65983 11.086C9.80682 11.0493 9.93692 10.9636 10.0287 10.843L10.2654 10.533C10.3896 10.3674 10.5506 10.233 10.7357 10.1404C10.9209 10.0479 11.125 9.99967 11.332 9.99967H13.332C13.6857 9.99967 14.0248 10.1402 14.2748 10.3902C14.5249 10.6402 14.6654 10.9794 14.6654 11.333V13.333C14.6654 13.6866 14.5249 14.0258 14.2748 14.2758C14.0248 14.5259 13.6857 14.6663 13.332 14.6663C10.1494 14.6663 7.09719 13.4021 4.84675 11.1516C2.59631 8.90119 1.33203 5.84894 1.33203 2.66634C1.33203 2.31272 1.47251 1.97358 1.72256 1.72353C1.9726 1.47348 2.31174 1.33301 2.66536 1.33301H4.66536C5.01899 1.33301 5.35812 1.47348 5.60817 1.72353C5.85822 1.97358 5.9987 2.31272 5.9987 2.66634V4.66634C5.9987 4.87333 5.9505 5.07749 5.85793 5.26263C5.76536 5.44777 5.63096 5.60881 5.46536 5.73301L5.15336 5.96701C5.03098 6.06046 4.94471 6.1934 4.90923 6.34324C4.87374 6.49308 4.89122 6.65059 4.9587 6.78901C5.86982 8.63959 7.36831 10.1362 9.22003 11.045Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
    const MapPinIconComponent = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path d="M8.0013 8.66634C9.10587 8.66634 10.0013 7.77091 10.0013 6.66634C10.0013 5.56177 9.10587 4.66634 8.0013 4.66634C6.89673 4.66634 6.0013 5.56177 6.0013 6.66634C6.0013 7.77091 6.89673 8.66634 8.0013 8.66634Z" stroke="#90A1B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>)
    
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
            title: "SELL",
            links: [
                { text: "Create Your Store", path: '/create-store' },
                { text: "Seller Dashboard", path: '/store' },
                { text: "Seller Resources", path: '/seller-resources' },
                { text: "Success Stories", path: '/seller-stories' },
            ]
        },
        {
            title: "CONTACT",
            links: [
                { text: "support@shopverse.com", path: 'mailto:support@shopverse.com', icon: MailIconComponent },
                { text: "+1 (555) 123-4567", path: 'tel:+15551234567', icon: PhoneIconComponent },
                { text: "123 Tech Street, San Francisco, CA", path: '/', icon: MapPinIconComponent }
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
                                            {link.icon && <link.icon />}
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                {/* Create Store CTA Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-12 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-center mb-4">
                            <StoreIcon size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Start Selling on ShopVerse</h3>
                        <p className="text-indigo-100 mb-6">
                            Join thousands of sellers who are growing their businesses with ShopVerse. 
                            Create your store today and reach millions of customers.
                        </p>
                        <Link 
                            href="/create-store" 
                            className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-slate-100 transition shadow-lg inline-block"
                        >
                            Create Your Store
                        </Link>
                    </div>
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

export default Footer;