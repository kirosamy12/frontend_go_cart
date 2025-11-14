'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function OrdersAreaChartImproved({ allOrders }) {

    // Group orders by date
    const ordersPerDay = (allOrders || []).reduce((acc, order) => {
        // Check if this is recentSales data (has _id as date and dailyRevenue/orderCount)
        if (order && order._id && typeof order._id === 'string' && order._id.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // This is recentSales data
            const date = order._id; // Already in YYYY-MM-DD format
            acc[date] = (acc[date] || 0) + (order.orderCount || 1);
            return acc;
        }
        
        // Validate that order and createdAt exist for regular order data
        if (!order || !order.createdAt) {
            return acc;
        }
        
        // Create date and check if it's valid
        const dateObj = new Date(order.createdAt);
        if (isNaN(dateObj.getTime())) {
            return acc; // Skip invalid dates
        }
        
        const date = dateObj.toISOString().split('T')[0]; // format: YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    // Convert to array for Recharts
    const chartData = Object.entries(ordersPerDay).map(([date, count]) => ({
        date,
        orders: count
    }));

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-semibold text-gray-900">{`Date: ${label}`}</p>
                    <p className="text-indigo-600">{`Orders: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[350px]">
            <h3 className="text-lg font-medium text-slate-800 mb-4"> 
                <span className='text-slate-500'>Orders /</span> Day
            </h3>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                        />
                        <YAxis 
                            allowDecimals={false} 
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#4f46e5" 
                            fill="url(#colorOrders)" 
                            strokeWidth={2}
                            name="Orders"
                        />
                        <defs>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium">No order data available</p>
                    <p className="text-sm">Orders will appear here once customers start placing orders</p>
                </div>
            )}
        </div>
    );
}