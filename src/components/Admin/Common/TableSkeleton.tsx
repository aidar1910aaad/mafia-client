'use client';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export default function TableSkeleton({ 
  rows = 10, 
  columns = 6, 
  className = "" 
}: TableSkeletonProps) {
  return (
    <div className={`bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl overflow-hidden shadow-xl ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#404040]/50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="text-left p-6">
                  <div className="h-4 bg-gradient-to-r from-[#404040]/30 via-[#404040]/50 to-[#404040]/30 rounded animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[#404040]/30">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="p-6">
                    <div 
                      className="h-4 bg-gradient-to-r from-[#404040]/20 via-[#404040]/40 to-[#404040]/20 rounded animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"
                      style={{ animationDelay: `${(rowIndex * columns + colIndex) * 50}ms` }}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}