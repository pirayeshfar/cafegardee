import React from 'react';
import { CoffeeBeanIcon } from './icons.js';

const e = React.createElement;

const LoadingSpinner = () => e('div', { className: "flex flex-col items-center justify-center space-y-4 my-8" },
    e('div', { className: "relative" },
        e('div', { className: "w-20 h-20 border-4 border-dashed rounded-full animate-spin border-[#A27B5C]" }),
        e(CoffeeBeanIcon, { className: "absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 text-[#4A2C2A]" })
    ),
    e('p', { className: "text-[#4A2C2A] text-lg font-semibold animate-pulse" }, "در حال آماده‌سازی بهترین رسپی‌ها...")
);

export default LoadingSpinner;
