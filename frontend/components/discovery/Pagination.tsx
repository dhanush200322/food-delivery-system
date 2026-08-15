"use client";

import { Pagination as PaginationType } from "@/types";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  const { page, pages, total, limit } = pagination;
  
  // Calculate display range
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-border mt-8">
      <div className="text-sm text-muted-foreground font-medium">
        Showing <span className="text-foreground font-bold">{start}</span> to <span className="text-foreground font-bold">{end}</span> of <span className="text-foreground font-bold">{total}</span> results
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-10 px-4"
        >
          <ChevronLeft size={16} className="mr-2" />
          Previous
        </Button>
        
        <div className="hidden sm:flex items-center gap-1 mx-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
            // Show first, last, and pages around current page
            if (
              p === 1 || 
              p === pages || 
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    p === page 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  {p}
                </button>
              );
            }
            
            // Show ellipses for gaps
            if (p === page - 2 || p === page + 2) {
              return <span key={p} className="px-1 text-muted-foreground">...</span>;
            }
            
            return null;
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="h-10 px-4"
        >
          Next
          <ChevronRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
