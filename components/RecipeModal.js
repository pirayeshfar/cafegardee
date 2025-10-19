import React, { useState, useEffect } from 'react';
import { CloseIcon, ClipboardIcon } from './icons.js';

const e = React.createElement;

const RecipeModal = ({ recipe, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [recipe]);

  const handleCopyToClipboard = () => {
    if (!recipe) return;
    const recipeText = `
رسپی: ${recipe.name}
خاستگاه: ${recipe.origin}${recipe.city ? ` (${recipe.city})` : ''}

توضیحات:
${recipe.description}

مواد لازم:
${recipe.ingredients.map(i => `- ${i}`).join('\n')}

دستور تهیه:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(recipeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!recipe) return null;

  const typeToKeywordMap = {
    'قهوه': 'coffee',
    'دمنوش': 'tea',
    'نوشیدنی': 'drink',
  };
  const keyword = typeToKeywordMap[recipe.type] || 'beverage';
  const imageUrl = `https://source.unsplash.com/1600x900/?${recipe.name.split('(')[0].trim()} ${keyword},food`;

  return e('div', { className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in", onClick: onClose },
    e('div', {
      className: "bg-[#DCD7C9] text-[#4A2C2A] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in",
      onClick: e => e.stopPropagation()
    },
      e('header', { className: "flex items-center justify-between p-4 border-b border-[#A27B5C]/50 sticky top-0 bg-[#DCD7C9]/80 backdrop-blur-sm z-10" },
        e('div', null,
          e('h2', { className: "text-xl sm:text-2xl font-bold" }, recipe.name),
          e('p', { className: "text-sm text-[#A27B5C]" }, `${recipe.origin}${recipe.city ? `, ${recipe.city}` : ''}`)
        ),
        e('button', { onClick: onClose, className: "p-2 rounded-full hover:bg-black/10 transition-colors" },
          e(CloseIcon, { className: "w-6 h-6" })
        )
      ),
      e('div', { className: "flex-1 overflow-y-auto" },
        e('img', { src: imageUrl, alt: recipe.name, className: "w-full h-64 object-cover bg-[#A27B5C]/20" }),
        e('div', { className: "p-6" },
          e('p', { className: "mb-6 italic" }, recipe.description),
          e('div', { className: "mb-6" },
            e('h3', { className: "text-lg sm:text-xl font-semibold mb-2 border-b-2 border-[#A27B5C] pb-1 inline-block" }, "مواد لازم"),
            e('ul', { className: "list-disc list-inside space-y-1" },
              recipe.ingredients.map((item, index) => e('li', { key: index }, item))
            )
          ),
          e('div', null,
            e('h3', { className: "text-lg sm:text-xl font-semibold mb-2 border-b-2 border-[#A27B5C] pb-1 inline-block" }, "دستور تهیه"),
            e('ol', { className: "list-decimal list-inside space-y-2" },
              recipe.instructions.map((step, index) => e('li', { key: index }, step))
            )
          )
        )
      ),
      e('footer', { className: "p-4 border-t border-[#A27B5C]/50 flex justify-end" },
        e('button', {
          onClick: handleCopyToClipboard,
          className: "flex items-center gap-2 bg-[#A27B5C] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#8e694d] transition-colors duration-300"
        },
          e(ClipboardIcon, { className: "w-5 h-5" }),
          e('span', null, copied ? 'کپی شد!' : 'کپی کردن رسپی')
        )
      )
    )
  );
};

export default RecipeModal;