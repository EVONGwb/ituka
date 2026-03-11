import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Send, User } from 'lucide-react';

export default function AdminChats() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      setConversations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchMessages = async (id) => {
    try {
      const { data } = await api.get(`/chat/${id}`);
      setMessages(data);
      scrollToBottom();
      
      // If we don't have currentUser yet, maybe we can get it from the first message sent by them
      if (!currentUser && data.length > 0) {
          const msgFromUser = data.find(m => m.sender._id === id);
          if (msgFromUser) setCurrentUser(msgFromUser.sender);
          else {
              // If all messages are from me, I still need their info. 
              // The receiver of my message is them.
              const msgToUser = data.find(m => m.receiver?._id === id);
              if (msgToUser) setCurrentUser(msgToUser.receiver);
          }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      const { data } = await api.post('/chat', {
        content: newMessage,
        receiverId: userId
      });
      setMessages([...messages, data]);
      setNewMessage('');
      scrollToBottom();
      fetchConversations(); 
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]); 

  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
      // Try to find user in conversations list
      const conv = conversations.find(c => c.user._id === userId);
      if (conv) setCurrentUser(conv.user);
      // If not found (e.g. direct link), we rely on messages to populate info or need fetchUser
    } else {
      setMessages([]);
      setCurrentUser(null);
    }
  }, [userId, conversations]); // Added conversations to dep array so if they load after userId, we set currentUser

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-stone-100 overflow-y-auto">
        <div className="p-4 border-b border-stone-100 font-bold text-stone-700">Conversaciones</div>
        {conversations.map(conv => (
          <div 
            key={conv.user._id}
            onClick={() => navigate(`/admin/chats/${conv.user._id}`)}
            className={`p-4 border-b border-stone-50 cursor-pointer hover:bg-stone-50 transition-colors ${userId === conv.user._id ? 'bg-green-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-stone-200 p-2 rounded-full">
                <User className="w-5 h-5 text-stone-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-stone-800 truncate">{conv.user.name}</div>
                <div className="text-sm text-stone-500 truncate">{conv.lastMessage?.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {userId ? (
          <>
            <div className="p-4 border-b border-stone-100 bg-stone-50 font-bold text-stone-700 flex items-center gap-2">
              <User className="w-5 h-5" />
              {currentUser ? currentUser.name : 'Cargando...'}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/30">
              {messages.map((msg, idx) => {
                const isMe = msg.sender._id !== userId; // Sender is NOT the client (so it's me/admin)
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-green-700 text-white rounded-tr-none' : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-stone-100 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 p-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="submit" className="bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400">
            Selecciona una conversación para comenzar
          </div>
        )}
      </div>
    </div>
  );
}
