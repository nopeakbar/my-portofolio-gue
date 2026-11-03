"use client";

import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  ExternalLink,
  Briefcase,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  ArrowUpRight
} from 'lucide-react';

export default function Portfolio() {
  const [showAllExperiences, setShowAllExperiences] = useState(false);

  // ==========================================
  // 1. DATA SELECTED PROJECTS
  // ==========================================
  type ProjectItem = {
    title: string;
    category: string;
    company: string;
    companyAbbr: string;
    logo?: string;
    period: string;
    description: string;
    outcome: string;
    bullets: string[];
    tags: string[];
    link?: string;
    github?: string;
  };

  const selectedProjects: ProjectItem[] = [
    {
      title: "Anythink: Full-Stack Platform Migration",
      category: "System Modernization",
      company: "berijalan",
      companyAbbr: "BJ",
      logo: "/logo/berijalan.png",
      period: "Oct 2026 — Present",
      description: "Migrated Anythink, an established multi-tenant AI Workplace platform, from a legacy Laravel monolith into a decoupled Next.js and Express.js architecture.",
      outcome: "Modernized backend services to support low-latency token streaming while hardening zero-trust security boundaries to prevent cross-tenant data leakage.",
      bullets: [
        "Migrated monolithic PHP/Laravel backend services to a decoupled Express.js runtime, enabling high-throughput async processing and Server-Sent Events (SSE) token streaming.",
        "Rebuilt the frontend using Next.js App Router, introducing strict schema validation and isolated tenant contexts to safeguard enterprise knowledge assets.",
      ],
      tags: ["Next.js", "Express.js", "TypeScript", "Multi-Tenant RAG", "Enterprise Security", "PostgreSQL"],
      link: "https://berijalan.co.id/"
    },
    {
      title: "AI FinOps Gateway: Two-Tier Cost Optimizer",
      category: "AI Infrastructure & Inference Optimization",
      company: "berijalan Techno Center",
      companyAbbr: "BTC",
      logo: "/logo/berijalan.png",
      period: "Sep 2026 – Oct 2026",
      description: "Architected a dual-stage middleware gateway to aggressively minimize corporate LLM API operating expenditures across enterprise RAG knowledge bases.",
      outcome: "Eliminated 100% API cost on semantic hits, with 25% token reduction driving 30%+ inference cost savings.",
      bullets: [
        "Engineered Layer-1 Semantic Caching to intercept semantically identical user queries using cosine similarity matching, returning cached outputs in under 50ms.",
        "Integrated Layer-2 Microsoft LLMLingua-2 prompt compression to prune syntactic noise and redundant context tokens before dispatching calls to the LLM."
      ],
      tags: ["Microsoft LLMLingua-2", "Semantic Caching", "Vector Similarity", "Redis", "FinOps", "Node.js"]
    },
    {
      title: "Bandha: AI Financial & Cloud Ecosystem",
      category: "Full-Stack AI & Cloud Infrastructure",
      company: "Personal Project",
      companyAbbr: "BND",
      period: "Feb 2026 – Present",
      description: "Architected an end-to-end financial intelligence ecosystem powered by a Quad-LLM engine and deployed on containerized production cloud infrastructure.",
      outcome: "Containerized and automated zero-downtime CI/CD deployment on AWS EC2 t3.micro with heavily optimized memory footprint.",
      bullets: [
        "Constructed a multi-model backend orchestrating Gemini 2.5 Flash, Whisper v3, Llama 3.3, and GPT OSS 120b for automated receipt OCR and conversational analysis.",
        "Engineered automated infrastructure using Docker, Nginx reverse proxy, and GitHub Actions CI/CD pipeline on AWS EC2."
      ],
      tags: ["AWS EC2", "Docker", "Flutter", "Node.js", "CI/CD", "Nginx"],
      github: "https://github.com/nopeakbar/aws-personal-expese.git",
      link: "https://nopeakbar-bandha-live-demo.vercel.app/"
    },
    {
      title: "NVIDIA Stock Price Prediction (Bi-LSTM)",
      category: "Deep Learning & Time-Series Research",
      company: "Bachelor's Thesis (UPNYK)",
      companyAbbr: "UPN",
      logo: "/logo/logo-upn.png",
      period: "Feb 2026",
      description: "Investigated the quantitative impact of technical indicator features on stock market price prediction accuracy using recurrent deep learning algorithms.",
      outcome: "Evaluated 10 model variants to identify optimal window configurations, achieving 2.29% MAPE and 3.13 RMSE on test distributions.",
      bullets: [
        "Designed and trained Bidirectional Long Short-Term Memory (Bi-LSTM) networks over multi-year high-frequency financial datasets.",
        "Engineered an interactive validation dashboard in Next.js to benchmark baseline configurations against optimized multi-feature configurations."
      ],
      tags: ["Python", "Bi-LSTM", "TensorFlow", "Time-Series", "Next.js", "Financial ML"],
      github: "https://github.com/nopeakbar/stocks-prediction-thesis.git",
      link: "https://stocks-prediction-thesis-nopeakbar.vercel.app/"
    }
  ];

  // ==========================================
  // 2. DATA EXPERIENCE
  // ==========================================
  type BulletPoint = {
    title: string;
    desc: string;
  };

  type RoleTimelineItem = {
    role: string;
    type: string;
    period: string;
  };

  type ExperienceItem = {
    company: string;
    companySubtitle?: string;
    period: string;
    location: string;
    logo: string; // path ke public/logo/
    scope: string;
    bullets: BulletPoint[];
    role?: string;
    rolesTimeline?: RoleTimelineItem[];
  };

  const experiences: ExperienceItem[] = [
    {
      company: "berijalan",
      companySubtitle: "PT Cipta Sedaya Digital Indonesia (CSDI)",
      period: "Jul 2026 — Present",
      location: "Yogyakarta, Indonesia",
      logo: "/logo/berijalan.png",
      rolesTimeline: [
        {
          role: "Fullstack Developer",
          type: "Freelance",
          period: "Oct 2026 — Present"
        },
        {
          role: "Fullstack Developer Intern",
          type: "Bootcamp Batch 18 · Internship",
          period: "Jul 2026 — Oct 2026"
        }
      ],
      scope: "Contributing to the full-stack modernization and architectural security hardening of Anythink (Astra Credit Companies), while previously engineering cost-efficient generative AI middleware during the enterprise bootcamp track.",
      bullets: [
        {
          title: "Full-Stack Modernization",
          desc: "Migrated legacy monolithic Laravel services into an Express.js backend and Next.js client, enabling high-throughput async processing and Server-Sent Events (SSE) token streaming."
        },
        {
          title: "Inference Cost Optimizer",
          desc: "Architected a Two-Tier Optimization Engine for corporate RAG, combining Layer-1 Semantic Caching (saving 100% API cost on hits) with Layer-2 Microsoft LLMLingua-2 prompt compression (25% token reduction, driving 30%+ inference cost savings)."
        },
        {
          title: "Tenant Data Boundary",
          desc: "Enforced strict schema validation and multi-tenant isolation contexts in the application layer to completely eliminate cross-tenant document and vector data leakage."
        },
        {
          title: "Security Hardening",
          desc: "Re-architected authentication using zero-trust stateless tokens, strict CORS policies, and role-based access control (RBAC) to meet enterprise compliance."
        },
        {
          title: "Progressive Excellence",
          desc: "Received the Best Progressive Developer award among Bootcamp Batch 18 cohort participants for shipping viable, production-focused engineering improvements."
        }
      ]
    },
    {
      role: "Co-Founder & Software Engineer",
      company: "KickOff Studio",
      companySubtitle: "KickOff Studio · Entrepreneurship",
      period: "May 2026 — Present",
      location: "Yogyakarta, Indonesia",
      logo: "/logo/kickoffstudio.png",
      scope: "Directing full-stack web architecture, transactional automation, and cloud edge routing for an on-demand merchandise e-commerce platform.",
      bullets: [
        {
          title: "Full-Stack Web Architecture",
          desc: "Engineered an end-to-end custom merchandise ordering platform with Next.js App Router and Tailwind CSS, featuring interactive design customizers."
        },
        {
          title: "Operational Automation",
          desc: "Automated customer invoice delivery pipelines and configured Cloudflare DNS edge routing to guarantee zero checkout downtime."
        }
      ]
    },
    {
      role: "AI Trainer",
      company: "Outlier.ai",
      companySubtitle: "Outlier.ai · Contract",
      period: "Jul 2026 — Present",
      location: "Remote, United States",
      logo: "/logo/outlierai.svg",
      scope: "Conducting systematic evaluation and calibration on frontier generative multimodal and voice AI models for safety and logical reasoning.",
      bullets: [
        {
          title: "Model Alignment & RLHF",
          desc: "Performed rigorous pairwise quality evaluations and adversarial stress tests to optimize RLHF datasets for next-gen conversational models."
        },
        {
          title: "Instruction & Logic Verification",
          desc: "Audited complex instruction adherence, step-by-step reasoning veracity, and hallucination containment across technical domains."
        }
      ]
    },
    {
      role: "Frontend Developer Intern",
      company: 'LPPM UPN "Veteran" Yogyakarta',
      companySubtitle: 'LPPM UPN "Veteran" Yogyakarta · Internship',
      period: "Feb 2025 — Apr 2025",
      location: "Yogyakarta, Indonesia",
      logo: "/logo/upn.png",
      scope: "Digitized university publication management workflows, replacing legacy manual paperwork with a centralized administrative web platform.",
      bullets: [
        {
          title: "Workflow Digitization",
          desc: "Transformed manual ISBN filing into a digitized submission portal using PHP and MySQL, streamlining validation checkpoints for university researchers."
        }
      ]
    }
  ];

  return (
    <div className="bg-[#FAFAFA] text-[#18181B] selection:bg-zinc-200 selection:text-zinc-900 font-sans antialiased min-h-screen">
      <Analytics />
      <SpeedInsights />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="lg:flex lg:justify-between lg:gap-16">

          {/* ======================================================== */}
          {/* STICKY SIDEBAR / PERSONAL HEADER (DESKTOP)               */}
          {/* ======================================================== */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-5/12 lg:flex-col lg:justify-between lg:py-24 py-16">
            <div>
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Open to Opportunities</span>
              </div>

              {/* Identity & Core Role */}
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 font-sans">
                Noveanto Nur Akbar
              </h1>
              <h2 className="mt-3 text-lg sm:text-xl font-medium text-zinc-600 tracking-tight">
                AI & Software Engineer
              </h2>

              {/* Bio */}
              <div className="mt-6 space-y-3 text-sm leading-relaxed text-zinc-600 max-w-sm">
                <p>
                  I am an <span className="text-zinc-900 font-medium">AI & Software Engineer</span> bridging intelligent models with production-grade web applications, with a strong focus on enterprise RAG systems, inference cost optimization, and secure data infrastructure.
                </p>
                <p>
                  Most recently at <span className="text-zinc-900 font-medium">berijalan</span>, I&apos;ve been contributing to Anythink, an enterprise AI workplace built for <span className="text-zinc-900 font-medium">Astra Credit Companies (ACC)</span>. My focus centers on full-stack migration using Next.js and Express.js, alongside engineering <span className="text-zinc-900 font-medium">two-tier caching pipelines</span> to eliminate redundant LLM token expenses. Beyond retrieval engines, I actively explore defensive data architectures (including <span className="text-zinc-900 font-medium">PII masking, Text-to-SQL, and AST firewalls</span>) and containerized cloud backends.
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="mt-8 flex items-center gap-3">
                <a
                  href="/CV_Noveanto-Nur-Akbar.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-sm transition duration-150"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download CV
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-lg transition duration-150"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </a>
              </div>

              {/* Quick Navigation Links */}
              <nav aria-label="In-page jump links" className="hidden lg:block mt-16">
                <ul className="space-y-4">
                  <li>
                    <a className="group flex items-center py-1" href="#experience">
                      <span className="mr-3 h-[1px] w-6 bg-zinc-300 transition-all duration-300 group-hover:w-9 group-hover:bg-zinc-950"></span>
                      <span className="text-xs font-mono tracking-widest uppercase text-zinc-500 group-hover:text-zinc-950 font-medium">
                        01 // Experience
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="group flex items-center py-1" href="#selected-work">
                      <span className="mr-3 h-[1px] w-6 bg-zinc-300 transition-all duration-300 group-hover:w-9 group-hover:bg-zinc-950"></span>
                      <span className="text-xs font-mono tracking-widest uppercase text-zinc-500 group-hover:text-zinc-950 font-medium">
                        02 // Selected Work
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="group flex items-center py-1" href="#contact">
                      <span className="mr-3 h-[1px] w-6 bg-zinc-300 transition-all duration-300 group-hover:w-9 group-hover:bg-zinc-950"></span>
                      <span className="text-xs font-mono tracking-widest uppercase text-zinc-500 group-hover:text-zinc-950 font-medium">
                        03 // Get In Touch
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Social Media Connect */}
            <div className="mt-12 lg:mt-0 flex items-center gap-5 text-zinc-400">
              <a
                aria-label="GitHub Profile"
                className="hover:text-zinc-900 transition-colors"
                href="https://github.com/nopeakbar"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                aria-label="LinkedIn Profile"
                className="hover:text-zinc-900 transition-colors"
                href="https://www.linkedin.com/in/noveanto-nur-akbar/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                aria-label="Email Noveanto Nur Akbar"
                className="hover:text-zinc-900 transition-colors"
                href="mailto:nopeakbar@gmail.com"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </header>

          {/* ======================================================== */}
          {/* MAIN STREAM CONTENT AREA (RIGHT SIDE)                    */}
          {/* ======================================================== */}
          <main className="lg:w-7/12 lg:py-24 pb-24 space-y-24">

            {/* SECTION: EXPERIENCE (AUTHENTIC ENGINEERING LOG STYLE) */}
            <section className="scroll-mt-24" id="experience">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-4 w-1 bg-zinc-900 rounded-full"></span>
                <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-500">
                  Experience
                </h2>
              </div>

              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <article
                    key={index}
                    className="bg-white border border-zinc-200/90 rounded-xl p-6 sm:p-7 shadow-sm hover:border-zinc-300 transition-all duration-200"
                  >
                    {/* Header Bersih & Responsif: Kiri Identitas Peran / Perusahaan, Kanan Logo (Selalu Top-Right) */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4 pb-4 mb-4 border-b border-zinc-100">
                      <div className="flex-1 min-w-0 pr-1 sm:pr-0">
                        {exp.rolesTimeline ? (
                          <>
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                              <h3 className="text-base sm:text-xl font-bold text-zinc-950 tracking-tight leading-snug">
                                {exp.company}
                              </h3>
                              {exp.companySubtitle && (
                                <span className="text-xs text-zinc-400 font-mono">
                                  · {exp.companySubtitle}
                                </span>
                              )}
                            </div>

                            {/* Mobile Total Timeline & Location */}
                            <div className="sm:hidden mt-1 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 flex-wrap">
                              <span>{exp.period}</span>
                              <span>·</span>
                              <span>{exp.location}</span>
                            </div>

                            {/* Compact Roles Timeline */}
                            <div className="space-y-2 mt-2.5">
                              {exp.rolesTimeline.map((item, rIdx) => (
                                <div key={rIdx} className="text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        rIdx === 0 ? "bg-zinc-900" : "bg-zinc-400"
                                      }`}
                                    />
                                    <span className="font-semibold text-zinc-900 leading-tight">
                                      {item.role}
                                    </span>
                                  </div>
                                  <div className="pl-3 mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                                    <span className="bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded text-[10px]">
                                      {item.type}
                                    </span>
                                    <span>·</span>
                                    <span className="text-zinc-400">{item.period}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="text-base sm:text-xl font-bold text-zinc-950 tracking-tight leading-snug">
                              {exp.role}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-zinc-500">
                              {exp.companySubtitle?.split("·").map((part, pIdx, arr) => (
                                <React.Fragment key={pIdx}>
                                  <span className={pIdx === 0 ? "font-semibold text-zinc-800" : "text-zinc-400"}>
                                    {part.trim()}
                                  </span>
                                  {pIdx < arr.length - 1 && <span>·</span>}
                                </React.Fragment>
                              ))}
                            </div>

                            {/* Mobile Period & Location */}
                            <div className="sm:hidden mt-1 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 flex-wrap">
                              <span>{exp.period}</span>
                              <span>·</span>
                              <span>{exp.location}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Right: Logo (Pinned Top-Right di Mobile & Desktop) + Desktop Timeline */}
                      <div className="shrink-0 flex flex-col items-end gap-1 sm:gap-1.5 pt-0.5">
                        {exp.logo && (
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            className="h-5 sm:h-6 max-h-6 w-auto max-w-[75px] sm:max-w-[120px] object-contain object-right rounded-sm"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        )}
                        <div className="hidden sm:block text-right">
                          <span className="text-xs font-mono font-medium text-zinc-700 block">
                            {exp.period}
                          </span>
                          <span className="text-[11px] text-zinc-400 block">
                            {exp.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scope / Context (Unified Single Description) */}
                    <p className="text-sm leading-relaxed text-zinc-600 mb-4">
                      {exp.scope}
                    </p>

                    {/* Key Deliverables with Lead-ins (Standar Senior Tech) */}
                    <div className="space-y-3 text-xs sm:text-sm text-zinc-600">
                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5">
                          <span className="text-zinc-400 font-mono text-sm leading-none mt-0.5 select-none">•</span>
                          <p className="leading-relaxed">
                            <strong className="text-zinc-900 font-medium">{bullet.title}:</strong> {bullet.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* SECTION 2: SELECTED WORK (GRID 2 KOLOM IDENTIK DENGAN GHOZY) */}
            <section className="scroll-mt-24" id="selected-work">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-4 w-1 bg-zinc-900 rounded-full"></span>
                <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-500">
                  Selected Work
                </h2>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                  Products and Systems With Measurable Outcomes
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* CARD 1: ANYTHINK MIGRATION */}
                <article className="group bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
                  <div>
                    {/* Top Header: Title & Company/Date */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors leading-snug">
                        <a
                          href="https://berijalan.co.id/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline focus:outline-none"
                        >
                          Anythink Full-Stack Migration <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">→</span>
                        </a>
                      </h4>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-medium text-zinc-500 block">berijalan</span>
                        <span className="text-[11px] font-mono text-zinc-400 block">Oct 2026</span>
                      </div>
                    </div>

                    {/* Category Label */}
                    <span className="block text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500 mb-3">
                      FULL-STACK & SYSTEM MIGRATION
                    </span>

                    {/* 1 Sentence Description */}
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-3">
                      Decoupled monolithic Laravel services into an Express.js runtime and Next.js interface.
                    </p>

                    {/* Measurable Outcome */}
                    <p className="text-xs sm:text-sm font-medium text-zinc-900 leading-relaxed">
                      Hardened zero-trust tenant boundaries and enabled low-latency SSE streaming.
                    </p>
                  </div>

                  {/* Tech Stack Footer (Inline Dot Separator) */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400 leading-relaxed">
                    Next.js · Express.js · Multi-Tenant RAG · TypeScript · PostgreSQL
                  </div>
                </article>

                {/* CARD 2: AI FINOPS GATEWAY */}
                <article className="group bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors leading-snug">
                        <a
                          href="https://berijalan.co.id/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline focus:outline-none"
                        >
                          AI FinOps Gateway <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">→</span>
                        </a>
                      </h4>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-medium text-zinc-500 block">berijalan</span>
                        <span className="text-[11px] font-mono text-zinc-400 block">Oct 2026</span>
                      </div>
                    </div>

                    <span className="block text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500 mb-3">
                      AI INFRASTRUCTURE & INFERENCE
                    </span>

                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-3">
                      Two-tier caching middleware utilizing semantic search and Microsoft LLMLingua-2.
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-zinc-900 leading-relaxed">
                      Eliminated 100% API cost on semantic hits, with 25% token reduction driving 30%+ inference cost savings.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400 leading-relaxed">
                    Semantic Caching · LLMLingua-2 · Redis · Vector DB · Node.js
                  </div>
                </article>

                {/* CARD 3: BANDHA CLOUD ECOSYSTEM */}
                <article className="group bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors leading-snug">
                        <a
                          href="https://nopeakbar-bandha-live-demo.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline focus:outline-none"
                        >
                          Bandha Cloud & Multi-LLM <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">→</span>
                        </a>
                      </h4>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-medium text-zinc-500 block">Personal</span>
                        <span className="text-[11px] font-mono text-zinc-400 block">Sep 2026</span>
                      </div>
                    </div>

                    <span className="block text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500 mb-3">
                      FULL-STACK AI & CLOUD INFRA
                    </span>

                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-3">
                      Financial intelligence backend orchestrating Quad-LLM routing with automated CI/CD.
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-zinc-900 leading-relaxed">
                      Containerized on AWS EC2 t3.micro with zero-downtime GitHub Actions deployment.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400 leading-relaxed">
                    AWS EC2 · Docker · Nginx · Flutter · Node.js · GitHub Actions
                  </div>
                </article>

                {/* CARD 4: NVIDIA TIME-SERIES */}
                <article className="group bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors leading-snug">
                        <a
                          href="https://stocks-prediction-thesis-nopeakbar.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline focus:outline-none"
                        >
                          NVIDIA Stock Bi-LSTM <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">→</span>
                        </a>
                      </h4>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-medium text-zinc-500 block">UPNYK</span>
                        <span className="text-[11px] font-mono text-zinc-400 block">Feb 2026</span>
                      </div>
                    </div>

                    <span className="block text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500 mb-3">
                      DEEP LEARNING & TIME-SERIES
                    </span>

                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-3">
                      Recurrent neural network evaluating the predictive impact of technical indicators.
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-zinc-900 leading-relaxed">
                      Benchmarked 10 model variants, achieving 2.29% MAPE on test distributions.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400 leading-relaxed">
                    Python · Bi-LSTM · TensorFlow · Time-Series · Next.js
                  </div>
                </article>

              </div>
            </section>

            {/* SECTION 3: CONTACT */}
            <section className="scroll-mt-24 pt-8 border-t border-zinc-200" id="contact">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-4 w-1 bg-zinc-900 rounded-full"></span>
                <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-500">
                  Contact
                </h2>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
                  Let's build something exceptional.
                </h3>
                <p className="mt-3 text-sm text-zinc-600 max-w-lg leading-relaxed">
                  Whether you need to scale enterprise generative AI, audit vector retrieval efficiency, or build resilient cloud backend architectures, my inbox is open.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 transition shadow-sm"
                    href="mailto:nopeakbar@gmail.com"
                  >
                    nopeakbar@gmail.com
                  </a>
                  <a
                    className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 transition"
                    href="https://www.linkedin.com/in/noveanto-nur-akbar/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="pt-12 text-xs font-mono text-zinc-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p>© 2026 Noveanto Nur Akbar. Built with semantic craft & clean principles.</p>
              <div className="flex items-center gap-4">
                <a className="hover:text-zinc-600 transition-colors" href="#">
                  Back to top ↑
                </a>
              </div>
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
}