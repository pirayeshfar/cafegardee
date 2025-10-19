import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessageStream } from '../services/geminiService.js';
import { SendIcon, CloseIcon, CoffeeBeanIcon } from './icons.js';

const e = React.createElement;

const Chatbot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'model', text: 'سلام! من باریستای هوشمند شما هستم. هر سوالی در مورد دنیای قهوه دارید از من بپرسید!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSend = async (event) => {
        event.preventDefault();
        if (!input.trim() || isLoading) return;

        const userInput = { role: 'user', text: input };
        const newMessages = [...messages, userInput];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // Format the history for the stateless API call, skipping the initial greeting.
        const apiHistory = newMessages.slice(1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        try {
            const stream = await sendChatMessageStream(apiHistory);
            
            // Add the empty placeholder for the model's response
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            let accumulatedText = '';
            for await (const chunk of stream) {
                accumulatedText += chunk.text;
                // FIX: State update is now fully immutable.
                // It correctly replaces the last message object instead of mutating it.
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: accumulatedText };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            const friendlyErrorMessage = "متاسفانه در حال حاضر امکان پاسخگویی وجود ندارد. ممکن است مشکل از شبکه شما یا سرویس ما باشد. لطفاً کمی بعد دوباره تلاش کنید.";
            setMessages(prev => [...prev, { role: 'model', text: friendlyErrorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return e('div', { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center sm:justify-end animate-fade-in" },
        e('div', { className: "bg-[#DCD7C9] text-[#4A2C2A] rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[80vh] flex flex-col m-0 sm:m-4 animate-fade-in-up", style: { animationDelay: '100ms' } },
            e('header', { className: "flex items-center justify-between p-4 border-b border-[#A27B5C]/50" },
                e('div', { className: "flex items-center gap-3" },
                    e(CoffeeBeanIcon, { className: "w-8 h-8 text-[#4A2C2A]" }),
                    e('h2', { className: "text-xl font-bold" }, "باریستای هوشمند")
                ),
                e('button', { onClick: onClose, className: "p-1 rounded-full hover:bg-black/10 transition-colors" },
                    e(CloseIcon, { className: "w-6 h-6" })
                )
            ),
            
            e('div', { className: "flex-1 p-4 overflow-y-auto space-y-4" },
                messages.map((msg, index) => e('div', { key: index, className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}` },
                    e('div', { className: `max-w-[80%] rounded-xl px-4 py-2 ${msg.role === 'user' ? 'bg-[#A27B5C] text-white' : 'bg-white/60'}` },
                        msg.text || e('span', { className: "animate-pulse" }, "...")
                    )
                )),
                e('div', { ref: messagesEndRef })
            ),
            e('form', { onSubmit: handleSend, className: "p-4 border-t border-[#A27B5C]/50 flex items-center gap-2" },
                e('input', {
                    type: "text",
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    placeholder: "پیام خود را بنویسید...",
                    className: "flex-1 bg-white/60 rounded-lg py-2 px-4 focus:ring-2 focus:ring-[#A27B5C] focus:outline-none transition-shadow",
                    disabled: isLoading,
                    'aria-label': "ورودی پیام چت"
                }),
                e('button', { type: "submit", disabled: isLoading || !input.trim(), className: "bg-[#4A2C2A] text-white rounded-lg p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#382220] transition-colors" },
                    e(SendIcon, { className: "w-6 h-6" })
                )
            )
        )
    );
};

export default Chatbot;