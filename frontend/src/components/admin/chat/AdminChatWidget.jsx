import { useState, useEffect, useRef } from 'react';
import { socket } from '../../../services/socket';
import { api } from '../../../lib/api';
import { getToken } from '../../../lib/auth';
import { Send, Paperclip, Image as ImageIcon, Loader2, CheckCheck } from 'lucide-react';

export default function AdminChatWidget({ userId, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  // Initialize Chat (remains the same)
  // ... (keeping previous useEffect logic)
  useEffect(() => {
    if (!userId) return;
    
    setLoading(true);
    setMessages([]);
    setChatId(null);
    
    // Auto-focus input when user changes
    setTimeout(() => {
        inputRef.current?.focus();
    }, 100);

    const initChat = async () => {
      try {
        const res = await api.get(`/chat/admin/user/${userId}`);
        const chat = res.data;
        
        if (chat) {
            setChatId(chat._id);
            setMessages(chat.messages || []); 
            socket.emit('join_chat', chat._id);
            const historyRes = await api.get(`/chat/${chat._id}/messages`);
            setMessages(historyRes.data);
        } else {
             const createRes = await api.post('/chat/init', { targetUserId: userId });
             const newChat = createRes.data;
             setChatId(newChat._id);
             socket.emit('join_chat', newChat._id);
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    const handleReceiveMessage = (message) => {
        if (chatId && message.chat === chatId) {
             setMessages((prev) => [...prev, message]);
        } else if (!chatId && message.sender === userId) {
             setMessages((prev) => [...prev, message]);
        }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [userId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || !chatId) return;

    setSending(true);
    try {
      let imageUrl = '';
      let messageType = 'text';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const uploadRes = await api.post('/chat/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
        messageType = 'image';
      }

      const payload = {
        chatId,
        content: input,
        messageType,
        imageUrl
      };

      // Send message
      await api.post('/chat/message', payload);

      setInput('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Focus back on input after sending
      inputRef.current?.focus();
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (!userId) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8">
              <p>Selecciona una solicitud para ver el chat.</p>
          </div>
      );
  }

  if (loading) {
      return (
          <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-ituka-gold animate-spin" />
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-[#FDFBF7]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-stone-300" />
                    </div>
                    <p className="text-sm font-bold text-stone-500">Inicia la conversación</p>
                    <p className="text-xs mt-1">Envía un mensaje para comenzar a chatear con {userName}.</p>
                </div>
            ) : (
                messages.map((msg, i) => {
                    const isAdmin = msg.senderRole === 'admin';
                    const isSequence = i > 0 && messages[i-1].senderRole === msg.senderRole;
                    
                    return (
                        <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} ${isSequence ? 'mt-1' : 'mt-4'}`}>
                            <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                <div className={`px-5 py-3 text-sm relative shadow-sm ${
                                    isAdmin 
                                    ? 'bg-ituka-gold text-white rounded-2xl rounded-tr-sm' 
                                    : 'bg-white text-stone-700 border border-stone-100 rounded-2xl rounded-tl-sm'
                                }`}>
                                    {msg.imageUrl && (
                                        <img src={msg.imageUrl} alt="Adjunto" className="rounded-lg mb-2 max-w-full cursor-pointer hover:opacity-90 transition-opacity" />
                                    )}
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                                <div className={`flex items-center gap-1 mt-1 px-1 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-[10px] text-stone-400 font-medium">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                    {isAdmin && (
                                        <CheckCheck className="w-3 h-3 text-ituka-gold/60" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-stone-100">
            {selectedFile && (
                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl mb-3 border border-stone-100 animate-in slide-in-from-bottom-2">
                    <div className="w-10 h-10 bg-stone-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-stone-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-700 truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-stone-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">×</button>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-stone-400 hover:text-ituka-gold hover:bg-stone-50 rounded-xl transition-colors mb-0.5"
                    title="Adjuntar imagen"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden" 
                    accept="image/*"
                />
                
                <div className="flex-1 bg-stone-50 rounded-2xl border border-transparent focus-within:border-ituka-gold/30 focus-within:bg-white focus-within:shadow-sm transition-all relative">
                    <textarea 
                        ref={inputRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            // Auto-resize
                            e.target.style.height = 'auto';
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Escribe un mensaje..."
                        className="w-full bg-transparent border-none px-4 py-3 text-sm focus:ring-0 resize-none max-h-32 min-h-[44px] custom-scrollbar"
                        rows={1}
                        style={{ height: '44px' }}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={(!input.trim() && !selectedFile) || sending}
                    className="p-3 bg-ituka-gold text-white rounded-xl hover:bg-ituka-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center mb-0.5"
                >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    </div>
  );
}