import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, MapPin, Menu, X, ChevronDown, Home as HomeIcon, BookOpen, HardHat } from "lucide-react";

import heroImg from "../assets/hero-community.png";
import constructionImg from "../assets/youthbuild-construction.png";
import counselingImg from "../assets/housing-counseling.png";

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

const marqueeItems = [
  "Transforming Lives", "Serving Since 1983", "Garfield Pittsburgh",
  "YouthBuild Program", "Affordable Housing", "Workforce Development",
  "Transforming Communities", "Faith in Action",
];

function MarqueeStrip() {
  return (
    <div className="overflow-hidden bg-primary py-4 select-none">
      <motion.div
        className="flex gap-0 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="font-display text-primary-foreground text-2xl px-8 shrink-0">
            {item}
            <span className="mx-8 text-primary-foreground/30">×</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const nav1983 = useCounter(1983);
  const navFamilies = useCounter(400);
  const navYouth = useCounter(24);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-background/95 backdrop-blur-xl border-b border-border/60" : "bg-transparent"}`}>
        <div className="container mx-auto px-6 md:px-10 flex justify-between items-center h-16">
          <button
            onClick={() => scrollTo("hero")}
            className="font-display text-2xl tracking-widest text-foreground hover:text-primary transition-colors"
            data-testid="nav-logo"
          >
            GJA
          </button>

          <div className="hidden md:flex items-center gap-10">
            {["About", "Programs", "YouthBuild", "Impact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
                data-testid={`nav-${item.toLowerCase()}`}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => scrollTo("get-involved")}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              data-testid="nav-get-involved"
            >
              Get Involved
            </button>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="nav-mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-background border-t border-border/60 overflow-hidden md:hidden"
            >
              <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                {["About", "Programs", "YouthBuild", "Impact"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollTo(item.toLowerCase())}
                    className="text-left py-2 text-foreground text-lg font-medium border-b border-border/40"
                  >
                    {item}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo("get-involved")}
                  className="mt-2 py-3 bg-primary text-primary-foreground font-semibold"
                >
                  Get Involved
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" ref={heroRef} className="relative h-screen flex items-end overflow-hidden">
        {/* Parallax image */}
        <motion.div className="absolute inset-0 scale-110" style={{ y: heroY }}>
          <img src={heroImg} alt="Pittsburgh Garfield neighborhood" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </motion.div>

        {/* Amber orb glow */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <motion.div
          className="relative z-10 container mx-auto px-6 md:px-10 pb-20 md:pb-28"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6" data-testid="hero-since">
              Pittsburgh · Since 1983
            </p>
            <h1 className="font-display text-[clamp(4rem,12vw,11rem)] leading-[0.9] text-foreground mb-2 text-glow" data-testid="hero-headline-1">
              Transforming
            </h1>
            <h1 className="font-display text-[clamp(4rem,12vw,11rem)] leading-[0.9] text-primary mb-8 text-glow" data-testid="hero-headline-2">
              Lives.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed mb-10 font-light">
              Strengthening the communities of Garfield, East End, and the Pittsburgh region through the manifestation of the love of God.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("get-involved")}
                className="group flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-semibold text-base hover:bg-primary/90 transition-all duration-300"
                data-testid="hero-cta-primary"
              >
                Get Involved
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="flex items-center gap-3 border border-border/60 text-foreground/80 px-8 py-4 font-medium text-base hover:border-primary/60 hover:text-primary transition-all duration-300"
                data-testid="hero-cta-secondary"
              >
                Our Story
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-10 hidden md:flex flex-col items-center gap-2 text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs tracking-widest uppercase rotate-90 mb-2">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MARQUEE ─── */}
      <MarqueeStrip />

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-28 md:py-36 bg-background relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-primary font-semibold tracking-[0.3em] uppercase text-xs mb-4">Our Roots</p>
              <h2 className="font-display text-[clamp(3rem,6vw,6rem)] leading-[0.9] text-foreground mb-8">
                Faith.<br/>
                <span className="text-primary">Community.</span><br/>
                Purpose.
              </h2>
              <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed font-light">
                <p>
                  Founded in 1983, the Garfield Jubilee Association has been quietly transforming Pittsburgh's Garfield neighborhood for over four decades — building homes, training young people, and pouring into the community with intention and love.
                </p>
                <p>
                  We are a Christian-based nonprofit committed to affordable housing, economic development, local leadership, and supportive services that sustain the dignity of every individual.
                </p>
              </div>
              <div className="mt-10 flex items-center gap-3 text-foreground/60 font-medium">
                <MapPin className="text-primary h-5 w-5 shrink-0" />
                <span>Serving Garfield, East End, and the Pittsburgh region</span>
              </div>
            </motion.div>

            {/* Image stack */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="relative"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img src={counselingImg} alt="Community counseling" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              {/* Float card */}
              <div className="absolute -bottom-6 -left-6 bg-card border border-border/60 p-6 max-w-[260px] amber-glow">
                <p className="font-serif text-xl text-foreground leading-snug italic">
                  "A place where everyone belongs."
                </p>
                <div className="mt-3 h-px w-10 bg-primary" />
              </div>
              {/* Year badge */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground w-20 h-20 flex flex-col items-center justify-center">
                <span className="font-display text-3xl leading-none">40+</span>
                <span className="text-xs font-semibold tracking-widest uppercase">Years</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PROGRAMS ─── */}
      <section id="programs" className="py-28 md:py-36 bg-card border-t border-b border-border/40 relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p className="text-primary font-semibold tracking-[0.3em] uppercase text-xs mb-4">What We Do</p>
            <h2 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9] text-foreground">
              Core Programs
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-border/40">
            {[
              {
                icon: <HomeIcon className="h-7 w-7" />,
                num: "01",
                title: "Housing Counseling",
                desc: "Comprehensive housing counseling services guiding families through homeownership and financial stability with expertise and care.",
              },
              {
                icon: <HardHat className="h-7 w-7" />,
                num: "02",
                title: "Housing Development",
                desc: "Building and renovating affordable homes for low and moderate-income families — transforming physical spaces into lasting community anchors.",
              },
              {
                icon: <BookOpen className="h-7 w-7" />,
                num: "03",
                title: "Workforce Development",
                desc: "Job training and employment support equipping individuals with the skills, confidence, and opportunity to thrive in the modern economy.",
              },
            ].map((prog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card p-10 group hover:bg-background transition-colors duration-300 relative overflow-hidden"
                data-testid={`program-card-${i}`}
              >
                <div className="absolute top-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500" />
                <div className="font-display text-[5rem] leading-none text-border/50 group-hover:text-primary/20 transition-colors duration-300 mb-2 absolute top-6 right-8">
                  {prog.num}
                </div>
                <div className="text-primary mb-6 relative z-10">{prog.icon}</div>
                <h3 className="font-serif text-2xl text-foreground mb-4 relative z-10">{prog.title}</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">{prog.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── YOUTHBUILD ─── */}
      <section id="youthbuild" className="py-28 md:py-36 bg-background relative overflow-hidden">
        {/* Background image with heavy overlay */}
        <div className="absolute inset-0">
          <img src={constructionImg} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            {/* Text — takes 3 cols */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="inline-block bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-8">
                Flagship Program
              </div>
              <h2 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9] text-foreground mb-8">
                Youth<span className="text-primary">Build</span>
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-10 max-w-lg">
                A free education and training program for young people <strong className="text-foreground font-semibold">ages 16–24</strong>. We are recruiting youth across Pittsburgh and Allegheny County.
              </p>

              <ul className="space-y-5 mb-12">
                {[
                  "Earn a high school diploma or GED",
                  "Skilled training in construction, health, customer service & retail",
                  "Employment placement or college pathway",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 text-foreground/80"
                    data-testid={`youthbuild-item-${i}`}
                  >
                    <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                    <span className="text-base md:text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Contact card */}
              <div className="bg-card border border-border/60 p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between group hover:border-primary/50 transition-colors duration-300">
                <div>
                  <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">YouthBuild Contact</p>
                  <p className="font-serif text-2xl text-foreground mb-1">Dion Jones</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-muted-foreground text-sm">
                    <a href="tel:4126655206" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Phone className="h-3.5 w-3.5" /> 412-665-5206
                    </a>
                    <a href="mailto:dionjones@garfieldjubilee.org" className="hover:text-primary transition-colors">
                      dionjones@garfieldjubilee.org
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => scrollTo("get-involved")}
                  className="shrink-0 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 group"
                  data-testid="youthbuild-apply-btn"
                >
                  Apply Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Image — takes 2 cols */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 hidden lg:block"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img src={constructionImg} alt="YouthBuild construction training" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── IMPACT NUMBERS ─── */}
      <section id="impact" className="py-28 md:py-36 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.07),transparent_60%)]" />
        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center"
          >
            <p className="text-primary-foreground/60 font-semibold tracking-[0.3em] uppercase text-xs mb-4">By The Numbers</p>
            <h2 className="font-display text-[clamp(3rem,6vw,6rem)] leading-[0.9] text-primary-foreground">
              Our Impact
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
            {[
              { counter: nav1983, suffix: "", label: "Year Founded", sub: "Over four decades of service", raw: true },
              { counter: navFamilies, suffix: "+", label: "Families Served", sub: "Through housing programs", raw: false },
              { counter: navYouth, suffix: " yrs", label: "Youth Ages Served", sub: "The heart of YouthBuild", raw: false },
            ].map(({ counter, suffix, label, sub, raw }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="py-12 md:py-8 md:px-16 text-center"
                data-testid={`stat-${i}`}
              >
                <div className="font-display text-[clamp(4rem,8vw,8rem)] leading-none text-primary-foreground mb-3">
                  <span ref={counter.ref}>{raw ? counter.count.toString() : counter.count.toLocaleString()}</span>
                  {suffix}
                </div>
                <p className="font-semibold text-primary-foreground text-lg mb-1">{label}</p>
                <p className="text-primary-foreground/60 text-sm">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GET INVOLVED ─── */}
      <section id="get-involved" className="py-28 md:py-36 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary font-semibold tracking-[0.3em] uppercase text-xs mb-4">Join The Work</p>
              <h2 className="font-display text-[clamp(3rem,6vw,6rem)] leading-[0.9] text-foreground mb-8">
                There Is a<br/>Place For<br/><span className="text-primary">You Here.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-12 max-w-md">
                It takes a community to build a community. Support our programs, volunteer your time, or enroll in YouthBuild — every contribution matters.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Donate to GJA", style: "bg-primary text-primary-foreground hover:bg-primary/90" },
                  { label: "Volunteer With Us", style: "border border-border/60 text-foreground hover:border-primary/60 hover:text-primary" },
                  { label: "Apply to YouthBuild", style: "bg-secondary text-secondary-foreground hover:bg-secondary/90" },
                ].map(({ label, style }, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className={`group flex items-center justify-between px-8 py-5 font-semibold text-base transition-all duration-300 ${style}`}
                    data-testid={`cta-${i}`}
                  >
                    {label}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="bg-card border border-border/60 p-10 md:p-12 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-5xl text-foreground mb-10">Contact Us</h3>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Location</p>
                      <p className="text-muted-foreground leading-relaxed">Garfield Neighborhood<br />Pittsburgh, PA</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Phone</p>
                      <a href="tel:4126655200" className="text-muted-foreground hover:text-primary transition-colors">
                        (412) 665-5200
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-14 pt-8 border-t border-border/50">
                <p className="text-xs font-bold tracking-widest uppercase text-primary mb-5">Connect</p>
                <div className="flex gap-6">
                  {["LinkedIn", "Twitter", "Facebook"].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                      data-testid={`social-${platform.toLowerCase()}`}
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/40 py-10 bg-background">
        <div className="container mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <span className="font-display text-xl text-foreground tracking-widest">GJA</span>
          <p>Garfield Jubilee Association · Pittsburgh, PA</p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
