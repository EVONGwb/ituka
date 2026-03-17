import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../services/socket';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';
import { Send, Paperclip, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { can } from '../lib/permissions';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [confirming, setConfirming] = useState(false);
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

        if (requestId && requestId !== 'support-general') {
          try {
            const orderRes = await api.get(`/orders/${requestId}`);
            setOrderInfo(orderRes.data);
          } catch {
            setOrderInfo(null);
          }
        } else {
          setOrderInfo(null);
        }
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

  const canConfirm = can(user?.role, 'orders:update') && orderInfo?._id;
  const confirmOrder = async () => {
    if (!orderInfo?._id) return;
    if (!window.confirm('¿Confirmar pedido?')) return;
    try {
      setConfirming(true);
      await api.put(`/orders/${orderInfo._id}/status`, { status: 'confirmado' });
      const updated = await api.get(`/orders/${orderInfo._id}`);
      setOrderInfo(updated.data);
    } catch (error) {
      console.error('Error confirmando pedido:', error);
      alert('No se pudo confirmar el pedido');
    } finally {
      setConfirming(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
  
  if (loading) return <div className="flex justify-center items-center min-h-screen bg-ituka-cream-soft"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ituka-gold"></div></div>;

  return (
    <div className="min-h-screen bg-ituka-cream-soft font-sans flex flex-col pb-36">
      <div className="bg-ituka-surface px-6 py-4 border-b border-ituka-gold/20 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-ituka-ink font-serif font-bold text-lg">
            {orderInfo?.user?.name ? orderInfo.user.name : 'Soporte ITUKA'}
          </h3>
          <p className="text-ituka-ink-muted text-xs font-bold uppercase tracking-wider">
            {orderInfo?.items?.[0]?.product?.name ? orderInfo.items[0].product.name : 'En línea'}
          </p>
        </div>

        {canConfirm && (
          <button
            type="button"
            onClick={confirmOrder}
            disabled={confirming}
            className="bg-ituka-gold text-white px-4 py-2.5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-ituka-gold/90 transition-colors shadow-lg shadow-ituka-gold/20 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {confirming ? 'Confirmando...' : 'Confirmar pedido'}
          </button>
        )}
      </div>
      
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = msg.senderRole === 'user'; 
          
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                  isMe 
                    ? 'bg-ituka-green text-white rounded-br-none' 
                    : 'bg-ituka-surface text-ituka-ink border border-ituka-border rounded-bl-none'
                }`}
              >
                {msg.imageUrl && (
                  <img src={`${API_URL}${msg.imageUrl}`} alt="attachment" className="rounded-lg mb-2 max-w-full" />
                )}
                {msg.content && <p className="leading-relaxed">{msg.content}</p>}
                <span className={`text-[10px] block mt-2 opacity-70 ${isMe ? 'text-white' : 'text-ituka-ink-muted'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="fixed left-0 right-0 bottom-16 bg-ituka-surface p-4 border-t border-ituka-gold/20 flex items-center gap-4" onSubmit={handleSendMessage}>
        <button 
          type="button" 
          className="p-3 text-ituka-green hover:bg-ituka-cream rounded-full transition-colors"
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
          <div className="bg-ituka-cream-deep px-3 py-1 rounded-full flex items-center gap-2 text-xs text-ituka-ink-muted">
            <ImageIcon className="w-3 h-3" /> Imagen
            <button onClick={() => setFile(null)} className="ml-1 font-bold">×</button>
          </div>
        )}
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow bg-ituka-cream-soft border-none rounded-full px-6 py-3 text-ituka-ink focus:ring-2 focus:ring-ituka-gold/30 transition-all"
        />
        <button 
          type="submit" 
          className="p-3 bg-ituka-gold text-white rounded-full hover:bg-ituka-gold/90 transition-colors shadow-lg shadow-ituka-gold/20"
          disabled={!input.trim() && !file}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
