import React from 'react';
import { Recipe } from '../types.ts';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onView: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index, onView }) => {
  const typeToKeywordMap = {
    'قهوه': 'coffee',
    'دمنوش': 'tea',
    'نوشیدنی': 'drink',
  };
  const keyword = typeToKeywordMap[recipe.type] || 'beverage';
  const imageUrl = `https://source.unsplash.com/800x600/?${recipe.name.split('(')[0].trim()} ${keyword}`;

  return (
    <div 
        className="bg-white/60 rounded-xl shadow-lg flex flex-col transform hover:-translate-y-2 transition-transform duration-300 ease-in-out animate-fade-in-up overflow-hidden"
        style={{ animationDelay: `${index * 75}ms` }}
    >
        <div className="relative">
            <img src={imageUrl} alt={recipe.name} className="w-full h-40 object-cover bg-[#A27B5C]/20" />
            <span className="absolute top-2 right-2 bg-[#A27B5C] text-white px-3 py-1 text-sm rounded-full">{recipe.origin}</span>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl md:text-2xl font-bold text-[#4A2C2A] mb-2">{recipe.name}</h3>
            <p className="text-[#4A2C2A]/80 mb-4 h-20 overflow-hidden text-ellipsis flex-grow">{recipe.description}</p>
            <button 
                onClick={onView}
                className="w-full mt-auto bg-[#4A2C2A] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#382220] transition-colors duration-300"
            >
                مشاهده رسپی
            </button>
        </div>
    </div>
  );
};

export default RecipeCard;