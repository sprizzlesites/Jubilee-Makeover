import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, MapPin, Menu, X, ChevronDown } from "lucide-react";

import heroImg from "../assets/hero-community.png";
import constructionImg from "../assets/youthbuild-construction.png";
import counselingImg from "../assets/housing-counseling.png";

/* ─── Custom Cursor ─── */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const dotX = useSpring(0, { stiffness: 2000, damping: 80 });
  const dotY = useSpring(0, { stiffness: 2000, damping: 80 });
  const ringX = useSpring(0, { stiffness: 180, damping: 28 });
  const ringY = useSpring(0, { stiffness: 180, damping: 28 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX); dotY.set(e.clientY);
      ringX.set(e.clientX); ringY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovered(!!(el.closest("button") || el.closest("a") || el.closest("[data-cursor]")));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, [dotX, dotY, ringX, ringY]);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[99999]">
      <motion.div
        ref={dot}
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovered ? 0 : 1 }}
        className="absolute w-2 h-2 rounded-full bg-primary"
      />
      <motion.div
        ref={ring}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovered ? 2.2 : 1, opacity: hovered ? 0.6 : 0.35 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute w-8 h-8 rounded-full border border-primary"
      />
    </div>
  );
}

/* ─── Ambient glow that follows cursor ─── */
function AmbientGlow() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const smoothX = useSpring(-999, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(-999, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { smoothX.set(e.clientX); smoothY.set(e.clientY); setPos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [smoothX, smoothY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-0"
      style={{
        x: smoothX, y: smoothY,
        translateX: "-50%", translateY: "-50%",
        width: 500, height: 500,
        background: "radial-gradient(circle, hsl(33 95% 58% / 0.06) 0%, transparent 70%)",
        borderRadius: "50%",
      }}
    />
  );
}

/* ─── Split text — char by char ─── */
function SplitText({ text, className, delay = 0, charClass }: { text: string; className?: string; delay?: number; charClass?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 80, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, delay: delay + i * 0.028, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${charClass ?? ""}`}
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── 3D tilt card ─── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    setTilt({ x: (ny - 0.5) * 12, y: (nx - 0.5) * -12, gx: nx * 100, gy: ny * 100 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, gx: 50, gy: 50 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.15s ease-out" }}
      className={`relative ${className ?? ""}`}
    >
      {/* Shimmer gradient */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit]"
        style={{ background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, hsl(33 95% 58% / 0.08), transparent 60%)` }}
      />
      {children}
    </div>
  );
}

/* ─── Counter hook ─── */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      n += step;
      if (n >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(n));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return { count, ref };
}

/* ─── Marquee ─── */
const MARQUEE = ["Transforming Lives", "Serving Since 1983", "Garfield Pittsburgh", "YouthBuild", "Affordable Housing", "Workforce Development", "Transforming Communities", "Faith in Action"];
function Marquee() {
  return (
    <div className="overflow-hidden bg-primary py-4 select-none">
      <motion.div className="flex whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 32, ease: "linear", repeat: Infinity }}>
        {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
          <span key={i} className="font-display text-2xl px-8 text-primary-foreground shrink-0">
            {item}<span className="mx-8 text-primary-foreground/30">×</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main ─── */
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden cursor-none lg:cursor-none">
      <Cursor />
      <AmbientGlow />
      <div className="grain-overlay" aria-hidden="true" />

      {/* ─── NAV ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-background/90 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center h-16">
          <button onClick={() => scrollTo("hero")} className="font-display text-2xl tracking-widest text-foreground hover:text-primary transition-colors" data-testid="nav-logo">
            GJA
          </button>
          <div className="hidden md:flex items-center gap-10">
            {["About", "Programs", "YouthBuild", "Impact"].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground tracking-[0.2em] uppercase transition-colors"
                data-testid={`nav-${item.toLowerCase()}`}>
                {item}
              </button>
            ))}
            <button onClick={() => scrollTo("get-involved")}
              className="relative group px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase overflow-hidden"
              data-testid="nav-cta">
              <span className="relative z-10">Get Involved</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="bg-background/95 backdrop-blur-xl border-t border-white/5 overflow-hidden md:hidden">
              <div className="container mx-auto px-6 py-6 flex flex-col gap-5">
                {["About", "Programs", "YouthBuild", "Impact"].map((item) => (
                  <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-left text-lg font-medium text-foreground border-b border-border/30 pb-4">{item}</button>
                ))}
                <button onClick={() => scrollTo("get-involved")} className="py-3 bg-primary text-primary-foreground font-bold tracking-wider">Get Involved</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" ref={heroRef} className="relative h-screen flex items-end overflow-hidden">
        {/* Ghost GJA behind everything */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none z-[1]">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="font-display text-[32vw] leading-none text-white/[0.025] select-none"
          >
            GJA
          </motion.span>
        </div>

        {/* Parallax bg */}
        <motion.div className="absolute inset-0 scale-110 z-0" style={{ y: heroY }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
        </motion.div>

        {/* Amber bloom bottom-left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/12 blur-[120px] pointer-events-none z-[1]" />

        <motion.div className="relative z-10 container mx-auto px-6 md:px-12 pb-24 md:pb-32" style={{ opacity: heroOpacity }}>
          <div className="overflow-hidden mb-2">
            <SplitText text="TRANSFORMING" className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] text-foreground block" delay={0.1} />
          </div>
          <div className="overflow-hidden mb-10">
            <SplitText text="LIVES." className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] text-primary block" delay={0.4} charClass="text-glow" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="text-muted-foreground text-lg max-w-md leading-relaxed font-light mb-10"
          >
            Strengthening the communities of Garfield, East End, and the Pittsburgh region through the manifestation of the love of God.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }} className="flex flex-wrap gap-4">
            <button onClick={() => scrollTo("get-involved")}
              className="group relative flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-semibold text-sm tracking-wide overflow-hidden"
              data-testid="hero-primary-cta">
              <span className="relative z-10 flex items-center gap-3">Get Involved <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 bg-white/15 translate-x-[-105%] group-hover:translate-x-0 transition-transform duration-300 skew-x-[-12deg]" />
            </button>
            <button onClick={() => scrollTo("about")}
              className="group flex items-center gap-3 border border-white/15 text-white/70 px-8 py-4 text-sm font-medium tracking-wide hover:border-primary/60 hover:text-primary transition-all duration-300"
              data-testid="hero-secondary-cta">
              Our Story <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            className="mt-6 text-xs tracking-[0.3em] uppercase text-muted-foreground/40">
            Pittsburgh · Since 1983
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 right-12 hidden md:flex flex-col items-center gap-3 z-10">
          <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/40 writing-vertical-lr rotate-90">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown size={14} className="text-muted-foreground/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MARQUEE ─── */}
      <Marquee />

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-28 md:py-40 bg-background relative overflow-hidden">
        {/* Large ghost text background */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 font-display text-[20vw] leading-none text-white/[0.018] select-none pointer-events-none whitespace-nowrap pr-4">
          SINCE 1983
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-28 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <p className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-6">Our Roots</p>
              <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-foreground mb-10">
                FAITH.<br />
                <span className="text-primary">COMMUNITY.</span><br />
                PURPOSE.
              </h2>
              <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed font-light border-l-2 border-primary/30 pl-6">
                <p>Founded in 1983, the Garfield Jubilee Association has been quietly transforming Pittsburgh's Garfield neighborhood for over four decades — building homes, training young people, and pouring into the community with intention and love.</p>
                <p>We are a Christian-based nonprofit committed to affordable housing, economic development, local leadership, and supportive services that sustain the dignity of every individual.</p>
              </div>
              <div className="mt-10 flex items-center gap-3 text-foreground/50 text-sm font-medium tracking-wide">
                <MapPin className="text-primary h-4 w-4 shrink-0" />
                Serving Garfield, East End, and the Pittsburgh region
              </div>
            </motion.div>

            {/* Image with clip-path reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <motion.div
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                className="aspect-[3/4] overflow-hidden"
              >
                <motion.img
                  src={counselingImg}
                  alt="Community"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                />
              </motion.div>

              {/* Float card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.7 }}
                className="absolute -bottom-6 -left-6 bg-card border border-white/8 p-6 max-w-[240px] amber-glow"
              >
                <p className="font-serif text-xl text-foreground leading-snug italic">"A place where everyone belongs."</p>
                <div className="mt-3 h-px w-8 bg-primary" />
              </motion.div>

              {/* Year badge */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground w-20 h-20 flex flex-col items-center justify-center">
                <span className="font-display text-3xl leading-none">40+</span>
                <span className="text-[9px] font-bold tracking-widest uppercase">Years</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PROGRAMS ─── */}
      <section id="programs" className="py-28 md:py-40 bg-card border-t border-b border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <div>
              <p className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-4">What We Do</p>
              <h2 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9] text-foreground">CORE PROGRAMS</h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">Three pillars driving real change across the Garfield neighborhood and beyond.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-0 border border-white/5">
            {[
              { num: "01", title: "Housing\nCounseling", desc: "Comprehensive housing counseling services guiding families through homeownership and financial stability with expertise and care.", color: "from-primary/5" },
              { num: "02", title: "Housing\nDevelopment", desc: "Building and renovating affordable homes for low and moderate-income families — transforming physical spaces into lasting community anchors.", color: "from-secondary/5" },
              { num: "03", title: "Workforce\nDevelopment", desc: "Job training and employment support equipping individuals with the skills, confidence, and opportunity they deserve.", color: "from-primary/5" },
            ].map((prog, i) => (
              <TiltCard key={i} className="border-r border-white/5 last:border-r-0">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.12 }}
                  className={`group p-10 h-full bg-gradient-to-b ${prog.color} to-transparent hover:bg-background/40 transition-colors duration-500 relative overflow-hidden`}
                  data-testid={`program-${i}`}
                >
                  {/* Sliding top bar */}
                  <div className="absolute top-0 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-600" />

                  <div className="font-display text-[6rem] leading-none text-border/30 group-hover:text-primary/15 transition-colors duration-500 absolute -top-2 right-6 select-none">
                    {prog.num}
                  </div>

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

      {/* ─── PULL QUOTE ─── */}
      <section className="py-28 md:py-40 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/4 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <span className="font-serif text-[8rem] leading-none text-primary/20 block -mb-8 select-none">"</span>
            <p className="font-serif text-3xl md:text-5xl text-foreground italic leading-[1.2] max-w-4xl mx-auto">
              To strengthen communities through the manifestation of the <span className="text-primary not-italic font-bold">love of God.</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-border" />
              <span className="text-xs tracking-[0.35em] uppercase text-muted-foreground font-semibold">Our Mission</span>
              <div className="h-px w-16 bg-border" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── YOUTHBUILD ─── */}
      <section id="youthbuild" className="relative min-h-screen flex items-center overflow-hidden bg-card">
        {/* Background image — right half */}
        <div className="absolute inset-0">
          <img src={constructionImg} alt="" className="w-full h-full object-cover object-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/40" />
        </div>

        {/* Diagonal stripe accent */}
        <div className="absolute inset-y-0 right-[40%] w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden lg:block" />

        <div className="container mx-auto px-6 md:px-12 py-28 relative z-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-block bg-primary text-primary-foreground px-4 py-1.5 text-[10px] font-black tracking-[0.4em] uppercase mb-8">
                Flagship Program
              </div>
              <h2 className="font-display text-[clamp(3.5rem,9vw,9rem)] leading-[0.85] text-foreground mb-4">
                YOUTH
              </h2>
              <h2 className="font-display text-[clamp(3.5rem,9vw,9rem)] leading-[0.85] text-primary mb-10 text-glow">
                BUILD.
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-10 max-w-md">
                Free education and training for young people <span className="text-foreground font-semibold">ages 16–24</span>. Actively recruiting across Pittsburgh and Allegheny County.
              </p>

              <ul className="space-y-4 mb-12">
                {[
                  "Earn a high school diploma or GED",
                  "Skilled training: construction, health, customer service & retail",
                  "Employment placement or college pathway",
                ].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }} className="flex items-center gap-4 text-foreground/80"
                    data-testid={`yb-item-${i}`}>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="border border-white/8 bg-background/30 backdrop-blur-sm p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between hover:border-primary/40 transition-colors duration-300">
                <div>
                  <p className="text-primary text-[10px] font-black tracking-[0.4em] uppercase mb-2">Contact</p>
                  <p className="font-serif text-2xl text-foreground mb-1">Dion Jones</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5 text-muted-foreground text-sm">
                    <a href="tel:4126655206" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Phone className="h-3 w-3" />412-665-5206</a>
                    <a href="mailto:dionjones@garfieldjubilee.org" className="hover:text-primary transition-colors">dionjones@garfieldjubilee.org</a>
                  </div>
                </div>
                <button onClick={() => scrollTo("get-involved")}
                  className="group shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors"
                  data-testid="yb-apply">
                  Apply Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── IMPACT ─── */}
      <section id="impact" className="py-28 md:py-40 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.08),transparent_55%)]" />
        {/* Ghost label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display text-[25vw] leading-none text-primary-foreground/[0.04] select-none">IMPACT</span>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-20">
            <p className="text-primary-foreground/50 text-xs font-bold tracking-[0.4em] uppercase mb-3">By the Numbers</p>
            <h2 className="font-display text-[clamp(3rem,6vw,6rem)] text-primary-foreground leading-none">OUR IMPACT</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/15">
            {[
              { c: c1983, suffix: "", label: "Year Founded", sub: "Over four decades of service", raw: true },
              { c: cFam, suffix: "+", label: "Families Served", sub: "Through housing programs", raw: false },
              { c: cYouth, suffix: " yrs", label: "Youth Ages Served", sub: "The heart of YouthBuild", raw: false },
            ].map(({ c, suffix, label, sub, raw }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }} className="py-12 md:py-0 md:px-16 text-center" data-testid={`stat-${i}`}>
                <div className="font-display text-[clamp(5rem,10vw,10rem)] leading-none text-primary-foreground mb-3">
                  <span ref={c.ref}>{raw ? c.count.toString() : c.count.toLocaleString()}</span>{suffix}
                </div>
                <p className="font-semibold text-primary-foreground text-lg mb-1">{label}</p>
                <p className="text-primary-foreground/50 text-sm">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GET INVOLVED ─── */}
      <section id="get-involved" className="py-28 md:py-40 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/4 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <p className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-6">Join The Work</p>
              <h2 className="font-display text-[clamp(3rem,6vw,6rem)] leading-[0.9] text-foreground mb-8">
                THERE IS A<br />PLACE FOR<br /><span className="text-primary">YOU HERE.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-12 max-w-sm">
                It takes a community to build a community. Support our programs, volunteer, or enroll in YouthBuild — every contribution matters.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Donate to GJA", cls: "bg-primary text-primary-foreground hover:bg-primary/90" },
                  { label: "Volunteer With Us", cls: "border border-white/10 text-foreground hover:border-primary/50 hover:text-primary" },
                  { label: "Apply to YouthBuild", cls: "bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/20" },
                ].map(({ label, cls }, i) => (
                  <motion.button key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className={`group flex items-center justify-between px-8 py-5 font-semibold text-base transition-all duration-300 ${cls}`}
                    data-testid={`cta-btn-${i}`}>
                    {label}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="bg-card border border-white/6 p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
              <div>
                <h3 className="font-display text-5xl text-foreground mb-10 tracking-wide">CONTACT US</h3>
                <div className="space-y-8">
                  {[
                    { icon: <MapPin className="h-4 w-4 text-primary" />, label: "Location", val: ["Garfield Neighborhood", "Pittsburgh, PA"] },
                    { icon: <Phone className="h-4 w-4 text-primary" />, label: "Phone", val: ["(412) 665-5200"] },
                  ].map(({ icon, label, val }, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-9 h-9 bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">{icon}</div>
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">{label}</p>
                        {val.map((line, j) => <p key={j} className="text-muted-foreground text-sm">{line}</p>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/6">
                <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-4">Connect</p>
                <div className="flex gap-6">
                  {["LinkedIn", "Twitter", "Facebook"].map((s) => (
                    <a key={s} href="#" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors" data-testid={`social-${s.toLowerCase()}`}>{s}</a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-10 bg-background">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground/50 text-xs tracking-wide">
          <span className="font-display text-xl text-foreground/80 tracking-widest">GJA</span>
          <p>Garfield Jubilee Association · Pittsburgh, PA</p>
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
