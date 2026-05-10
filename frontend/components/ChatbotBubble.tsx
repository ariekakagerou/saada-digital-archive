"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Plus, Search, FileUp, ShieldCheck, Zap } from "lucide-react";

type Message = {
    id: number;
    text: string;
    sender: "bot" | "user";
    type?: "text" | "options";
    options?: string[];
};

export default function ChatbotBubble() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: 1, 
            text: "Halo! Saya asisten pintar SAADA. Ada yang bisa saya bantu hari ini?", 
            sender: "bot" 
        }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickReplies = [
        "Cara Scan Ijazah",
        "Apa itu OCR?",
        "Tips OCR Akurat",
        "Arti Warna Status",
        "Simpan ke PDF",
        "Lihat Buku Induk"
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, isTyping, mounted]);

    const getBotResponse = (question: string) => {
        const q = question.toLowerCase();
        
        // 1. Dasar Navigasi
        if (q.includes("buku induk") || q.includes("file master")) {
            return "Menu **File Master Siswa** menyimpan semua detail arsip. Anda bisa melihat Buku Induk, Ijazah, dan SKHU di sana. Cukup klik ikon folder di bar navigasi bawah.";
        }
        if (q.includes("scan") || q.includes("kamera") || q.includes("unggah")) {
            return "Untuk memproses dokumen baru, tekan tombol **Kamera Hijau** di tengah navigasi. Anda bisa langsung mengambil foto ijazah atau mengunggah file yang sudah ada.";
        }
        if (q.includes("ocr")) {
            return "OCR (*Optical Character Recognition*) adalah fitur pintar SAADA yang otomatis membaca teks dari foto ijazah. Ini mempercepat pengisian data hingga 80%!";
        }
        if (q.includes("excel") || q.includes("import")) {
            return "Tentu! Anda bisa menggunakan fitur **Import Excel** di dashboard untuk memasukkan data alumni dalam jumlah besar sekaligus.";
        }

        // 2. Keunggulan & Tips (Advantage Features)
        if (q.includes("akurat") || q.includes("tips") || q.includes("biar jelas")) {
            return "**Tips OCR Akurat:**\n1. Pastikan dokumen berada di tempat terang.\n2. Hindari bayangan pada teks.\n3. Posisikan kamera lurus sejajar dengan dokumen.";
        }
        if (q.includes("warna") || q.includes("status") || q.includes("badge")) {
            return "**Arti Warna Status:**\n🟢 **Selesai**: Data sudah diverifikasi.\n🟡 **Menunggu**: Menunggu verifikasi petugas.\n🔴 **Ditolak**: Dokumen kurang jelas/salah.";
        }
        if (q.includes("pdf") || q.includes("cetak") || q.includes("print")) {
            return "Anda bisa menyimpan data alumni sebagai PDF! Masuk ke detail alumni, lalu tekan tombol **Print** (ikon Printer) di pojok kanan atas.";
        }
        if (q.includes("filter") || q.includes("cari banyak")) {
            return "Gunakan fitur **Filter Canggih** di halaman arsip. Anda bisa menyaring data berdasarkan Tahun Lulus, Kelas, atau Status secara spesifik.";
        }
        if (q.includes("aman") || q.includes("privasi") || q.includes("enkripsi")) {
            return "SAADA melindungi privasi alumni dengan **Enkripsi AES-256**. Hanya petugas resmi yang memiliki hak akses untuk membuka dan mengubah data.";
        }

        // 3. Lain-lain
        if (q.includes("password") || q.includes("akun") || q.includes("pengaturan")) {
            return "Pengaturan profil dan ganti kata sandi dapat dilakukan melalui menu **Pengaturan** (ikon Roda Gigi). Pastikan gunakan password yang kuat ya!";
        }
        if (q.includes("halo") || q.includes("hi") || q.includes("hai")) {
            return "Halo! Senang bertemu Anda. Ada fitur SAADA yang ingin Anda tanyakan?";
        }
        
        return "Pertanyaan menarik! Saya masih terus belajar. Anda bisa mencoba bertanya tentang 'Tips OCR', 'Arti Warna', atau 'Simpan PDF'.";
    };

    const processMessage = (text: string) => {
        const newMsgId = Date.now();
        setMessages(prev => [...prev, { id: newMsgId, text, sender: "user" }]);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                id: newMsgId + 1, 
                text: getBotResponse(text), 
                sender: "bot" 
            }]);
        }, 1200);
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;
        processMessage(inputText);
        setInputText("");
    };

    if (!mounted) return null;

    return (
        <div className="chatbot-root" style={{ position: "fixed", bottom: "85px", right: "20px", zIndex: 1000 }}>
            
            {/* ─── CHAT WINDOW ─── */}
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chat-header">
                    <div className="header-info">
                        <div className="bot-avatar">
                            <Bot size={22} />
                            <div className="online-pulse" />
                        </div>
                        <div>
                            <h3>Asisten SAADA</h3>
                            <span className="status-text">AI Berbasis Pengetahuan</span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="chat-body">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`msg-group ${msg.sender}`}>
                            <div className="avatar">
                                {msg.sender === "bot" ? <Sparkles size={14} /> : <User size={14} />}
                            </div>
                            <div className="bubble">
                                {msg.text.split('**').map((part, i) => 
                                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="msg-group bot">
                            <div className="avatar"><Sparkles size={14} /></div>
                            <div className="bubble typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {!isTyping && (
                    <div className="quick-replies">
                        {quickReplies.map((reply, i) => (
                            <button key={i} onClick={() => processMessage(reply)} className="reply-pill">
                                {reply}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <div className="chat-input-area">
                    <form onSubmit={handleSendMessage}>
                        <input 
                            type="text" 
                            placeholder="Tanya sesuatu..." 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button type="submit" disabled={!inputText.trim()} className="send-btn">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* ─── FLOATING BUTTON ─── */}
            <div className="trigger-wrapper">
                {!isOpen && (
                    <div className="welcome-tooltip">
                        Halo! Ada yang bisa dibantu?
                    </div>
                )}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`main-trigger ${isOpen ? 'active' : ''}`}
                >
                    {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                    {!isOpen && <div className="notification-dot" />}
                </button>
            </div>

            <style jsx>{`
                .chatbot-root {
                    font-family: 'Inter', sans-serif;
                }

                .chat-window {
                    width: 380px;
                    height: 550px;
                    max-height: 70vh;
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    transform-origin: bottom right;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    opacity: 0;
                    transform: scale(0.8) translateY(20px);
                    pointer-events: none;
                }

                .chat-window.open {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                    pointer-events: auto;
                }

                .chat-header {
                    background: #15803d;
                    padding: 1.25rem;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-info { display: flex; align-items: center; gap: 0.85rem; }
                
                .bot-avatar {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .online-pulse {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 10px;
                    height: 10px;
                    background: #4ade80;
                    border: 2px solid #15803d;
                    border-radius: 50%;
                }

                .chat-header h3 { font-size: 1rem; font-weight: 700; margin: 0; }
                .status-text { font-size: 0.75rem; opacity: 0.8; }

                .close-btn {
                    background: rgba(0,0,0,0.1);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-body {
                    flex: 1;
                    padding: 1.25rem;
                    overflow-y: auto;
                    background: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .msg-group { display: flex; gap: 0.75rem; max-width: 85%; }
                .msg-group.user { flex-direction: row-reverse; align-self: flex-end; }
                
                .avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 4px;
                }
                .bot .avatar { background: #dcfce7; color: #166534; }
                .user .avatar { background: #e0e7ff; color: #4338ca; }

                .bubble {
                    padding: 0.75rem 1rem;
                    border-radius: 18px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .bot .bubble { 
                    background: white; 
                    color: #334155; 
                    border: 1px solid #e2e8f0; 
                    border-top-left-radius: 4px;
                }
                .user .bubble { 
                    background: #15803d; 
                    color: white; 
                    border-top-right-radius: 4px;
                }

                .typing { display: flex; gap: 4px; padding: 12px 16px; }
                .typing span {
                    width: 6px; height: 6px; background: #94a3b8; border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out;
                }
                .typing span:nth-child(1) { animation-delay: -0.32s; }
                .typing span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

                .quick-replies {
                    padding: 0.75rem;
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    background: #f8fafc;
                    border-top: 1px solid #f1f5f9;
                }

                .reply-pill {
                    padding: 0.5rem 0.85rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 100px;
                    font-size: 0.85rem;
                    color: #15803d;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .reply-pill:hover { background: #f0fdf4; border-color: #15803d; }

                .chat-input-area { padding: 1rem; background: white; border-top: 1px solid #f1f5f9; }
                .chat-input-area form { display: flex; gap: 0.75rem; }
                
                input {
                    flex: 1;
                    padding: 0.75rem 1.25rem;
                    background: #f1f5f9;
                    border: 1px solid transparent;
                    border-radius: 100px;
                    outline: none;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                }
                input:focus { background: white; border-color: #15803d; box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.1); }

                .send-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: #15803d;
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .send-btn:disabled { background: #cbd5e1; cursor: default; }

                .trigger-wrapper { position: relative; }
                
                .welcome-tooltip {
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    background: white;
                    padding: 0.75rem 1.25rem;
                    border-radius: 14px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #1e293b;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    white-space: nowrap;
                    animation: float 3s infinite ease-in-out;
                }

                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

                .main-trigger {
                    width: 64px;
                    height: 64px;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #15803d, #22c55e);
                    color: white;
                    border: none;
                    box-shadow: 0 10px 30px rgba(21, 128, 61, 0.4);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .main-trigger:hover { transform: scale(1.05) rotate(5deg); }
                .main-trigger.active { border-radius: 50%; transform: rotate(-90deg); }

                .notification-dot {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 12px;
                    height: 12px;
                    background: #facc15;
                    border: 2px solid white;
                    border-radius: 50%;
                }

                @media (max-width: 480px) {
                    .chat-window { width: 90vw; height: 80vh; right: -5px; }
                }
            `}</style>
        </div>
    );
}

