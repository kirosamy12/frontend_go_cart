'use client'
import { BookOpenIcon, VideoIcon, UsersIcon, FileTextIcon, LightbulbIcon, TrendingUpIcon } from "lucide-react"
import Link from "next/link"

const resources = [
  {
    id: 1,
    title: "Getting Started Guide",
    description: "Complete guide to setting up your ShopVerse store",
    icon: BookOpenIcon,
    type: "Guide",
    link: "#"
  },
  {
    id: 2,
    title: "Product Photography Tips",
    description: "Learn how to take professional product photos",
    icon: VideoIcon,
    type: "Video",
    link: "#"
  },
  {
    id: 3,
    title: "Pricing Strategies",
    description: "How to price your products competitively",
    icon: TrendingUpIcon,
    type: "Article",
    link: "#"
  },
  {
    id: 4,
    title: "Shipping Best Practices",
    description: "Optimize your shipping process for customer satisfaction",
    icon: FileTextIcon,
    type: "Guide",
    link: "#"
  },
  {
    id: 5,
    title: "Marketing Your Store",
    description: "Effective marketing strategies for ShopVerse sellers",
    icon: LightbulbIcon,
    type: "Guide",
    link: "#"
  },
  {
    id: 6,
    title: "Seller Community",
    description: "Join our community of successful sellers",
    icon: UsersIcon,
    type: "Community",
    link: "#"
  }
]

const faqs = [
  {
    question: "How much does it cost to sell on ShopVerse?",
    answer: "We charge a 10% commission on each sale. There are no monthly fees or setup costs."
  },
  {
    question: "How long does it take to get approved?",
    answer: "Most applications are reviewed within 2-3 business days. You'll receive an email notification once your store is approved."
  },
  {
    question: "What products can I sell?",
    answer: "You can sell most physical products. We prohibit certain items like weapons, illegal substances, and counterfeit goods. See our prohibited items list for details."
  },
  {
    question: "How do I get paid?",
    answer: "Payments are processed through our secure payment system and transferred to your bank account monthly."
  }
]

export default function SellerResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <LightbulbIcon size={16} />
            Resources
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Seller Resources</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to start, grow, and succeed with your ShopVerse store
          </p>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Start Selling?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join thousands of successful sellers who have built their businesses on ShopVerse
          </p>
          <Link 
            href="/create-store" 
            className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-slate-100 transition shadow-lg"
          >
            Create Your Store
          </Link>
        </div>

        {/* Resource Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <resource.icon size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{resource.title}</h3>
              <p className="text-slate-600 mb-4">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {resource.type}
                </span>
                <Link 
                  href={resource.link} 
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1"
                >
                  Learn more
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33398 8H12.6673M12.6673 8L8.00065 3.33333M12.6673 8L8.00065 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div className="bg-slate-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Need More Help?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Our seller support team is here to help you succeed. Get in touch with us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Contact Support
            </Link>
            <Link 
              href="/help" 
              className="px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}