import React from 'react';
import { Leaf, MapPin, Users, Sprout } from 'lucide-react';

const BrandedLeftPanel = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between w-full h-full bg-[#fdfcf6] p-12 border-r border-gray-100">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-2 text-green-700">
          <Leaf className="w-8 h-8 fill-current" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">SajiloKheti</span>
        </div>
      </div>

      {/* Featured Component: "The Living Listing" */}
      <div className="relative">
        <div className="bg-white rounded-2xl shadow-xl shadow-green-900/5 border border-gray-100 p-6 max-w-sm rotate-1 transform">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              New Listing
            </span>
            <span className="text-gray-400 font-mono text-xs">#SK-2026</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-1">0.5 Acres in Lalitpur</h3>
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            Kathmandu Valley, NP
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-50 text-sm">
              <span className="text-gray-500">Soil Type</span>
              <span className="font-medium text-gray-800">Fertile Alluvial</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50 text-sm">
              <span className="text-gray-500">Water Access</span>
              <span className="font-medium text-gray-800">Borewell & Rainwater</span>
            </div>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
            View Land Details
          </button>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute -bottom-6 -right-6 bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm animate-bounce">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-yellow-800 font-bold uppercase">Organic Tips</p>
              <p className="text-xs text-yellow-700">Start with spinach this season.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Stats Footer */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">500+</span>
          </div>
          <p className="text-sm text-gray-500">Urban Farmers growing in the community.</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">120+</span>
          </div>
          <p className="text-sm text-gray-500">Acres of unused land available now.</p>
        </div>
      </div>
    </div>
  );
};

export default BrandedLeftPanel;
