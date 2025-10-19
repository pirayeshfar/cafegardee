import React from 'react';

const e = React.createElement;

const CategorySelectionCard = ({ title, description, imageUrl, icon, onSelect }) => {
  return e('div', {
      onClick: onSelect,
      className: "relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-80 bg-cover bg-center text-white transform hover:scale-105 transition-all duration-500 ease-in-out animate-fade-in-up bg-[#A27B5C]/30",
      style: { backgroundImage: `url(${imageUrl})` }
    },
    e('div', { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" }),
    e('div', { className: "relative h-full flex flex-col justify-end p-8" },
      e('div', { className: "transform group-hover:-translate-y-2 transition-transform duration-300" },
          e('div', { className: "mb-4" }, icon),
          e('h3', { className: "text-3xl md:text-4xl font-black" }, title),
          e('p', { className: "mt-2 opacity-90" }, description)
      )
    )
  );
};

export default CategorySelectionCard;