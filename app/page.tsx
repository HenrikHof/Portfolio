"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll } from "framer-motion"
import { Calendar, MessageCircle, Zap, Smartphone, Layers, Search, Users, Network, ExternalLink, Play, Wrench, Brain, TrendingUp, Globe, Mail, X, Sun, Moon } from "lucide-react"
import { playButtonClickSound } from "@/lib/sounds"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  IconHome,
  IconUser,
  IconBriefcase,
  IconSettings,
  IconId,
} from "@tabler/icons-react"
import { FloatingDock } from "@/components/ui/floating-dock"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CometCard } from "@/components/ui/comet-card"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { TracingBeam } from "@/components/ui/tracing-beam"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [businessCardOpen, setBusinessCardOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const { scrollYProgress } = useScroll()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // Add click sounds to all buttons
  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('button')
      // Skip dock buttons (they have their own sounds)
      if (button && !button.closest('[data-dock-item]') && !button.closest('[data-slot="dialog-close"]')) {
        playButtonClickSound()
      }
    }

    document.addEventListener('click', handleButtonClick, true)
    return () => document.removeEventListener('click', handleButtonClick, true)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      // Save to database
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // Also send email as fallback
      const subject = encodeURIComponent(`Consultation Request from ${data.name}`)
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
      )
      window.location.href = `mailto:kontakt@henrikhof.com?subject=${subject}&body=${body}`
      
      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        form.reset()
        setScheduleOpen(false)
      }, 2000)
    } catch (error) {
      console.error("Error submitting form:", error)
      // Still show success to user, but log error
      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        form.reset()
        setScheduleOpen(false)
      }, 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const floatingDockItems = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-muted-foreground" />,
      href: "#intro",
      onClick: () => scrollToSection("intro"),
    },
    {
      title: "About",
      icon: <IconUser className="h-full w-full text-muted-foreground" />,
      href: "#about",
      onClick: () => scrollToSection("about"),
    },
    {
      title: "Services",
      icon: <IconBriefcase className="h-full w-full text-muted-foreground" />,
      href: "#services",
      onClick: () => scrollToSection("services"),
    },
    {
      title: "Video",
      icon: <Play className="h-full w-full text-muted-foreground" />,
      href: "#intro",
      onClick: () => setVideoDialogOpen(true),
    },
    {
      title: "Schedule",
      icon: <Calendar className="h-full w-full text-muted-foreground" />,
      href: "#connect",
      onClick: () => setScheduleOpen(true),
    },
    {
      title: "Business Card",
      icon: <IconId className="h-full w-full text-muted-foreground" />,
      href: "#",
      onClick: () => setBusinessCardOpen(true),
    },
    {
      title: "WhatsApp",
      icon: <MessageCircle className="h-full w-full text-muted-foreground" />,
      href: "https://wa.me/351963429170",
      onClick: () => setWhatsappDialogOpen(true),
    },
    {
      title: "Connect",
      icon: <IconSettings className="h-full w-full text-muted-foreground" />,
      href: "#connect",
      onClick: () => scrollToSection("connect"),
    },
    {
      title: isDark ? "Light Mode" : "Dark Mode",
      icon: isDark ? (
        <Sun className="h-full w-full text-muted-foreground" />
      ) : (
        <Moon className="h-full w-full text-muted-foreground" />
      ),
      href: "#",
      onClick: toggleTheme,
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Henrik Hof",
            "jobTitle": "Software architect delivering custom software and human‑centered AI",
            "description": "Software architect delivering custom software and human‑centered AI. Zero Friction, Just Results.",
            "url": "https://henrikhof.com",
            "image": "https://henrikhof.com/henrikhof.jpg",
            "telephone": "+351963429170",
            "email": "contact@henrikhof.com",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "PT",
              "addressRegion": "Portugal"
            },
            "sameAs": [],
            "knowsAbout": [
              "Next.js",
              "React",
              "TypeScript",
              "Node.js",
              "PostgreSQL",
              "Software Architecture",
              "AI Integration",
              "Custom Software Development"
            ],
            "offers": {
              "@type": "Service",
              "serviceType": "Technology Consulting",
              "name": "Strategic Technology Consulting & Software Architecture",
              "description": "Custom software development, AI integration, and scalable architecture solutions",
              "areaServed": {
                "@type": "Country",
                "name": "Worldwide"
              },
              "provider": {
                "@type": "Person",
                "name": "Henrik Hof"
              },
              "availableChannel": {
                "@type": "ServiceChannel",
                "serviceUrl": "https://henrikhof.com",
                "servicePhone": "+351963429170",
                "serviceSmsNumber": "+351963429170"
              }
            },
            "worksFor": {
              "@type": "ProfessionalService",
              "name": "Henrik Hof - Technology Consulting",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PT",
                "addressRegion": "Portugal"
              },
              "telephone": "+351963429170",
              "url": "https://henrikhof.com"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Henrik Hof - Software architect delivering custom software and human‑centered AI",
            "description": "Software architect delivering custom software and human‑centered AI. Custom software, AI integration, and scalable architecture solutions.",
            "url": "https://henrikhof.com",
            "image": "https://henrikhof.com/henrikhof.jpg",
            "telephone": "+351963429170",
            "email": "contact@henrikhof.com",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "PT",
              "addressRegion": "Portugal"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "addressCountry": "PT"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Worldwide"
            },
            "serviceType": [
              "Technology Consulting",
              "Software Architecture",
              "Custom Software Development",
              "AI Integration",
              "Next.js Development",
              "React Development"
            ],
            "founder": {
              "@type": "Person",
              "name": "Henrik Hof"
            },
            "priceRange": "$$"
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Henrik Hof - Technology Consultant",
            "url": "https://henrikhof.com",
            "description": "Software architect delivering custom software and human‑centered AI",
            "author": {
              "@type": "Person",
              "name": "Henrik Hof"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://henrikhof.com?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <div className="min-h-screen bg-background text-foreground relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-foreground origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {[
            "intro",
            "about",
            "services",
            "process",
            "technologies",
            "testimonials",
            "case-studies",
            "approach",
            "why-me",
            "connect",
          ].map((section) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 relative">
        <header id="intro" ref={(el) => { sectionsRef.current[0] = el }} className="min-h-screen flex items-center relative overflow-hidden pt-16 sm:pt-0">
          {/* Subtle background beams effect - very low opacity for professional look */}
          <BackgroundBeams className="opacity-[0.15] dark:opacity-[0.08] pointer-events-none" />
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-3 space-y-6 sm:space-y-8"
            >
              <div className="space-y-3 sm:space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight"
                >
                  Henrik
                  <br />
                  <span className="text-muted-foreground">Hof</span>
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-6 max-w-md"
              >
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Software architect delivering custom software and human‑centered AI with
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-foreground bg-clip-text text-transparent font-medium dark:from-purple-300 dark:via-pink-300"> Next.js</span> and
                  <span className="text-[#61DAFB] font-medium"> React Development</span>. Zero Friction, Just Results.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Zap className="h-4 w-4 text-foreground" />
                    <span>Instant load times</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Smartphone className="h-4 w-4 text-foreground" />
                    <span>Seamless mobile experiences</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Layers className="h-4 w-4 text-foreground" />
                    <span>Architecture built to scale with your growth</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => {
                        playButtonClickSound()
                        setScheduleOpen(true)
                      }}
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors duration-300 font-medium whitespace-nowrap text-sm sm:text-base"
                    >
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">Schedule Consultation</span>
                    </button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => {
                        playButtonClickSound()
                        setWhatsappDialogOpen(true)
                      }}
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-border rounded-lg hover:border-muted-foreground/50 transition-colors duration-300 font-medium whitespace-nowrap text-sm sm:text-base"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">Send WhatsApp</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="lg:col-span-2 flex flex-col justify-center space-y-6 sm:space-y-8 mt-8 lg:mt-0"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted/40 dark:bg-muted/20">
                <Image
                  src="/henrik.png"
                  alt="Henrik Hof - Software architect delivering custom software and human‑centered AI"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full border border-foreground/30 animate-ripple-1"></div>
                    <div className="absolute inset-0 rounded-full border border-foreground/30 animate-ripple-2"></div>
                    <div className="absolute inset-0 rounded-full border border-foreground/30 animate-ripple-3"></div>
                    <button
                      onClick={() => {
                        playButtonClickSound()
                        setVideoDialogOpen(true)
                      }}
                      className="relative scale-90 p-2.5 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-300 hover:scale-100 group z-10"
                      aria-label="Play video"
                    >
                      <Play className="h-4 w-4 text-foreground fill-foreground ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">AVAILABILITY</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-foreground">One client at a time</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"].map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05, borderColor: "hsl(var(--muted-foreground))" }}
                      className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        <AnimatedSection id="about" sectionRef={(el) => { sectionsRef.current[1] = el }}>
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light text-balance">
              Operational Transformation with <span className="text-foreground">Custom Software + Human‑Centered AI</span>
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              I come in, get a clear picture of where you are now, then design and ship software that removes
              bottlenecks, supports your team with practical AI, and scales without drama.
            </p>

            <div className="grid gap-8 sm:gap-12 lg:grid-cols-3">
              {[
                {
                  title: "Diagnosis → Plan",
                  description:
                    "Hands‑on discovery with stakeholders and systems. Clear problem statements, KPIs, and a pragmatic roadmap you can execute against.",
                  icon: Search,
                },
                {
                  title: "Human‑Centered AI",
                  description:
                    "AI that enhances people, not replaces them. Assistive automation, decision support, and safe guardrails integrated into workflows.",
                  icon: Users,
                },
                {
                  title: "Scalable Architecture",
                  description:
                    "Modern, cloud‑ready systems with clean, functional design principles, built to evolve without rewrites.",
                  icon: Network,
                },
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                    className="space-y-4 p-6 rounded-lg border border-border/50 hover:border-border transition-all duration-300"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5, type: "spring" }}
                    >
                      <IconComponent className="h-6 w-6 text-foreground shrink-0 mb-4" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-medium">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="services" sectionRef={(el) => { sectionsRef.current[2] = el }}>
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light">What I Deliver</h2>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              End‑to‑end solutions, from diagnosis and architecture to development, AI augmentation, and scalable operations.
            </p>

            <div className="space-y-8 sm:space-y-12">
              {[
                { title: "Discovery & Diagnosis", description: "Stakeholder interviews, system review, and data analysis to surface constraints and opportunities." },
                { title: "Architecture & Roadmap", description: "Target architecture, integration strategy, and an incremental delivery plan that de‑risks change." },
                { title: "Custom Software Development", description: "Next.js/React, Node.js, and cloud services to build products, internal tools, and APIs that fit your workflows." },
                { title: "AI Augmentation (Human‑in‑the‑Loop)", description: "Copilots, automations, and decision support that keep people in control while multiplying throughput." },
                { title: "Workflow Automation & Integration", description: "Connect CRMs, ERPs, data pipelines, and third‑party APIs to eliminate swivel‑chair work." },
                { title: "DevOps, SRE & Observability", description: "CI/CD, IaC, cost‑aware scaling, and metrics that make reliability and iteration speed the default." },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="group py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <motion.span
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 90 }}
                        className="text-sm text-muted-foreground font-mono mt-1"
                      >
                        ▼
                      </motion.span>
                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg sm:text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="process" sectionRef={(el) => { sectionsRef.current[3] = el }}>
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light">How I Work</h2>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              No fluff. Clear steps, steady delivery, measurable outcomes.
            </p>

            <TracingBeam className="max-w-4xl">
              <div className="space-y-8 sm:space-y-12">
              {[
                {
                  step: "01",
                  title: "Discovery & Diagnosis",
                  description:
                    "Stakeholder workshops, system walkthroughs, and data review to identify bottlenecks, risks, and high‑leverage opportunities.",
                },
                {
                  step: "02",
                  title: "Target Architecture",
                  description:
                    "Define the domain boundaries, integrations, and platform choices. Document a roadmap that balances time‑to‑value with long‑term maintainability.",
                },
                {
                  step: "03",
                  title: "Build & Integrate",
                  description:
                    "Ship iteratively with strong engineering practices: clean, functional code; automated testing; CI/CD; and observability from day one.",
                },
                {
                  step: "04",
                  title: "AI Augmentation",
                  description:
                    "Introduce human‑in‑the‑loop automations and copilots that enhance your team’s throughput while preserving oversight and safety.",
                },
                {
                  step: "05",
                  title: "Operate & Evolve",
                  description:
                    "Runbooks, SLOs, training, and a cadence of improvements. Scale efficiently with cloud‑native practices and cost visibility.",
                },
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500"
                    >
                      {phase.step}
                    </motion.div>
                  </div>

                  <div className="lg:col-span-10 space-y-3">
                    <h3 className="text-lg sm:text-xl font-medium">{phase.title}</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">{phase.description}</p>
                  </div>
                </motion.div>
              ))}
              </div>
            </TracingBeam>
          </div>
        </AnimatedSection>

        <AnimatedSection id="technologies" sectionRef={(el) => { sectionsRef.current[4] = el }}>
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light">Technologies</h2>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Modern tools and platforms I work with to build exceptional solutions
            </p>

            <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
              {[
                {
                  category: "Frontend",
                  tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
                },
                {
                  category: "Backend",
                  tech: ["Node.js", "PostgreSQL", "GraphQL", "REST APIs"],
                },
                {
                  category: "Cloud & DevOps",
                  tech: ["AWS", "Docker", "CI/CD", "Vercel"],
                },
                {
                  category: "Tools & Platforms",
                  tech: ["Git", "Figma", "Postman", "Analytics"],
                },
              ].map((group, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm text-muted-foreground font-mono">{group.category.toUpperCase()}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.tech.map((tech) => (
                      <motion.span
                        key={tech}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-3 py-1 text-sm border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="testimonials" sectionRef={(el) => { sectionsRef.current[5] = el }}>
          <div className="space-y-12 sm:space-y-16">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Client testimonials and case study results coming soon
                </p>
                <p className="text-base text-muted-foreground/70">
                  Real feedback from real projects, check back for authentic client experiences
                </p>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="case-studies" sectionRef={(el) => { sectionsRef.current[6] = el }}>
          <div className="space-y-12 sm:space-y-16">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Case Studies coming soon
                </p>
                <p className="text-base text-muted-foreground/70">
                  Detailed project breakdowns and results, check back for in-depth case studies
                </p>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="approach" sectionRef={(el) => { sectionsRef.current[7] = el }}>
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light text-balance">
              How I Work
            </h2>

            <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
              {[
                {
                  title: "Architect + Builder",
                  description:
                    "I don't hand off diagrams. I design the architecture and help build it, owning outcomes end to end.",
                  icon: Wrench,
                },
                {
                  title: "Human‑Centered AI",
                  description:
                    "AI is used to enhance teams: copilots, automations, and decision support with human oversight, not black‑box replacements.",
                  icon: Brain,
                },
                {
                  title: "Scale by Design",
                  description:
                    "Infrastructure‑as‑Code, CI/CD, observability, and clean functional code so the system stays fast and affordable as you grow.",
                  icon: TrendingUp,
                },
                {
                  title: "Agile Global Delivery",
                  description:
                    "I lead a small, distributed network of senior developers, spinning up the right skills quickly without agency overhead.",
                  icon: Globe,
                },
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                    className="space-y-4 p-6 rounded-lg border border-border/50 hover:border-border transition-all duration-300"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5, type: "spring" }}
                    >
                      <IconComponent className="h-6 w-6 text-foreground shrink-0 mb-4" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-medium">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="why-me" sectionRef={(el) => { sectionsRef.current[8] = el }}>
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light">Why Work With Me</h2>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              I blend software architecture, product thinking, design, and marketing into one outcome‑driven practice.
              The result: systems that are technically sound, usable, measurable, and aligned with business goals.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection id="connect" sectionRef={(el) => { sectionsRef.current[10] = el }}>
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-light">Let's Work Together</h2>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Ready for a solution that's fast, scalable, and built to last? Let's discuss your project.
                </p>

                <p className="text-base text-muted-foreground leading-relaxed">
                  Your solution receives dedicated focus and comprehensive attention from initial concept through ongoing maintenance.
                </p>

                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => setScheduleOpen(true)}
                      className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                    >
                      <span className="text-base sm:text-lg">Contact Me</span>
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-sm text-muted-foreground font-mono">CONNECT</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Schedule Call", url: "#connect" },
                  { name: "WhatsApp", url: "#", onClick: () => setWhatsappDialogOpen(true) },
                  { name: "LinkedIn", url: "#" },
                  { name: "GitHub", url: "#" },
                ].map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -3 }}
                  >
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="block w-full p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm text-left"
                      >
                        <div className="text-foreground">{link.name}</div>
                      </button>
                    ) : link.url.startsWith("http") ? (
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                      >
                        <div className="text-foreground">{link.name}</div>
                      </Link>
                    ) : (
                      <Link
                        href={link.url}
                        className="block p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                      >
                        <div className="text-foreground">{link.name}</div>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        <footer className="py-12 sm:py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Henrik Hof. All rights reserved.</div>
              <div className="text-xs text-muted-foreground">Software Architect • Custom Software + Human‑Centered AI • Scalable Systems</div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>

      <FloatingDock items={floatingDockItems} />

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="!max-w-md !w-[calc(100vw-1rem)] sm:!max-w-md sm:!w-auto !mx-2 sm:!mx-auto !max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">Schedule a Consultation</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground/80 mt-2">
              Let's discuss your project and how I can help bring your vision to life.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                  >
                    {isSubmitting ? "Sending..." : submitSuccess ? "Sent!" : "Send Message"}
                  </Button>
                  <button
                    onClick={() => {
                      setScheduleOpen(false)
                      setWhatsappDialogOpen(true)
                    }}
                    className="flex items-center justify-center gap-2 flex-1 px-5 py-3 border border-border/50 rounded-md hover:border-border hover:bg-muted/30 transition-all duration-200 text-sm font-medium"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
        <DialogContent className="!max-w-md !w-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-light">Connect via WhatsApp</DialogTitle>
            </div>
            <DialogDescription className="text-sm sm:text-base text-muted-foreground/80 mt-2">
              Choose how you'd like to get in touch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                window.open("https://wa.me/351963429170", "_blank", "noopener,noreferrer")
                setWhatsappDialogOpen(false)
              }}
              className="group w-full flex items-center justify-between px-4 py-3 border border-border/50 rounded-lg hover:border-border hover:bg-muted/30 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-4">
                <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Open in WhatsApp</span>
                  <span className="text-sm text-muted-foreground mt-0.5">Launch WhatsApp in a new window</span>
                </div>
              </div>
              <svg 
                className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={() => {
                setWhatsappDialogOpen(false)
                setScheduleOpen(true)
              }}
              className="group w-full flex items-center justify-between px-4 py-3 border border-border/50 rounded-lg hover:border-border hover:bg-muted/30 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-4">
                <MessageCircle className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Request Contact</span>
                  <span className="text-sm text-muted-foreground mt-0.5">Send a message through our form</span>
                </div>
              </div>
              <svg 
                className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-light">About My Work</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-muted-foreground/80 mt-2">
              Learn more about how I approach projects and deliver results
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/20 border border-border">
              <iframe
                src="https://www.youtube.com/embed/jN0eHND314A?rel=0&modestbranding=1"
                title="About My Work - Henrik Hof"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="space-y-3 pt-2">
              <p className="text-xs sm:text-sm text-muted-foreground text-center px-2">
                If you'd like to discuss how I can help with your project, feel free to reach out.
              </p>
              <button
                onClick={() => {
                  playButtonClickSound()
                  setVideoDialogOpen(false)
                  setWhatsappDialogOpen(true)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#25D366]/30 rounded-lg hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-200 text-sm font-medium text-foreground"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Contact via WhatsApp
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={businessCardOpen} onOpenChange={setBusinessCardOpen}>
        <DialogContent 
          className="!max-w-[90vw] sm:!max-w-[504px] !w-auto !p-6 sm:!p-8 !bg-transparent !border-none !shadow-none"
          showCloseButton={false}
          noPadding={true}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Business Card</DialogTitle>
          </DialogHeader>
          {/* Business Card: 1.5x size = 504px x 288px (scaled up from 3.5" x 2") */}
          <div className="flex flex-col items-center gap-6">
            {/* Card container */}
            <div className="w-full max-w-[504px] aspect-[336/192] h-auto sm:h-[288px] p-0 m-0">
              <CometCard 
                rotateDepth={17.5}
                translateDepth={20}
                className="w-full h-full !m-0"
              >
                <div className="w-full h-full bg-background border border-border/50 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden rounded-2xl">
                  <div className="relative z-10 space-y-2 sm:space-y-3">
                    {/* Name - matching homepage style */}
                    <div className="space-y-0">
                      <h2 className="text-2xl sm:text-3xl font-light tracking-tight leading-none">
                        Henrik
                      </h2>
                      <h2 className="text-2xl sm:text-3xl font-light tracking-tight leading-none text-muted-foreground">
                        Hof
                      </h2>
                    </div>

                    {/* Description - matching homepage style */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Software architect delivering custom software and human‑centered AI with
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-foreground bg-clip-text text-transparent font-medium dark:from-purple-300 dark:via-pink-300"> Next.js</span> and
                      <span className="text-[#61DAFB] font-medium"> React Development</span>. Zero Friction, Just Results.
                    </p>

                    {/* Contact Info - matching homepage bullet point style */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-foreground flex-shrink-0" />
                        <a 
                          href="mailto:kontakt@henrikhof.com" 
                          className="text-xs sm:text-sm hover:text-foreground transition-colors truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          kontakt@henrikhof.com
                        </a>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-foreground flex-shrink-0" />
                        <a 
                          href="https://wa.me/351963429170" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm hover:text-foreground transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          +351 963 429 170
                        </a>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                        <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-foreground flex-shrink-0" />
                        <a 
                          href="https://henrikhof.com" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm hover:text-foreground transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          henrikhof.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CometCard>
            </div>
            
            {/* Close button positioned outside and below the card */}
            <button
              onClick={() => setBusinessCardOpen(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-background transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 group font-medium text-sm sm:text-base"
              aria-label="Close preview"
            >
              <X className="h-4 w-4 text-foreground/70 group-hover:text-foreground transition-colors" />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">Close preview</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  )
}

function AnimatedSection({
  id,
  sectionRef,
  children,
}: {
  id: string
  sectionRef: (el: HTMLElement | null) => void
  children: React.ReactNode
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      id={id}
      ref={(el) => {
        sectionRef(el)
        // @ts-ignore
        ref.current = el
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen py-20 sm:py-32"
    >
      {children}
    </motion.section>
  )
}

