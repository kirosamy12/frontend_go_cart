'use client'
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StoreAdvancedAnalyticsPage() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not store owner
    if (!isAuthenticated || user?.role !== 'store') {
      router.push('/signin');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'store') {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdvancedAnalyticsDashboard />
    </div>
  );
}