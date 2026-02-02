'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader, MessageCircle, Send, Sparkles } from 'lucide-react';
import { chat } from '@/ai/flows/chat-flow';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }));
            
            const result = await chat({ history: chatHistory, message: currentInput });
            
            const modelMessage: Message = { role: 'model', content: result.response };
            setMessages((prev) => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: Message = { role: 'model', content: "죄송합니다, 오류가 발생했어요. 잠시 후 다시 시도해 주세요." };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-20" size="icon">
                    <MessageCircle className="h-8 w-8" />
                    <span className="sr-only">챗봇 열기</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] flex flex-col" onOpenAutoFocus={(e) => e.preventDefault()}>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        케어봇
                    </SheetTitle>
                    <SheetDescription>
                        궁금한 점을 물어보거나 일상적인 대화를 나눠보세요.
                    </SheetDescription>
                </SheetHeader>
                
                <div className="flex-1 my-4 pr-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'model' && (
                                    <Avatar className="h-8 w-8 self-start">
                                        <AvatarFallback>봇</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-[75%] rounded-lg p-3 text-sm ${
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                }`}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-end gap-2">
                                <Avatar className="h-8 w-8 self-start">
                                    <AvatarFallback>봇</AvatarFallback>
                                </Avatar>
                                <div className="max-w-[75%] rounded-lg p-3 bg-muted">
                                    <Loader className="h-5 w-5 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <SheetFooter>
                    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            disabled={isLoading}
                            autoFocus
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                            <Send className="h-4 w-4" />
                            <span className="sr-only">보내기</span>
                        </Button>
                    </form>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
