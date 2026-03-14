import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../services/socket';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const requestId = location.state?.requestId || 'support-general';

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }

    const initChat = async () => {
      try {
        const res = await api.post('/chat/init', { requestId });
        const chat = res.data;
        setChatId(chat._id);

        socket.connect();
        socket.emit('join_chat', chat._id);

        const historyRes = await api.get(`/chat/${chat._id}/messages`);
        setMessages(historyRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error iniciando chat:', error);
        setLoading(false);
      }
    };

    initChat();

    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [requestId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !file) || !chatId) return;

    try {
      let imageUrl = '';
      let messageType = 'text';

      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await api.post('/chat/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
        messageType = 'image';
      }

      await api.post('/chat/message', {
        chatId,
        content: input,
        messageType,
        imageUrl
      });

      setInput('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
  
  if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#F9F7F2]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#556B2F]"></div></div>;

  return (
    <div className="h-[calc(100vh-80px)] bg-[#F9F7F2] font-sans flex flex-col">
      <div className="bg-white px-6 py-4 border-b border-[#D4AF37]/20 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-[#3E2723] font-serif font-bold text-lg">Soporte ITUKA</h3>
          <p className="text-[#556B2F] text-xs uppercase tracking-wider">En línea</p>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = msg.senderRole === 'user'; 
          
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                  isMe 
                    ? 'bg-[#556B2F] text-white rounded-br-none' 
                    : 'bg-white text-[#3E2723] border border-[#F5F5DC] rounded-bl-none'
                }`}
              >
                {msg.imageUrl && (
                  <img src={`${API_URL}${msg.imageUrl}`} alt="attachment" className="rounded-lg mb-2 max-w-full" />
                )}
                {msg.content && <p className="leading-relaxed">{msg.content}</p>}
                <span className={`text-[10px] block mt-2 opacity-70 ${isMe ? 'text-white' : 'text-[#5D4037]'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="bg-white p-4 border-t border-[#D4AF37]/20 flex items-center gap-4" onSubmit={handleSendMessage}>
        <button 
          type="button" 
          className="p-3 text-[#556B2F] hover:bg-[#F9F7F2] rounded-full transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          accept="image/*"
        />
        
        {file && (
          <div className="bg-[#EBE5CE] px-3 py-1 rounded-full flex items-center gap-2 text-xs text-[#5D4037]">
            <ImageIcon className="w-3 h-3" /> Imagen
            <button onClick={() => setFile(null)} className="ml-1 font-bold">×</button>
          </div>
        )}
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow bg-[#F9F7F2] border-none rounded-full px-6 py-3 text-[#3E2723] focus:ring-2 focus:ring-[#556B2F] transition-all"
        />
        <button 
          type="submit" 
          className="p-3 bg-[#556B2F] text-white rounded-full hover:bg-[#3E2723] transition-colors shadow-lg shadow-[#556B2F]/20"
          disabled={!input.trim() && !file}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
