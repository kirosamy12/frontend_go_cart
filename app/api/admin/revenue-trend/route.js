import { NextResponse } from 'next/server';

// Mock data based on the API response you provided
const mockRevenueTrendData = [
  {
    period: "2025-11-06",
    revenue: 199,
    orderCount: 1
  },
  {
    period: "2025-11-08",
    revenue: 29999,
    orderCount: 1
  },
  {
    period: "2025-11-09",
    revenue: 59998,
    orderCount: 1
  },
  {
    period: "2025-11-10",
    revenue: 80,
    orderCount: 2
  },
  {
    period: "2025-11-11",
    revenue: 80,
    orderCount: 1
  }
];

export async function GET(request) {
  try {
    // In a real implementation, you would:
    // 1. Verify the admin token
    // 2. Fetch data from the database
    // 3. Calculate the metrics
    
    // For now, we're returning mock data based on your API response
    return NextResponse.json({
      success: true,
      data: mockRevenueTrendData
    });
  } catch (error) {
    console.error('Error fetching admin revenue trend data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch revenue trend data' },
      { status: 500 }
    );
  }
}