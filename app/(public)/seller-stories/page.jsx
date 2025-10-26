'use client'
import { useState } from "react"
import { StoreIcon, TrendingUpIcon, UsersIcon, AwardIcon } from "lucide-react"
import Link from "next/link"

const sellerStories = [
  {
    id: 1,
    name: "TechGadgets Pro",
    username: "techgadgetspro",
    story: "Started as a small electronics repair shop, now generating $50K+ monthly revenue on ShopVerse with over 10,000 satisfied customers.",
    revenue: "$50K+/month",
    growth: "500%",
    image: "/placeholder.jpg",
    featured: true
  },
  {
    id: 2,
    name: "Fashion Forward",
    username: "fashionforward",
    story: "Launched during the pandemic with handmade jewelry. Now ships internationally and has been featured in Vogue magazine.",
    revenue: "$25K+/month",
    growth: "300%",
    image: "/placeholder.jpg",
    featured: true
  },
  {
    id: 3,
    name: "Home Essentials",
    username: "homeessentials",
    story: "Family-run business selling home decor. Expanded from local markets to becoming one of our top home sellers.",
    revenue: "$35K+/month",
    growth: "400%",
    image: "/placeholder.jpg",
    featured: false
  },
  {
    id: 4,
    name: "Fitness World",
    username: "fitnessworld",
    story: "Personal trainer turned entrepreneur. Built a successful fitness equipment store with custom workout plans.",
    revenue: "$20K+/month",
    growth: "350%",
    image: "/placeholder.jpg",
    featured: false
  }
]

export default function SellerStoriesPage() {
  const [filter, setFilter] = useState('all')

  const filteredStories = filter === 'featured' 
    ? sellerStories.filter(story => story.featured)
    : sellerStories

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <AwardIcon size={16} />
            Success Stories
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Seller Success Stories</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover how entrepreneurs like you have built thriving businesses on ShopVerse
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <StoreIcon size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">10,000+</h3>
            <p className="text-slate-600">Active Sellers</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUpIcon size={24} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">$100M+</h3>
            <p className="text-slate-600">Annual Revenue</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UsersIcon size={24} className="text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">5M+</h3>
            <p className="text-slate-600">Happy Customers</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'all' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              All Stories
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'featured' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Featured
            </button>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredStories.map((story) => (
            <div 
              key={story.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-indigo-700 font-bold text-lg">
                        {story.name.charAt(0)}
                      </span>
                    </div>
                    {story.featured && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                        <AwardIcon size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">{story.name}</h3>
                    <p className="text-indigo-600">@{story.username}</p>
                    
                    <div className="flex gap-4 mt-3">
                      <div>
                        <p className="text-sm text-slate-500">Revenue</p>
                        <p className="font-semibold text-slate-800">{story.revenue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Growth</p>
                        <p className="font-semibold text-green-600">{story.growth}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="mt-4 text-slate-600">{story.story}</p>
                
                <div className="mt-6">
                  <Link 
                    href={`/shop/${story.username}`} 
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Visit Store
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33398 8H12.6673M12.6673 8L8.00065 3.33333M12.6673 8L8.00065 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <StoreIcon size={48} className="text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Success Story?</h2>
            <p className="text-indigo-100 text-xl mb-8">
              Join thousands of sellers who are growing their businesses with ShopVerse
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/create-store" 
                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-100 transition shadow-lg"
              >
                Create Your Store
              </Link>
              <Link 
                href="/seller-resources" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition"
              >
                Seller Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}