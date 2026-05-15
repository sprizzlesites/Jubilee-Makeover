import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Home as HomeIcon, BookOpen, HandHeart, Phone, MapPin, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import heroImg from "../assets/hero-community.png";
import constructionImg from "../assets/youthbuild-construction.png";
import counselingImg from "../assets/housing-counseling.png";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="font-serif text-2xl font-bold text-primary flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("hero")}>
            <Heart className="text-secondary h-6 w-6" />
            <span className={isScrolled ? "text-primary" : "text-white"}>GJA</span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            {["About", "Programs", "YouthBuild", "Impact"].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase())}
                className={`text-sm font-medium tracking-wide hover:text-secondary transition-colors ${isScrolled ? "text-primary/80" : "text-white/90"}`}
              >
                {item}
              </button>
            ))}
            <Button 
              variant={isScrolled ? "default" : "secondary"} 
              className={isScrolled ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-white text-primary hover:bg-white/90"}
              onClick={() => scrollTo("get-involved")}
            >
              Get Involved
            </Button>
          </div>

          <button className="md:hidden text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className={isScrolled ? "text-primary" : "text-white"} /> : <Menu className={isScrolled ? "text-primary" : "text-white"} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-background border-t border-border/50 p-4 flex flex-col gap-4 shadow-lg md:hidden">
            {["About", "Programs", "YouthBuild", "Impact"].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-left py-2 text-primary font-medium border-b border-border/50"
              >
                {item}
              </button>
            ))}
            <Button className="w-full bg-primary text-primary-foreground mt-2" onClick={() => scrollTo("get-involved")}>
              Get Involved
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Pittsburgh Garfield neighborhood" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 pt-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={STAGGER}
            className="max-w-3xl"
          >
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Since 1983
            </motion.div>
            <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6">
              Transforming Lives.<br />
              <span className="text-secondary italic">Transforming Communities.</span>
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-lg md:text-xl text-white/80 font-light mb-10 max-w-2xl leading-relaxed">
              Strengthening the communities of Garfield, East End, and the Pittsburgh region through the manifestation of the love of God.
            </motion.p>
            <motion.div variants={FADE_UP} className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base h-14 px-8 rounded-none" onClick={() => scrollTo("get-involved")}>
                Get Involved
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white text-base h-14 px-8 rounded-none" onClick={() => scrollTo("about")}>
                Learn More <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={STAGGER}
            >
              <motion.h2 variants={FADE_UP} className="text-sm font-bold tracking-widest text-secondary uppercase mb-3">Our Roots</motion.h2>
              <motion.h3 variants={FADE_UP} className="text-4xl md:text-5xl mb-6">Faith-rooted.<br/>Community-driven.</motion.h3>
              <motion.p variants={FADE_UP} className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Founded in 1983, the Garfield Jubilee Association has been quietly transforming the Pittsburgh neighborhood for over four decades. We believe in building homes, training young people, and pouring into the community with intention and love.
              </motion.p>
              <motion.p variants={FADE_UP} className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We are a Christian-based nonprofit organization. Our work is not just a service—it is a manifestation of love, dignity, and deep human connection. We strive to be the kind of organization you'd trust your neighbor with.
              </motion.p>
              <motion.div variants={FADE_UP} className="flex items-center gap-4 text-primary font-serif italic text-xl">
                <MapPin className="text-secondary" />
                Serving Garfield, East End, and the Pittsburgh Region
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                <img src={counselingImg} alt="Community counseling" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-card p-8 shadow-xl max-w-xs border border-border/50">
                <p className="font-serif text-2xl text-primary leading-snug">"A place where everyone belongs."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.h2 variants={FADE_UP} className="text-sm font-bold tracking-widest text-secondary uppercase mb-3">Our Work</motion.h2>
            <motion.h3 variants={FADE_UP} className="text-4xl md:text-5xl">Core Programs</motion.h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <HomeIcon className="h-8 w-8 text-secondary mb-6" />,
                title: "Housing Counseling",
                desc: "Comprehensive housing counseling services for residents, guiding families through the complexities of homeownership and financial stability with care."
              },
              {
                icon: <HandHeart className="h-8 w-8 text-secondary mb-6" />,
                title: "Housing Development",
                desc: "Building and renovating affordable homes for low and moderate-income families, transforming physical spaces into lasting community anchors."
              },
              {
                icon: <BookOpen className="h-8 w-8 text-secondary mb-6" />,
                title: "Workforce Development",
                desc: "Job training and employment support designed to equip individuals with the skills, confidence, and opportunities needed to thrive."
              }
            ].map((prog, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }}
                viewport={{ once: true }}
                className="bg-card p-10 border border-border hover:border-secondary/50 transition-colors group"
              >
                {prog.icon}
                <h4 className="font-serif text-2xl text-primary mb-4">{prog.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{prog.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YouthBuild Spotlight */}
      <section id="youthbuild" className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="none">
            <polygon points="0,100 100,0 100,100" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
            >
              <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-bold uppercase tracking-wider mb-6">
                Flagship Program
              </motion.div>
              <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-serif mb-6 text-white">YouthBuild Spotlight</motion.h2>
              <motion.p variants={FADE_UP} className="text-xl text-white/80 mb-8 font-light leading-relaxed">
                Free education and training for young people ages 16-24. We are actively recruiting youth in Pittsburgh and Allegheny County.
              </motion.p>
              
              <motion.ul variants={STAGGER} className="space-y-4 mb-10">
                {[
                  "Earn a high school diploma or GED",
                  "Occupational skilled training in construction, health, customer service/retail",
                  "Employment placement or college pathway"
                ].map((item, i) => (
                  <motion.li key={i} variants={FADE_UP} className="flex items-start gap-3 text-white/90">
                    <ArrowRight className="h-6 w-6 text-secondary shrink-0" />
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={FADE_UP} className="bg-white/5 border border-white/10 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div>
                  <p className="text-sm text-secondary uppercase tracking-widest font-bold mb-1">Contact for YouthBuild</p>
                  <p className="font-serif text-2xl text-white">Dion Jones</p>
                  <div className="flex items-center gap-4 mt-2 text-white/70 text-sm">
                    <span className="flex items-center gap-1"><Phone className="h-4 w-4"/> 412-665-5206</span>
                    <a href="mailto:dionjones@garfieldjubilee.org" className="hover:text-white transition-colors">dionjones@garfieldjubilee.org</a>
                  </div>
                </div>
                <Button className="bg-white text-primary hover:bg-white/90 shrink-0 rounded-none" onClick={() => scrollTo("get-involved")}>
                  Apply Now
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
              <img src={constructionImg} alt="Youth learning construction" className="w-full h-full object-cover border-8 border-white/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border"
          >
            {[
              { num: "1983", label: "Year Founded", desc: "Serving the Garfield neighborhood" },
              { num: "3", label: "Core Programs", desc: "Housing, Development, Workforce" },
              { num: "16-24", label: "Youth Ages Served", desc: "Through the YouthBuild program" }
            ].map((stat, i) => (
              <motion.div key={i} variants={FADE_UP} className="py-8 md:py-0 md:px-8 text-center flex flex-col items-center justify-center">
                <span className="text-6xl md:text-7xl font-serif text-primary mb-2">{stat.num}</span>
                <span className="text-xl font-bold text-foreground mb-2">{stat.label}</span>
                <span className="text-muted-foreground">{stat.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Get Involved & Contact */}
      <section id="get-involved" className="bg-card py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
            >
              <motion.h2 variants={FADE_UP} className="text-4xl md:text-5xl font-serif text-primary mb-6">Join the Work</motion.h2>
              <motion.p variants={FADE_UP} className="text-lg text-muted-foreground mb-10">
                It takes a community to build a community. Whether you want to support our programs financially, volunteer your time, or enroll in YouthBuild, there is a place for you here.
              </motion.p>
              
              <motion.div variants={STAGGER} className="flex flex-col gap-4">
                <Button size="lg" className="w-full sm:w-auto justify-start text-lg h-14 bg-primary hover:bg-primary/90 rounded-none">
                  Donate to GJA
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto justify-start text-lg h-14 border-primary text-primary hover:bg-primary/5 rounded-none">
                  Volunteer With Us
                </Button>
                <Button size="lg" className="w-full sm:w-auto justify-start text-lg h-14 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-none">
                  Apply to YouthBuild
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
              viewport={{ once: true }}
              className="bg-primary text-primary-foreground p-10 md:p-12 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-3xl mb-8 text-white">Contact Us</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-secondary shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-white mb-1">Location</p>
                      <p className="text-white/80">Garfield Neighborhood<br/>Pittsburgh, PA</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="text-secondary shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-white mb-1">Phone</p>
                      <p className="text-white/80">(412) 665-5200</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 pt-8 border-t border-white/20">
                <p className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Connect</p>
                <div className="flex gap-6">
                  <a href="#" className="text-white/80 hover:text-white transition-colors">LinkedIn</a>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Facebook</a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-8 text-center text-muted-foreground border-t border-border">
        <div className="container mx-auto px-4">
          <Heart className="h-6 w-6 text-secondary mx-auto mb-4" />
          <p className="mb-2 text-sm font-medium text-foreground">Garfield Jubilee Association</p>
          <p className="text-sm">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
