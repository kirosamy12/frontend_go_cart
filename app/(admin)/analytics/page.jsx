'use client'
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'store')) {
      router.push('/signin');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'store')) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnalyticsDashboard />
    </div>
  );
}