import React from 'react';

interface CategorySelectionCardProps {
  title: string;
  description: string;
  imageUrl: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

const CategorySelectionCard: React.FC<CategorySelectionCardProps> = ({ title, description, imageUrl, icon, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-80 bg-cover bg-center text-white transform hover:scale-105 transition-all duration-500 ease-in-out animate-fade-in-up bg-[#A27B5C]/30"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      <div className="relative h-full flex flex-col justify-end p-8">
        <div className="transform group-hover:-translate-y-2 transition-transform duration-300">
            <div className="mb-4">{icon}</div>
            <h3 className="text-3xl md:text-4xl font-black">{title}</h3>
            <p className="mt-2 opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionCard;