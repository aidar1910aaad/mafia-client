'use client';

import { Download } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-3xl font-bold">Регламент</h1>
            <a 
              href="/rules.pdf" 
              download
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Скачать PDF
            </a>
          </div>
          
          <div className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            <iframe
              src="/rules.pdf"
              className="w-full h-full"
              title="Регламент"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 