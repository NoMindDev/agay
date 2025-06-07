// app/conversation/[id]/loading.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      {/* Skeleton Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 flex flex-col space-y-4 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="p-3">
                  <Skeleton className="h-4 w-[250px] mb-2" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Input */}
      <div className="w-full sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 relative">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
