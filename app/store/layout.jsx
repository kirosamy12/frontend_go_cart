import ModernStoreLayout from "@/components/ModernStoreLayout";

export const metadata = {
    title: "ShopVerse. - Store Dashboard",
    description: "ShopVerse. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <ModernStoreLayout>
                {children}
            </ModernStoreLayout>
        </>
    );
}