'use client'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/api"; // Use our api client

const TestAnalyticsAPI = () => {
  const { user, token } = useSelector(state => state.auth);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const runTests = async () => {
      const results = [];
      
      // Test 1: Check if we have a token
      results.push({
        test: "Authentication Token",
        status: token ? "PASS" : "FAIL",
        details: token ? "Token present" : "No token found"
      });
      
      // Test 2: Check user role
      results.push({
        test: "User Role",
        status: user?.role ? "PASS" : "FAIL",
        details: user?.role || "No role found"
      });
      
      // Test 3: Check store ID for store owners
      if (user?.role === 'store') {
        const storeId = user?.storeId || user?.store?.id || user?.store?._id;
        results.push({
          test: "Store ID",
          status: storeId ? "PASS" : "FAIL",
          details: storeId || "No store ID found"
        });
      }
      
      // Test 4: Direct API call using our api client
      try {
        let response;
        if (user?.role === 'store') {
          const storeId = user?.storeId || user?.store?.id || user?.store?._id;
          results.push({
            test: "API Endpoint",
            status: "IN_PROGRESS",
            details: `Testing store analytics with storeId: ${storeId}`
          });
          response = await api.getAnalytics("store", storeId);
        } else if (user?.role === 'admin') {
          results.push({
            test: "API Endpoint",
            status: "IN_PROGRESS",
            details: "Testing admin analytics"
          });
          response = await api.getAnalytics("admin");
        } else {
          throw new Error("Invalid user role");
        }
        
        results.push({
          test: "API Response",
          status: response.status === 200 ? "PASS" : "FAIL",
          details: `Status: ${response.status} ${response.statusText}`
        });
        
        if (response.status === 200) {
          const data = response.data;
          results.push({
            test: "API Data",
            status: data.success ? "PASS" : "FAIL",
            details: data.success ? "Data received successfully" : "API returned success=false"
          });
        }
      } catch (error) {
        results.push({
          test: "API Call",
          status: "FAIL",
          details: error.response?.data?.message || error.message
        });
      }
      
      setTestResults(results);
    };
    
    if (user && token) {
      runTests();
    }
  }, [user, token]);
  
  if (!user || !token) {
    return <div className="p-4 bg-yellow-100">Waiting for authentication...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Analytics API Test Results</h2>
      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div 
            key={index} 
            className={`p-3 rounded ${
              result.status === "PASS" ? "bg-green-100" : 
              result.status === "FAIL" ? "bg-red-100" : 
              "bg-blue-100"
            }`}
          >
            <div className="font-medium">{result.test}</div>
            <div className={`text-sm ${
              result.status === "PASS" ? "text-green-800" : 
              result.status === "FAIL" ? "text-red-800" : 
              "text-blue-800"
            }`}>
              Status: {result.status}
            </div>
            <div className="text-sm text-gray-600">{result.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestAnalyticsAPI;