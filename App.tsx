
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  CreditCard, Sparkles, Sun, Moon, Search, 
  Gamepad2, Tv, Gift, Grid, Zap, X, 
  Check, ArrowRight, Download, ChevronRight,
  ShieldCheck, ArrowLeft, Star, MessageSquarePlus, Eye, Ticket, Heart, Loader2, ShoppingBag, Receipt, CalendarClock, Bomb, Snowflake, Trophy, Timer, MessageCircle, Send, Bot
} from 'lucide-react';
import { PRODUCTS, MAX_KIM_POINTS, DISCOUNT_PER_POINT, EX_RATE_IND, COUPONS } from './constants';
import { Product, CheckoutState, EBill, Review } from './types';

// --- Components ---

const TypewriterLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [text, setText] = useState('');
  const [showSub, setShowSub] = useState(false);
  const fullText = 'kim.';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setShowSub(true);
        setTimeout(onComplete, 1200); // Wait a bit after finishing before hiding
      }
    }, 250); // Typing speed

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col items-center justify-center transition-colors duration-500">
      <div className="flex items-end">
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-black dark:text-white leading-none">
          {text}
        </h1>
        <div className="w-2 h-12 md:h-20 bg-black dark:bg-white animate-cursor mb-2 md:mb-4 ml-1"></div>
      </div>
      <p 
        className={`mt-6 text-xs font-mono uppercase tracking-[0.5em] text-zinc-500 transition-all duration-700 transform ${
          showSub ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        studios
      </p>
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover",
    outline: "border-2 border-zinc-200 dark:border-zinc-800 hover:border-accent text-zinc-600 dark:text-zinc-400 hover:text-accent bg-transparent",
    ghost: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, required = false, autoFocus = false, className = '', disabled = false }: any) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 ml-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-black focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

const StarRating = ({ rating, size = 14 }: { rating: number, size?: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          size={size} 
          className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300 dark:text-zinc-700'}`} 
        />
      ))}
    </div>
  );
};

const ReviewsSection = ({ reviews: initialReviews, productName }: { reviews: Review[], productName: string }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;
    
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      user: authorName,
      rating: newRating,
      comment: newComment,
      date: 'Just now'
    };
    
    setReviews([newReview, ...reviews]);
    setNewComment('');
    setAuthorName('');
    setNewRating(5);
  };

  return (
    <div className="mt-12 pt-12 border-t border-zinc-200 dark:border-zinc-800 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
            Customer Reviews <span className="text-sm font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{reviews.length}</span>
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-display font-black text-zinc-900 dark:text-white">{averageRating}</span>
            <div>
               <StarRating rating={Number(averageRating)} size={16} />
               <p className="text-xs text-zinc-500 mt-0.5">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Reviews List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {reviews.length === 0 && (
            <p className="text-zinc-500 italic">No reviews yet. Be the first to review!</p>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-sm text-zinc-900 dark:text-white">{review.user}</p>
                  <p className="text-[10px] text-zinc-400">{review.date}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">"{review.comment}"</p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-fit">
          <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
            <MessageSquarePlus size={16} /> Write a review
          </h4>
          
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setNewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star 
                        size={24} 
                        className={`${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300 dark:text-zinc-700'}`} 
                      />
                    </button>
                  ))}
                </div>
             </div>
             
             <Input 
                label="Your Name" 
                value={authorName} 
                onChange={(e: any) => setAuthorName(e.target.value)} 
                placeholder="John Doe"
             />

             <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider ml-1">Comment</label>
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-black focus:border-accent outline-none transition-all text-sm min-h-[100px] resize-none dark:text-white"
                  placeholder="Share your experience..."
                />
             </div>

             <Button className="w-full" disabled={!newComment.trim() || !authorName.trim()}>
               Submit Review
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuickViewModal = ({ product, stockLevels, onClose }: { product: Product, stockLevels: Record<string, number>, onClose: () => void }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 rounded-full z-10 transition-colors"
        >
          <X size={20} className="text-zinc-900 dark:text-white" />
        </button>
        
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
             <Zap size={12} className="text-yellow-500 fill-current" /> {product.delivery}
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{product.category}</span>
          <h2 className="text-2xl font-black font-display text-zinc-900 dark:text-white mb-4">{product.name}</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">{product.description}</p>
          
          <div className="space-y-3">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Plans Available:</p>
            {product.plans.slice(0, 3).map(plan => {
               const stock = stockLevels[plan.id] ?? plan.stock;
               return (
                <div key={plan.id} className="flex justify-between items-center text-sm border-b border-dashed border-zinc-200 dark:border-zinc-800 pb-2">
                  <div className="flex flex-col">
                    <span className="font-medium dark:text-zinc-300">{plan.name}</span>
                    {stock === 0 ? (
                      <span className="text-[10px] text-red-500 font-bold uppercase">Sold Out</span>
                    ) : stock < 5 ? (
                      <span className="text-[10px] text-orange-500 font-bold">{stock} left</span>
                    ) : (
                      <span className="text-[10px] text-green-500 font-bold">In Stock</span>
                    )}
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {plan.price}
                  </span>
                </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Game Logic: Mines ---
interface Tile {
  id: number;
  isBomb: boolean;
  isRevealed: boolean;
}

const MinesGame = ({ onWin, onBack }: { onWin: () => void, onBack: () => void }) => {
  const [grid, setGrid] = useState<Tile[]>([]);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    // Check daily limit
    const lastPlayed = localStorage.getItem('kim_last_game_date');
    const today = new Date().toDateString();
    
    if (lastPlayed !== today) {
      setCanPlay(true);
      initializeGame();
    } else {
      setGameState('won'); // Using 'won' state to just show "Come back tomorrow" message or similar
      setCanPlay(false);
    }
  }, []);

  const initializeGame = () => {
    const newGrid: Tile[] = Array(16).fill(null).map((_, i) => ({ id: i, isBomb: false, isRevealed: false }));
    
    // Place 2 bombs
    let bombsPlaced = 0;
    while (bombsPlaced < 2) {
      const idx = Math.floor(Math.random() * 16);
      if (!newGrid[idx].isBomb) {
        newGrid[idx].isBomb = true;
        bombsPlaced++;
      }
    }
    setGrid(newGrid);
    setGameState('playing');
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing' || !canPlay) return;

    const tile = grid[index];
    if (tile.isRevealed) return;

    const newGrid = [...grid];
    newGrid[index].isRevealed = true;
    setGrid(newGrid);

    if (tile.isBomb) {
      setGameState('lost');
      // Reveal all
      setGrid(prev => prev.map(t => ({ ...t, isRevealed: true })));
      // Mark played for today
      localStorage.setItem('kim_last_game_date', new Date().toDateString());
    } else {
      // Check win (14 safe tiles revealed)
      const revealedSafe = newGrid.filter(t => t.isRevealed && !t.isBomb).length;
      if (revealedSafe === 14) {
        setGameState('won');
        onWin(); // Add points
        localStorage.setItem('kim_last_game_date', new Date().toDateString());
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 animate-fade-in text-center">
      <button onClick={onBack} className="mb-8 text-sm font-bold text-zinc-500 hover:text-accent flex items-center gap-1 mx-auto">
        <ArrowLeft size={16} /> Back to Store
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <h2 className="text-3xl font-display font-black mb-2 dark:text-white flex items-center justify-center gap-2">
           Snowflake Mines <Snowflake className="text-accent" />
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          Find all 14 snowflakes. Avoid the 2 bombs.<br/>
          <span className="font-bold text-accent">Win 5 KP!</span> (1 Game/Day)
        </p>

        {!canPlay && gameState !== 'lost' && (
          <div className="mb-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
             <CalendarClock className="mx-auto mb-2 text-zinc-400" size={32} />
             <p className="font-bold text-zinc-900 dark:text-white">You've played today!</p>
             <p className="text-xs text-zinc-500">Come back tomorrow for another chance.</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 mb-6 mx-auto w-fit">
           {grid.map((tile) => (
             <button
               key={tile.id}
               disabled={gameState !== 'playing'}
               onClick={() => handleTileClick(tile.id)}
               className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 transform ${
                 tile.isRevealed 
                   ? tile.isBomb 
                     ? 'bg-red-500 text-white shadow-inner scale-95' 
                     : 'bg-accent/10 text-accent shadow-inner scale-95'
                   : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-md hover:-translate-y-1'
               }`}
             >
               {tile.isRevealed && (
                 <span className="animate-scale-in">
                   {tile.isBomb ? <Bomb size={24} /> : <Snowflake size={24} />}
                 </span>
               )}
             </button>
           ))}
        </div>

        {gameState === 'won' && canPlay && ( // Only show congrats if they actually just played and won
           <div className="animate-scale-in p-4 bg-green-500/10 text-green-500 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Trophy size={20} /> You Won 5 KP! 🎉
           </div>
        )}
        
        {gameState === 'lost' && (
           <div className="animate-shake p-4 bg-red-500/10 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Bomb size={20} /> BOOM! Better luck next time.
           </div>
        )}

      </div>
    </div>
  );
};

// --- Chat Bot Logic ---

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const ChatInterface = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'bot', text: 'Hi there! I am kim.ai 🤖\nI can help you with Card Ghar questions. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // AI Logic Simulation
    setTimeout(() => {
      let botResponse = "I'm not sure about that. Try asking about payment, KP points, stock, or coupons!";
      const lower = userText.toLowerCase();

      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        botResponse = "Hello! 👋 Welcome to Card Ghar. Looking for a specific gift card?";
      } else if (lower.includes('kp') || lower.includes('point') || lower.includes('reward')) {
        botResponse = "KP (Kim Points) are our loyalty rewards! ✨\n• 1 KP = 0.5% Discount\n• Use 0 or 20 KP to earn +1 KP per order.\n• Max usage: 20 KP (10% OFF).";
      } else if (lower.includes('payment') || lower.includes('pay') || lower.includes('qr')) {
        botResponse = "We accept payments via QR code. At checkout (Step 3), scan the generated QR code with your banking app to pay instantly.";
      } else if (lower.includes('coupon') || lower.includes('code') || lower.includes('promo')) {
        botResponse = "Keep an eye on the header timer! ⏳ We drop new codes during special events. Try 'KIMNEW2' or 'SAVE5' if they haven't expired!";
      } else if (lower.includes('stock') || lower.includes('out') || lower.includes('available')) {
        botResponse = "Our stock is real-time. If an item says 'Sold Out', we usually restock within 24-48 hours. Check back soon!";
      } else if (lower.includes('refund') || lower.includes('problem') || lower.includes('issue') || lower.includes('help')) {
        botResponse = "I'm sorry you're facing an issue. Please email our human support team at support@cardghar.com with your Order ID.";
      } else if (lower.includes('delivery') || lower.includes('time') || lower.includes('receive')) {
        botResponse = "Most items like Gift Cards are 'Instant' delivery ⚡. Some subscriptions require manual invite, which takes 10-30 mins.";
      } else if (lower.includes('game') || lower.includes('play')) {
        botResponse = "Check out our 'Play & Win' section! You can play Mines once a day to win 5 KP. 💣❄️";
      }

      const newBotMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'bot', text: botResponse };
      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay 1-2s
  };

  return (
    <div className="max-w-2xl mx-auto h-[80vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-slide-up my-4">
      {/* Header */}
      <div className="bg-zinc-50 dark:bg-zinc-950 p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
         <button onClick={onBack} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-zinc-500" />
         </button>
         <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <Bot size={24} />
         </div>
         <div>
            <h3 className="font-bold text-zinc-900 dark:text-white">kim.ai Support</h3>
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs text-zinc-500">Online</span>
            </div>
         </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-black/20">
         {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div 
                  className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${
                     msg.role === 'user' 
                     ? 'bg-accent text-white rounded-tr-sm' 
                     : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm shadow-sm'
                  }`}
               >
                  {msg.text}
               </div>
            </div>
         ))}
         {isTyping && (
            <div className="flex justify-start">
               <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-sm border border-zinc-200 dark:border-zinc-700 shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
               </div>
            </div>
         )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
         <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-zinc-100 dark:bg-zinc-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-zinc-900 dark:text-white"
         />
         <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-accent text-white p-3 rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
         >
            <Send size={20} />
         </button>
      </form>
    </div>
  );
};


// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [region, setRegion] = useState<'NP' | 'IND'>('NP');
  const [points, setPoints] = useState(0);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'home' | 'wishlist' | 'purchases' | 'game' | 'chat'>('home');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Data Persistence
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<EBill[]>([]);
  const [usedCoupons, setUsedCoupons] = useState<string[]>([]);
  
  // Stock State
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});

  // Checkout State
  const [checkout, setCheckout] = useState<CheckoutState>({
    isOpen: false,
    step: 1,
    product: null,
    selectedPlanId: null,
    processingPlanId: null,
    email: '',
    username: '',
    pointsToUse: 0,
    couponInput: '',
    appliedCoupon: null,
    isApplyingCoupon: false,
    couponError: null,
    generatedBill: null,
    isCheckingPayment: false
  });

  // --- Initialization ---
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load Data
    const savedPoints = localStorage.getItem('kim_points');
    if (savedPoints) setPoints(parseInt(savedPoints));

    const savedWishlist = localStorage.getItem('kim_wishlist');
    if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));

    const savedHistory = localStorage.getItem('kim_purchase_history');
    if (savedHistory) setPurchaseHistory(JSON.parse(savedHistory));

    const savedUsedCoupons = localStorage.getItem('kim_used_coupons');
    if (savedUsedCoupons) setUsedCoupons(JSON.parse(savedUsedCoupons));

    // Initialize Stock logic
    const savedStock = localStorage.getItem('kim_stock_levels');
    if (savedStock) {
      // Merge saved stock with default stock (in case new products added)
      const parsedStock = JSON.parse(savedStock);
      const initialStock: Record<string, number> = {};
      PRODUCTS.forEach(p => {
        p.plans.forEach(plan => {
          initialStock[plan.id] = parsedStock[plan.id] !== undefined ? parsedStock[plan.id] : plan.stock;
        });
      });
      setStockLevels(initialStock);
    } else {
      // Initialize fresh from constants
      const initialStock: Record<string, number> = {};
      PRODUCTS.forEach(p => {
        p.plans.forEach(plan => {
          initialStock[plan.id] = plan.stock;
        });
      });
      setStockLevels(initialStock);
    }

    // Region (Simple timezone check)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Calcutta') || tz.includes('Kolkata')) setRegion('IND');
  }, []);

  // Timer Effect
  useEffect(() => {
    const targetDate = new Date('2025-12-25T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Memoized callback to prevent infinite loop in TypewriterLoader
  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  // --- Logic ---

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleRegion = () => setRegion(prev => prev === 'NP' ? 'IND' : 'NP');

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistIds(prev => {
      const newIds = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('kim_wishlist', JSON.stringify(newIds));
      return newIds;
    });
  };

  const formatPrice = (amount: number) => {
    const val = region === 'IND' ? Math.ceil(amount / EX_RATE_IND) : amount;
    return region === 'IND' ? `₹${val.toLocaleString()}` : `NPR ${val.toLocaleString()}`;
  };

  const getRawPrice = (amount: number) => {
     return region === 'IND' ? Math.ceil(amount / EX_RATE_IND) : amount;
  };

  const calculateExpiryDate = (validity: string): string => {
    const today = new Date();
    if (validity.toLowerCase().includes('lifetime')) return 'Never / Lifetime';
    if (validity.toLowerCase().includes('no expiry')) return 'No Expiry';
    
    const count = parseInt(validity) || 1;
    if (validity.toLowerCase().includes('month')) {
      today.setMonth(today.getMonth() + count);
    } else if (validity.toLowerCase().includes('year')) {
      today.setFullYear(today.getFullYear() + count);
    } else if (validity.toLowerCase().includes('day')) {
      today.setDate(today.getDate() + count);
    }
    
    return today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (view === 'wishlist') {
      list = list.filter(p => wishlistIds.includes(p.id));
    }
    return list.filter(p => {
      const matchCat = category === 'all' || p.category === category || view === 'wishlist'; // Ignore category filter in wishlist view
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search, view, wishlistIds]);

  const handleWinGame = () => {
    const newPoints = Math.min(points + 5, MAX_KIM_POINTS);
    setPoints(newPoints);
    localStorage.setItem('kim_points', newPoints.toString());
  };

  // --- Actions ---
  const openCheckout = (product: Product) => {
    const savedEmail = localStorage.getItem('last_email') || '';
    const savedUser = localStorage.getItem('last_user') || '';
    
    setCheckout({
      isOpen: true,
      step: 1,
      product,
      selectedPlanId: null,
      processingPlanId: null,
      email: savedEmail,
      username: savedUser,
      pointsToUse: 0,
      couponInput: '',
      appliedCoupon: null,
      isApplyingCoupon: false,
      couponError: null,
      generatedBill: null,
      isCheckingPayment: false
    });
    
    document.body.style.overflow = 'hidden';
  };

  const closeCheckout = () => {
    setCheckout(prev => ({ ...prev, isOpen: false }));
    document.body.style.overflow = 'auto';
  };

  const handleSelectPlan = (planId: string) => {
    // 1. Highlight Animation
    setCheckout(prev => ({ ...prev, processingPlanId: planId }));

    // 2. Wait, then proceed
    setTimeout(() => {
      setCheckout(prev => ({ 
        ...prev, 
        selectedPlanId: planId,
        processingPlanId: null,
        step: 2, 
        pointsToUse: 0 
      }));
    }, 600); // 600ms delay for animation
  };

  const applyCoupon = () => {
    const code = checkout.couponInput.trim();
    if (!code) return;

    // Start loading state
    setCheckout(prev => ({ ...prev, isApplyingCoupon: true, couponError: null }));

    setTimeout(() => {
      // Logic after delay
      if (usedCoupons.includes(code)) {
        setCheckout(prev => ({ 
          ...prev, 
          appliedCoupon: null, 
          couponError: 'Coupon already used',
          isApplyingCoupon: false
        }));
      } else if (COUPONS[code]) {
        setCheckout(prev => ({ 
          ...prev, 
          appliedCoupon: { code, percent: COUPONS[code] },
          couponError: null,
          isApplyingCoupon: false
        }));
      } else {
        setCheckout(prev => ({ 
          ...prev, 
          appliedCoupon: null, 
          couponError: 'Invalid coupon code',
          isApplyingCoupon: false
        }));
      }
    }, 1200); // Simulated network delay
  };

  const removeCoupon = () => {
    setCheckout(prev => ({ ...prev, appliedCoupon: null, couponInput: '', couponError: null }));
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkout.email) {
      setCheckout(prev => ({ ...prev, step: 3 }));
      localStorage.setItem('last_email', checkout.email);
      localStorage.setItem('last_user', checkout.username);
    }
  };

  const generateBill = useCallback(() => {
    if (!checkout.product || !checkout.selectedPlanId) return;
    
    const plan = checkout.product.plans.find(p => p.id === checkout.selectedPlanId)!;
    const rawPrice = getRawPrice(plan.price);
    
    // Check stock one last time
    const currentStock = stockLevels[plan.id];
    if (currentStock <= 0) {
      alert("Sorry, this item just went out of stock!");
      closeCheckout();
      return;
    }

    const pointDiscount = Math.round(rawPrice * (checkout.pointsToUse * DISCOUNT_PER_POINT));
    const couponDiscount = checkout.appliedCoupon 
        ? Math.round(rawPrice * checkout.appliedCoupon.percent) 
        : 0;

    const finalPrice = Math.max(0, rawPrice - pointDiscount - couponDiscount);

    const earned = (checkout.pointsToUse === 0 || checkout.pointsToUse === 20) ? 1 : 0;
    
    // Update Points
    const newPoints = Math.min(points + earned, MAX_KIM_POINTS);
    setPoints(newPoints);
    localStorage.setItem('kim_points', newPoints.toString());

    // Update Stock
    const newStockLevels = { ...stockLevels, [plan.id]: currentStock - 1 };
    setStockLevels(newStockLevels);
    localStorage.setItem('kim_stock_levels', JSON.stringify(newStockLevels));

    // Consume Coupon
    if (checkout.appliedCoupon) {
      const updatedUsedCoupons = [...usedCoupons, checkout.appliedCoupon.code];
      setUsedCoupons(updatedUsedCoupons);
      localStorage.setItem('kim_used_coupons', JSON.stringify(updatedUsedCoupons));
    }

    const bill: EBill = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString(),
      productName: checkout.product.name,
      planName: plan.name,
      email: checkout.email,
      username: checkout.username,
      price: finalPrice,
      originalPrice: rawPrice,
      pointsUsed: checkout.pointsToUse,
      pointsEarned: earned,
      couponCode: checkout.appliedCoupon?.code,
      couponDiscountAmount: couponDiscount,
      currency: region === 'IND' ? 'INR' : 'NPR',
      expiryDate: calculateExpiryDate(plan.validity)
    };

    // Update History
    const newHistory = [bill, ...purchaseHistory];
    setPurchaseHistory(newHistory);
    localStorage.setItem('kim_purchase_history', JSON.stringify(newHistory));

    setCheckout(prev => ({ ...prev, generatedBill: bill, step: 4, isCheckingPayment: false }));
  }, [checkout, points, region, purchaseHistory, usedCoupons, stockLevels]);

  const togglePaymentCheck = () => {
    setCheckout(prev => ({ ...prev, isCheckingPayment: true }));
  };

  // Keyboard listener for Payment Bypass (Double K)
  useEffect(() => {
    let lastKPress = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!checkout.isCheckingPayment) return;
      
      if (e.key.toLowerCase() === 'k') {
        const now = Date.now();
        if (now - lastKPress < 400) {
           // Double press detected
           generateBill();
        }
        lastKPress = now;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkout.isCheckingPayment, generateBill]);

  // --- Renderers ---

  if (loading) {
    return <TypewriterLoader onComplete={handleLoaderComplete} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <CreditCard size={20} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden md:block">Card Ghar</span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-full p-1 border border-zinc-200 dark:border-zinc-800">
                <button onClick={() => setView('wishlist')} className={`relative p-2 rounded-full transition-colors ${view === 'wishlist' ? 'bg-white dark:bg-zinc-800 text-red-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                   <Heart size={18} className={view === 'wishlist' ? 'fill-current' : ''} />
                   {wishlistIds.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>
                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                <button onClick={() => setView('purchases')} className={`relative p-2 rounded-full transition-colors ${view === 'purchases' ? 'bg-white dark:bg-zinc-800 text-accent shadow-sm' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                   <Receipt size={18} />
                </button>
                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                <button onClick={() => setView('chat')} className={`relative p-2 rounded-full transition-colors ${view === 'chat' ? 'bg-white dark:bg-zinc-800 text-green-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                   <MessageCircle size={18} className={view === 'chat' ? 'fill-current' : ''} />
                </button>
            </div>

            <button onClick={toggleRegion} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-transparent dark:border-zinc-800">
              <span>{region === 'NP' ? '🇳🇵' : '🇮🇳'}</span>
              <span>{region === 'NP' ? 'NPR' : 'INR'}</span>
            </button>

            <div className="relative group cursor-help">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-bold">
                <Sparkles size={14} />
                <span>{points} KP</span>
              </div>
              <div className="absolute top-full right-0 mt-4 w-64 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                 <div className="text-center mb-3">
                    <p className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">Balance</p>
                    <p className="text-3xl font-display font-black text-accent">{points}<span className="text-sm text-zinc-500 font-medium">/20</span></p>
                 </div>
                 <div className="text-[10px] text-zinc-500 space-y-2 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <p className="flex justify-between"><span>1 KP</span> <span>0.5% OFF</span></p>
                    <p className="flex justify-between"><span>20 KP</span> <span className="text-accent font-bold">10% OFF</span></p>
                 </div>
              </div>
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              {darkMode ? <Sun size={20} className="text-zinc-400" /> : <Moon size={20} className="text-zinc-400" />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        
        {/* Hero Section (Only on Home) */}
        {view === 'home' && (
          <div className="mb-12 relative rounded-3xl overflow-hidden h-auto min-h-[300px] md:h-[400px] bg-cover bg-center flex items-end p-6 md:p-12 shadow-2xl" 
               style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/minimalist-christmas-banner-template-design_1001175-71492.jpg?w=360')" }}>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="relative z-10 text-white animate-fade-in w-full flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-0">
              <div className="text-center md:text-left w-full md:w-auto">
                <span className="inline-block px-3 py-1 mb-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest">
                  Festive
                </span>
                <h1 className="text-3xl md:text-6xl font-display font-bold mb-4 leading-tight">
                  Christmas 🎄 with <br/><span className="text-accent">Card Ghar.</span>
                </h1>
                
                <button 
                  onClick={() => setView('game')}
                  className="mt-2 group relative inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                >
                   <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                   Play & Win
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Countdown Timer - Mobile Fixed */}
              <div className="w-full md:w-auto bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                 <div className="flex justify-center gap-4 text-center font-mono font-bold text-xl md:text-2xl mb-1">
                    <div>
                       <span>{timeLeft.days.toString().padStart(2, '0')}</span>
                       <span className="block text-[10px] font-sans text-zinc-400 uppercase font-bold tracking-wider">Days</span>
                    </div>
                    <span>:</span>
                    <div>
                       <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                       <span className="block text-[10px] font-sans text-zinc-400 uppercase font-bold tracking-wider">Hrs</span>
                    </div>
                    <span>:</span>
                    <div>
                       <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                       <span className="block text-[10px] font-sans text-zinc-400 uppercase font-bold tracking-wider">Mins</span>
                    </div>
                    <span className="hidden md:inline">:</span>
                    <div className="hidden md:block">
                       <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                       <span className="block text-[10px] font-sans text-zinc-400 uppercase font-bold tracking-wider">Secs</span>
                    </div>
                 </div>
                 <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-2 animate-pulse">NEW Coupon Codes!</p>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist View */}
        {view === 'wishlist' && (
          <div className="mb-8 animate-fade-in">
            <button onClick={() => setView('home')} className="mb-4 text-sm font-bold text-zinc-500 hover:text-accent flex items-center gap-1">
              <ArrowLeft size={16} /> Back to Store
            </button>
            <h1 className="text-3xl font-display font-black">Your Wishlist ({filteredProducts.length})</h1>
          </div>
        )}

        {/* Game View */}
        {view === 'game' && (
           <MinesGame onWin={handleWinGame} onBack={() => setView('home')} />
        )}
        
        {/* Chat View */}
        {view === 'chat' && (
           <ChatInterface onBack={() => setView('home')} />
        )}

        {/* Purchases View */}
        {view === 'purchases' && (
          <div className="mb-8 animate-fade-in">
             <button onClick={() => setView('home')} className="mb-4 text-sm font-bold text-zinc-500 hover:text-accent flex items-center gap-1">
              <ArrowLeft size={16} /> Back to Store
            </button>
            <h1 className="text-3xl font-display font-black mb-8 flex items-center gap-3">
               <div className="p-3 bg-accent/10 rounded-2xl text-accent"><Receipt size={32} /></div>
               Purchase History
            </h1>
            
            {purchaseHistory.length === 0 ? (
               <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                  <ShoppingBag size={48} className="mx-auto text-zinc-300 mb-4" />
                  <p className="text-zinc-500 font-medium">No purchases yet.</p>
                  <button onClick={() => setView('home')} className="text-accent font-bold text-sm mt-2 hover:underline">Start shopping</button>
               </div>
            ) : (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchaseHistory.map((bill) => (
                     <div key={bill.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">
                              {bill.productName.charAt(0)}
                           </div>
                           <span className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded">{bill.id}</span>
                        </div>
                        <h3 className="font-bold text-lg dark:text-white mb-1">{bill.productName}</h3>
                        <p className="text-sm text-zinc-500 mb-4">{bill.planName}</p>
                        {bill.expiryDate && (
                           <div className="mb-4 text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                              <CalendarClock size={12} /> Exp: {bill.expiryDate}
                           </div>
                        )}
                        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-center">
                           <span className="text-xs text-zinc-400">{bill.date}</span>
                           <span className="font-bold text-accent">{bill.currency} {bill.price}</span>
                        </div>
                     </div>
                  ))}
               </div>
            )}
          </div>
        )}

        {/* Filters (Hidden in Wishlist/Purchases/Game/Chat) */}
        {view === 'home' && (
          <div className="sticky top-24 z-20 mb-8 p-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 p-1 overflow-x-auto w-full md:w-auto no-scrollbar">
              {[
                { id: 'all', icon: Grid, label: 'All' },
                { id: 'games', icon: Gamepad2, label: 'Games' },
                { id: 'subscriptions', icon: Tv, label: 'Subs' },
                { id: 'gift-cards', icon: Gift, label: 'Cards' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    category === cat.id 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-md' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-80 group px-2 md:px-0">
              <Search className="absolute left-5 md:left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-accent transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 md:pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
              />
            </div>
          </div>
        )}

        {/* Grid */}
        {view === 'home' || view === 'wishlist' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px]">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-zinc-400 py-12">
                 <ShoppingBag size={48} className="mb-4 opacity-50" />
                 <p className="font-bold">No items found</p>
                 {view === 'wishlist' && <p className="text-sm mt-2">Go back to store and add some!</p>}
              </div>
            ) : (
              filteredProducts.map(product => {
                 const minPrice = Math.min(...product.plans.map(p => p.price));
                 const avgRating = product.reviews.length > 0 
                    ? (product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length).toFixed(1) 
                    : null;
                 const isWishlisted = wishlistIds.includes(product.id);
                 
                 // Check total stock for this product
                 const totalStock = product.plans.reduce((acc, plan) => acc + (stockLevels[plan.id] ?? plan.stock), 0);
                 const isSoldOut = totalStock === 0;

                 return (
                  <div 
                    key={product.id} 
                    className="group bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200 dark:border-zinc-800 hover:border-accent/50 dark:hover:border-accent/50 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1 hover:scale-[1.02] flex flex-col relative"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-950 cursor-pointer" onClick={() => openCheckout(product)}>
                      <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${isSoldOut ? 'grayscale opacity-50' : 'group-hover:scale-110'}`} />
                      
                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                           <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Sold Out</span>
                        </div>
                      )}

                      {!isSoldOut && (
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                           <Zap size={10} className="text-yellow-400 fill-current" /> {product.delivery}
                        </div>
                      )}
                      
                      {/* Quick View Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                        className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur p-2 rounded-full text-zinc-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-white shadow-lg"
                        title="Quick View"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                    
                    <div className="flex-1 flex flex-col cursor-pointer" onClick={() => openCheckout(product)}>
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="font-bold text-lg dark:text-zinc-100">{product.name}</h3>
                         {avgRating && (
                           <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded">
                             <Star size={10} className="fill-current" /> {avgRating}
                           </div>
                         )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                         <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{product.category}</span>
                         <button 
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="text-zinc-400 hover:text-red-500 transition-colors active:scale-90"
                         >
                           <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                         </button>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-400 uppercase font-bold">Starts at</span>
                          <span className="text-accent font-bold">{formatPrice(minPrice)}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                 )
              })
            ) : null}
          </div>
        ) : null}

      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          stockLevels={stockLevels}
          onClose={() => setQuickViewProduct(null)} 
        />
      )}

      {/* --- CHECKOUT PAGE OVERLAY --- */}
      {checkout.isOpen && checkout.product && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 overflow-y-auto animate-slide-up">
          
          {/* Top Bar - Mobile Fixed */}
          <div className="sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 h-16 md:h-20 flex items-center justify-between z-40">
             <div className="flex items-center gap-3 overflow-hidden">
                <button onClick={closeCheckout} className="p-2 -ml-2 shrink-0 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 dark:text-zinc-400 hover:text-red-500">
                  <X size={24} />
                </button>
                <div className="hidden md:block w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
                <div className="flex items-center gap-3 overflow-hidden">
                   <h2 className="font-bold text-base md:text-lg leading-tight dark:text-white truncate">{checkout.product.name}</h2>
                   <div className="hidden md:flex items-center gap-2 text-xs font-bold px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 uppercase tracking-wider shrink-0">
                      <span>Step {checkout.step}</span>
                      <span className="opacity-50">/ 4</span>
                   </div>
                </div>
             </div>
             
             {/* Progress Steps */}
             <div className="flex items-center gap-1 md:gap-2 text-xs font-bold text-zinc-400 shrink-0">
                <span className={checkout.step >= 1 ? "text-accent" : ""}>Plan</span>
                <ChevronRight size={12} />
                <span className={checkout.step >= 2 ? "text-accent" : ""}>Details</span>
                <ChevronRight size={12} />
                <span className={checkout.step >= 3 ? "text-accent" : ""}>Pay</span>
             </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-32">
            
            {/* Step 1: PLAN SELECTION (Expanded View) */}
            {checkout.step === 1 && (
              <div className="animate-fade-in space-y-8 md:space-y-12">
                 {/* Product Hero Details */}
                 <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    <img src={checkout.product.image} className="w-full md:w-32 h-48 md:h-32 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 object-cover" alt="Product" />
                    <div className="flex-1 space-y-4">
                       <h1 className="text-2xl md:text-4xl font-display font-black text-zinc-900 dark:text-white">Select your plan</h1>
                       <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">{checkout.product.description}</p>
                       <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full flex items-center gap-1"><Zap size={12} /> {checkout.product.delivery}</span>
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full flex items-center gap-1"><ShieldCheck size={12} /> Official Source</span>
                      </div>
                    </div>
                 </div>

                 <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800"></div>

                 {/* Plan Cards Grid */}
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {checkout.product.plans.map(plan => {
                       const currentStock = stockLevels[plan.id] ?? plan.stock;
                       const isOutOfStock = currentStock <= 0;
                       
                       return (
                       <button 
                          key={plan.id}
                          onClick={() => handleSelectPlan(plan.id)}
                          disabled={isOutOfStock}
                          className={`group relative flex flex-col text-left bg-white dark:bg-zinc-900 p-6 rounded-3xl border transition-all duration-300 ${
                            isOutOfStock 
                            ? 'opacity-60 cursor-not-allowed border-zinc-100 dark:border-zinc-800' 
                            : 'active:scale-95'
                          } ${
                            checkout.processingPlanId === plan.id 
                            ? 'border-accent shadow-[0_0_30px_rgba(77,163,255,0.2)] scale-[1.02] ring-2 ring-accent' 
                            : isOutOfStock 
                              ? ''
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-accent hover:shadow-xl hover:shadow-accent/5'
                          }`}
                       >
                          <div className="mb-4">
                             <div className="flex justify-between items-start">
                                <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1 group-hover:text-accent transition-colors">{plan.name}</h3>
                                {isOutOfStock ? (
                                   <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-500 px-2 py-1 rounded font-bold uppercase">Sold Out</span>
                                ) : currentStock < 5 ? (
                                   <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-500 px-2 py-1 rounded font-bold uppercase animate-pulse">Only {currentStock} left!</span>
                                ) : (
                                   <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-500 px-2 py-1 rounded font-bold uppercase">In Stock</span>
                                )}
                             </div>
                             <p className="text-2xl font-black text-zinc-900 dark:text-white">{formatPrice(plan.price)}</p>
                          </div>
                          
                          <div className="mb-6 flex items-center gap-2 text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg w-fit">
                             <CalendarClock size={14} />
                             Valid for: {plan.validity}
                          </div>

                          <ul className="space-y-3 mb-6 flex-1">
                             {plan.features.map((feat, i) => (
                                <li 
                                  key={i} 
                                  className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400 animate-fade-in-stagger opacity-0"
                                  style={{ animationDelay: `${i * 100}ms` }}
                                >
                                   <Check size={16} className="text-accent shrink-0 mt-0.5" />
                                   <span className="font-medium">{feat}</span>
                                </li>
                             ))}
                          </ul>

                          <div className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-colors ${
                              isOutOfStock
                              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                              : checkout.processingPlanId === plan.id 
                                ? 'bg-accent text-white' 
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white group-hover:bg-accent group-hover:text-white'
                          }`}>
                             {checkout.processingPlanId === plan.id ? (
                                <Loader2 size={16} className="animate-spin" />
                             ) : isOutOfStock ? (
                                "Sold Out"
                             ) : (
                                <>Select Plan <ArrowRight size={16} className="ml-2" /></>
                             )}
                          </div>
                       </button>
                    )})}
                 </div>

                 {/* NEW: Reviews Section */}
                 <ReviewsSection reviews={checkout.product.reviews} productName={checkout.product.name} />
              </div>
            )}

            {/* Step 2: DETAILS FORM */}
            {checkout.step === 2 && checkout.selectedPlanId && (
              <div className="max-w-md mx-auto animate-slide-in-right">
                 <button onClick={() => setCheckout(prev => ({...prev, step: 1}))} className="mb-6 text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft size={16} /> Back to plans
                 </button>

                 <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                       <div>
                          <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Selected Plan</p>
                          <h3 className="font-bold text-xl dark:text-white">{checkout.product.plans.find(p => p.id === checkout.selectedPlanId)?.name}</h3>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-accent">{formatPrice(checkout.product.plans.find(p => p.id === checkout.selectedPlanId)?.price || 0)}</p>
                       </div>
                    </div>

                    <form onSubmit={handleDetailsSubmit} className="space-y-6">
                       {/* Points Slider */}
                       {points > 0 && (
                          <div className="bg-zinc-900 text-white rounded-2xl p-5 relative overflow-hidden mb-6">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-accent blur-3xl opacity-50"></div>
                            <div className="flex justify-between items-center mb-4 relative z-10">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="text-yellow-400 fill-current" size={16} />
                                  <span className="font-bold text-sm">Use Kim Points</span>
                                </div>
                                <span className="font-mono font-bold">{checkout.pointsToUse} <span className="text-xs opacity-50">/ {Math.min(points, MAX_KIM_POINTS)}</span></span>
                            </div>
                            <input 
                              type="range"
                              min="0"
                              max={Math.min(points, MAX_KIM_POINTS)}
                              value={checkout.pointsToUse}
                              onChange={(e) => setCheckout(prev => ({...prev, pointsToUse: parseInt(e.target.value)}))}
                              className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer mb-3 accent-accent"
                            />
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider opacity-60">
                              <span>0%</span>
                              <span>Discount: {(checkout.pointsToUse * 0.5).toFixed(1)}%</span>
                            </div>
                          </div>
                       )}

                       <Input 
                          label="Email Address" 
                          type="email" 
                          placeholder="name@example.com" 
                          value={checkout.email}
                          onChange={(e: any) => setCheckout(prev => ({...prev, email: e.target.value}))}
                          required 
                          autoFocus
                       />
                       
                       {checkout.product.requiresAccountId && (
                          <Input 
                            label="Account ID / Username" 
                            placeholder="e.g. PlayerOne#1234" 
                            value={checkout.username}
                            onChange={(e: any) => setCheckout(prev => ({...prev, username: e.target.value}))}
                            required 
                          />
                       )}
                       
                       {/* Coupon Code Section */}
                       <div className="pt-2">
                         <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 ml-1 mb-2 block">Coupon Code</label>
                         <div className="flex gap-2">
                            <div className="relative flex-1">
                               <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                               <input 
                                  type="text" 
                                  placeholder="Enter code" 
                                  value={checkout.couponInput}
                                  onChange={(e) => {
                                      setCheckout(prev => ({...prev, couponInput: e.target.value.toUpperCase(), couponError: null}));
                                  }}
                                  disabled={!!checkout.appliedCoupon || checkout.isApplyingCoupon}
                                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border ${checkout.couponError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-accent focus:ring-accent'} focus:bg-white dark:focus:bg-black focus:ring-1 outline-none transition-all text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed uppercase`}
                               />
                            </div>
                            {!checkout.appliedCoupon ? (
                               <button 
                                type="button" 
                                onClick={applyCoupon}
                                disabled={!checkout.couponInput.trim() || checkout.isApplyingCoupon}
                                className="w-24 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                               >
                                 {checkout.isApplyingCoupon ? (
                                    <Loader2 size={18} className="animate-spin text-zinc-500" />
                                 ) : (
                                    "Apply"
                                 )}
                               </button>
                            ) : (
                               <button 
                                type="button" 
                                onClick={removeCoupon}
                                className="px-4 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                               >
                                 Remove
                               </button>
                            )}
                         </div>
                         {checkout.couponError && (
                            <p className="text-xs text-red-500 font-bold mt-2 ml-1 flex items-center gap-1 animate-fade-in">
                               <X size={12} strokeWidth={3} /> {checkout.couponError}
                            </p>
                         )}
                         {checkout.appliedCoupon && (
                            <p className="text-xs text-green-500 font-bold mt-2 ml-1 flex items-center gap-1">
                               <Check size={12} strokeWidth={3} /> Code applied! {(checkout.appliedCoupon.percent * 100).toFixed(0)}% discount
                            </p>
                         )}
                       </div>
                       
                       {/* Total Price Preview in Step 2 */}
                       <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 mt-6">
                          <div className="flex justify-between text-xs text-zinc-500 mb-1">
                             <span>Subtotal</span>
                             <span>{formatPrice(getRawPrice(checkout.product.plans.find(p => p.id === checkout.selectedPlanId)?.price || 0))}</span>
                          </div>
                          {checkout.pointsToUse > 0 && (
                             <div className="flex justify-between text-xs text-green-500 mb-1 font-medium">
                                <span>Points Discount</span>
                                <span>- {formatPrice(Math.round(getRawPrice(checkout.product.plans.find(p => p.id === checkout.selectedPlanId)?.price || 0) * (checkout.pointsToUse * DISCOUNT_PER_POINT)))}</span>
                             </div>
                          )}
                          {checkout.appliedCoupon && (
                             <div className="flex justify-between text-xs text-green-500 mb-1 font-medium">
                                <span>Coupon ({checkout.appliedCoupon.code})</span>
                                <span>- {formatPrice(Math.round(getRawPrice(checkout.product.plans.find(p => p.id === checkout.selectedPlanId)?.price || 0) * checkout.appliedCoupon.percent))}</span>
                             </div>
                          )}
                          <div className="flex justify-between font-bold text-lg text-zinc-900 dark:text-white border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2">
                             <span>Total</span>
                             <span>{formatPrice(Math.max(0, Math.round(getRawPrice(checkout.product.plans.find(p => p.id === checkout.selectedPlanId)?.price || 0) * (1 - (checkout.pointsToUse * DISCOUNT_PER_POINT) - (checkout.appliedCoupon?.percent || 0)))))}</span>
                          </div>
                       </div>

                       <Button 
                          className="w-full py-4 text-base mt-4" 
                          disabled={!checkout.email || (checkout.product.requiresAccountId && !checkout.username)}
                       >
                          Proceed to Payment <ArrowRight size={18} />
                       </Button>
                    </form>
                 </div>
              </div>
            )}

            {/* Step 3: PAYMENT */}
            {checkout.step === 3 && checkout.selectedPlanId && (
              <div className="max-w-md mx-auto animate-slide-in-right text-center">
                 <button onClick={() => setCheckout(prev => ({...prev, step: 2}))} className="mb-6 mx-auto text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft size={16} /> Back to details
                 </button>

                 <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                    <h3 className="font-bold text-zinc-500 uppercase tracking-widest mb-8 text-xs">Scan QR Code to Pay</h3>
                    
                    {/* Price calculation logic moved here for display */}
                    {(() => {
                         const rawPrice = getRawPrice(checkout.product.plans.find(p => p.id === checkout.selectedPlanId)!.price);
                         const pointDisc = checkout.pointsToUse * DISCOUNT_PER_POINT;
                         const couponDisc = checkout.appliedCoupon?.percent || 0;
                         const finalAmount = Math.max(0, Math.round(rawPrice * (1 - pointDisc - couponDisc)));
                         
                         return (
                            <>
                                <div className="relative w-64 h-64 mx-auto bg-white p-4 rounded-2xl shadow-inner mb-6 border border-zinc-100">
                                   <img 
                                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY_${finalAmount}`} 
                                      className="w-full h-full object-contain mix-blend-multiply"
                                      alt="QR Payment"
                                   />
                                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                         <div className="w-8 h-8 bg-black rounded-full"></div>
                                      </div>
                                   </div>
                                </div>

                                <div className="text-center mb-8">
                                   <p className="text-sm text-zinc-400 font-medium mb-1">Total Amount</p>
                                   <p className="text-4xl font-black font-display text-zinc-900 dark:text-white">
                                     {formatPrice(finalAmount)}
                                   </p>
                                   {(pointDisc > 0 || couponDisc > 0) && (
                                      <p className="text-xs text-green-500 font-bold mt-2">
                                        You saved {formatPrice(rawPrice - finalAmount)}!
                                      </p>
                                   )}
                                </div>
                            </>
                         );
                    })()}

                    <Button 
                       onClick={togglePaymentCheck} 
                       className="w-full py-4 text-base"
                       disabled={checkout.isCheckingPayment}
                    >
                       {checkout.isCheckingPayment ? (
                          <>Checking <Loader2 className="animate-spin" size={18} /></>
                       ) : (
                          <>Check Payment <Check size={18} /></>
                       )}
                    </Button>
                 </div>
              </div>
            )}

            {/* Step 4: SUCCESS (Enhanced) */}
            {checkout.step === 4 && checkout.generatedBill && (
               <div className="max-w-md mx-auto text-center pt-8">
                  <div className="animate-scale-in">
                     <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/10">
                        <Check size={48} strokeWidth={3} />
                     </div>
                  </div>
                  
                  <div className="animate-fade-in-stagger" style={{ animationDelay: '100ms' }}>
                     <h2 className="text-3xl font-display font-bold mb-2 dark:text-white">Order Confirmed!</h2>
                     <p className="text-zinc-500 dark:text-zinc-400 mb-8">Your digital receipt is ready.</p>
                  </div>

                  {/* Enhanced Digital Ticket/Receipt */}
                  <div className="bg-white dark:bg-zinc-900 w-full rounded-3xl shadow-2xl overflow-hidden relative mb-8 animate-receipt-slide text-left mx-auto">
                       {/* Top Decoration */}
                       <div className="h-2 bg-accent w-full"></div>
                       
                       <div className="p-6 md:p-8">
                          {/* Receipt Header */}
                          <div className="flex justify-between items-center mb-8 opacity-50">
                             <div className="flex items-center gap-2">
                                <span className="font-display font-black tracking-tighter text-lg text-zinc-900 dark:text-white">CARD GHAR</span>
                             </div>
                             <span className="text-[10px] font-bold tracking-widest uppercase border border-current px-2 py-0.5 rounded">Paid</span>
                          </div>

                          {/* Items */}
                          <div className="space-y-4 mb-8">
                             <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Item</p>
                                <p className="font-bold text-xl text-zinc-900 dark:text-white">{checkout.generatedBill.productName}</p>
                                <p className="text-zinc-500 text-sm">{checkout.generatedBill.planName}</p>
                             </div>
                             <div className="flex justify-between">
                                <div>
                                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Date</p>
                                   <p className="text-sm font-medium dark:text-zinc-300">{checkout.generatedBill.date}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Order ID</p>
                                   <p className="text-sm font-mono text-zinc-900 dark:text-white">{checkout.generatedBill.id}</p>
                                </div>
                             </div>
                             <div className="flex justify-between">
                                <div>
                                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Expiry</p>
                                   <p className="text-sm font-medium dark:text-zinc-300 text-accent">{checkout.generatedBill.expiryDate}</p>
                                </div>
                             </div>
                          </div>
                          
                          {/* Dashed Separator */}
                          <div className="w-full border-b-2 border-dashed border-zinc-200 dark:border-zinc-800 mb-6 relative">
                             <div className="absolute -left-10 -bottom-2.5 w-5 h-5 bg-zinc-50 dark:bg-zinc-950 rounded-full"></div>
                             <div className="absolute -right-10 -bottom-2.5 w-5 h-5 bg-zinc-50 dark:bg-zinc-950 rounded-full"></div>
                          </div>

                          {/* Total & Barcode */}
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Paid</p>
                                <p className="text-2xl font-black text-accent">{checkout.generatedBill.currency} {checkout.generatedBill.price}</p>
                             </div>
                             {/* Mock Barcode */}
                             <div className="h-8 flex items-end gap-0.5 opacity-30">
                                {[...Array(15)].map((_, i) => (
                                   <div key={i} className="bg-black dark:bg-white w-0.5" style={{ height: Math.random() > 0.5 ? '100%' : '60%', width: Math.random() > 0.5 ? '2px' : '1px' }}></div>
                                ))}
                             </div>
                          </div>

                          {/* Points Earned Banner */}
                          {checkout.generatedBill.pointsEarned > 0 && (
                            <div className="mt-6 bg-accent/5 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-accent">
                               <Sparkles size={14} /> Earned +1 Kim Point
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="space-y-3 animate-fade-in-stagger" style={{ animationDelay: '300ms' }}>
                       <Button variant="outline" className="w-full" onClick={() => {}}>
                          <Download size={18} /> Download Receipt
                       </Button>
                       <button onClick={closeCheckout} className="text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                          Close and Return to Store
                       </button>
                    </div>
               </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
