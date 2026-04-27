import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { supabase } from './supabase';
import {
  MapPin,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Users,
  CheckCircle,
  MessageSquare,
  Zap,
  Globe,
  Quote,
  Check,
  Target,
  Wrench, Monitor, Hammer, Scissors, Car, Camera, Paintbrush, Briefcase, Code, Music, Search,
  User, Lock, Mail, X, Edit2, Save, FileText, LayoutGrid, Calendar, Flame, Filter, Plus, Activity, Award, Star, Clock, AlertCircle
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Animated IP Tracing / Location Background
const TracingBackground = () => {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    // Generate new pins periodically to simulate live tracking
    const generatePin = () => {
      const newPin = {
        id: Math.random(),
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
        scale: Math.random() * 0.6 + 0.4, // size variation
        duration: Math.random() * 4 + 4, // 4s to 8s 
        type: Math.random() > 0.5 ? 'success' : 'primary', // 50% chance to be green or red
        ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*100)}.${Math.floor(Math.random()*255)}`
      };
      setPins(prev => {
        const next = [...prev, newPin];
        // Increase up to 15 pins for more activity
        if (next.length > 20) return next.slice(1);
        return next;
      });
    };

    const interval = setInterval(generatePin, 1200); // Slower generation for better performance
    // Initial pins
    for(let i=0; i<5; i++) setTimeout(generatePin, i*200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>

      {/* Dotted Map Background */}
      <div style={{ 
        position: 'absolute', width: '120%', height: '120%', left: '-10%', top: '-10%',
        backgroundImage: 'url("/world-map.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.25,
        filter: 'grayscale(100%) brightness(1.2)'
      }}></div>

      {/* Connecting Data Traces */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
        {pins.map((pin, i) => {
          if (i === 0) return null; // Need previous pin to connect to
          const prevPin = pins[i - 1]; 
          
          const dx = pin.x - prevPin.x;
          const dy = pin.y - prevPin.y;
          const bend = pin.id > 0.5 ? 0.3 : -0.3;
          const cx = prevPin.x + dx / 2 - dy * bend;
          const cy = prevPin.y + dy / 2 + dx * bend;
          
          const pathD = `M ${prevPin.x}% ${prevPin.y - 4}% Q ${cx}% ${cy}% ${pin.x}% ${pin.y}%`;
          
          const strokeColor = pin.type === 'success' ? '#10b981' : '#ef4444'; // Bright Green / Bright Red

          return (
            <motion.path
              key={`line-${pin.id}`}
              d={pathD}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0.6, 0],
                strokeDashoffset: [0, -300] // Fast data zip
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: pin.duration, ease: "easeInOut" },
                strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" }
              }}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeDasharray="4 20" // Zip traces
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0px 0px 4px ${strokeColor})`, opacity: 0.8 }}
            />
          );
        })}
      </svg>

      {/* Cyber Nodes */}
      <AnimatePresence>
        {pins.map(pin => {
          const pinColor = pin.type === 'success' ? '#10b981' : '#ef4444';
          return (
            <motion.div
              key={pin.id}
              initial={{ opacity: 0, scale: 0, left: `${pin.x}%`, top: `${pin.y}%` }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, pin.scale, pin.scale, 0],
                top: [`${pin.y}%`, `${pin.y - 8}%`] // Drift/jump upwards
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: pin.duration, ease: "easeInOut" }}
              style={{ position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%`, color: pinColor, transform: 'translate(-50%, -50%)' }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                 
                 {/* Location Icon */}
                 <motion.div 
                   style={{ 
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     filter: `drop-shadow(0 0 5px ${pinColor})`
                   }}
                 >
                   <MapPin size={32} strokeWidth={2} />
                 </motion.div>

              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Animated Abstract Background for Sections (Floating Tools)
const FloatingIconsBackground = React.memo(() => {
  const iconSet = [Wrench, Code, Scissors, MessageSquare, Camera, Paintbrush, Briefcase, Zap, Music, Hammer];
  
  // Memoize random properties so they don't regenerate continuously on mouse move
  const floatingIconsProps = useMemo(() => {
    return [...Array(15)].map((_, i) => {
      return {
        Icon: iconSet[i % iconSet.length] || Wrench,
        size: Math.random() * 80 + 40,
        left: Math.random() * 100,
        top: Math.random() * 100,
        durationY: Math.random() * 15 + 15,
        durationX: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        driftY: -(Math.random() * 150 + 50),
        swayX: Math.random() * 80 - 40,
        rotateMax: Math.random() * 45
      };
    });
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Soft gradient overlay so it doesn't clash with content, opacity slightly reduced to show icons */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(248, 250, 252, 0) 0%, rgba(248, 250, 252, 0.6) 100%)', zIndex: 1 }} />
      {floatingIconsProps.map((props, i) => {
        const { Icon, size, left, top, durationY, durationX, delay, driftY, swayX, rotateMax } = props;
        
        return (
          <motion.div
            key={`bg-icon-${i}`}
            initial={{ opacity: 0.12 }} // Much higher opacity
            animate={{ 
              y: [0, driftY, 0], 
              x: [0, swayX, -swayX, 0],
              rotate: [0, rotateMax, -rotateMax, 0] 
            }}
            transition={{
              y: { duration: durationY, repeat: Infinity, ease: "easeInOut", delay },
              x: { duration: durationX, repeat: Infinity, ease: "easeInOut", delay },
              rotate: { duration: durationY * 1.5, repeat: Infinity, ease: "easeInOut", delay }
            }}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              color: 'var(--brand-red)',
              willChange: 'transform'
            }}
          >
            <Icon size={size} strokeWidth={1.5} />
          </motion.div>
        );
      })}
    </div>
  );
});

const fadeInUp = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const staggerCards = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const floatAnim = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Navbar = ({ scrolled, setPage, isDark, isLoggedIn, onAuth, onLogout, currentPage }) => (
  <nav className={`navbar transition-all duration-500 fixed top-0 w-full z-[1000] ${scrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-crystal' : 'bg-transparent'}`}>
    <div className="container mx-auto px-6 md:px-8 py-3 md:py-5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
      {/* Top Row: Brand (Left) + Auth (Right) on mobile */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <motion.div 
          whileHover={{ scale: 1.02, rotate: -1 }} 
          className="brand cursor-pointer flex items-center bg-brand-red px-4 md:px-5 py-1.5 md:py-2 rounded-xl shadow-neo"
          onClick={() => setPage('home')}
        >
          <span className="text-white text-xl md:text-2xl font-black tracking-tight font-['Space_Grotesk']">Bartr.in</span>
        </motion.div>

        {/* Mobile Auth (Now on the Right) */}
        <div className="flex md:hidden gap-2">
          {isLoggedIn ? (
            <button onClick={onLogout} className="bg-white border-2 border-slate-900 px-4 py-2 rounded-xl font-black text-xs shadow-sm uppercase">Logout</button>
          ) : (
            <button onClick={() => onAuth('login')} className="bg-white border-2 border-slate-900 px-4 py-2 rounded-xl font-black text-xs shadow-sm uppercase">Login</button>
          )}
        </div>
      </div>


      {/* Navigation Links - Scrollable on mobile, centered on desktop */}
      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar w-full md:w-auto justify-start md:justify-center py-1 md:py-0 border-t md:border-t-0 border-black/5 mt-1 md:mt-0">
        {[
          { id: 'home', label: 'Feed', icon: <LayoutGrid size={18} /> },
          { id: 'gigs', label: 'Gigs', icon: <Zap size={18} /> },
          { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
          { id: 'careers', label: 'Careers', icon: <Briefcase size={18} /> },
          { id: 'tri-score', label: 'TRI Score', icon: <Award size={18} /> },
          ...(isLoggedIn ? [{ id: 'profile', label: 'Profile', icon: <User size={18} /> }] : [])
        ].map((item) => (
          <motion.a
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${currentPage === item.id ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            style={{ cursor: 'pointer' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.a>
        ))}
      </div>
      
      {/* Desktop Auth Actions */}
      <div className="hidden md:flex gap-3 items-center">
        {isLoggedIn ? (
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onLogout}
            className="bg-white border-2 border-black px-5 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-sm"
          >
            LOGOUT
          </motion.button>
        ) : (
          <>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onAuth('login')}
              className="bg-white text-black border-2 border-black px-5 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-sm"
            >
              LOGIN
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onAuth('signup')}
              className="bg-brand-red text-white border-2 border-black px-5 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-sm"
            >
              SIGNUP
            </motion.button>
          </>
        )}
      </div>
    </div>
  </nav>


);

// --- UNIQUE GIGS PAGE (Ultimate Redesign) ---
const GigsPage = ({ setPage, isLoggedIn, onAuth, onLogout, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'All', icon: <LayoutGrid size={18} />, color: '#000' },
    { name: 'Tech', icon: <Code size={18} />, color: '#3b82f6' },
    { name: 'Manual', icon: <Hammer size={18} />, color: '#ef4444' },
    { name: 'Creative', icon: <Paintbrush size={18} />, color: '#a855f7' },
    { name: 'Delivery', icon: <Zap size={18} />, color: '#22c55e' }
  ];

  const gigs = [
    { id: 1, title: 'Fix My Kitchen Sink', category: 'Manual', price: '₹400', time: '2h ago', status: 'Urgent', desc: 'Leaking pipe under the main sink. Need help ASAP.', loc: 'Dharampeth' },
    { id: 2, title: 'UI Design for App', category: 'Creative', price: '₹2500', time: '5h ago', status: 'Active', desc: 'Need a simple 3-page mockup for a local delivery app.', loc: 'Sadat Bazar' },
    { id: 3, title: 'Shift 10 Boxes', category: 'Manual', price: '₹200', time: '1h ago', status: 'Instant', desc: 'Just need some muscle to move boxes to the 2nd floor.', loc: 'Dhantoli' },
    { id: 4, title: 'Debug React Code', category: 'Tech', price: '₹1200', time: '10m ago', status: 'Urgent', desc: 'Infinite loop in my useEffect. Help me find it!', loc: 'Remote' },
    { id: 5, title: 'Grocery Run', category: 'Delivery', price: '₹150', time: '3h ago', status: 'Active', desc: 'Pick up 5 items from Big Bazaar and drop at Sitabuldi.', loc: 'Sitabuldi' },
    { id: 6, title: 'Logo Animation', category: 'Creative', price: '₹1800', time: '6h ago', status: 'New', desc: 'Lottie animation for a startup splash screen.', loc: 'Itwari' }
  ];

  const filteredGigs = activeCategory === 'All' ? gigs : gigs.filter(g => g.category === activeCategory);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: '#f8fafc', minHeight: '100vh', color: '#000', paddingBottom: '60px' }}>
      <Navbar scrolled={scrolled} setPage={setPage} isDark={false} isLoggedIn={isLoggedIn} onAuth={onAuth} onLogout={onLogout} currentPage="gigs" />
      
      <div className="container" style={{ paddingTop: '130px' }}>
        
        {/* Floating Category Pill Bar + Post Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '4rem',
          position: 'sticky',
          top: '110px',
          zIndex: 100
        }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(20px)', 
            padding: '0.5rem', 
            borderRadius: '100px', 
            display: 'flex', 
            gap: '0.5rem',
            alignItems: 'center',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <div className="nav-links" style={{ display: 'flex', gap: '0.3rem', borderRight: '1px solid #eee', paddingRight: '0.5rem', marginRight: '0.2rem', background: 'transparent', border: 'none' }}>

              {categories.map(cat => (
                <motion.button
                  key={cat.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.name)}
                  style={{ 
                    padding: '0.7rem 1.2rem', 
                    borderRadius: '100px', 
                    background: activeCategory === cat.name ? '#000' : 'transparent',
                    color: activeCategory === cat.name ? 'white' : '#666',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s'
                  }}
                >
                  {cat.icon} {cat.name}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, background: '#dc2626' }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                background: '#ef4444', 
                color: 'white', 
                border: 'none', 
                padding: '0.7rem 1.5rem', 
                borderRadius: '100px', 
                fontWeight: '900', 
                fontSize: '0.9rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 5px 15px rgba(239, 68, 68, 0.2)'
              }}
            >
              <Plus size={18} /> Post a Gig
            </motion.button>
          </div>
        </div>

        {/* Dynamic Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          <AnimatePresence mode="popLayout">
            {filteredGigs.map((gig, i) => {
              const catInfo = categories.find(c => c.name === gig.category);
              return (
                <motion.div
                  key={gig.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -10 }}
                  style={{ 
                    background: 'white', 
                    border: '1px solid #eee', 
                    borderRadius: '32px', 
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `0 10px 40px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(255,255,255,0.5)`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '280px'
                  }}
                >
                  {/* Category Glow */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '-50px', 
                    right: '-50px', 
                    width: '150px', 
                    height: '150px', 
                    background: catInfo?.color, 
                    filter: 'blur(80px)', 
                    opacity: 0.1,
                    zIndex: 0
                  }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: '900', 
                        background: `${catInfo?.color}15`, 
                        color: catInfo?.color, 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '8px', 
                        textTransform: 'uppercase' 
                      }}>{gig.category}</span>
                      <div style={{ color: '#ccc', fontWeight: '800', fontSize: '0.8rem' }}>{gig.time}</div>
                    </div>
                    
                    <h4 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>{gig.title}</h4>
                    <p style={{ color: '#777', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '500' }}>{gig.desc}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '800', marginBottom: '0.2rem' }}>OFFER</div>
                      <div style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>{gig.price}</div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05, background: '#000', color: '#fff' }}
                      style={{ background: 'transparent', border: '2.5px solid #000', padding: '0.7rem 1.5rem', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      APPLY
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* FIXED BOTTOM TICKER (Bloomberg Style) */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: '#000', 
        color: 'white', 
        padding: '0.7rem 0', 
        zIndex: 10001,
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', width: '200%' }}>
          <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }} 
            style={{ display: 'flex', alignItems: 'center', gap: '5rem', whiteSpace: 'nowrap' }}
          >
            {[1, 2].map(i => (
              <React.Fragment key={i}>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#ef4444' }}>⚡ LIVE MARKET: KITCHEN SINK IN DHARAMPETH (₹400)</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#3b82f6' }}>• NEW TECH POST: REACT DEBUGGING (₹1200)</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#22c55e' }}>• SUCCESS: LOGO GIG FILLED IN 12 MINS</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#fff' }}>• ACTIVE USERS: 142 IN NAGPUR</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COUNTUP UTILITY ---
const CountUp = ({ target, duration = 2 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;
    
    let totalMiliseconds = duration * 1000;
    let incrementTime = totalMiliseconds / end;
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
};

// --- TRI SCORE PAGE (Crystal Light Redesign) ---
const TRIScorePage = ({ setPage, isLoggedIn, onAuth, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const kpis = [
    { title: 'Jobs Completed', value: 'Consistency', icon: <Activity size={32} />, color: '#6366f1', desc: 'Experience and consistency in delivering work.' },
    { title: 'Average Rating', value: 'Quality', icon: <Star size={32} />, color: '#f59e0b', desc: 'Service quality based on client feedback.' },
    { title: 'Response Time', value: 'Engagement', icon: <Clock size={32} />, color: '#10b981', desc: 'Engagement speed and reliability.' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: '#f8fafc', minHeight: '100vh', color: '#000', overflow: 'hidden', position: 'relative' }}>
      
      {/* ATMOSPHERIC BACKGROUND ANIMATION */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Diagonal Ghost Marquees */}
        <div style={{ position: 'absolute', top: 0, left: '-10%', width: '120%', height: '120%', zIndex: 0 }}>
           {/* Top-Left to Bottom-Right Marquee */}
           <div style={{ position: 'absolute', top: '20%', left: 0, width: '150%', transform: 'rotate(-15deg)', opacity: 0.04 }}>
              <motion.div 
                animate={{ x: [0, -1000] }} 
                transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                className="whitespace-nowrap font-black text-[12rem] tracking-tighter"
              >
                TRUST • VELOCITY • ELITE • SCORE • REPUTATION • TRUST • VELOCITY • ELITE • SCORE • REPUTATION
              </motion.div>
           </div>
           
           {/* Bottom-Left to Top-Right Marquee */}
           <div style={{ position: 'absolute', top: '50%', left: '-25%', width: '150%', transform: 'rotate(15deg)', opacity: 0.03 }}>
              <motion.div 
                animate={{ x: [-1000, 0] }} 
                transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
                className="whitespace-nowrap font-black text-[10rem] tracking-tighter"
              >
                VERIFIED • NAGPUR • BARTR • PERFORMANCE • ELITE • VERIFIED • NAGPUR • BARTR • PERFORMANCE
              </motion.div>
           </div>
        </div>

        {/* Floating Glow Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [Math.random() * 1000, Math.random() * 1000],
              x: [Math.random() * 1000, Math.random() * 1000],
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 25 + Math.random() * 25,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(99,102,241,0.08)' : 'rgba(239,68,68,0.05)'} 0%, transparent 70%)`,
              borderRadius: '50%',
              top: 0,
              left: 0,
              willChange: 'transform, opacity'
            }}
          />
        ))}

        {/* Drifting Geometric Shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`geo-${i}`}
            animate={{
              rotate: [0, 360],
              y: [-100, 1000],
              x: [i * 200, i * 200 + 100]
            }}
            transition={{
              duration: 40 + Math.random() * 40,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              border: '1px solid rgba(0,0,0,0.03)',
              borderRadius: i % 2 === 0 ? '20%' : '50%',
              top: '-10%',
              left: 0
            }}
          />
        ))}
      </div>

      <Navbar scrolled={scrolled} setPage={setPage} isDark={false} isLoggedIn={isLoggedIn} onAuth={onAuth} onLogout={onLogout} currentPage="tri-score" />
      
      <div className="container" style={{ paddingTop: '150px', paddingBottom: '10rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#fff', color: '#6366f1', padding: '0.6rem 1.4rem', borderRadius: '100px', fontWeight: '900', fontSize: '0.85rem', marginBottom: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
          >
            <Award size={16} /> RELIABILITY INDEX v2.4
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: '900', letterSpacing: '-5px', lineHeight: '0.85', marginBottom: '2rem' }}
          >
            YOUR TRUST. <br/> <span style={{ background: 'linear-gradient(90deg, #6366f1, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>QUANTIFIED.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: '1.4rem', color: '#64748b', fontWeight: '600', maxWidth: '650px', margin: '0 auto' }}
          >
            The TRI Score is a live mathematical reflection of your professional performance on Bartr.in.
          </motion.p>
        </div>

        {/* The Liquid Gauge Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-24 md:mb-40">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-crystal rounded-[48px] p-10 md:p-16 text-center relative group"
           >
              <div className="relative w-[220px] md:w-[280px] h-[220px] md:h-[280px] mx-auto mb-10 md:mb-12">
                 {/* Outer Glow Effect */}
                 <motion.div 
                   animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl -z-10"
                 />
                 
                 <svg width="100%" height="100%" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="8" />
                    <motion.circle 
                      cx="50" cy="50" r="46" fill="none" stroke="url(#pastelGradient)" strokeWidth="8" strokeDasharray="289"
                      initial={{ strokeDashoffset: 289 }}
                      whileInView={{ strokeDashoffset: 289 - (289 * 0.85) }}
                      transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="pastelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                 </svg>
                 <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <div className="text-6xl md:text-[6rem] font-black tracking-tighter leading-none flex items-baseline">
                      <CountUp target={850} duration={2} />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-xs md:text-sm font-black text-indigo-600 tracking-[0.3em] mt-3 uppercase italic"
                    >
                      MASTER
                    </motion.div>
                 </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-black text-sm border-2 border-black/10 shadow-neo"
              >
                 <Activity size={16} className="text-emerald-400 animate-pulse" /> TOP 1.2% NATIONWIDE
              </motion.div>
           </motion.div>

           <div className="flex flex-col gap-4">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={kpi.title}
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-crystal hover:shadow-premium hover:-translate-y-1 transition-all rounded-3xl p-6 md:p-8 flex items-center gap-6 cursor-pointer group"
                >
                  <div 
                    className="p-4 rounded-2xl shadow-sm transition-all group-hover:scale-110"
                    style={{ color: kpi.color, background: 'white' }}
                  >
                    {kpi.icon}
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black text-slate-800 leading-none mb-1">{kpi.title}</h4>
                    <p className="text-sm md:text-base text-slate-500 font-bold leading-tight">{kpi.desc}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* The Algorithm Blueprint v3 (High Contrast Split) */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1.5rem' }}>02 / THE ARCHITECTURE</div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', letterSpacing: '-3px', marginBottom: '4rem' }}>The Science of <span style={{ color: '#ef4444' }}>Reputation.</span></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* LEFT: The Dark Engine */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.01 }}
            className="bg-slate-950 rounded-[32px] shadow-2xl overflow-hidden border border-slate-800"
          >
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
               <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
               </div>
               <div className="text-xs text-slate-500 font-mono font-bold tracking-widest uppercase">rep_engine_v3.py</div>
            </div>
            <div className="p-8 md:p-12 font-mono text-base md:text-lg leading-relaxed text-slate-100">
               <div className="text-slate-600 mb-4 tracking-tighter"># CORE REPUTATION ALGORITHM</div>
               <div><span className="text-rose-500">def</span> <span className="text-indigo-400">calculate_tri</span>(data):</div>
               <div className="pl-6 border-l border-slate-800 ml-1 mt-2 space-y-1">
                 <div>score = (</div>
                 <div className="pl-6">data.jobs <span className="text-rose-500">*</span> <span className="text-amber-500">0.45</span> +</div>
                 <div className="pl-6">data.rating <span className="text-rose-500">*</span> <span className="text-amber-500">0.35</span> +</div>
                 <div className="pl-6">data.response <span className="text-rose-500">*</span> <span className="text-amber-500">0.20</span></div>
                 <div>)</div>
               </div>
               <div className="mt-4"><span className="text-rose-500">return</span> round(score, <span className="text-amber-500">2</span>)</div>
               
               <div className="mt-12 pt-6 border-t border-slate-900">
                  <div className="text-emerald-400 flex items-center gap-3 text-sm font-bold tracking-wider">
                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse" />
                     REPUTATION SYSTEMS ONLINE // VERIFIED
                  </div>
               </div>
            </div>
          </motion.div>

          {/* RIGHT: The Explanation */}
          <div className="flex flex-col gap-4">
             {[
               { icon: <Activity className="text-indigo-500" />, title: '45% / Output Velocity', text: 'We prioritize completed jobs above all. It proves you can start and finish a task reliably.' },
               { icon: <Star className="text-amber-500" />, title: '35% / Quality Index', text: 'Sentiment analysis of reviews and star ratings ensures that speed never sacrifices excellence.' },
               { icon: <Clock className="text-emerald-500" />, title: '20% / Pulse Speed', text: 'Your response time to inquiries. On Bartr, speed is trust. Fast engagement leads to higher retention.' }
             ].map((item, i) => (
               <motion.div
                 key={item.title}
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-crystal hover:shadow-premium transition-all"
               >
                 <div className="flex items-center gap-4 mb-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm">{item.icon}</div>
                    <h4 className="font-black text-lg text-slate-800 tracking-tight">{item.title}</h4>
                 </div>
                 <p className="text-slate-500 leading-relaxed font-bold text-sm md:text-base">{item.text}</p>
               </motion.div>
             ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// --- SARCASTIC CAREERS PAGE ---
const CareersPage = ({ setPage, isLoggedIn, onAuth, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      className="min-h-screen" style={{ background: '#f8fafc', position: 'relative', overflow: 'hidden' }}
    >
      <Navbar scrolled={scrolled} setPage={setPage} isDark={false} isLoggedIn={isLoggedIn} onAuth={onAuth} onLogout={onLogout} currentPage="careers" />
      
      {/* GenZ Marquee Background & Neo-brutalist Orbs */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.05, pointerEvents: 'none' }} />
      
      <div style={{ position: 'absolute', top: '15%', left: '-20%', width: '150%', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(-5deg)', zIndex: 0 }}>
         <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }} style={{ whiteSpace: 'nowrap', fontSize: '15rem', fontWeight: 900, lineHeight: 1 }}>
            WE OUT HERE HIRING • NO CAP • WE OUT HERE HIRING • NO CAP • WE OUT HERE HIRING • NO CAP
         </motion.div>
      </div>
      <div style={{ position: 'absolute', top: '65%', left: '-20%', width: '150%', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(5deg)', zIndex: 0 }}>
         <motion.div animate={{ x: [-1000, 0] }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} style={{ whiteSpace: 'nowrap', fontSize: '15rem', fontWeight: 900, lineHeight: 1 }}>
            DOUBT WE'LL RESPOND • DOUBT WE'LL RESPOND • DOUBT WE'LL RESPOND • DOUBT WE'LL RESPOND
         </motion.div>
      </div>

      {/* Floating Emojis */}
      <motion.div animate={{ y: [0, -40, 0], rotate: [0, 20, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', top: '20%', left: '15%', fontSize: '5rem', zIndex: 0 }}>🔥</motion.div>
      <motion.div animate={{ y: [0, 50, 0], rotate: [0, -30, 30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} style={{ position: 'absolute', top: '40%', right: '15%', fontSize: '5rem', zIndex: 0 }}>💀</motion.div>
      <motion.div animate={{ y: [0, -30, 0], scale: [1, 1.5, 1], rotate: [0, 45, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }} style={{ position: 'absolute', bottom: '25%', left: '25%', fontSize: '5rem', zIndex: 0 }}>💸</motion.div>

      <section className="hero" style={{ minHeight: '50vh', paddingTop: '10rem', background: 'transparent' }}>
        <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div variants={staggerCards} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} whileHover={{ rotate: [-2, 2, -2], scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block', background: '#bef264', color: 'black', border: '3px solid black', boxShadow: '4px 4px 0 rgba(0,0,0,1)', padding: '0.75rem 2rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '2rem', cursor: 'pointer' }}>
              We're Hiring (Desperately)
            </motion.div>
            <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', lineHeight: 0.9, margin: '2rem 0', color: 'black', letterSpacing: '-0.06em', fontWeight: '900', textTransform: 'uppercase' }}>
              Join our cult<br/>
              <span style={{ color: '#ef4444', textShadow: '6px 6px 0px rgba(0,0,0,0.1)' }}>erm, team.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.5rem', color: '#334155', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500', border: '3px solid black', padding: '1.5rem', borderRadius: '16px', background: 'white', boxShadow: '8px 8px 0px black' }}>
               We're disrupting the hyperlocal market by using enough buzzwords to secure our Series A. We need people who thrive in absolute chaos, write zero documentation, and exist exclusively on iced coffee.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
           <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem', fontWeight: '900', textAlign: 'center', letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'black' }}>Our "Industry-Leading" Perks</h2>
           <div className="grid-3" style={{ gap: '2rem' }}>
              <motion.div 
                 whileHover={{ y: -15, scale: 1.05, rotate: -3, boxShadow: '16px 16px 0px black' }} 
                 transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                 className="modern-card" style={{ background: '#fca5a5', border: '4px solid black', boxShadow: '8px 8px 0px black', borderRadius: '16px' }}>
                 <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'white', width: '100px', height: '100px', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', boxShadow: '4px 4px 0px black' }}>💸</div>
                 <h3 style={{ marginBottom: '0.75rem', fontSize: '2rem', fontWeight: '900', color: 'black' }}>Competitive Salary</h3>
                 <p style={{ color: 'black', fontSize: '1.25rem', lineHeight: 1.5, fontWeight: '500' }}>We pay just enough so you can't quite afford to quit, but definitely not enough to buy a house anytime soon.</p>
              </motion.div>
              <motion.div 
                 whileHover={{ y: -15, scale: 1.05, rotate: 3, boxShadow: '16px 16px 0px black' }} 
                 transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                 className="modern-card" style={{ background: '#93c5fd', border: '4px solid black', boxShadow: '8px 8px 0px black', borderRadius: '16px' }}>
                 <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'white', width: '100px', height: '100px', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', boxShadow: '4px 4px 0px black' }}>🏖️</div>
                 <h3 style={{ marginBottom: '0.75rem', fontSize: '2rem', fontWeight: '900', color: 'black' }}>Unlimited PTO</h3>
                 <p style={{ color: 'black', fontSize: '1.25rem', lineHeight: 1.5, fontWeight: '500' }}>It's a psychological trap! We offer it knowing no one has ever taken a single day off without feeling immense guilt.</p>
              </motion.div>
              <motion.div 
                 whileHover={{ y: -15, scale: 1.05, rotate: -2, boxShadow: '16px 16px 0px black' }} 
                 transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                 className="modern-card" style={{ background: '#fcd34d', border: '4px solid black', boxShadow: '8px 8px 0px black', borderRadius: '16px' }}>
                 <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'white', width: '100px', height: '100px', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', boxShadow: '4px 4px 0px black' }}>🏓</div>
                 <h3 style={{ marginBottom: '0.75rem', fontSize: '2rem', fontWeight: '900', color: 'black' }}>Mandatory Fun</h3>
                 <p style={{ color: 'black', fontSize: '1.25rem', lineHeight: 1.5, fontWeight: '500' }}>We bought a ping pong table to pretend we have culture. Thursday evening awkward social events are non-negotiable.</p>
              </motion.div>
           </div>
        </div>
      </section>

      <section className="section" style={{ padding: '2rem 0 10rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
           <h2 style={{ fontSize: '3.5rem', marginBottom: '4rem', color: 'black', fontWeight: '900', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Open Requisitions</h2>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <motion.div 
                 whileHover={{ scale: 1.03, x: 10, y: -5, boxShadow: '16px 16px 0px black' }} 
                 transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                 style={{ background: '#a7f3d0', border: '4px solid black', padding: '2.5rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '8px 8px 0px black', position: 'relative', overflow: 'hidden' }}>
                 <div>
                    <h3 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: 'black', fontWeight: '900' }}>Senior Stack Overflow Specialist <br/><span style={{ fontSize: '1.125rem', color: '#1e293b', fontWeight: 'bold' }}>aka Frontend Developer</span></h3>
                    <p style={{ color: 'black', margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><MapPin size={24} color="black" /> Remote • Must know how to center a div without crying.</p>
                 </div>
                 <motion.div whileHover={{ rotate: 45, scale: 1.2 }} transition={{ type: 'spring' }} style={{ background: 'white', padding: '1.25rem', border: '3px solid black', borderRadius: '50%', color: 'black', boxShadow: '4px 4px 0px black' }}>
                   <ArrowRight size={36} strokeWidth={3} />
                 </motion.div>
              </motion.div>

              <motion.div 
                 whileHover={{ scale: 1.03, x: -10, y: -5, boxShadow: '-16px 16px 0px black' }} 
                 transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                 style={{ background: '#ddd6fe', border: '4px solid black', padding: '2.5rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '-8px 8px 0px black', position: 'relative', overflow: 'hidden' }}>
                 <div>
                    <h3 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: 'black', fontWeight: '900' }}>Professional Scope Creeper <br/><span style={{ fontSize: '1.125rem', color: '#1e293b', fontWeight: 'bold' }}>aka Product Manager</span></h3>
                    <p style={{ color: 'black', margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><MapPin size={24} color="black" /> Nagpur HQ • Expertise in scheduling meetings that could've been emails.</p>
                 </div>
                 <motion.div whileHover={{ rotate: -45, scale: 1.2 }} transition={{ type: 'spring' }} style={{ background: 'white', padding: '1.25rem', border: '3px solid black', borderRadius: '50%', color: 'black', boxShadow: '-4px 4px 0px black' }}>
                   <ArrowRight size={36} strokeWidth={3} />
                 </motion.div>
              </motion.div>

              <motion.div 
                 whileHover={{ scale: 1.03, x: 10, y: -5, boxShadow: '16px 16px 0px black' }} 
                 transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                 style={{ background: '#fbcfe8', border: '4px solid black', padding: '2.5rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '8px 8px 0px black', position: 'relative', overflow: 'hidden' }}>
                 <div>
                    <h3 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: 'black', fontWeight: '900' }}>Ghost Protocol Architect <br/><span style={{ fontSize: '1.125rem', color: '#1e293b', fontWeight: 'bold' }}>aka Backend Engineer</span></h3>
                    <p style={{ color: 'black', margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><MapPin size={24} color="black" /> Remote • Building APIs nobody asked for and blaming the frontend for latency.</p>
                 </div>
                 <motion.div whileHover={{ rotate: 135, scale: 1.2 }} transition={{ type: 'spring' }} style={{ background: 'white', padding: '1.25rem', border: '3px solid black', borderRadius: '50%', color: 'black', boxShadow: '4px 4px 0px black' }}>
                   <ArrowRight size={36} strokeWidth={3} />
                 </motion.div>
              </motion.div>

           </div>
        </div>
      </section>
    </motion.div>
  );
};

// --- NEO-BRUTALIST EVENTS PAGE ---
const EventsPage = ({ setPage, isLoggedIn, onAuth, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0); 
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      onAuth('login');
    } else {
      setPage('pitch-fire-register');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      style={{ background: '#f8fafc', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      <Navbar scrolled={scrolled} setPage={setPage} isDark={false} isLoggedIn={isLoggedIn} onAuth={onAuth} onLogout={onLogout} currentPage="events" />
      
      {/* GenZ Marquee Background & Neo-brutalist Patterns */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(#10b981 2px, transparent 2px)', backgroundSize: '60px 60px', opacity: 0.1, pointerEvents: 'none' }} />
      
      <div style={{ position: 'absolute', top: '15%', left: '-20%', width: '150%', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(-5deg)', zIndex: 0 }}>
         <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }} style={{ whiteSpace: 'nowrap', fontSize: '15rem', fontWeight: 900, lineHeight: 1 }}>
            FOMO IS REAL • BE THERE OR BE SQUARE • FOMO IS REAL • BE THERE OR BE SQUARE
         </motion.div>
      </div>
      <div style={{ position: 'absolute', top: '75%', left: '-20%', width: '150%', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(5deg)', zIndex: 0 }}>
         <motion.div animate={{ x: [-1000, 0] }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} style={{ whiteSpace: 'nowrap', fontSize: '15rem', fontWeight: 900, lineHeight: 1 }}>
            EXCLUSIVE DROPS • VIP ONLY • EXCLUSIVE DROPS • VIP ONLY • EXCLUSIVE DROPS
         </motion.div>
      </div>

      {/* Floating Emojis */}
      <motion.div animate={{ y: [0, -40, 0], rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', top: '20%', left: '10%', fontSize: '6rem', zIndex: 0 }}>📍</motion.div>
      <motion.div animate={{ y: [0, 50, 0], rotate: [0, -30, 30, 0], scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} style={{ position: 'absolute', top: '50%', right: '10%', fontSize: '6rem', zIndex: 0 }}>🎫</motion.div>
      <motion.div animate={{ y: [0, -30, 0], scale: [1, 1.5, 1], rotate: [0, 45, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }} style={{ position: 'absolute', bottom: '15%', left: '20%', fontSize: '6rem', zIndex: 0 }}>🍻</motion.div>

      <section className="hero" style={{ minHeight: '40vh', paddingTop: '10rem', background: 'transparent' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div variants={staggerCards} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} whileHover={{ rotate: [-2, 2, -2], scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block', background: '#34d399', color: 'black', border: '3px solid black', boxShadow: '4px 4px 0 rgba(0,0,0,1)', padding: '0.75rem 2rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '2rem', cursor: 'pointer', textTransform: 'uppercase' }}>
              Happening Now
            </motion.div>
            <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', lineHeight: 0.9, margin: '2rem 0', color: 'black', letterSpacing: '-0.06em', fontWeight: '900', textTransform: 'uppercase' }}>
              Local <br/>
              <span style={{ color: '#10b981', textShadow: '6px 6px 0px rgba(0,0,0,0.1)' }}>Fixtures.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ fontSize: '1.5rem', color: '#334155', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500', border: '3px solid black', padding: '1.5rem', borderRadius: '16px', background: 'white', boxShadow: '8px 8px 0px black' }}>
               Skip the algorithm. Find out where people actually exist in real life. Underground meetups, founder coffees, and warehouse raves. 
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ padding: '4rem 0 10rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '3rem' }}>
           
           {/* EXCLUSIVE PITCH FIRE EVENT */}
           <motion.div 
               whileHover={{ scale: 1.02, x: 10, y: -10, boxShadow: '30px 30px 0px #10b981' }} 
               transition={{ type: 'spring', stiffness: 300, damping: 15 }}
               style={{ background: '#fcd34d', border: '6px solid black', borderRadius: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer', boxShadow: '20px 20px 0px black', minHeight: '600px' }}>
               
               <div style={{ background: 'black', color: 'white', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#ef4444', width: '15px', height: '15px', borderRadius: '50%', boxShadow: '0 0 15px #ef4444' }}></div>
                    <span style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>LIVE EVENT</span>
                  </div>
                  <div style={{ fontWeight: '900' }}>MAY 9</div>
               </div>

               <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
                 <div style={{ flex: '1.5', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '6px solid black', minWidth: '350px' }}>
                    <div style={{ background: 'white', color: 'black', border: '4px solid black', padding: '0.5rem 1.5rem', borderRadius: '12px', fontWeight: '900', textTransform: 'uppercase', width: 'fit-content', marginBottom: '2rem', boxShadow: '6px 6px 0px black', fontSize: '1.25rem' }}>🔥 THE MAIN STAGE</div>
                    
                    <h3 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '1.5rem', color: 'black', fontWeight: '900', lineHeight: 0.85, letterSpacing: '-0.04em' }}>FOUNDERS <br/><span style={{ color: '#ef4444' }}>ARENA.</span></h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.75rem', fontWeight: '800' }}>
                          <span style={{ fontSize: '2.5rem' }}>⏰</span> Friday, May 2 • 9:30 AM to 1:30 PM
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.75rem', fontWeight: '800' }}>
                          <span style={{ fontSize: '2.5rem' }}>📍</span> Aromas Cafe & Bistro
                       </div>
                    </div>

                    <p style={{ color: 'black', fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', lineHeight: 1.4, maxWidth: '500px' }}>
                      3 Minutes. 2 Founders. High stakes roasting by esteemed judges. No slides, no mercy. Survive the fire and get funded.
                    </p>
                 </div>
                 
                 <div style={{ flex: '1', background: '#f472b6', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minWidth: '300px' }}>
                    <div style={{ background: 'white', border: '4px solid black', padding: '2rem', borderRadius: '24px', boxShadow: '12px 12px 0px black', transform: 'rotate(5deg)' }}>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '900', color: '#64748b', marginBottom: '0.5rem' }}>ENTRY FEE</span>
                      <h2 style={{ fontSize: '5rem', color: 'black', fontWeight: '900', lineHeight: 1, margin: 0 }}>₹1200</h2>
                    </div>

                    <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                      <motion.button 
                        onClick={handleRegisterClick} 
                        whileHover={{ scale: 1.05, rotate: -2, boxShadow: '0px 10px 0px black' }} 
                        whileTap={{ scale: 0.95 }} 
                        style={{ background: 'black', color: 'white', border: '4px solid black', padding: '1.5rem 3rem', borderRadius: '16px', fontSize: '2rem', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase', width: '100%' }}>
                        GRAB A SLOT 🚀
                      </motion.button>
                      <p style={{ fontWeight: '800', fontSize: '1.125rem', color: 'black', opacity: 0.7 }}>Limited to 50 Teams Only</p>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                          {[1,2,3,4].map(i => (
                            <div key={i} style={{ width: '45px', height: '45px', background: `hsl(${i * 45}, 70%, 60%)`, border: '3px solid black', borderRadius: '50%', marginLeft: '-15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>👤</div>
                          ))}
                       </div>
                       <span style={{ fontSize: '1.125rem', fontWeight: '900', color: 'black' }}>+16 Founders joined</span>
                    </div>
                 </div>
               </div>
            </motion.div>
         </div>
       </section>
     </motion.div>
   );
};

const PitchFireRegistration = ({ setPage, user }) => {
  const [step, setStep] = useState(1);
  const [teamData, setTeamData] = useState({ teamName: '', member1: '', member2: '', idea: '' });
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState('');
  const [ticketId, setTicketId] = useState('');

  const handleNext = (e) => { e.preventDefault(); setStep(step + 1); };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading('Sending Secure OTP to your email...');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to connect to backend server. Make sure node server.js is running!");
    } finally {
      setLoading('');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading('Verifying 2FA Code...');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        alert("Invalid or Expired OTP: " + data.error);
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading('');
    }
  };

  const processPayment = async () => {
    setLoading('Verifying payment & generating ticket...');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BART-PF-';
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setTicketId(result);
    setStep(4);

    try {
      // 1. Save to Supabase
      const { error: dbError } = await supabase.from('registrations').insert({
        user_id: user?.id,
        team_name: teamData.teamName,
        ticket_id: result,
        payment_status: 'success'
      });
      
      if (dbError) throw dbError;

      // 2. Send email notification
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/send-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ticketId: result, teamName: teamData.teamName })
      });
    } catch (err) {
      console.error('Registration Error:', err);
      alert('Payment confirmed, but we had trouble saving your data. Please contact support with ID: ' + result);
    } finally {
      setLoading('');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '1.25rem',
    border: '4px solid black',
    borderRadius: '16px',
    background: 'white',
    fontSize: '1.25rem',
    fontWeight: '800',
    outline: 'none',
    boxShadow: '6px 6px 0px rgba(0,0,0,0.1)',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '900',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: '#000', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}
    >
      {/* BACKGROUND MOVING TEXT MARQUEE */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden', opacity: 0.2 }}>
          <motion.div 
            animate={{ x: [-2000, 0] }} 
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }} 
            style={{ fontSize: '20rem', fontWeight: 900, color: 'white', whiteSpace: 'nowrap', lineHeight: 1 }}
          >
            FOUNDERS ARENA MAY 9 • FOUNDERS ARENA MAY 9 • FOUNDERS ARENA MAY 9
          </motion.div>
          <motion.div 
            animate={{ x: [0, -2000] }} 
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }} 
            style={{ fontSize: '20rem', fontWeight: 900, color: '#ef4444', whiteSpace: 'nowrap', lineHeight: 1 }}
          >
            NAGPUR STARTUPS • NAGPUR STARTUPS • NAGPUR STARTUPS
          </motion.div>
      </div>

      <div style={{ cursor: 'pointer', position: 'absolute', top: '2rem', left: '2rem', zIndex: 100, background: 'white', border: '3px solid black', padding: '0.75rem 1.5rem', borderRadius: '12px', boxShadow: '4px 4px 0px black', display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: '900' }} onClick={() => setPage('events')}>
         <ArrowRight size={24} style={{ transform: 'rotate(180deg)' }} /> EXIT
      </div>

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {loading && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ background: '#fcd34d', color: 'black', padding: '2rem 4rem', borderRadius: '24px', border: '6px solid black', fontWeight: '900', fontSize: '2rem', boxShadow: '15px 15px 0px #ef4444', textAlign: 'center' }}>
               {loading}
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <div style={{ width: '100%', maxWidth: '650px', position: 'relative', zIndex: 10 }}>
        
        {/* Step Progress */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ flex: 1, height: '12px', background: s <= step ? (s === 4 ? '#34d399' : '#ef4444') : '#334155', border: '3px solid black', borderRadius: '6px', transition: 'all 0.4s' }}></div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} style={{ background: '#f8fafc', border: '6px solid black', padding: '3.5rem', borderRadius: '32px', boxShadow: '20px 20px 0px black' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                 <h2 style={{ fontSize: '3rem', fontWeight: '900', textTransform: 'uppercase', lineHeight: 1 }}>TEAM <br/><span style={{ color: '#ef4444' }}>SETUP.</span></h2>
                 <div style={{ fontSize: '3rem' }}>🚀</div>
               </div>
               
               <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                     <label style={labelStyle}>Company / Team Name</label>
                     <input required placeholder="eg. Ghost Protocol" value={teamData.teamName} onChange={e => setTeamData({...teamData, teamName: e.target.value})} style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                       <label style={labelStyle}>Founder 1</label>
                       <input required placeholder="Name" value={teamData.member1} onChange={e => setTeamData({...teamData, member1: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                       <label style={labelStyle}>Founder 2</label>
                       <input required placeholder="Name" value={teamData.member2} onChange={e => setTeamData({...teamData, member2: e.target.value})} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                     <label style={labelStyle}>The Pitch (One sentence roast)</label>
                     <textarea required rows={3} placeholder="We solve problems that don't exist..." value={teamData.idea} onChange={e => setTeamData({...teamData, idea: e.target.value})} style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                  <motion.button whileHover={{ scale: 1.02, y: -5, boxShadow: '0px 10px 0px black' }} whileTap={{ scale: 0.98 }} type="submit" style={{ background: 'black', color: 'white', border: '4px solid black', padding: '1.5rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.5rem', cursor: 'pointer', marginTop: '1rem', textTransform: 'uppercase' }}>Continue to Verify →</motion.button>
               </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} style={{ background: '#f8fafc', border: '6px solid black', padding: '3.5rem', borderRadius: '32px', boxShadow: '20px 20px 0px black' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                 <h2 style={{ fontSize: '3rem', fontWeight: '900', textTransform: 'uppercase', lineHeight: 1 }}>EMAIL <br/><span style={{ color: '#3b82f6' }}>AUTH.</span></h2>
                 <div style={{ fontSize: '3rem' }}>🔒</div>
               </div>

               {!otpSent ? (
                 <form onSubmit={sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                       <label style={labelStyle}>Founder Email</label>
                       <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@startup.com" style={inputStyle} />
                       <p style={{ marginTop: '1rem', fontWeight: '700', color: '#64748b' }}>We'll send your digital ticket here.</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} type="submit" style={{ background: '#3b82f6', color: 'white', border: '4px solid black', padding: '1.5rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.5rem', boxShadow: '6px 6px 0px black', cursor: 'pointer', textTransform: 'uppercase' }}>Request PIN</motion.button>
                 </form>
               ) : (
                 <form onSubmit={verifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                       <label style={labelStyle}>6-Digit PIN</label>
                       <input required type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} style={{ ...inputStyle, fontSize: '3rem', textAlign: 'center', letterSpacing: '0.75rem', background: '#fef9c3' }} />
                       <p style={{ marginTop: '1rem', fontWeight: '700', color: '#ef4444' }}>Expiring in 2 minutes!</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} type="submit" style={{ background: '#34d399', color: 'black', border: '4px solid black', padding: '1.5rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.5rem', boxShadow: '6px 6px 0px black', cursor: 'pointer', textTransform: 'uppercase' }}>Confirm Identity</motion.button>
                    <p onClick={() => setOtpSent(false)} style={{ textAlign: 'center', fontWeight: '900', cursor: 'pointer', textDecoration: 'underline' }}>Resend code?</p>
                 </form>
               )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} style={{ background: '#f8fafc', border: '6px solid black', padding: 'clamp(1.5rem, 8vw, 3.5rem)', borderRadius: '24px', boxShadow: '10px 10px 0px black', textAlign: 'center' }}>
               <h2 style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem' }}>GET <span style={{ color: '#a78bfa' }}>ENTRY.</span></h2>
               <p style={{ fontWeight: '800', fontSize: '1.5rem', marginBottom: '2.5rem' }}>Scan the QR to secure your team slot.</p>
               
               <div style={{ background: 'white', padding: '2rem', display: 'inline-block', borderRadius: '24px', border: '5px solid black', marginBottom: '2.5rem', boxShadow: '12px 12px 0px rgba(167,139,250,0.3)' }}>
                  <div style={{ width: '220px', height: '220px', background: 'white', backgroundImage: 'url("https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=mock@upi&pn=Bartr&am=1200.00&tr=mock-txn")', backgroundSize: 'cover' }}></div>
                  <div style={{ marginTop: '1.5rem', fontSize: '2.5rem', fontWeight: '900' }}>₹1200</div>
               </div>
               
               <motion.button onClick={processPayment} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} style={{ width: '100%', background: '#a78bfa', color: 'black', border: '4px solid black', padding: '1.5rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.5rem', boxShadow: '8px 8px 0px black', cursor: 'pointer', textTransform: 'uppercase' }}>I've Paid! Generate Ticket</motion.button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ scale: 0.5, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} style={{ background: '#fff', border: '6px solid black', borderRadius: '24px', boxShadow: '15px 15px 0px black', width: '100%', overflow: 'hidden' }}>
               <div style={{ background: '#ef4444', padding: 'clamp(1.5rem, 8vw, 3rem)', color: 'white', borderBottom: '6px dashed black', textAlign: 'center' }}>
                 <motion.h2 animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)', fontWeight: '900', margin: 0, textShadow: '4px 4px 0px black', letterSpacing: '-0.05em' }}>SUCCESS! 🎫</motion.h2>
                 <p style={{ fontWeight: '900', fontSize: '1.2rem', marginTop: '1rem', textTransform: 'uppercase' }}>You are officially in the fire.</p>
               </div>
               <div style={{ padding: 'clamp(1.5rem, 8vw, 4rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '16px', border: '3px solid black' }}>
                      <span style={{ color: '#64748b', fontWeight: '900', fontSize: '0.9rem', textTransform: 'uppercase' }}>TEAM</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'black' }}>{teamData.teamName}</div>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '16px', border: '3px solid black' }}>
                      <span style={{ color: '#64748b', fontWeight: '900', fontSize: '0.9rem', textTransform: 'uppercase' }}>SLOT</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#10b981' }}>CONFIRMED</div>
                    </div>
                  </div>
                  <div style={{ background: '#000', color: '#34d399', padding: '2rem', borderRadius: '16px', border: '3px solid #34d399', textAlign: 'center' }}>
                      <span style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '1rem', display: 'block', marginBottom: '0.5rem' }}>TICKET SERIAL</span>
                      <div style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '0.2em' }}>{ticketId}</div>
                  </div>
                  <p style={{ textAlign: 'center', fontWeight: '800', fontSize: '1.1rem', color: '#64748b' }}>A confirmation has been sent to {email}. <br/>Bring this ID to Aromas Cafe & Bistro.</p>
                  <motion.button onClick={() => setPage('events')} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} style={{ width: '100%', background: 'black', color: 'white', border: '4px solid black', padding: '1.5rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.5rem', marginTop: '1rem', cursor: 'pointer', textTransform: 'uppercase' }}>Back to Site</motion.button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} style={{ position: 'absolute', top: '10%', right: '5%', fontSize: '8rem', zIndex: 1, opacity: 0.3 }}>🔥</motion.div>
      <motion.div animate={{ y: [0, -50, 0] }} transition={{ repeat: Infinity, duration: 5 }} style={{ position: 'absolute', bottom: '10%', left: '5%', fontSize: '6rem', zIndex: 1, opacity: 0.3 }}>🚀</motion.div>
      <motion.div animate={{ x: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ position: 'absolute', top: '40%', left: '2%', fontSize: '5rem', zIndex: 1, opacity: 0.3 }}>🎫</motion.div>

    </motion.div>
  );
};

// --- CUSTOM CURSOR (Sleek & Minimalist) ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable custom cursor on mobile/touch devices
    if (typeof window !== "undefined" && (window.innerWidth < 850 || "ontouchstart" in window)) {
      return;
    }
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Check if hovering over clickable elements
      const target = e.target;
      if (
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.brand') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mousemove', moveCursor);
    document.body.style.cursor = 'none'; // hide default cursor globally
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.style.cursor = 'auto';
    };
  }, [cursorX, cursorY]);

  if (typeof window !== "undefined" && (window.innerWidth < 850 || "ontouchstart" in window)) {
    return null;
  }

  return (
    <>
      <motion.div
        style={{
          position: 'fixed', left: 0, top: 0, x: cursorXSpring, y: cursorYSpring,
          width: isHovering ? '60px' : '40px',
          height: isHovering ? '60px' : '40px',
          marginLeft: isHovering ? '-30px' : '-20px',
          marginTop: isHovering ? '-30px' : '-20px',
          backgroundColor: isHovering ? 'rgba(0, 0, 0, 0.05)' : 'transparent', 
          border: '2px solid black',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform, width, height, margin',
          transition: 'width 0.2s, height 0.2s, margin 0.2s, background-color 0.2s'
        }}
      />
      <motion.div
        style={{
          position: 'fixed', left: 0, top: 0, x: cursorX, y: cursorY,
          width: '8px', height: '8px', marginLeft: '-4px', marginTop: '-4px',
          backgroundColor: 'black', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999,
          willChange: 'transform',
          opacity: isHovering ? 0 : 1,
          transition: 'opacity 0.2s'
        }}
      />
    </>
  );
};

// --- MAIN ROUTER APP ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState(false);

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setIsPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo(0, 0);
      setTimeout(() => setIsPageLoading(false), 400);
    }, 500);
  };

  useEffect(() => {
    // 1. Check for verification token instantly (Supabase Email Confirmation Redirect)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      setIsPageLoading(true);
      
      // Give it a small delay for the session to settle and for the "Elite" B-Loader to show
      setTimeout(() => {
        setIsPageLoading(false);
        setVerifiedMessage(true);
        setCurrentPage('welcome');
        
        // Clean the URL of the secret tokens for a professional look
        window.history.replaceState(null, null, window.location.pathname);
        
        // Hide celebration toast after 5 seconds
        setTimeout(() => setVerifiedMessage(false), 5000);
      }, 2000);
    }

    // 2. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
      }
    });

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      
      if (session && event === 'SIGNED_IN') {
        setShowAuthModal(false);
      }
    });

    // 3. Listen for manual login modal triggers (from verification redirect)
    const handleOpenLogin = () => openAuth('login');
    window.addEventListener('openLoginModal', handleOpenLogin);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('openLoginModal', handleOpenLogin);
    };
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
    handlePageChange('home');
    // Clear any remaining auth items from localStorage just in case
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('supabase.auth.token')) {
        localStorage.removeItem(key);
      }
    }
  };

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {isPageLoading && <PageLoader />}
      </AnimatePresence>

      {currentPage === 'home' && <LandingPage setPage={handlePageChange} isLoggedIn={isLoggedIn} onAuth={openAuth} onLogout={handleLogout} />}
      {currentPage === 'gigs' && <GigsPage setPage={handlePageChange} isLoggedIn={isLoggedIn} onAuth={openAuth} onLogout={handleLogout} currentPage="gigs" />}
      {currentPage === 'careers' && <CareersPage setPage={handlePageChange} isLoggedIn={isLoggedIn} onAuth={openAuth} onLogout={handleLogout} />}
      {currentPage === 'tri-score' && <TRIScorePage setPage={handlePageChange} isLoggedIn={isLoggedIn} onAuth={openAuth} onLogout={handleLogout} />}
      {currentPage === 'events' && <EventsPage setPage={handlePageChange} isLoggedIn={isLoggedIn} onAuth={openAuth} onLogout={handleLogout} />}
      {currentPage === 'pitch-fire-register' && <PitchFireRegistration setPage={handlePageChange} user={user} />}
      {currentPage === 'profile' && <UserProfile setPage={handlePageChange} user={user} />}
      {currentPage === 'welcome' && <WelcomePage setPage={handlePageChange} user={user} />}
      
      <AuthModal isOpen={showAuthModal} initialMode={authMode} onClose={() => setShowAuthModal(false)} />
      
      <AnimatePresence>
        {verifiedMessage && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            style={{ position: 'fixed', top: '2rem', left: '50%', x: '-50%', zIndex: 10000, background: '#34d399', color: 'black', border: '4px solid black', padding: '1rem 2rem', borderRadius: '12px', fontWeight: '900', boxShadow: '6px 6px 0px black', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ background: 'white', borderRadius: '50%', padding: '0.25rem' }}>✅</div>
            EMAIL VERIFIED! WELCOME TO BARTR.IN 🚀
          </motion.div>
        )}
      </AnimatePresence>

      {currentPage !== 'pitch-fire-register' && currentPage !== 'welcome' && <Footer setPage={handlePageChange} />}
    </>
  )
}

// --- UNIQUE MOSAIC B-LETTER LOADER ---
const PageLoader = () => {
  const bMap = [
    1, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 0
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[20000] flex flex-col items-center justify-center backdrop-blur-md bg-white/5"
    >
      <div className="grid grid-cols-5 gap-1">
        {bMap.map((active, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={active ? { 
              scale: 1, 
              opacity: 1,
              backgroundColor: ['#ef4444', '#000', '#ef4444'],
            } : { 
              scale: 0.2, 
              opacity: 0.05 
            }}
            transition={{
              duration: 0.3,
              delay: (i % 5) * 0.03 + Math.floor(i / 5) * 0.03,
              backgroundColor: { repeat: Infinity, duration: 1.5, delay: i * 0.05 }
            }}
            className="w-2.5 h-2.5 rounded-[2px]"
            style={{ filter: active ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))' : 'none' }}
          />
        ))}
      </div>
      
      <motion.span 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-[8px] font-black uppercase tracking-[0.8em] mt-6 text-black/40 italic"
      >
        Hustling
      </motion.span>
    </motion.div>
  );
};

// --- PROFESSIONAL WELCOME PAGE ---
const WelcomePage = ({ setPage, user }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata?.full_name || user.email.split('@')[0]);
    }

    // Automatically redirect to home after 5 seconds
    const timer = setTimeout(() => {
      window.history.replaceState(null, null, window.location.pathname);
      setPage('home');
      // Dispatch custom event to open login modal in App
      window.dispatchEvent(new CustomEvent('openLoginModal'));
    }, 5000);
    return () => clearTimeout(timer);
  }, [setPage, user]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
         <TracingBackground />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[48px] p-10 md:p-16 text-center shadow-premium relative z-10 w-full max-w-xl flex flex-col items-center"
      >
        <motion.div 
          whileHover={{ scale: 1.02, rotate: -1 }} 
          className="brand cursor-pointer flex items-center bg-brand-red px-6 py-3 rounded-2xl shadow-neo mb-10"
        >
          <span className="text-white text-3xl font-black tracking-tight font-['Space_Grotesk']">Bartr.in</span>
        </motion.div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 md:w-32 md:h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.4)]"
        >
          <CheckCircle size={64} className="text-white" strokeWidth={3} />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4 uppercase">
          Welcome, <br/><span className="text-emerald-400">{userName}!</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 font-bold mb-10 leading-tight">
          You are officially <span className="text-white">verified.</span> <br/> Nagpur's biggest opportunity hub is waiting.
        </p>

        {/* Countdown Progress */}
        <div className="relative w-full h-3 bg-white/5 rounded-full mb-4 overflow-hidden">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400"
          />
        </div>
        <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">Redirecting to Login...</p>
      </motion.div>
    </div>
  );
};


// --- USER PROFILE PAGE ---
const UserProfile = ({ setPage, user }) => {
  const [profile, setProfile] = useState({ full_name: '', phone: '', bio: '', location: '', skills: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setPage('home');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
    if (data) {
      setProfile({
        full_name: data.full_name || '',
        phone: data.phone || '',
        bio: data.bio || '',
        location: data.location || '',
        skills: data.skills ? data.skills.join(', ') : ''
      });
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const skillsArray = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
    
    const { error } = await supabase.from('user_profiles').upsert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      bio: profile.bio,
      location: profile.location,
      skills: skillsArray,
      updated_at: new Date()
    });

    if (!error) setIsEditing(false);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPage('home');
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900' }}>LOADING PROFILE...</div>;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#f8fafc', paddingBottom: '4rem', overflow: 'hidden' }}>
      
      {/* Background Floaters */}
      <FloatingIconsBackground />

      {/* BACKGROUND MOVING TEXT MARQUEE */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden', opacity: 0.1 }}>
          <motion.div 
            animate={{ x: [-2000, 0] }} 
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }} 
            style={{ fontSize: '20rem', fontWeight: 900, color: '#3b82f6', whiteSpace: 'nowrap', lineHeight: 1, marginTop: '20vh' }}
          >
            YOUR BARTR PROFILE • YOUR BARTR PROFILE • YOUR BARTR PROFILE
          </motion.div>
          <motion.div 
            animate={{ x: [0, -2000] }} 
            transition={{ repeat: Infinity, duration: 35, ease: 'linear' }} 
            style={{ fontSize: '20rem', fontWeight: 900, color: '#10b981', whiteSpace: 'nowrap', lineHeight: 1 }}
          >
            NAGPUR STARTUPS • NAGPUR STARTUPS • NAGPUR STARTUPS
          </motion.div>
      </div>

      <Navbar scrolled={scrolled} setPage={setPage} isDark={false} isLoggedIn={!!user} onLogout={handleLogout} />

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '150px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>My Profile</h1>
          {!isEditing && (
            <motion.button 
              onClick={() => setIsEditing(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'black', color: 'white', border: '3px solid black', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '4px 4px 0px #ef4444' }}
            >
              <Edit2 size={20} /> EDIT PROFILE
            </motion.button>
          )}
        </div>

        <div style={{ background: 'white', border: '6px solid black', borderRadius: '24px', padding: '3rem', boxShadow: '20px 20px 0px black', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: '-40px', left: '3rem', width: '120px', height: '120px', borderRadius: '50%', background: '#3b82f6', border: '6px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '8px 8px 0px black' }}>
             <User size={60} color="white" />
          </div>

          <div style={{ marginTop: '4rem' }}>
            {isEditing ? (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Full Name</label>
                  <input required value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} style={{ width: '100%', padding: '1rem', border: '3px solid black', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Phone Number</label>
                  <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} style={{ width: '100%', padding: '1rem', border: '3px solid black', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Location (e.g., Wardha Road, Nagpur)</label>
                  <input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} style={{ width: '100%', padding: '1rem', border: '3px solid black', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Bio / What do you do?</label>
                  <textarea rows="4" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} style={{ width: '100%', padding: '1rem', border: '3px solid black', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Skills (comma separated)</label>
                  <input placeholder="React, Graphic Design, Sales..." value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} style={{ width: '100%', padding: '1rem', border: '3px solid black', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <motion.button type="button" onClick={() => setIsEditing(false)} whileHover={{ scale: 1.05 }} style={{ flex: 1, background: '#f1f5f9', border: '3px solid black', padding: '1rem', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>CANCEL</motion.button>
                  <motion.button type="submit" whileHover={{ scale: 1.05 }} style={{ flex: 2, background: '#34d399', color: 'black', border: '3px solid black', padding: '1rem', borderRadius: '12px', fontWeight: '900', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <Save size={20} /> SAVE PROFILE
                  </motion.button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>{profile.full_name || 'Anonymous User'}</h2>
                  <p style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 'bold', margin: '0.5rem 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={20} /> {user.email}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '3px solid black' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase' }}><MapPin size={18} /> Location</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{profile.location || 'Not specified'}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '3px solid black' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase' }}><Briefcase size={18} /> Phone Number</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{profile.phone || 'Not specified'}</div>
                  </div>
                </div>

                <div style={{ background: '#fef3c7', padding: '2rem', borderRadius: '16px', border: '3px solid black' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase' }}><FileText size={18} /> About Me</div>
                   <p style={{ fontSize: '1.25rem', fontWeight: '600', lineHeight: 1.6, margin: 0 }}>{profile.bio || 'This user prefers to keep an air of mystery.'}</p>
                </div>

                {profile.skills && (
                  <div>
                    <h3 style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem' }}>Superpowers</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {profile.skills.split(',').map((s, i) => (
                        <span key={i} style={{ background: 'black', color: 'white', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: '800', border: '2px solid black' }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const AuthModal = ({ isOpen, initialMode, onClose }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // New state for signup success
  
  useEffect(() => {
    setIsLogin(initialMode === 'login');
    setError(null);
    setShowSuccess(false);
  }, [initialMode, isOpen]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { 
              full_name: fullName,
              phone: phone
            }
          }
        });
        if (error) throw error;
        
        // Send custom welcome email via backend
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, fullName })
        }).catch(err => console.error("Welcome email failed:", err));

        setShowSuccess(true); // Show the success UI
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) setError(error.message);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 30, rotate: -1 }} 
          animate={{ scale: 1, y: 0, rotate: 0 }} 
          exit={{ scale: 0.9, y: 30 }}
          className="bg-white border-[8px] border-black rounded-[40px] w-full max-w-[480px] relative overflow-hidden shadow-[16px_16px_0px_rgba(0,0,0,1)]"
          onClick={e => e.stopPropagation()}
        >
          {showSuccess ? (
            <div className="p-12 text-center">
               <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-8"
               >
                 📩
               </motion.div>
               <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">Check Yo Mail!</h2>
               <p className="font-bold text-slate-500 text-lg mb-10 leading-tight">We sent a magic link to <span className="text-black underline">{email}</span>. Activate it to start the hustle.</p>
               <motion.button 
                 onClick={() => { setShowSuccess(false); setIsLogin(true); }}
                 whileHover={{ scale: 1.05, y: -5 }} 
                 whileTap={{ scale: 0.95 }}
                 className="w-full bg-brand-red text-white border-4 border-black py-5 rounded-2xl font-black text-2xl shadow-neo uppercase italic tracking-widest"
               >
                 Back to Login
               </motion.button>
            </div>
          ) : (
            <>
              {/* Vibrant Header */}
              <div className={`p-8 border-b-[6px] border-black relative transition-colors duration-500 ${isLogin ? 'bg-indigo-500' : 'bg-rose-500'}`}>
                 <motion.div 
                    whileHover={{ scale: 1.1, rotate: 2 }} 
                    className="bg-white border-4 border-black px-4 py-1.5 rounded-xl shadow-[6px_6px_0px_black] w-fit mb-6"
                  >
                    <span className="text-black text-xl font-black tracking-tight font-['Space_Grotesk'] italic">Bartr.in</span>
                 </motion.div>
                 
                 <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-2">
                   {isLogin ? 'Welcome Back, Legend' : 'Join the Hustle'}
                 </h2>
                 <p className="text-white font-black opacity-90 uppercase tracking-widest text-xs">
                   {isLogin ? 'Nagpur is waiting for you' : 'Start building your future today'}
                 </p>
                 
                 <motion.button 
                    whileHover={{ rotate: 90, scale: 1.1 }} 
                    onClick={onClose} 
                    className="absolute top-6 right-6 bg-black text-white p-2 rounded-xl border-4 border-white shadow-lg"
                  >
                    <X size={20} strokeWidth={3} />
                 </motion.button>
              </div>

              <div className="p-8 md:p-10 space-y-6">
                 {error && (
                   <div className="bg-rose-100 border-4 border-rose-500 p-4 rounded-xl flex items-center gap-3 animate-shake">
                     <AlertCircle className="text-rose-600" />
                     <p className="text-rose-900 font-black text-sm uppercase italic">{error}</p>
                   </div>
                 )}

                 <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Your Boss Name"
                          className="w-full bg-slate-50 border-4 border-black p-4 rounded-2xl font-bold text-lg focus:bg-white focus:shadow-[4px_4px_0px_black] transition-all outline-none"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="you@hustle.com"
                        className="w-full bg-slate-50 border-4 border-black p-4 rounded-2xl font-bold text-lg focus:bg-white focus:shadow-[4px_4px_0px_black] transition-all outline-none"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-4 border-black p-4 rounded-2xl font-bold text-lg focus:bg-white focus:shadow-[4px_4px_0px_black] transition-all outline-none"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <motion.button 
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98, y: 0 }}
                      className={`w-full py-5 rounded-2xl font-black text-2xl border-4 border-black shadow-[8px_8px_0px_black] uppercase italic tracking-widest transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-black text-white hover:bg-slate-900'}`}
                    >
                      {loading ? 'Hustling...' : isLogin ? 'Let\'s Gooo' : 'Start Now'}
                    </motion.button>
                 </form>

                 <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t-4 border-black/10"></div>
                    <span className="flex-shrink mx-4 text-slate-400 font-black text-xs uppercase tracking-widest">OR</span>
                    <div className="flex-grow border-t-4 border-black/10"></div>
                 </div>

                 <motion.button 
                   onClick={handleGoogleLogin}
                   whileHover={{ scale: 1.02, y: -4 }}
                   whileTap={{ scale: 0.98, y: 0 }}
                   className="w-full bg-white border-4 border-black py-4 rounded-2xl flex items-center justify-center gap-4 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-[8px_8px_0px_black] transition-all"
                 >
                   <img src="https://www.gstatic.com/lamda/images/google_favicon_v2.svg" className="w-6 h-6" alt="G" />
                   <span className="font-black text-xl uppercase italic">Continue with Google</span>
                 </motion.button>

                 <div className="text-center pt-4">
                    <button 
                      onClick={() => setIsLogin(!isLogin)} 
                      className="text-slate-500 font-black uppercase tracking-widest text-xs hover:text-black hover:underline underline-offset-4"
                    >
                      {isLogin ? 'New to the hub? Create account' : 'Already a legend? Login here'}
                    </button>
                 </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


const Footer = ({ setPage }) => {
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 overflow-hidden relative">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <motion.div 
              whileHover={{ scale: 1.02, rotate: -1 }} 
              className="brand cursor-pointer flex items-center bg-brand-red px-5 py-2 rounded-xl shadow-neo w-fit"
              onClick={() => setPage('home')}
            >
              <span className="text-white text-2xl font-black tracking-tight font-['Space_Grotesk']">Bartr.in</span>
            </motion.div>
            <p className="text-slate-400 font-bold leading-relaxed text-lg">
              Nagpur's premiere hyperlocal platform. Connecting the city's talent with immediate local needs through transparency and technology.
            </p>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Live in Nagpur</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-8">Platform</h4>
            <ul className="space-y-5">
              {[
                { name: 'Browse Gigs', page: 'gigs' },
                { name: 'Nagpur Events', page: 'events' },
                { name: 'Careers', page: 'careers' },
                { name: 'TRI Score', page: 'tri-score' }
              ].map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 8, color: '#ef4444' }}
                  className="text-slate-400 font-bold cursor-pointer transition-colors"
                  onClick={() => setPage(link.page)}
                >
                  {link.name}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-8">Support</h4>
            <ul className="space-y-5">
              {[
                'Terms of Service',
                'Privacy Policy',
                'Safety Center',
                'Business Solutions'
              ].map((link) => (
                <motion.li 
                  key={link}
                  whileHover={{ x: 8, color: '#ef4444' }}
                  className="text-slate-400 font-bold cursor-pointer transition-colors"
                >
                  {link}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-8">Connect</h4>
            <div className="space-y-4">
              <a href="mailto:communication@bartr.in" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                <div className="bg-white/5 p-2 rounded-lg group-hover:bg-brand-red/10 transition-colors"><Mail size={18} /></div>
                <span className="font-bold">communication@bartr.in</span>
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="bg-white/5 p-2 rounded-lg"><MapPin size={18} /></div>
                <span className="font-bold">Nagpur, Maharashtra</span>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              {[Users, ShieldCheck, Globe].map((Icon, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5, backgroundColor: '#ef4444', borderColor: '#000' }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer transition-all shadow-crystal"
                >
                  <Icon size={20} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 font-bold text-sm">
            © 2026 Bartr Platform. All rights reserved. Built for <span className="text-white">Nagpur.</span>
          </p>
          <div className="flex items-center gap-8">
            <motion.a whileHover={{ color: 'white' }} href="#" className="text-slate-500 font-black text-xs uppercase tracking-widest transition-colors">Instagram</motion.a>
            <motion.a whileHover={{ color: 'white' }} href="#" className="text-slate-500 font-black text-xs uppercase tracking-widest transition-colors">LinkedIn</motion.a>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <span className="text-slate-500 font-bold text-sm">v1.0.4 Premium</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- LANDING PAGE ---
function LandingPage({ setPage, isLoggedIn, onAuth, onLogout }) {
  const [scrolled, setScrolled] = useState(false);

  // Scroll Parallax Hooks
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.4]);
  const bgRotate = useTransform(scrollY, [0, 1000], [0, 15]);

  // Roadmap Hooks
  const roadmapRef = useRef(null);
  const { scrollYProgress: roadmapProgress } = useScroll({
    target: roadmapRef,
    offset: ["start center", "end center"]
  });
  const lineHeight = useTransform(roadmapProgress, [0, 1], ["0%", "100%"]);
  const lineWidth = useTransform(roadmapProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Landing page main container */}
      <Navbar scrolled={scrolled} setPage={setPage} isDark={false} isLoggedIn={isLoggedIn} onAuth={onAuth} onLogout={onLogout} currentPage="home" />
      <section className="hero relative overflow-hidden w-full min-h-screen flex items-center pt-[180px] md:pt-[120px] pb-20">
        <div className="absolute inset-0 z-0">
           <TracingBackground />
        </div>
        
        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent z-[1] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerCards}
            className="w-full max-w-[950px]"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red border border-brand-red/20 px-5 py-2.5 rounded-full font-black text-sm mb-8 shadow-crystal animate-pulse-slow">
              <MapPin size={18} className="animate-bounce" />
              Showing opportunities from Nagpur
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-[clamp(3rem,12vw,9rem)] font-black leading-[0.8] tracking-tighter mb-2 text-slate-900 filter drop-shadow-sm">
               Post what you <span className="text-brand-red">need.</span>
            </motion.h1>
            
            <motion.h1 variants={fadeInUp} className="text-[clamp(2rem,8vw,6rem)] font-black leading-[0.8] tracking-tight text-slate-800 mb-8 opacity-90">
              Find work near you.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-3xl text-slate-600 font-medium leading-relaxed max-w-[750px] mb-10 opacity-80 px-1 md:px-0">
              Bartr is Nagpur's hyperlocal platform for workers, businesses, and individuals to exchange services, gigs, and opportunities — instantly and transparently.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5">
              <motion.button whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }} className="bg-brand-red text-white border-2 border-slate-900 px-10 py-5 rounded-2xl font-black text-xl shadow-neo uppercase tracking-wide transition-all">
                Get Started
              </motion.button>
              <motion.button whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }} className="bg-white text-black border-2 border-slate-900 px-10 py-5 rounded-2xl font-black text-xl shadow-neo uppercase tracking-wide transition-all hover:bg-slate-50">
                Browse Nearby
              </motion.button>
            </motion.div>

          </motion.div>
        </div>
      </section>



      <div className="marquee-container" style={{ position: 'relative', zIndex: 11 }}>
        <div className="marquee-content" style={{ background: 'linear-gradient(90deg, var(--brand-red), #ff8a00)' }}>
           <span>• HYPERLOCAL SERVICES</span>
           <span>• VERIFIED PROFILES</span>
           <span>• INSTANT CONNECTIONS</span>
           <span>• AI MODERATION</span>
           <span>• NAGPUR FIRST</span>
           <span>• CITY WIDE EXPOSURE</span>
           <span>• SECURE PLATFORM</span>
           <span>• NO SPAM</span>
           {/* Duplicate for seamless scrolling */}
           <span>• HYPERLOCAL SERVICES</span>
           <span>• VERIFIED PROFILES</span>
           <span>• INSTANT CONNECTIONS</span>
           <span>• AI MODERATION</span>
           <span>• NAGPUR FIRST</span>
           <span>• CITY WIDE EXPOSURE</span>
           <span>• SECURE PLATFORM</span>
           <span>• NO SPAM</span>
        </div>
      </div>

      <section id="how-it-works" ref={roadmapRef} className="section section-bg-alt relative py-24 md:py-32 overflow-hidden">
        <FloatingIconsBackground />
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }} 
             whileInView={{ opacity: 1, scale: 1 }} 
             viewport={{ once: true }} 
             transition={{ duration: 0.5 }}
             className="section-header"
          >
            <span className="section-tag">Smooth Process</span>
            <h2 className="section-title" style={{ 
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--brand-red) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>The Bartr Journey</h2>
            <p className="section-subtitle">How we connect your needs with local talent instantly.</p>
          </motion.div>
          
          <div className="roadmap-container">
             {/* Desktop Horizontal Line */}
             <div className="desktop-line-container">
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--border-color)', borderRadius: '4px' }} />
                <motion.div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'linear-gradient(to right, var(--brand-red), #ff8a00)', width: lineWidth, borderRadius: '4px', zIndex: 1 }} />
             </div>

             {/* Mobile Vertical Line */}
             <div className="mobile-line-container">
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--border-color)', borderRadius: '4px' }} />
                <motion.div style={{ position: 'absolute', left: 0, top: 0, width: '100%', background: 'linear-gradient(to bottom, var(--brand-red), #ff8a00)', height: lineHeight, borderRadius: '4px', zIndex: 1 }} />
             </div>
             
             {/* Step 1 */}
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ type: "spring", bounce: 0.4 }}
               className="roadmap-step"
             >
                <h3 style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', marginBottom: '1rem' }}>1. Post Any Service Needed</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '2rem' }}>From plumbing to programming, repairing to designing. Post exactly what you need in under a minute without long forms.</p>
                <div className="roadmap-icons" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                   <motion.div whileHover={{ scale: 1.1, y: -5, color: '#f59e0b' }} className="modern-card" style={{ padding: '1rem', borderRadius: '16px' }}><Wrench size={24} /></motion.div>
                   <motion.div whileHover={{ scale: 1.1, y: -5, color: '#3b82f6' }} className="modern-card" style={{ padding: '1rem', borderRadius: '16px' }}><Code size={24} /></motion.div>
                   <motion.div whileHover={{ scale: 1.1, y: -5, color: '#10b981' }} className="modern-card" style={{ padding: '1rem', borderRadius: '16px' }}><Paintbrush size={24} /></motion.div>
                   <motion.div whileHover={{ scale: 1.1, y: -5, color: '#ec4899' }} className="modern-card" style={{ padding: '1rem', borderRadius: '16px' }}><Scissors size={24} /></motion.div>
                   <motion.div whileHover={{ scale: 1.1, y: -5, color: '#8b5cf6' }} className="modern-card" style={{ padding: '1rem', borderRadius: '16px' }}><Camera size={24} /></motion.div>
                   <motion.div whileHover={{ scale: 1.1, y: -5, color: '#ef4444' }} className="modern-card" style={{ padding: '1rem', borderRadius: '16px' }}><Music size={24} /></motion.div>
                   <motion.div whileHover={{ scale: 1.1, y: -5, color: '#0f172a' }} className="modern-card" style={{ padding: '1rem', borderRadius: '16px' }}><Briefcase size={24} /></motion.div>
                </div>
             </motion.div>

             {/* Step 2 */}
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ type: "spring", bounce: 0.4 }}
               className="roadmap-step"
             >
                <h3 style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', marginBottom: '1rem' }}>2. AI Radar Matching</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '2rem' }}>Our AI scans your neighborhood instantly (within a 5km radius) to alert highly skilled and relevant local pros via push notifications.</p>
                <motion.div 
                   animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 0 0 rgba(239,68,68,0)', '0 0 0 20px rgba(239,68,68,0.1)', '0 0 0 40px rgba(239,68,68,0)'] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="modern-card" style={{ padding: '2rem', borderRadius: '50%', display: 'inline-flex', background: 'var(--brand-red-light)', color: 'var(--brand-red)', border: 'none' }}
                >
                   <Search size={48} />
                </motion.div>
             </motion.div>

             {/* Step 3 */}
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ type: "spring", bounce: 0.4 }}
               className="roadmap-step"
             >
                <h3 style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', marginBottom: '1rem' }}>3. Direct Connection</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '2rem' }}>Chat securely, agree on price, and get the job done quickly. No middlemen holding your money hostage.</p>
                <motion.div whileHover={{ scale: 1.05 }} className="modern-card" style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '24px', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg, var(--brand-red) 0%, #ff8a00 100%)', color: 'white', border: 'none' }}>
                   <div style={{ background: 'white', color: 'var(--brand-red)', padding: '0.5rem', borderRadius: '12px' }}><MessageSquare size={24} /></div>
                   <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>"I can be there in 10 mins!"</span>
                </motion.div>
             </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container grid-2">
          <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={staggerCards}
          >
            <motion.span variants={fadeInUp} className="section-tag">Core Value</motion.span>
            <motion.h2 variants={fadeInUp} className="section-title" style={{ 
                background: 'linear-gradient(135deg, var(--brand-red) 0%, #ff8a00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>Hyperlocal by Design</motion.h2>
            
            <ul className="check-list" style={{ marginTop: '2rem' }}>
              <motion.li variants={fadeInUp} whileHover={{ x: 15, color: 'var(--brand-red)' }}>
                <div className="check-icon"><MapPin size={24} /></div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>City-first approach</h4>
                  <span style={{ fontSize: '1.125rem' }}>Starting with Nagpur, focusing on local demand.</span>
                </div>
              </motion.li>
              <motion.li variants={fadeInUp} whileHover={{ x: 15, color: 'var(--brand-red)' }} style={{ margin: '2rem 0' }}>
                <div className="check-icon"><Users size={24} /></div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Nearby users first</h4>
                  <span style={{ fontSize: '1.125rem' }}>No global spam. Connect with your neighborhood.</span>
                </div>
              </motion.li>
              <motion.li variants={fadeInUp} whileHover={{ x: 15, color: 'var(--brand-red)' }}>
                <div className="check-icon"><ShieldCheck size={24} /></div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Trust & Safety Built-In</h4>
                  <span style={{ fontSize: '1.125rem' }}>AI moderation & verified users for a safe ecosystem.</span>
                </div>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
             whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 60, damping: 15 }}
             style={{ position: 'relative' }}
          >
             <motion.div 
                 animate="animate" 
                 variants={floatAnim}
                 style={{ background: 'linear-gradient(135deg, var(--brand-red) 0%, #ff8a00 100%)', borderRadius: '32px', padding: '1rem' }}
             >
                <div style={{ background: 'white', borderRadius: '24px', padding: 'clamp(1.5rem, 8vw, 3rem)', transform: 'rotate(-4deg)', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                   <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--brand-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-red)' }}>
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><MessageSquare size={28} /></motion.div>
                      </div>
                      <div>
                          <h4 style={{ fontSize: '1.25rem' }}>Need a Plumber!</h4>
                          <p style={{ color: 'var(--brand-red)' }}>0.5km away • High Priority</p>
                      </div>
                   </motion.div>
                   <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                          <Users size={28} />
                      </div>
                      <div>
                          <h4 style={{ fontSize: '1.25rem' }}>Freelance Web Dev</h4>
                          <p style={{ color: 'var(--text-secondary)' }}>1.2km away • Applied 2m ago</p>
                      </div>
                   </motion.div>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="pricing" className="section relative overflow-hidden bg-slate-50/50 py-24 md:py-32">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
             initial={{ opacity: 0, y: -20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
              <TrendingUp size={14} /> Hyper-Growth Platform
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Boost Your <span className="text-brand-red">Reach.</span></h2>
            <p className="text-lg md:text-xl text-slate-500 font-bold max-w-2xl mx-auto">Get noticed faster with featured posts. Stand out at the top of local feeds with precision placement.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerCards}
          >
            {/* Tier 1: City Top */}
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -8 }} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 md:p-10 flex flex-col shadow-crystal transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-800 mb-2">City Top</h3>
                <p className="text-slate-500 font-bold">Essential priority visibility</p>
              </div>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">₹79</span>
                <span className="text-slate-400 font-black text-lg">/post</span>
              </div>
              
              <div className="space-y-4 flex-grow mb-10">
                {[
                  'Priority category feed',
                  '24 hours live duration',
                  'Featured "Top" badge',
                  'Real-time view stats'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-indigo-50 text-indigo-600 p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>
                    <span className="text-slate-600 font-bold text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-white text-black border-4 border-black py-4 rounded-2xl font-black text-lg shadow-neo hover:bg-slate-50 transition-all uppercase tracking-wide">
                Get City Top
              </button>
            </motion.div>

            {/* Tier 2: Premium Boost (Featured) */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ scale: 1.05, y: -10 }} 
              className="relative bg-gradient-to-br from-brand-red to-orange-500 rounded-[32px] p-8 md:p-10 flex flex-col text-white shadow-premium scale-100 lg:scale-105 border-4 border-black ring-4 ring-orange-500/20"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }} 
                transition={{ repeat: Infinity, duration: 3 }} 
                className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full font-black text-xs tracking-widest border-2 border-white shadow-xl"
              >
                MOST POPULAR
              </motion.div>
              
              <div className="mb-8 mt-4">
                <h3 className="text-2xl font-black mb-2">Premium Boost</h3>
                <p className="text-white/80 font-bold">Maximum market exposure</p>
              </div>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-black tracking-tighter">₹399</span>
                <span className="text-white/70 font-black text-lg">/week</span>
              </div>
              
              <div className="space-y-4 flex-grow mb-10">
                {[
                  'Highlighted visual UI',
                  'City-wide top placement',
                  '7 days live duration',
                  'Priority algorithm push',
                  'Dedicated support'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-white text-brand-red p-1 rounded-full shadow-sm"><Check size={14} strokeWidth={3} /></div>
                    <span className="text-white font-bold text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-white text-brand-red border-4 border-black py-4 rounded-2xl font-black text-lg shadow-neo hover:bg-slate-50 transition-all uppercase tracking-wide">
                Choose Premium
              </button>
            </motion.div>

            {/* Tier 3: Business */}
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -8 }} className="bg-slate-900 rounded-[32px] p-8 md:p-10 flex flex-col text-white shadow-2xl border border-slate-800 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-white mb-2">Business</h3>
                <p className="text-slate-400 font-bold">Enterprise-level reach</p>
              </div>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-black text-white tracking-tighter">₹1.4k</span>
                <span className="text-slate-500 font-black text-lg">/mo</span>
              </div>
              
              <div className="space-y-4 flex-grow mb-10">
                {[
                  'Unlimited featured posts',
                  'Advanced analytics hub',
                  'Verified Business Badge',
                  'Bulk posting tools',
                  'Custom growth strategy'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>
                    <span className="text-slate-300 font-bold text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-white text-slate-900 border-4 border-black py-4 rounded-2xl font-black text-lg shadow-neo hover:bg-slate-50 transition-all uppercase tracking-wide">
                Contact Sales
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>


      <section id="testimonials" className="section relative py-24 md:py-32 overflow-hidden bg-slate-50/30">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div 
             initial={{ opacity: 0, y: -20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-rose-100 shadow-sm">
               Real Stories
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">What Nagpur is <span className="text-brand-red">Saying.</span></h2>
            <p className="text-lg md:text-xl text-slate-500 font-bold max-w-2xl mx-auto">Join thousands of local professionals who have transformed their work-life balance on Bartr.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerCards}
          >
             {[
               { quote: "I posted once and got 3 calls in 15 minutes. Much faster and direct than any other app.", author: "Local Freelancer" },
               { quote: "Much better than WhatsApp groups. Cleaner, faster, and actually shows relevant people nearby.", author: "Small Business Owner" },
               { quote: "Feels local and real, not like those massive job portals. Found a great gig a few blocks away.", author: "Individual User" }
             ].map((t, i) => (
               <motion.div 
                 key={i}
                 variants={fadeInUp}
                 whileHover={{ scale: 1.02, y: -5 }}
                 className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 md:p-10 shadow-crystal relative group"
               >
                  <div className="text-brand-red mb-6 opacity-30 group-hover:opacity-100 transition-opacity"><Quote size={40} fill="currentColor" /></div>
                  <p className="text-lg md:text-xl font-bold text-slate-700 italic mb-8 relative z-10 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-brand-red/20 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-brand-red/10 to-orange-500/10" />
                      </div>
                      <div>
                          <h4 className="font-black text-slate-900 leading-none mb-1">{t.author}</h4>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nagpur, India</span>
                      </div>
                  </div>
               </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

      <section className="section relative py-24 md:py-40 overflow-hidden bg-gradient-to-br from-brand-red to-orange-500 text-white text-center">
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.15 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at center, white 2px, transparent 2px)', backgroundSize: '60px 60px', transform: 'rotate(20deg)' }}
        />
        <div className="container mx-auto px-6 md:px-8 relative z-10">
           <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 30 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 100 }}
           >
             <h2 className="text-white text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">Ready to get <br className="hidden md:block" /><span className="text-black/20">started?</span></h2>
             <p className="text-xl md:text-2xl text-white/90 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
               Join Nagpur's fastest growing community of workers, businesses, and opportunity seekers.
             </p>
             <motion.button 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.95 }} 
                className="bg-white text-brand-red border-4 border-black px-12 py-6 rounded-2xl font-black text-2xl shadow-neo uppercase tracking-widest transition-all"
             >
               Join Bartr Now
             </motion.button>
           </motion.div>
        </div>
      </section>

    </motion.div>
  );
}


