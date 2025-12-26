"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingSequencerProps {
  children: React.ReactNode;
}

export function LoadingSequencer({ children }: LoadingSequencerProps) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(true);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  if (!showSkeleton) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
        <div className="relative w-40 h-40 animate-pulse">
           <Image 
             src="/assets/flowva_logo.png" 
             alt="Flowva Loading" 
             fill
             className="object-contain"
             priority
           />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
