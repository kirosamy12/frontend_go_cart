'use client'
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminAdvancedAnalyticsPage() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/signin');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdvancedAnalyticsDashboard />
    </div>
  );
}