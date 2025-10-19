import React from 'react';

const e = React.createElement;

const CountryCard = ({ countryName, index, onSelect }) => {
  const imageUrl = `https://source.unsplash.com/800x600/?${countryName},travel`;

  return e(
    'div',
    {
      onClick: onSelect,
      className: "relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-48 bg-cover bg-center text-white transform hover:scale-105 transition-all duration-300 ease-in-out animate-fade-in-up bg-[#A27B5C]/30",
      style: { backgroundImage: `url(${imageUrl})`, animationDelay: `${index * 50}ms` }
    },
    e('div', { className: "absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300" }),
    e(
      'div',
      { className: "relative h-full flex items-center justify-center p-4" },
      e('h3', { className: "text-xl md:text-2xl font-bold text-center" }, countryName)
    )
  );
};

export default CountryCard;