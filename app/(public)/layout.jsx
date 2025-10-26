'use client'
import Banner from "@/components/Banner";
import ModernNavbar from "@/components/ModernNavbar";

export default function PublicLayout({ children }) {

    return (
        <>
            <Banner />
            <ModernNavbar />
            {children}
        </>
    );
}