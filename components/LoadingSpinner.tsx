import React from 'react';
import { CoffeeBeanIcon } from './icons.tsx';

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4 my-8">
      <div className="relative"><div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-[#A27B5C]"></div><CoffeeBeanIcon className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 text-[#4A2C2A]" /></div>
      <p className="text-[#4A2C2A] text-lg font-semibold animate-pulse">در حال آماده‌سازی بهترین رسپی‌ها...</p>
    </div>
);

export default LoadingSpinner;