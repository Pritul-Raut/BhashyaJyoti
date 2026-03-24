import React, { useState } from 'react';
import {
    ShoppingCart,
    BookOpen,
    CreditCard,
    CheckCircle,
    Package,
    ArrowLeft,
    Trash2,
    Plus,
    Minus,
    Globe2,
    Award,
    ShieldCheck,
    MapPin
} from 'lucide-react';

// --- Mock Data ---
const PRODUCTS = [
    { id: 1, title: "IELTS Masterclass Guide", category: "English / IELTS", price: 1500, desc: "Comprehensive prep guide with 4 full-length practice tests and audio tracks.", color: "bg-blue-100 text-blue-600", imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" },
    { id: 2, title: "JLPT N5 Complete Prep", category: "Japanese / JLPT", price: 1200, desc: "Master the basics of Japanese. Includes vocabulary, grammar, and kanji for N5.", color: "bg-red-100 text-red-600", imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600" },
    { id: 3, title: "German A1 Crash Course", category: "German / Goethe", price: 850, desc: "Beginner friendly German learning book focusing on conversational skills.", color: "bg-yellow-100 text-yellow-700", imageUrl: "https://images.unsplash.com/photo-1512820200501-c8842e616f9f?auto=format&fit=crop&q=80&w=600" },
    { id: 4, title: "TOEFL Practice Tests Vol 1", category: "English / TOEFL", price: 1800, desc: "Official past papers to help you score 100+ on your internet-based test.", color: "bg-indigo-100 text-indigo-600", imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600" },
    { id: 5, title: "French Grammar in Use", category: "French / DELF", price: 950, desc: "Clear explanations and practice exercises for beginner to intermediate learners.", color: "bg-cyan-100 text-cyan-600", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600" },
    { id: 6, title: "Spanish Vocabulary Builder", category: "Spanish / DELE", price: 600, desc: "Learn over 3000 common Spanish words with memory techniques.", color: "bg-orange-100 text-orange-600", imageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=600" },
    { id: 7, title: "DELF B1 Exam Preparation", category: "French / DELF", price: 1400, desc: "Targeted strategies for listening, reading, writing, and speaking sections.", color: "bg-teal-100 text-teal-600", imageUrl: "https://images.unsplash.com/photo-1503694978374-8a2fa83b18bf?auto=format&fit=crop&q=80&w=600" },
    { id: 8, title: "JLPT N4 Mock Exams", category: "Japanese / JLPT", price: 750, desc: "Test your skills before the real exam with 3 realistic practice papers.", color: "bg-pink-100 text-pink-600", imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600" },
    { id: 9, title: "English Speaking Mastery", category: "English / General", price: 500, desc: "Overcome the fear of speaking. Accent reduction and fluency tips.", color: "bg-purple-100 text-purple-600", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600" }
];

export default function App() {
    const [view, setView] = useState('shop'); // 'shop', 'cart', 'checkout', 'orders'
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [checkoutData, setCheckoutData] = useState({
        fullName: '', email: '', phone: '', address: '', city: '', zipCode: '', // Shipping details
        nameOnCard: '', card: '', expiry: '', cvv: '' // Payment details
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // --- Cart Logic ---
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        showToast(`Added ${product.title} to cart`);
    };

    const updateQty = (id, delta) => {
        setCart((prev) => prev.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : item;
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter(item => item.id !== id));
    };

    const getCartTotal = () => cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

    // --- UI Helpers ---
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // --- Payment Logic ---
    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate API delay
        setTimeout(() => {
            const newOrder = {
                id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                date: new Date().toLocaleString(),
                items: [...cart],
                total: getCartTotal(),
                status: 'Paid successfully',
                shipping: {
                    name: checkoutData.fullName,
                    email: checkoutData.email,
                    fullAddress: `${checkoutData.address}, ${checkoutData.city} - ${checkoutData.zipCode}`
                }
            };

            setOrders([newOrder, ...orders]); // Add new order to top
            setCart([]); // Clear cart
            setCheckoutData({
                fullName: '', email: '', phone: '', address: '', city: '', zipCode: '',
                nameOnCard: '', card: '', expiry: '', cvv: ''
            });
            setIsProcessing(false);
            setView('orders');
            window.scrollTo(0, 0);
        }, 1500);
    };

    // --- Render Components ---
    const renderHeader = () => (
        <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('shop')}>
                    <Globe2 className="w-6 h-6 text-blue-400" />
                    <h1 className="text-xl font-bold tracking-tight">Polyglot Prep<span className="text-blue-400">Store</span></h1>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setView('orders')}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-300 ${view === 'orders' ? 'text-blue-400' : 'text-slate-300'}`}
                    >
                        <Package className="w-5 h-5" />
                        <span className="hidden sm:inline">Orders</span>
                        {orders.length > 0 && <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">{orders.length}</span>}
                    </button>

                    <button
                        onClick={() => setView('cart')}
                        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-300 relative"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="hidden sm:inline">Cart</span>
                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );

    const renderShop = () => (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-extrabold text-slate-900">Language Prep Materials</h2>
                <p className="text-slate-500 mt-2">Ace your exams with our premium study guides and mock tests.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {PRODUCTS.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        {/* Real Book Cover Image */}
                        <div className="h-48 w-full bg-slate-100 relative overflow-hidden group">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'; }}
                            />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm">
                                {product.category.split(' / ')[1]}
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{product.category}</span>
                            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{product.title}</h3>
                            <p className="text-sm text-slate-500 mb-4 flex-grow">{product.desc}</p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                <span className="text-xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCart = () => (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
            <button onClick={() => setView('shop')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
            </button>

            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Your Shopping Cart</h2>

            {cart.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                    <ShoppingCart className="w-16 h-16 text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h3>
                    <p className="text-slate-500 mb-6">Looks like you haven't added any study materials yet.</p>
                    <button onClick={() => setView('shop')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        Browse Books
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                                    <div className="text-sm text-slate-500 mb-2">{item.category}</div>
                                    <div className="font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                                        <button onClick={() => updateQty(item.id, -1)} className="p-2 text-slate-500 hover:text-slate-800 transition-colors"><Minus className="w-4 h-4" /></button>
                                        <span className="w-8 text-center font-semibold">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="p-2 text-slate-500 hover:text-slate-800 transition-colors"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal ({getCartCount()} items)</span>
                                    <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Tax (Estimated)</span>
                                    <span>₹{Math.round(getCartTotal() * 0.05).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-slate-800">Total</span>
                                    <span className="text-2xl font-black text-slate-900">₹{Math.round(getCartTotal() * 1.05).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setView('checkout')}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderCheckout = () => (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setView('cart')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Cart
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">Secure Checkout</h2>
                        <p className="text-slate-500 text-sm mt-1">Mock payment gateway for demonstration.</p>
                    </div>
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>

                <div className="p-6 md:p-8">
                    <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-xl flex items-start gap-3 border border-blue-100">
                        <Award className="w-6 h-6 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">You are about to purchase {getCartCount()} items for a total of <strong className="text-lg">₹{Math.round(getCartTotal() * 1.05).toLocaleString('en-IN')}</strong>. This is a safe and encrypted fake transaction.</p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-8">
                        {/* Shipping Details Section */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <MapPin className="w-5 h-5 text-slate-400" /> Shipping Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        required type="text" placeholder="Jane Doe"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={checkoutData.fullName} onChange={e => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input
                                        required type="email" placeholder="jane@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={checkoutData.email} onChange={e => setCheckoutData({ ...checkoutData, email: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                    <input
                                        required type="text" placeholder="123 Main Street, Apt 4B"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={checkoutData.address} onChange={e => setCheckoutData({ ...checkoutData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input
                                        required type="text" placeholder="Mumbai"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={checkoutData.city} onChange={e => setCheckoutData({ ...checkoutData, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">PIN Code</label>
                                    <input
                                        required type="text" placeholder="400001" maxLength="6"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={checkoutData.zipCode} onChange={e => setCheckoutData({ ...checkoutData, zipCode: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Details Section */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <CreditCard className="w-5 h-5 text-slate-400" /> Payment Details
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name on Card</label>
                                <input
                                    required type="text" placeholder="John Doe"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={checkoutData.nameOnCard} onChange={e => setCheckoutData({ ...checkoutData, nameOnCard: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                                <div className="relative">
                                    <input
                                        required type="text" placeholder="0000 0000 0000 0000" maxLength="19"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                                        value={checkoutData.card} onChange={e => setCheckoutData({ ...checkoutData, card: e.target.value })}
                                    />
                                    <div className="absolute right-3 top-3 flex gap-1">
                                        <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                        <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry (MM/YY)</label>
                                    <input
                                        required type="text" placeholder="MM/YY" maxLength="5"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                                        value={checkoutData.expiry} onChange={e => setCheckoutData({ ...checkoutData, expiry: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                                    <input
                                        required type="password" placeholder="123" maxLength="4"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                                        value={checkoutData.cvv} onChange={e => setCheckoutData({ ...checkoutData, cvv: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-8 shadow-md"
                        >
                            {isProcessing ? (
                                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                            ) : (
                                `Pay ₹${Math.round(getCartTotal() * 1.05).toLocaleString('en-IN')}`
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    const renderOrders = () => {
        const latestOrder = orders.length > 0 ? orders[0] : null;
        const pastOrders = orders.length > 1 ? orders.slice(1) : [];

        return (
            <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <Package className="w-8 h-8 text-blue-600" /> Your Orders
                    </h2>
                    <button onClick={() => setView('shop')} className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                        Continue Shopping
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                        <Package className="w-16 h-16 text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No orders found</h3>
                        <p className="text-slate-500">When you buy books, your receipt will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Temporary/Recent Order Highlight */}
                        {latestOrder && (
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl blur opacity-25"></div>
                                <div className="relative bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
                                    <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                                            <div>
                                                <h3 className="text-lg font-bold text-emerald-800">Order Successful!</h3>
                                                <p className="text-sm text-emerald-600">Placed on {latestOrder.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <div className="text-sm text-slate-500 font-medium">Order ID: {latestOrder.id}</div>
                                            <div className="text-xl font-black text-slate-900">₹{Math.round(latestOrder.total * 1.05).toLocaleString('en-IN')}</div>
                                        </div>
                                    </div>

                                    <div className="bg-white px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-start gap-4 justify-between">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Shipping To</h4>
                                            <p className="font-semibold text-slate-800">{latestOrder.shipping?.name}</p>
                                            <p className="text-sm text-slate-600">{latestOrder.shipping?.fullAddress}</p>
                                        </div>
                                        <div className="md:text-right">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</h4>
                                            <p className="text-sm text-slate-600">{latestOrder.shipping?.email}</p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h4 className="font-semibold text-slate-800 mb-4">Items Included:</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {latestOrder.items.map(item => (
                                                <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <div className="w-12 h-16 rounded overflow-hidden flex flex-shrink-0 bg-slate-200 border border-slate-200">
                                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="font-semibold text-sm text-slate-800 truncate">{item.title}</div>
                                                        <div className="text-xs text-slate-500">Qty: {item.qty}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Past Orders List */}
                        {pastOrders.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Previous Orders</h3>
                                <div className="space-y-4">
                                    {pastOrders.map(order => (
                                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-slate-800">{order.id}</span>
                                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Paid</span>
                                                </div>
                                                <div className="text-sm text-slate-500">{order.date}</div>
                                                <div className="text-sm text-slate-600 mt-2">
                                                    {order.items.length} item(s) • {order.items.map(i => i.title).join(', ').substring(0, 40)}...
                                                </div>
                                            </div>
                                            <div className="text-xl font-black text-slate-900 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 self-start md:self-auto">
                                                ₹{Math.round(order.total * 1.05).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {renderHeader()}

            {/* Main Content Area */}
            <main>
                {view === 'shop' && renderShop()}
                {view === 'cart' && renderCart()}
                {view === 'checkout' && renderCheckout()}
                {view === 'orders' && renderOrders()}
            </main>

            {/* Floating Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium text-sm">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}