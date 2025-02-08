import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Smile, Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I am your medical assistant. How can I help you today?'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const API_KEY = 'AIzaSyCC4XhKz_4rr_dUS70NKKuL4SpvK9SewQo';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatResponse = (text) => {
        // Replace *text* with **text** for bold formatting
        return text.replace(/\*(.*?)\*/g, '**$1**');
    };

    const generateResponse = async (userMessage) => {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

        try {
            const response = await fetch(`${url}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful medical assistant chatbot. Please format important terms, headings, and key points using markdown bold syntax (**text**) in your response. Respond to this message: ${userMessage}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            return formatResponse(data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error('Error:', error);
            return 'I apologize, but I am having trouble processing your request at the moment.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { role: 'user', content: message };
        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        const aiResponse = await generateResponse(message);
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        setIsLoading(false);
    };

    const toggleChat = () => setIsOpen(!isOpen);

    const quickResponses = [
        { text: 'Book Appointment', message: 'I would like to book an appointment.' },
        { text: 'Medical Records', message: 'How can I access my medical records?' },
        { text: 'Symptoms', message: 'I want to discuss my symptoms.' },
        { text: 'Medications', message: 'Can you explain my medications?' }
    ];

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <MessageSquare className="h-6 w-6 text-white" />
                </button>
            )}

            {isOpen && (
                <div className="w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
                    {/* Chat header */}
                    <div className="bg-blue-600 p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
                                <img
                                    src="/api/placeholder/40/40"
                                    alt="AI Assistant"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-white">
                                <div className="font-semibold text-lg">Medical Assistant</div>
                                <div className="text-sm opacity-90">
                                    {isLoading ? 'Typing...' : 'Online'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="text-white hover:bg-blue-700 p-1 rounded"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Chat messages area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 
                  ${msg.role === 'user' ? 'bg-blue-600' : 'bg-blue-100'}`}>
                                    <MessageSquare className={`h-5 w-5 ${msg.role === 'user' ? 'text-white' : 'text-blue-600'}`} />
                                </div>
                                <div className={`rounded-lg p-4 max-w-[80%] ${
                                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                                }`}>
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown
                                            className={`text-base prose ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-base">{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 p-2">
                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-100" />
                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-200" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick response buttons */}
                    <div className="p-3 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            {quickResponses.map((response, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setMessage(response.message);
                                        handleSubmit({ preventDefault: () => {} });
                                    }}
                                    className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 whitespace-nowrap"
                                >
                                    {response.text}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full px-4 py-3 border rounded-full focus:outline-none focus:border-blue-500 text-base"
                                    disabled={isLoading}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                                        <Smile className="h-5 w-5 text-gray-400" />
                                    </button>
                                    <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                                        <Paperclip className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={isLoading}
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FloatingChatbot;