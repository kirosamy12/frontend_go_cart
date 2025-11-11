import ModernStoreLayout from "@/components/ModernStoreLayout";

export const metadata = {
    title: "ShopVerse. - Store Dashboard",
    description: "ShopVerse. - Store Dashboard",
};

export default function StoreRootLayout({ children }) {

    return (
        <>
            <ModernStoreLayout>
                {children}
            </ModernStoreLayout>
        </>
    );
}