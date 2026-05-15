import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, MapPin, Menu, X, ChevronDown, CheckCircle, Loader2 } from "lucide-react";

import heroImg from "../assets/hero-community.png";
import constructionImg from "../assets/youthbuild-construction.png";
import counselingImg from "../assets/housing-counseling.png";

/* ─── Static data (computed once, never in render) ─── */
const PARTICLES = [
  { id:0,  size:2, left:5,  bot:8,  dist:140, dur:3.5, delay:0.0 },
  { id:1,  size:3, left:12, bot:15, dist:190, dur:2.8, delay:1.2 },
  { id:2,  size:1, left:19, bot:10, dist:130, dur:4.2, delay:0.5 },
  { id:3,  size:3, left:26, bot:20, dist:200, dur:3.1, delay:2.0 },
  { id:4,  size:2, left:33, bot:7,  dist:160, dur:2.5, delay:0.8 },
  { id:5,  size:4, left:40, bot:18, dist:220, dur:3.8, delay:1.6 },
  { id:6,  size:2, left:47, bot:12, dist:145, dur:4.5, delay:3.0 },
  { id:7,  size:3, left:54, bot:25, dist:175, dur:2.9, delay:0.3 },
  { id:8,  size:1, left:61, bot:6,  dist:155, dur:3.6, delay:1.8 },
  { id:9,  size:2, left:68, bot:14, dist:210, dur:2.6, delay:0.7 },
  { id:10, size:3, left:75, bot:22, dist:170, dur:4.1, delay:2.4 },
  { id:11, size:2, left:82, bot:9,  dist:135, dur:3.3, delay:1.1 },
  { id:12, size:1, left:88, bot:17, dist:195, dur:2.7, delay:0.4 },
  { id:13, size:3, left:93, bot:11, dist:150, dur:4.4, delay:2.8 },
  { id:14, size:2, left:8,  bot:28, dist:180, dur:3.0, delay:1.5 },
  { id:15, size:4, left:23, bot:5,  dist:225, dur:2.4, delay:0.9 },
  { id:16, size:2, left:37, bot:32, dist:165, dur:3.9, delay:2.2 },
  { id:17, size:1, left:51, bot:13, dist:125, dur:4.3, delay:0.6 },
  { id:18, size:3, left:64, bot:27, dist:185, dur:2.8, delay:1.9 },
  { id:19, size:2, left:78, bot:19, dist:215, dur:3.4, delay:3.2 },
];

const TESTIMONIALS = [
  {
    quote: "YouthBuild completely changed the trajectory of my life. I went from not knowing what I wanted to do to having a real career in construction. GJA believed in me before I believed in myself.",
    name: "Marcus T.",
    role: "YouthBuild Graduate",
    initial: "M",
  },
  {
    quote: "Their housing counselors were patient, knowledgeable, and truly cared about our family's future. We couldn't have navigated buying our first home without the guidance of Garfield Jubilee.",
    name: "The Williams Family",
    role: "Housing Counseling Clients",
    initial: "W",
  },
  {
    quote: "The workforce development program gave me the skills and confidence to find a job I actually love. I'm grateful every single day for this organization and everyone in it.",
    name: "Jasmine R.",
    role: "Workforce Development Graduate",
    initial: "J",
  },
];

const MARQUEE_ITEMS = ["Transforming Lives", "Serving Since 1983", "Garfield Pittsburgh", "YouthBuild", "Affordable Housing", "Workforce Development", "Transforming Communities", "Faith in Action"];

/* ─── Cursor ─── */
function Cursor() {
  const dotX = useSpring(0, { stiffness: 2000, damping: 80 });
  const dotY = useSpring(0, { stiffness: 2000, damping: 80 });
  const ringX = useSpring(0, { stiffness: 180, damping: 28 });
  const ringY = useSpring(0, { stiffness: 180, damping: 28 });
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { dotX.set(e.clientX); dotY.set(e.clientY); ringX.set(e.clientX); ringY.set(e.clientY); };
    const over = (e: MouseEvent) => setHovered(!!(e.target as HTMLElement).closest("button,a,input,textarea,select,[data-cursor]"));
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mousedown", down); window.removeEventListener("mouseup", up); };
  }, [dotX, dotY, ringX, ringY]);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[99999]">
      <motion.div style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: clicking ? 0.5 : hovered ? 0 : 1 }}
        className="absolute w-2.5 h-2.5 rounded-full bg-primary" />
      <motion.div style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: clicking ? 0.8 : hovered ? 2.4 : 1, opacity: hovered ? 0.8 : 0.35, borderColor: hovered ? "hsl(33 95% 58%)" : "hsl(33 95% 58%)" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute w-8 h-8 rounded-full border border-primary mix-blend-difference" />
    </div>
  );
}

/* ─── Ambient glow ─── */
function AmbientGlow() {
  const x = useSpring(-999, { stiffness: 60, damping: 18 });
  const y = useSpring(-999, { stiffness: 60, damping: 18 });
  useEffect(() => {
    const fn = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [x, y]);
  return (
    <motion.div className="pointer-events-none fixed z-0"
      style={{ x, y, translateX: "-50%", translateY: "-50%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, hsl(33 95% 58% / 0.055) 0%, transparent 70%)" }} />
  );
}

/* ─── Floating particles ─── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {PARTICLES.map((p) => (
        <motion.div key={p.id}
          className="absolute rounded-full bg-primary"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, bottom: `${p.bot}%` }}
          animate={{ y: [0, -p.dist], opacity: [0, 0.55, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeOut" }} />
      ))}
    </div>
  );
}

/* ─── Magnetic button ─── */
function MagButton({ children, className, onClick, type = "button" }: { children: React.ReactNode; className?: string; onClick?: () => void; type?: "button" | "submit" }) {
  const ref = useRef<HTMLButtonElement>(null);
  const bx = useSpring(0, { stiffness: 280, damping: 22 });
  const by = useSpring(0, { stiffness: 280, damping: 22 });
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    bx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    by.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  return (
    <motion.button ref={ref} style={{ x: bx, y: by }} onMouseMove={onMove} onMouseLeave={() => { bx.set(0); by.set(0); }}
      onClick={onClick} type={type} className={className}>
      {children}
    </motion.button>
  );
}

/* ─── Split text ─── */
function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split("").map((c, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 70, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, delay: delay + i * 0.027, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block" style={{ whiteSpace: c === " " ? "pre" : undefined }}>
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── 3D Tilt card ─── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    setT({ x: (ny - 0.5) * 10, y: (nx - 0.5) * -10, gx: nx * 100, gy: ny * 100 });
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setT({ x: 0, y: 0, gx: 50, gy: 50 })}
      style={{ transform: `perspective(1000px) rotateX(${t.x}deg) rotateY(${t.y}deg)`, transition: "transform 0.15s ease-out" }}
      className={`relative ${className ?? ""}`}>
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit]"
        style={{ background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, hsl(33 95% 58% / 0.09), transparent 60%)` }} />
      {children}
    </div>
  );
}

/* ─── Counter ─── */
function useCounter(target: number, d = 2000) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let v = 0; const step = target / (d / 16);
    const t = setInterval(() => { v += step; if (v >= target) { setN(target); clearInterval(t); } else setN(Math.floor(v)); }, 16);
    return () => clearInterval(t);
  }, [inView, target, d]);
  return { n, ref };
}

/* ─── Marquee ─── */
function Marquee() {
  return (
    <div className="overflow-hidden bg-primary py-4 select-none">
      <motion.div className="flex whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 34, ease: "linear", repeat: Infinity }}>
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="font-display text-2xl px-8 text-primary-foreground shrink-0">
            {item}<span className="mx-8 text-primary-foreground/25">×</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const auto = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  }, [idx]);

  useEffect(() => {
    auto.current = setInterval(() => {
      setDir(1);
      setIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => { if (auto.current) clearInterval(auto.current); };
  }, []);

  const t = TESTIMONIALS[idx];

  return (
    <section className="py-28 md:py-40 bg-card border-t border-b border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(33_95%_58%_/_0.04),transparent_70%)]" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-4">Community Voices</p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] text-foreground">TESTIMONIALS</h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={idx} custom={dir}
                initial={{ opacity: 0, x: dir * 60, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -dir * 60, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-center w-full"
              >
                <span className="font-serif text-[7rem] leading-none text-primary/20 block -mb-6 select-none">"</span>
                <p className="font-serif text-2xl md:text-3xl text-foreground/90 italic leading-[1.4] mb-10 max-w-3xl mx-auto">
                  {t.quote}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-display text-xl text-primary-foreground shrink-0">
                    {t.initial}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs tracking-wide">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => go(i)} data-testid={`testimonial-dot-${i}`}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === idx ? "2.5rem" : "1.5rem", background: i === idx ? "hsl(33 95% 58%)" : "hsl(33 95% 58% / 0.25)" }}>
                {i === idx && (
                  <motion.div className="absolute inset-y-0 left-0 bg-primary-foreground/30 origin-left"
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6, ease: "linear" }} />
                )}
              </button>
            ))}
          </div>

          {/* Arrow nav */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {[{ d: -1, label: "←" }, { d: 1, label: "→" }].map(({ d, label }) => (
              <button key={d} onClick={() => go((idx + d + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-10 h-10 border border-border/50 flex items-center justify-center text-muted-foreground hover:border-primary/60 hover:text-primary transition-all duration-200 font-mono text-sm">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact form ─── */
type FormState = "idle" | "sending" | "success" | "error";

function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setTimeout(() => setState("success"), 1800);
  };

  const fields: { key: string; label: string; type?: string; span?: boolean }[] = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email Address", type: "email" },
    { key: "phone", label: "Phone (optional)", type: "tel" },
  ];

  if (state === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center py-20 text-center gap-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}>
          <CheckCircle className="h-16 w-16 text-primary" />
        </motion.div>
        <h3 className="font-display text-4xl text-foreground">Message Sent!</h3>
        <p className="text-muted-foreground max-w-sm leading-relaxed">Thank you for reaching out. The Garfield Jubilee team will get back to you within 1-2 business days.</p>
        <button onClick={() => { setState("idle"); setForm({ name: "", email: "", phone: "", interest: "", message: "" }); }}
          className="mt-4 text-primary text-sm font-semibold hover:underline">
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        {fields.map(({ key, label, type = "text" }) => (
          <div key={key} className="relative">
            <motion.label animate={{ y: focused === key || form[key as keyof typeof form] ? -22 : 0, fontSize: focused === key || form[key as keyof typeof form] ? "0.65rem" : "0.875rem", color: focused === key ? "hsl(33 95% 58%)" : "hsl(30 10% 55%)" }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-3.5 font-medium pointer-events-none tracking-wide" style={{ transformOrigin: "left" }}>
              {label}
            </motion.label>
            <input type={type} value={form[key as keyof typeof form]} onChange={set(key)}
              onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
              className="w-full bg-transparent border-b border-border/50 pt-5 pb-2 text-foreground text-sm outline-none focus:border-primary transition-colors duration-300 placeholder-transparent"
              data-testid={`form-${key}`} />
            <motion.div className="absolute bottom-0 left-0 h-px bg-primary" animate={{ scaleX: focused === key ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.3 }} />
          </div>
        ))}
      </div>

      {/* Interest select */}
      <div className="relative">
        <motion.label animate={{ y: focused === "interest" || form.interest ? -22 : 0, fontSize: focused === "interest" || form.interest ? "0.65rem" : "0.875rem", color: focused === "interest" ? "hsl(33 95% 58%)" : "hsl(30 10% 55%)" }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-3.5 font-medium pointer-events-none tracking-wide">
          How can we help?
        </motion.label>
        <select value={form.interest} onChange={set("interest")} onFocus={() => setFocused("interest")} onBlur={() => setFocused(null)}
          className="w-full bg-transparent border-b border-border/50 pt-5 pb-2 text-foreground text-sm outline-none focus:border-primary transition-colors duration-300 appearance-none"
          data-testid="form-interest">
          <option value="" disabled hidden />
          <option value="general" className="bg-background">General Inquiry</option>
          <option value="youthbuild" className="bg-background">YouthBuild Application</option>
          <option value="volunteer" className="bg-background">Volunteer</option>
          <option value="donate" className="bg-background">Donate</option>
          <option value="housing" className="bg-background">Housing Services</option>
        </select>
        <motion.div className="absolute bottom-0 left-0 h-px bg-primary" animate={{ scaleX: focused === "interest" ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.3 }} />
      </div>

      {/* Message */}
      <div className="relative">
        <motion.label animate={{ y: focused === "message" || form.message ? -22 : 0, fontSize: focused === "message" || form.message ? "0.65rem" : "0.875rem", color: focused === "message" ? "hsl(33 95% 58%)" : "hsl(30 10% 55%)" }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-3.5 font-medium pointer-events-none tracking-wide">
          Your Message
        </motion.label>
        <textarea value={form.message} onChange={set("message")} rows={4}
          onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
          className="w-full bg-transparent border-b border-border/50 pt-5 pb-2 text-foreground text-sm outline-none focus:border-primary transition-colors duration-300 resize-none"
          data-testid="form-message" />
        <motion.div className="absolute bottom-0 left-0 h-px bg-primary" animate={{ scaleX: focused === "message" ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.3 }} />
      </div>

      <MagButton type="submit"
        className="group relative w-full mt-4 flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 font-bold tracking-widest uppercase text-sm overflow-hidden disabled:opacity-50"
        data-testid="form-submit">
        <span className="relative z-10 flex items-center gap-3">
          {state === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>Send Message <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
        </span>
        <div className="absolute inset-0 bg-white/12 translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-400 skew-x-[-12deg]" />
      </MagButton>
    </form>
  );
}

/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const c1983 = useCounter(1983);
  const cFam = useCounter(400);
  const cYouth = useCounter(24);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden cursor-none">
      <Cursor />
      <AmbientGlow />
      <div className="grain-overlay" aria-hidden="true" />

      {/* ─── NAV ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-background/90 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center h-16">
          <button onClick={() => scrollTo("hero")} className="font-display text-2xl tracking-widest text-foreground hover:text-primary transition-colors" data-testid="nav-logo">GJA</button>
          <div className="hidden md:flex items-center gap-10">
            {["About", "Programs", "YouthBuild", "Impact"].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} data-testid={`nav-${item.toLowerCase()}`}
                className="text-[10px] font-bold text-muted-foreground hover:text-foreground tracking-[0.25em] uppercase transition-colors">
                {item}
              </button>
            ))}
            <MagButton onClick={() => scrollTo("contact")} data-testid="nav-cta"
              className="relative group px-6 py-2.5 bg-primary text-primary-foreground text-[10px] font-black tracking-[0.3em] uppercase overflow-hidden">
              <span className="relative z-10">Get Involved</span>
              <div className="absolute inset-0 bg-white/12 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </MagButton>
          </div>
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="bg-background/95 backdrop-blur-xl border-t border-white/5 overflow-hidden md:hidden">
              <div className="container mx-auto px-6 py-6 flex flex-col gap-5">
                {["About", "Programs", "YouthBuild", "Impact", "Contact"].map((item) => (
                  <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-left text-lg font-medium text-foreground border-b border-border/25 pb-4">{item}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" ref={heroRef} className="relative h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none z-[1]">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.5, delay: 0.8 }}
            className="font-display text-[35vw] leading-none text-white/[0.022] select-none pr-2">GJA</motion.span>
        </div>
        <motion.div className="absolute inset-0 scale-110 z-0" style={{ y: heroY }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/25 to-transparent" />
        </motion.div>
        <Particles />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none z-[1]" />

        <motion.div className="relative z-10 container mx-auto px-6 md:px-12 pb-24 md:pb-32" style={{ opacity: heroOpacity }}>
          <div className="overflow-hidden mb-1">
            <SplitText text="TRANSFORMING" className="font-display text-[clamp(3.5rem,11vw,10.5rem)] leading-[0.88] text-foreground block" delay={0.1} />
          </div>
          <div className="overflow-hidden mb-10">
            <SplitText text="LIVES." className="font-display text-[clamp(3.5rem,11vw,10.5rem)] leading-[0.88] text-primary block text-glow" delay={0.4} />
          </div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8 }}
            className="text-muted-foreground text-lg max-w-md leading-relaxed font-light mb-10">
            Strengthening the communities of Garfield, East End, and the Pittsburgh region through the manifestation of the love of God.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }} className="flex flex-wrap gap-4">
            <MagButton onClick={() => scrollTo("contact")} data-testid="hero-cta-primary"
              className="group relative flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-semibold text-sm tracking-wide overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">Get Involved <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 bg-white/15 translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-300 skew-x-[-12deg]" />
            </MagButton>
            <button onClick={() => scrollTo("about")} data-testid="hero-cta-secondary"
              className="flex items-center gap-3 border border-white/14 text-white/65 px-8 py-4 text-sm font-medium hover:border-primary/55 hover:text-primary transition-all duration-300">
              Our Story <ChevronDown className="h-4 w-4" />
            </button>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="mt-6 text-[10px] tracking-[0.38em] uppercase text-muted-foreground/35">Pittsburgh · Since 1983</motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          className="absolute bottom-8 right-12 hidden md:flex flex-col items-center gap-3 z-10">
          <span className="text-[9px] tracking-[0.45em] uppercase text-muted-foreground/35 rotate-90 mb-2">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown size={13} className="text-muted-foreground/25" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <Marquee />

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-28 md:py-40 bg-background relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 font-display text-[22vw] leading-none text-white/[0.016] select-none pointer-events-none flex items-center pr-2">1983</div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-28 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <p className="text-primary text-[10px] font-black tracking-[0.45em] uppercase mb-6">Our Roots</p>
              <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.88] text-foreground mb-10">
                FAITH.<br /><span className="text-primary">COMMUNITY.</span><br />PURPOSE.
              </h2>
              <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed font-light border-l-2 border-primary/25 pl-6">
                <p>Founded in 1983, the Garfield Jubilee Association has been quietly transforming Pittsburgh's Garfield neighborhood for over four decades — building homes, training young people, and pouring into the community with intention and love.</p>
                <p>We are a Christian-based nonprofit committed to affordable housing, economic development, local leadership, and supportive services that sustain the dignity of every individual.</p>
              </div>
              <div className="mt-10 flex items-center gap-3 text-foreground/45 text-sm font-medium tracking-wide">
                <MapPin className="text-primary h-4 w-4 shrink-0" />
                Serving Garfield, East End, and the Pittsburgh region
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="relative">
              <motion.div initial={{ clipPath: "inset(100% 0% 0% 0%)" }} whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }} viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }} className="aspect-[3/4] overflow-hidden">
                <motion.img src={counselingImg} alt="Community counseling" className="w-full h-full object-cover"
                  initial={{ scale: 1.25 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.0, duration: 0.7 }}
                className="absolute -bottom-6 -left-6 bg-card border border-white/7 p-6 max-w-[240px] amber-glow">
                <p className="font-serif text-xl text-foreground leading-snug italic">"A place where everyone belongs."</p>
                <div className="mt-3 h-px w-8 bg-primary" />
              </motion.div>
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground w-20 h-20 flex flex-col items-center justify-center">
                <span className="font-display text-3xl leading-none">40+</span>
                <span className="text-[9px] font-bold tracking-widest uppercase">Years</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS ═══ */}
      <section id="programs" className="py-28 md:py-40 bg-card border-t border-b border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <div>
              <p className="text-primary text-[10px] font-black tracking-[0.45em] uppercase mb-4">What We Do</p>
              <h2 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9] text-foreground">CORE PROGRAMS</h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">Three pillars driving real change across the Garfield neighborhood and beyond.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {[
              { num: "01", title: "Housing\nCounseling", desc: "Comprehensive housing counseling services guiding families through homeownership and financial stability with expertise and genuine care." },
              { num: "02", title: "Housing\nDevelopment", desc: "Building and renovating affordable homes for low and moderate-income families — transforming physical spaces into lasting community anchors." },
              { num: "03", title: "Workforce\nDevelopment", desc: "Job training and employment support equipping individuals with the skills, confidence, and opportunity they deserve to thrive." },
            ].map((prog, i) => (
              <TiltCard key={i} className="border-r border-white/5 last:border-r-0">
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.12 }}
                  className="group p-10 h-full bg-card hover:bg-background/40 transition-colors duration-500 relative overflow-hidden"
                  data-testid={`program-${i}`}>
                  <div className="absolute top-0 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-500" />
                  <div className="font-display text-[5.5rem] leading-none text-border/25 group-hover:text-primary/18 transition-colors duration-500 absolute -top-2 right-6 select-none">{prog.num}</div>
                  <div className="relative z-10 pt-16">
                    <h3 className="font-display text-4xl leading-[1] text-foreground mb-5 whitespace-pre-line">{prog.title}</h3>
                    <div className="w-8 h-0.5 bg-primary mb-6" />
                    <p className="text-muted-foreground leading-relaxed text-sm">{prog.desc}</p>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PULL QUOTE ═══ */}
      <section className="py-28 md:py-36 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/4 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <span className="font-serif text-[7rem] leading-none text-primary/18 block -mb-8 select-none">"</span>
            <p className="font-serif text-3xl md:text-5xl text-foreground italic leading-[1.25] max-w-4xl mx-auto">
              To strengthen communities through the manifestation of the <span className="text-primary not-italic font-bold">love of God.</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px w-14 bg-border/50" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-bold">Our Mission</span>
              <div className="h-px w-14 bg-border/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <Testimonials />

      {/* ═══ YOUTHBUILD ═══ */}
      <section id="youthbuild" className="relative min-h-screen flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0">
          <img src={constructionImg} alt="" className="w-full h-full object-cover opacity-[0.14]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/93 to-background/50" />
        </div>
        <div className="absolute inset-y-0 right-[42%] w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent hidden lg:block" />
        <div className="container mx-auto px-6 md:px-12 py-28 relative z-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-block bg-primary text-primary-foreground px-4 py-1.5 text-[10px] font-black tracking-[0.45em] uppercase mb-8">Flagship Program</div>
              <h2 className="font-display text-[clamp(3.5rem,9vw,9rem)] leading-[0.85] text-foreground mb-2">YOUTH</h2>
              <h2 className="font-display text-[clamp(3.5rem,9vw,9rem)] leading-[0.85] text-primary mb-10 text-glow">BUILD.</h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-10 max-w-md">
                Free education and training for young people <span className="text-foreground font-semibold">ages 16–24</span>. Recruiting across Pittsburgh and Allegheny County.
              </p>
              <ul className="space-y-4 mb-12">
                {["Earn a high school diploma or GED", "Skilled training: construction, health, customer service & retail", "Employment placement or college pathway"].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }} className="flex items-center gap-4 text-foreground/80" data-testid={`yb-${i}`}>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />{item}
                  </motion.li>
                ))}
              </ul>
              <div className="border border-white/7 bg-card/50 backdrop-blur-sm p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between hover:border-primary/35 transition-colors duration-300">
                <div>
                  <p className="text-primary text-[10px] font-black tracking-[0.4em] uppercase mb-2">Contact</p>
                  <p className="font-serif text-2xl text-foreground mb-1">Dion Jones</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5 text-muted-foreground text-sm">
                    <a href="tel:4126655206" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Phone className="h-3 w-3" />412-665-5206</a>
                    <a href="mailto:dionjones@garfieldjubilee.org" className="hover:text-primary transition-colors">dionjones@garfieldjubilee.org</a>
                  </div>
                </div>
                <MagButton onClick={() => scrollTo("contact")}
                  className="group shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors"
                  data-testid="yb-apply">
                  Apply Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </MagButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ IMPACT ═══ */}
      <section id="impact" className="py-28 md:py-40 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display text-[25vw] leading-none text-primary-foreground/[0.035] select-none">IMPACT</span>
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-20">
            <p className="text-primary-foreground/45 text-[10px] font-black tracking-[0.45em] uppercase mb-3">By the Numbers</p>
            <h2 className="font-display text-[clamp(3rem,6vw,6rem)] text-primary-foreground leading-none">OUR IMPACT</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/12">
            {[
              { c: c1983, suffix: "", label: "Year Founded", sub: "Four decades of service", raw: true },
              { c: cFam, suffix: "+", label: "Families Served", sub: "Through housing programs", raw: false },
              { c: cYouth, suffix: " yrs", label: "Youth Ages Served", sub: "The heart of YouthBuild", raw: false },
            ].map(({ c, suffix, label, sub, raw }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }} className="py-12 md:py-0 md:px-16 text-center" data-testid={`stat-${i}`}>
                <div className="font-display text-[clamp(5rem,10vw,10rem)] leading-none text-primary-foreground mb-3">
                  <span ref={c.ref}>{raw ? c.n.toString() : c.n.toLocaleString()}</span>{suffix}
                </div>
                <p className="font-semibold text-primary-foreground text-lg mb-1">{label}</p>
                <p className="text-primary-foreground/45 text-sm">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GET INVOLVED ═══ */}
      <section id="get-involved" className="py-28 md:py-40 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/4 blur-[90px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <p className="text-primary text-[10px] font-black tracking-[0.45em] uppercase mb-4">Join The Work</p>
            <h2 className="font-display text-[clamp(3rem,6vw,6rem)] leading-[0.9] text-foreground">THERE IS A PLACE<br /><span className="text-primary">FOR YOU HERE.</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Donate to GJA", desc: "Support our programs financially and help us build a stronger community.", cls: "bg-primary text-primary-foreground", btn: "Give Now" },
              { label: "Volunteer", desc: "Share your time, talents, and energy with the people who need it most.", cls: "bg-card border border-white/7 text-foreground", btn: "Sign Up" },
              { label: "Apply to YouthBuild", desc: "Ages 16–24 in Pittsburgh and Allegheny County. Start your new chapter.", cls: "bg-secondary/15 border border-secondary/20 text-foreground", btn: "Apply Now" },
            ].map(({ label, desc, cls, btn }, i) => (
              <TiltCard key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className={`p-8 h-full flex flex-col ${cls}`} data-testid={`involve-${i}`}>
                  <h3 className="font-display text-3xl leading-none mb-4">{label}</h3>
                  <p className="text-sm leading-relaxed opacity-70 flex-1 mb-8">{desc}</p>
                  <button onClick={() => scrollTo("contact")}
                    className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:gap-4 transition-all duration-300">
                    {btn} <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM ═══ */}
      <section id="contact" className="py-28 md:py-40 bg-card border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/4 blur-[110px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Left: info */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <p className="text-primary text-[10px] font-black tracking-[0.45em] uppercase mb-6">Reach Out</p>
              <h2 className="font-display text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.9] text-foreground mb-8">
                LET'S<br /><span className="text-primary">CONNECT.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-12 max-w-sm">
                Whether you have questions, want to volunteer, or are ready to apply to YouthBuild — we'd love to hear from you.
              </p>
              <div className="space-y-6">
                <div className="flex gap-5">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">Location</p>
                    <p className="text-muted-foreground text-sm">Garfield Neighborhood<br />Pittsburgh, PA</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">Phone</p>
                    <a href="tel:4126655200" className="text-muted-foreground text-sm hover:text-primary transition-colors">(412) 665-5200</a>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/6">
                <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-5">Connect</p>
                <div className="flex gap-6">
                  {["LinkedIn", "Twitter", "Facebook"].map((s) => (
                    <a key={s} href="#" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors" data-testid={`social-${s.toLowerCase()}`}>{s}</a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
              className="bg-background border border-white/6 p-10 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-10 bg-background">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground/40 text-xs tracking-wide">
          <span className="font-display text-xl text-foreground/70 tracking-widest">GJA</span>
          <p>Garfield Jubilee Association · Pittsburgh, PA</p>
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
