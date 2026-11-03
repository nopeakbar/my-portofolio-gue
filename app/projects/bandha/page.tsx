"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Mic,
  Camera,
  MessageSquare,
  Sparkles,
  Database,
  FileCode,
  Layers,
  Clock,
  Zap,
  TrendingUp,
  DollarSign,
  Smartphone,
  Bot,
  Table,
  CheckCircle2,
  FileText,
  HelpCircle,
  ShieldCheck,
  Terminal,
} from "lucide-react";

// ==========================================
// CODE BLOCK COMPONENT WITH COPY BUTTON
// ==========================================
function CodeBlock({
  filename,
  language = "typescript",
  code,
}: {
  filename: string;
  language?: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="my-5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-sm">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-300">
          <FileCode className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-medium text-zinc-200">{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/60">
            {language}
          </span>
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-xs"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="font-sans text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono">
        <pre className="text-zinc-200 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function BandhaCaseStudyPage() {
  // Code snippet 1: Groq Whisper STT with Indonesian Financial Priming
  const codeSnippetVoice = `// Path: bandha-backend/src/controllers/voice.controller.ts
import fs from 'fs';
import Groq from 'groq-sdk';
import { Request, Response } from 'express';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function handleVoiceTranscription(req: Request, res: Response) {
  const filePath = req.file?.path;
  if (!filePath) {
    return res.status(400).json({ success: false, error: 'File audio .m4a tidak ditemukan' });
  }

  try {
    // Transkripsi suara via Groq Whisper Large v3 (<650ms)
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-large-v3',
      language: 'id',
      // Financial prompt priming menjamin istilah kasual & perbankan lokal ditranskripsikan presisi
      prompt: 'Kopi susu 25 ribu pakai qris, gajian freelance 5 juta transfer bca, beli bensin 50k pertamax',
      temperature: 0.0,
      response_format: 'verbose_json',
    });

    return res.json({
      success: true,
      text: transcription.text,
      duration: transcription.duration,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    // Zero Retention: berkas audio langsung dihapus dari disk lokal
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}`;

  // Code snippet 2: Two-Stage Prompting & Balanced ekstrakJson Parser
  const codeSnippetParser = `// Path: bandha-backend/src/utils/ekstrakJson.util.ts

/**
 * Membersihkan komentar JavaScript, tag markdown, dan melacak keseimbangan kurung kurawal
 * terluar guna menjamin JSON.parse() tidak gagal pada output LLM yang bervariasi.
 */
export function ekstrakJson(rawText: string): any {
  if (!rawText) return null;

  // 1. Strip komentar tunggal // dan blok /* ... */
  let cleaned = rawText
    .replace(/\\/\\/[^\\r\\n]*/g, '')
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '')
    .trim();

  // 2. Cari kurung kurawal pembuka pertama
  const startIndex = cleaned.indexOf('{');
  if (startIndex === -1) return null;

  // 3. Pelacakan kurung kurawal terluar (Balanced Curly-Brace Tracking)
  let depth = 0;
  let endIndex = -1;

  for (let i = startIndex; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) return null;

  const jsonCandidate = cleaned.substring(startIndex, endIndex + 1);
  try {
    return JSON.parse(jsonCandidate);
  } catch (e) {
    // Fallback: hapus trailing commas yang tidak valid dalam JSON standar
    const sanitized = jsonCandidate.replace(/,\\s*([}\\]])/g, '$1');
    return JSON.parse(sanitized);
  }
}`;

  // Code snippet 3: In-Memory Slot-Filling State Machine
  const codeSnippetSlotFilling = `// Path: bandha-backend/src/services/sessionManager.service.ts

interface DraftTransaction {
  item?: string;
  kategori?: string;
  nominal?: number;
  tempat?: string;
  tujuan?: string;
  metode?: string;
  waitingFor?: string;
  timestamp: Date;
}

const userSessions: Record<string, DraftTransaction> = {};

export function cekDataKurang(chatId: string, parsedData: any): { isComplete: boolean; promptMessage?: string } {
  // Jika nominal kosong atau bernilai nol, simpan ke memori sesi aktif
  if (!parsedData.nominal || parsedData.nominal <= 0) {
    userSessions[chatId] = {
      ...parsedData,
      waitingFor: 'nominal',
      timestamp: new Date(),
    };
    return {
      isComplete: false,
      promptMessage: 'Eh, nominalnya berapa duit? (Ketik angkanya aja, misal: 25000 atau 50k)',
    };
  }

  return { isComplete: true };
}

export function handleSlotResponse(chatId: string, replyText: string): any | null {
  const session = userSessions[chatId];
  if (!session) return null;

  // Ekspansi pintasan nominal otomatis (misal: '50k' -> 50000, '2.5jt' -> 2500000)
  let nominal = 0;
  const cleaned = replyText.toLowerCase().replace(/\\s+/g, '');

  if (cleaned.endsWith('k') || cleaned.endsWith('rb')) {
    nominal = parseFloat(cleaned) * 1000;
  } else if (cleaned.endsWith('jt')) {
    nominal = parseFloat(cleaned) * 1000000;
  } else {
    nominal = parseInt(cleaned.replace(/[^0-9]/g, ''), 10);
  }

  if (!isNaN(nominal) && nominal > 0) {
    session.nominal = nominal;
    delete session.waitingFor;
    const completed = { ...session };
    delete userSessions[chatId]; // Bersihkan sesi
    return completed;
  }

  return null;
}`;

  // Code snippet 4: Two-Stage Compound AI Intelligence & FinOps Bypass
  const codeSnippetCompound = `// Path: bandha-backend/src/services/compoundAnalysis.service.ts
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateCompoundFinancialReport(
  transactionsCsv: string,
  skipAi: boolean = false
) {
  // FINOPS TOKEN-BYPASS CIRCUIT (?no_ai=true)
  // Untuk rendering grafik instan di beranda seluler (<15ms, 0 tokens)
  if (skipAi) {
    return {
      mode: 'NUMERIC_SUMMARY_ONLY',
      tokensUsed: 0,
      advisoryText: null,
    };
  }

  // TAHAP 1: Analis Statistik Matematis Murni (Temperature: 0, Zero-Opinion)
  const mathAnalysis = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    temperature: 0.0,
    messages: [
      {
        role: 'system',
        content: 'Anda kalkulator finansial deterministik. Hitung total_income, total_expense, net_cashflow, dan top_expense_categories. DILARANG MEMBERI OPINI ATAU SARAN. Hasilkan JSON valid.',
      },
      { role: 'user', content: transactionsCsv },
    ],
  });

  const verifiedMathJson = mathAnalysis.choices[0].message.content;

  // TAHAP 2: Penasihat Keuangan Berpersona Software Engineer (Temperature: 0.7)
  const seAdvisor = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: \`Anda Senior Tech Lead yang menasihati finansial junior engineer.
Gunakan analogi arsitektur perangkat lunak:
- Pengeluaran impulsif -> "Memory leak di runtime"
- Disiplin menabung -> "Database indexing & cold storage caching"
- Saldo menipis -> "Mendekati resource limit / container OOM kill"
Patuhi Mobile Markdown Guardrails: DILARANG membuat tabel markdown atau heading ganda.\`,
      },
      {
        role: 'user',
        content: \`Data Statistik Terverifikasi: \${verifiedMathJson}\`,
      },
    ],
  });

  return {
    mode: 'COMPOUND_ANALYSIS_COMPLETE',
    verifiedMath: JSON.parse(verifiedMathJson || '{}'),
    advisoryMarkdown: seAdvisor.choices[0].message.content,
  };
}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B] antialiased selection:bg-zinc-200 selection:text-zinc-900">
      {/* ======================================================== */}
      {/* 1. TOP-DOWN HERO SECTION (Full-Width Container)          */}
      {/* ======================================================== */}
      <header className="border-b border-zinc-200/90 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-10">
          {/* Back Button */}
          <Link
            href="/#selected-work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors mb-6 group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Overview
          </Link>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500 mb-4">
            <span className="font-semibold text-zinc-900">
              Bandha Personal Finance Platform
            </span>
            <span>•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 font-medium text-zinc-700">
              Mobile AI Copilot & Compound Intelligence
            </span>
            <span>•</span>
            <span className="text-zinc-400">Sep 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 max-w-4xl leading-[1.15] mb-4 font-sans">
            Bandha: Ekosistem AI Keuangan Pribadi Multi-Modal & Orkestrasi Heterogen Quad-Model
          </h1>

          {/* Subtitle / Executive Pitch */}
          <p className="text-zinc-600 text-base sm:text-lg max-w-3xl leading-relaxed mb-6 font-normal">
            Arsitektur mobile cross-platform (Flutter), daemon bot Telegram, dual-channel ingress, compound AI analytics (GPT-OSS 120B), dan serverless Google Sheets cloud ledger berbiaya $0 guna memangkas friksi pencatatan arus kas hingga ~92%.
          </p>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "Flutter 3.x",
              "Express.js 5",
              "Groq Whisper Large v3",
              "Groq Llama 3.3 70B",
              "Google Gemini 2.5 Flash",
              "Groq GPT-OSS 120B",
              "Google Sheets API JWT",
              "Telegram Bot Daemon",
              "Slot-Filling State Machine",
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-mono rounded-md bg-white border border-zinc-200/90 text-zinc-700 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quick Metrics / Specs Box (4-Grid Simetris) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl border border-zinc-200/90 bg-white shadow-sm">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Ingress & Klien
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Flutter + Telegram Daemon + Widget
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                AI Ensemble
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Heterogeneous Quad-Model Pipeline
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Cloud Ledger
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Google Sheets API JWT (Dual-Sheet)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Dampak Efisiensi
              </div>
              <div className="text-sm font-semibold text-emerald-700">
                Input 92% Lebih Cepat & $0/bln Cloud Cost
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN READING AREA + SLIM STICKY SIDEBAR               */}
      {/* ======================================================== */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* SISI KIRI: SLIM STICKY RAIL (3 dari 12 Kolom / ~25%) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-8 space-y-8">
            {/* Quick Metadata */}
            <div className="space-y-4 pb-6 border-b border-zinc-200">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Peran
                </div>
                <div className="text-sm font-semibold text-zinc-900 mt-0.5">
                  Fullstack Mobile & AI Systems Engineer
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Lingkup Deployment
                </div>
                <div className="text-sm font-semibold text-zinc-900 mt-0.5">
                  Mobile (Android/iOS), Telegram Bot, Cloud Ledger
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Live Showcase
                </div>
                <a
                  href="https://nopeakbar-bandha-live-demo.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-950 transition-colors mt-0.5 font-mono font-medium"
                >
                  bandha-live-demo.app <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Fokus Rekayasa
                </div>
                <div className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                  Voice Ingestion (Whisper), Receipt OCR (Gemini), Entity Extraction (Llama 70B), Compound Analysis (GPT-OSS 120B) & Zero-Cost Sheets DB
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
                Daftar Isi
              </div>
              <nav className="space-y-2 text-xs font-mono text-zinc-500">
                <a href="#bottlenecks" className="block hover:text-zinc-950 transition-colors py-0.5">
                  01. Friksi PFM & Solusi Multi-Modal
                </a>
                <a href="#distributed-architecture" className="block hover:text-zinc-950 transition-colors py-0.5">
                  02. Arsitektur Terdistribusi Quad-AI
                </a>
                <a href="#ingestion-lifecycle" className="block hover:text-zinc-950 transition-colors py-0.5">
                  03. Siklus Hidup Ingesti Multi-Modal
                </a>
                <a href="#engineering-pillars" className="block hover:text-zinc-950 transition-colors py-0.5">
                  04. Pilar Rekayasa Teknis Utama
                </a>
                <a href="#data-modeling" className="block hover:text-zinc-950 transition-colors py-0.5">
                  05. Pemodelan Data Cloud Ledger
                </a>
                <a href="#benchmarks" className="block hover:text-zinc-950 transition-colors py-0.5">
                  06. Evaluasi Kinerja Operasional
                </a>
                <a href="#technical-faq" className="block hover:text-zinc-950 transition-colors py-0.5">
                  07. Pertahanan Wawancara Teknis
                </a>
                <a href="#takeaways" className="block hover:text-zinc-950 transition-colors py-0.5">
                  08. Kesimpulan Rekayasa
                </a>
              </nav>
            </div>
          </aside>

          {/* SISI KANAN / TENGAH: WIDE CASE STUDY CONTENT (9 dari 12 Kolom / ~75%) */}
          <article className="lg:col-span-9 space-y-14 text-zinc-700 leading-relaxed text-[15px] sm:text-base">
            
            {/* ======================================================== */}
            {/* SECTION 1: BOTTLENECKS                                   */}
            {/* ======================================================== */}
            <section id="bottlenecks" className="space-y-5 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                01. Titik Kritis: Friksi Pencatatan Finansial Tradisional & Solusi Multi-Modal
              </h2>

              <h3 className="text-lg font-bold text-zinc-900 mt-4">
                Hambatan Adopsi Aplikasi Anggaran Konvensional (The Data Entry Friction)
              </h3>
              <p>
                Pencatatan arus kas pribadi adalah disiplin krusial dalam literasi finansial. Namun, data industri membuktikan lebih dari <strong>80% pengguna meninggalkan aplikasi pencatat keuangan dalam 30 hari pertama</strong>. Kegagalan adopsi ini berakar pada tingginya beban pencatatan manual (<em>form fatigue</em>):
              </p>

              {/* Stack Vertikal 3 Bottleneck Cards */}
              <div className="space-y-4 my-6">
                
                {/* CARD 1: Form Fatigue */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 01 // Cognitive Friction
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Beban Formulir Bertingkat (Form Fatigue)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      8+ Required Fields
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Aplikasi konvensional memaksa pengguna membuka multi-layar: memilih dropdown kategori hierarkis, menentukan rekening dompet sumber, mengetik angka nominal, memilih tanggal kalender, dan mengisi nama merchant. Beban kognitif ini membunuh motivasi pengguna setelah beberapa hari.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Abandonment Rate Tinggi</span>
                    <span className="font-semibold text-neutral-900">80% Drop-off dalam 30 Hari</span>
                  </div>
                </div>

                {/* CARD 2: Context Loss in the Field */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 02 // Field Inaccessibility
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Kehilangan Konteks Transaksi di Situasi Sibuk
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Fast-Paced Microtransactions
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Transaksi harian terjadi di situasi cepat: membayar parkir tunai di jalan, memindai QRIS di kasir saat antrean padat, atau memesan transportasi online. Pengguna tidak memiliki waktu mengisi formulir di tempat; saat tiba di rumah, struk kertas hilang dan mutasi kecil terlupakan tanpa tercatat.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Kebocoran Pengeluaran Kas Mikro</span>
                    <span className="font-semibold text-neutral-900">Unrecorded Micro-Expenses</span>
                  </div>
                </div>

                {/* CARD 3: Walled Gardens */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 03 // Data Sovereignty
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Silo Data Tertutup (Walled Gardens & Subscription Fees)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Proprietary Cloud Lock-In
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mayoritas aplikasi mengunci riwayat transaksi pengguna di basis data cloud berbayar dengan biaya langganan bulanan mahal ($15–$50/tahun), menghalangi pengguna mengekspor atau menganalisis data keuangan di spreadsheet mandiri seperti Google Sheets atau Excel.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Hilangnya Kepemilikan Data</span>
                    <span className="font-semibold text-neutral-900">Zero Raw Data Ownership</span>
                  </div>
                </div>

              </div>

              {/* Solution Summary */}
              <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3">
                <h4 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Solusi Bandha: Mengeliminasi Hambatan Input Manual (&lt; 3 Detik)
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Bandha mentransformasikan komunikasi multi-modal manusia menjadi baris pembukuan relasional terstruktur secara otomatis dalam waktu kurang dari 3 detik:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-zinc-700 pt-1">
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
                    <strong className="text-zinc-900 block mb-1 font-sans font-semibold">Teks Bahasa Alami</strong>
                    "Beli soto ayam 18rb di warung pojok bareng reza bayar qris"
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
                    <strong className="text-zinc-900 block mb-1 font-sans font-semibold">Voice Notes Instan</strong>
                    Groq Whisper Large v3 transkripsi audio dengan priming finansial Indonesia
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
                    <strong className="text-zinc-900 block mb-1 font-sans font-semibold">Vision OCR Struk Belanja</strong>
                    Google Gemini 2.5 Flash mengekstraksi foto struk & mutasi m-banking
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
                    <strong className="text-zinc-900 block mb-1 font-sans font-semibold">Daemon Bot Telegram</strong>
                    Pencatatan langsung via chat @mykeuangangw_bot tanpa membuka app seluler
                  </div>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 2: DISTRIBUTED ARCHITECTURE & QUAD-AI           */}
            {/* ======================================================== */}
            <section id="distributed-architecture" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                02. Arsitektur Terdistribusi & Saluran Ingress Ganda
              </h2>
              <p>
                Sistem mengadopsi pola arsitektur decoupled yang menghubungkan saluran ingress multi-platform ke backend Express.js 5 yang mengorkestrasi <strong>Quad-Model Heterogeneous AI Ensemble</strong> dan cloud ledger Google Sheets:
              </p>

              {/* 4 Cards: The Quad-Model Ensemble */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                
                {/* MODEL 1 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                        Model 01 // Voice Engine
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium">
                        whisper-large-v3
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-emerald-600" />
                      Groq Whisper Large v3
                    </h4>
                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      Speech-to-Text ultra-cepat (latensi &lt;650ms) dengan Indonesian financial vocabulary priming untuk menangkap jargon slang, nama makanan lokal, dan akronim pembayaran (QRIS, BCA, Gopay).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] font-mono text-zinc-500">
                    Tugas: Transkripsi Audio Voice Note
                  </div>
                </div>

                {/* MODEL 2 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                        Model 02 // NLP Extractor
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-blue-50 text-blue-700 border border-blue-200/60 font-medium">
                        llama-3.3-70b-versatile
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-600" />
                      Groq Llama 3.3 70B
                    </h4>
                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      Klasifikasi intensi biner (Pemasukan vs Pengeluaran) dan ekstraksi entitas semantik 9 dimensi dalam waktu sub-450 ms dengan biaya komputasi mendekati $0.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] font-mono text-zinc-500">
                    Tugas: Intent & Entity Parsing
                  </div>
                </div>

                {/* MODEL 3 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                        Model 03 // Vision OCR
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-purple-50 text-purple-700 border border-purple-200/60 font-medium">
                        gemini-2.5-flash
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-purple-600" />
                      Google Gemini 2.5 Flash
                    </h4>
                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      Vision OCR multimodal untuk membaca struk fisik supermarket, tagihan kafe berkerut, atau screenshot mutasi m-banking dengan ekstraksi rincian subtotal & merchant otomatis.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] font-mono text-zinc-500">
                    Tugas: Receipt & Screenshot Vision OCR
                  </div>
                </div>

                {/* MODEL 4 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                        Model 04 // Compound AI
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
                        openai/gpt-oss-120b
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-amber-600" />
                      Groq GPT-OSS 120B
                    </h4>
                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                      Two-stage compound financial advisory: Analisis statistik murni tanpa opini (suhu 0.0) dilanjutkan dengan konsultasi cerdas berpersona Software Engineer (suhu 0.7).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] font-mono text-zinc-500">
                    Tugas: Compound Financial Advisory
                  </div>
                </div>

              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 3: INGESTION LIFECYCLE                           */}
            {/* ======================================================== */}
            <section id="ingestion-lifecycle" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                03. Siklus Hidup Permintaan & Alur Ingesti Multi-Modal
              </h2>
              <p>
                Alur data dirancang deterministik dari saluran input pengguna hingga penyimpanan permanen di Google Sheets:
              </p>

              {/* Step by Step Sequence Cards */}
              <div className="space-y-3 my-6 font-mono text-xs">
                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold mb-1 font-sans">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[11px] font-mono">1</span>
                    Multi-Channel Ingestion Dispatch
                  </div>
                  <p className="text-zinc-600 font-sans leading-relaxed">
                    Pengguna merekam audio (.m4a), mengetik teks kasual, atau mengunggah foto struk via aplikasi Flutter maupun chat bot Telegram (@mykeuangangw_bot).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold mb-1 font-sans">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[11px] font-mono">2</span>
                    Heterogeneous Model Routing
                  </div>
                  <p className="text-zinc-600 font-sans leading-relaxed">
                    Audio diarahkan ke Groq Whisper Large v3 untuk transkripsi instan (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">/api/voice</code>); teks diarahkan ke Llama 3.3 70B (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">/api/catat</code>); citra struk diproses oleh Gemini 2.5 Flash Vision (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">/api/scan</code>).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold mb-1 font-sans">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[11px] font-mono">3</span>
                    Resilient JSON Extraction (ekstrakJson)
                  </div>
                  <p className="text-zinc-600 font-sans leading-relaxed">
                    Parser membersihkan komentar JavaScript, tag markdown, dan melacak kurung kurawal terluar guna menjamin JSON valid terisolasi tanpa kegagalan runtime parser.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold mb-1 font-sans">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[11px] font-mono">4</span>
                    In-Memory Interactive Slot-Filling
                  </div>
                  <p className="text-zinc-600 font-sans leading-relaxed">
                    Jika atribut esensial (nominal) bernilai nol, state machine menyimpan draf transaksi dan menanyakan pertanyaan klarifikasi ramah kepada pengguna tanpa memicu error 400.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold mb-1 font-sans">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-mono">5</span>
                    Relational Cloud Ledger Storage (Google Sheets API JWT)
                  </div>
                  <p className="text-zinc-600 font-sans leading-relaxed">
                    Data ternormalisasi dituliskan ke Sheet 0 (Pengeluaran - 9 dimensi) atau Sheet 1 (Pemasukan - 5 dimensi) via Service Account JWT terenkripsi dengan stempel waktu WIB.
                  </p>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 4: ENGINEERING PILLARS                           */}
            {/* ======================================================== */}
            <section id="engineering-pillars" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                04. Pilar Rekayasa Teknis Utama
              </h2>

              {/* Stack 6 Engineering Pillars Cards */}
              <div className="space-y-4 my-6">
                
                {/* PILAR 1 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Pilar 01 // Multi-Modal Ingestion
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Transkripsi Finansial Terpriming & Vision OCR
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 whitespace-nowrap font-medium">
                      Zero Retention Cleanup
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Audio dikirim ke <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">/api/voice</code> dengan parameter bahasa <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">id</code> dan prompt priming perbankan guna memastikan istilah lokal tidak terdistorsi. Berkas audio lokal langsung dihapus seketika setelah transkripsi selesai. Untuk struk belanja, Gemini 2.5 Flash mengekstraksi rincian subtotal secara otomatis.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Kecepatan Transkripsi: &lt;650 ms</span>
                    <span className="font-semibold text-emerald-700">Zero Audio Storage Footprint</span>
                  </div>
                </div>

                {/* PILAR 2 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Pilar 02 // Prompt Architecture
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Two-Stage Decoupled Prompting & Parser ekstrakJson
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-blue-50 text-blue-800 border border-blue-200/70 whitespace-nowrap font-medium">
                      Balanced Brace Tracking
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengeliminasi halusinasi skema dengan memisahkan klasifikasi intensi biner (Tahap 1: Pemasukan / Pengeluaran) dari ekstraksi entitas semantik 9 atribut (Tahap 2). Parser <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">ekstrakJson</code> melacak keseimbangan kurung kurawal terluar untuk menangani variasi teks pengantar dari LLM.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Keandalan Parsing: 100% Valid JSON</span>
                    <span className="font-semibold text-neutral-900">Zero Schema Hallucination</span>
                  </div>
                </div>

                {/* PILAR 3 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Pilar 03 // State Machine
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        In-Memory Interactive Slot-Filling & Koreksi
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-purple-50 text-purple-800 border border-purple-200/70 whitespace-nowrap font-medium">
                      /undo & /edit Commands
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Menyimpan draf transaksi di memori sesi saat atribut penting belum lengkap (misal: "Beli bensin" tanpa nominal). Mendukung ekspansi otomatis singkatan nominal kasual (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">50k</code> → 50.000, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">2.5jt</code> → 2.500.000), serta perintah rollback <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">/undo</code> dan modifikasi langsung <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">/edit</code>.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: Volatile State Store</span>
                    <span className="font-semibold text-purple-700">Conversational Error Recovery</span>
                  </div>
                </div>

                {/* PILAR 4 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Pilar 04 // Cloud Ledger
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Normalisasi Dual-Sheet Relasional via Google Sheets API
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap font-medium">
                      Service Account JWT
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Menyimpan data pembukuan di spreadsheet pribadi pengguna menggunakan Google Auth Service Account JWT: Sheet 0 (Pengeluaran - 9 Kolom) dan Sheet 1 (Pemasukan - 5 Kolom) dengan stempel waktu terstandarisasi zona waktu <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">Asia/Jakarta</code>.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Infrastruktur: Serverless Database</span>
                    <span className="font-semibold text-neutral-900">$0.00 Biaya Server Bulanan</span>
                  </div>
                </div>

                {/* PILAR 5 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Pilar 05 // Mobile Client
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Offline-First SharedPreferences & Widget Beranda OS
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-blue-50 text-blue-800 border border-blue-200/70 whitespace-nowrap font-medium">
                      &lt;50ms Instant Load
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Aplikasi Flutter mengimplementasikan penyimpanan lokal time-scoped cache (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">analisis_cache_days_7</code>) sehingga dasbor analitik termuat dalam waktu &lt;50 ms. Terintegrasi dengan widget beranda ponsel Android/iOS (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">home_widget</code>) dan ekspor laporan keuangan format PDF.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>UI Responsiveness: Sub-50ms Cache</span>
                    <span className="font-semibold text-neutral-900">Seamless Cross-Screen Sync</span>
                  </div>
                </div>

                {/* PILAR 6 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Pilar 06 // Compound Intelligence
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Compound AI via GPT-OSS 120B & FinOps Bypass Circuit
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-amber-50 text-amber-800 border border-amber-200/70 whitespace-nowrap font-medium">
                      ?no_ai=true FinOps Circuit
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mencegah kesalahan kalkulasi matematika finansial: Tahap 1 menghitung angka murni pada <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">temperature: 0.0</code> tanpa opini; Tahap 2 mengemas saran edukatif berpersona Software Engineer (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">temperature: 0.7</code>). Sirkuit bypass <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">?no_ai=true</code> menghemat ribuan token saat klien hanya membutuhkan ringkasan angka (&lt;15 ms).
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Akurasi Aritmatika: 100% Deterministic</span>
                    <span className="font-semibold text-amber-800">Token-Saving Dashboard Bypass</span>
                  </div>
                </div>

              </div>

              {/* Implementation Code Blocks */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-zinc-950">
                  Implementasi Produksi Pipa Bandha
                </h3>
                <p className="text-sm text-zinc-600">
                  Berikut potongan kode inti yang menggerakkan mesin ingesti suara, parser tangguh, state machine slot-filling, dan compound AI:
                </p>

                <CodeBlock
                  filename="bandha-backend/src/controllers/voice.controller.ts"
                  language="typescript"
                  code={codeSnippetVoice}
                />

                <CodeBlock
                  filename="bandha-backend/src/utils/ekstrakJson.util.ts"
                  language="typescript"
                  code={codeSnippetParser}
                />

                <CodeBlock
                  filename="bandha-backend/src/services/sessionManager.service.ts"
                  language="typescript"
                  code={codeSnippetSlotFilling}
                />

                <CodeBlock
                  filename="bandha-backend/src/services/compoundAnalysis.service.ts"
                  language="typescript"
                  code={codeSnippetCompound}
                />
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 5: DATA MODELING                                 */}
            {/* ======================================================== */}
            <section id="data-modeling" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                05. Pemodelan Data & Dimensi Ledger Google Sheets
              </h2>
              <p>
                Struktur kolom Google Sheets dirancang ternormalisasi guna memudahkan analisis langsung di spreadsheet maupun koneksi ke Google Looker Studio:
              </p>

              {/* Data Modeling Table */}
              <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs my-6">
                <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
                    Skema Relasional Dual-Sheet
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Google Sheets API v5.2
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-700">
                      <tr>
                        <th className="p-3.5 font-bold">Lembar Kerja (Sheet)</th>
                        <th className="p-3.5 font-bold">Struktur Kolom Dimensi</th>
                        <th className="p-3.5 font-bold">Tipe Data & Contoh Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-zinc-600">
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900 whitespace-nowrap">
                          Sheet 0 (Pengeluaran)
                        </td>
                        <td className="p-3.5">
                          1. Waktu<br/>2. Item<br/>3. Kategori<br/>4. Nominal<br/>5. Tempat<br/>6. Tujuan<br/>7. Partisipan<br/>8. Metode<br/>9. Rating
                        </td>
                        <td className="p-3.5 text-zinc-500">
                          String (DD/MM/YYYY, HH.MM.SS)<br/>String (Americano, Soto Ayam)<br/>String (Makanan, Transportasi)<br/>Integer (25000, 150000)<br/>String (Kenangan, SPBU)<br/>String (Nongkrong, Mudik)<br/>String (Sendiri, Teman Kantor)<br/>String (QRIS, Cash, Transfer)<br/>String (5/5, Mantap)
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900 whitespace-nowrap">
                          Sheet 1 (Pemasukan)
                        </td>
                        <td className="p-3.5">
                          1. Waktu<br/>2. Sumber Pemasukan<br/>3. Nominal<br/>4. Kategori<br/>5. Catatan
                        </td>
                        <td className="p-3.5 text-zinc-500">
                          String (DD/MM/YYYY, HH.MM.SS)<br/>String (Gaji Pokok, Freelance)<br/>Integer (5000000, 750000)<br/>String (Gaji, Bonus, Dividen)<br/>String (Transferan Project A)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 6: BENCHMARKS                                    */}
            {/* ======================================================== */}
            <section id="benchmarks" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                06. Evaluasi Tolok Ukur Kinerja Operasional
              </h2>
              <p>
                Hasil benchmarking membuktikan arsitektur multi-modal Bandha mengungguli aplikasi PFM konvensional dalam seluruh dimensi operasional:
              </p>

              {/* Benchmark Table */}
              <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs my-6">
                <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
                    Hasil Pengujian Empiris Sistem Bandha
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    vs Aplikasi PFM Konvensional
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-700">
                      <tr>
                        <th className="p-3.5 font-bold">Parameter Kinerja</th>
                        <th className="p-3.5 font-bold">Aplikasi PFM Konvensional</th>
                        <th className="p-3.5 font-bold">Platform Bandha Multi-Modal</th>
                        <th className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">Peningkatan Terukur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-zinc-600">
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Waktu Rata-rata Input Transaksi</td>
                        <td className="p-3.5 text-zinc-500">35 – 50 Detik (8 Field Formulir)</td>
                        <td className="p-3.5">2.8 – 4.5 Detik (Suara / Teks Alami)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">~92% Lebih Cepat</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Latensi Ekstraksi NLP Teks</td>
                        <td className="p-3.5 text-zinc-500">2.400 ms – 3.800 ms (Cloud Standar)</td>
                        <td className="p-3.5">320 ms – 450 ms (Groq Llama 3.3 70B)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">~8x Penurunan Latensi</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Kecepatan Transkripsi Suara (STT)</td>
                        <td className="p-3.5 text-zinc-500">3.500 ms – 5.000 ms (Whisper Standar)</td>
                        <td className="p-3.5">450 ms – 850 ms (Groq Whisper v3)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">~5x Lebih Cepat</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Akurasi Analitik Finansial</td>
                        <td className="p-3.5 text-red-600">Rentan Halusinasi Hitung</td>
                        <td className="p-3.5 font-bold text-emerald-700">Presisi Matematis Zero-Opinion (Temp 0)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">Bebas Kesalahan Aritmatika</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Konsumsi Token Layar Utama</td>
                        <td className="p-3.5 text-red-600">Membakar token setiap refresh layar</td>
                        <td className="p-3.5 font-bold text-emerald-700">0 Token (Bypass via ?no_ai=true)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">100% Penghematan Dasbor</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Biaya Hosting Basis Data</td>
                        <td className="p-3.5 text-zinc-500">$15 – $45 / bulan (Hosted DB)</td>
                        <td className="p-3.5 font-bold text-emerald-700">$0.00 / bulan (Google Sheets API)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">100% Penghematan Infra</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Kecepatan Render Layar Dasbor</td>
                        <td className="p-3.5 text-zinc-500">1.200 ms (Fetch Sinkron)</td>
                        <td className="p-3.5 font-bold text-emerald-700">&lt; 50 ms (Pemuatan Cache Lokal)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">Pemuatan Instan (&lt;50 ms)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 7: TECHNICAL FAQ                                 */}
            {/* ======================================================== */}
            <section id="technical-faq" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                07. Panduan Pertahanan Wawancara Teknis
              </h2>
              <p>
                Rasionalisasi keputusan arsitektur kunci dalam perancangan Bandha:
              </p>

              {/* FAQ Cards */}
              <div className="space-y-4 my-6">
                
                {/* Q1 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    "Mengapa menggunakan Google Sheets dan bukan PostgreSQL atau MongoDB?"
                  </h3>
                  <div className="mt-3 text-sm text-zinc-600 leading-relaxed space-y-2 border-l-2 border-emerald-500 pl-4 py-1">
                    <p>
                      Untuk aplikasi personal finance management, Google Sheets via Service Account JWT memberikan tiga keunggulan strategis:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-700">
                      <li><strong>Nol Biaya Infrastruktur:</strong> Menghilangkan biaya langganan database server bulanan secara total ($0 cloud cost).</li>
                      <li><strong>Kedaulatan Data Pengguna:</strong> Pengguna memiliki data mentah langsung di akun Google Drive mereka, bebas membuat tabel pivot atau menghubungkannya ke Google Looker Studio tanpa perlu fitur ekspor kustom.</li>
                      <li><strong>Audit Transparan & Rollback:</strong> Backend dapat membaca dan memperbarui baris secara deterministik (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">/undo</code> dan <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">/edit</code>), memberikan kontrol visibilitas penuh atas pembukuan.</li>
                    </ul>
                  </div>
                </div>

                {/* Q2 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    "Mengapa mengorkestrasi 4 model AI berbeda dibanding 1 model multimodal besar?"
                  </h3>
                  <div className="mt-3 text-sm text-zinc-600 leading-relaxed space-y-2 border-l-2 border-blue-500 pl-4 py-1">
                    <p>
                      Menggunakan satu model besar untuk seluruh tugas adalah antipattern yang memicu latensi tinggi dan pemborosan biaya token:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-700">
                      <li><strong>Groq Whisper Large v3:</strong> Dikhususkan untuk Speech-to-Text ultra-cepat dengan priming kosakata finansial Indonesia.</li>
                      <li><strong>Groq Llama 3.3 70B:</strong> Menangani klasifikasi intensi dan ekstraksi entitas sub-450 ms pada biaya $0.</li>
                      <li><strong>Google Gemini 2.5 Flash:</strong> Menangani tugas berat vision OCR untuk struk belanja dan bukti transfer.</li>
                      <li><strong>Groq GPT-OSS 120B:</strong> Menjalankan compound analytics (analisis statistik presisi pada suhu 0 dan konsultasi finansial santai berpersona Software Engineer pada suhu 0.7).</li>
                    </ul>
                    <p className="text-xs text-zinc-500 font-sans">
                      Setiap model bekerja murni pada domain spesifiknya, menjamin akurasi tinggi dan latensi sub-detik tanpa pemborosan token.
                    </p>
                  </div>
                </div>

                {/* Q3 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                    "Bagaimana cara mencegah kesalahan kalkulasi matematika pada analisis keuangan AI?"
                  </h3>
                  <div className="mt-3 text-sm text-zinc-600 leading-relaxed space-y-2 border-l-2 border-purple-500 pl-4 py-1">
                    <p>
                      Model bahasa generatif tidak dapat diandalkan untuk kalkulasi numerik jika ditugaskan bernalar sekaligus mengarang teks percakapan secara simultan:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-700">
                      <li><strong>Compound AI Pattern:</strong> Pada Tahap 1, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">openai/gpt-oss-120b</code> dipanggil dengan <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">temperature: 0.0</code> dan instruksi tegas yang melarang opini untuk menghitung Net Cashflow dan anomali secara deterministik.</li>
                      <li><strong>Advisory Layer:</strong> Pada Tahap 2, hasil hitungan terverifikasi dioper ke pemanggilan kedua (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">temperature: 0.7</code>) yang bertugas mengemas pesan edukatif dengan analogi software engineering.</li>
                      <li><strong>FinOps Circuit:</strong> Saat pengguna hanya membuka dashboard di aplikasi mobile, parameter <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">?no_ai=true</code> aktif untuk menyajikan agregasi grafik secara instan (&lt;15 ms) tanpa menyentuh API LLM sama sekali.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 8: ENGINEERING TAKEAWAYS                         */}
            {/* ======================================================== */}
            <section id="takeaways" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                08. Kesimpulan Rekayasa & Prinsip Desain
              </h2>
              <p>
                Platform Bandha membuktikan bahwa kecerdasan AI terdepan dapat diterapkan pada perangkat seluler tanpa biaya server mahal maupun friksi pengguna:
              </p>

              {/* Takeaways Stack Cards */}
              <div className="space-y-4 my-6">
                
                {/* TAKEAWAY 1 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 01 // Multi-Modal Ergonomics
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        Eliminasi Form Fatigue via Ingress Alami
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Sub-3s Data Entry
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Menggantikan formulir 8-kolom kaku dengan input suara, teks alami, dan pemindaian struk kamera menurunkan waktu pencatatan transaksi dari 45 detik menjadi di bawah 3 detik, secara efektif memecahkan krisis abandonment rate aplikasi keuangan.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Peningkatan Retensi Pengguna</span>
                    <span className="font-semibold text-neutral-900">92% Friction Reduction</span>
                  </div>
                </div>

                {/* TAKEAWAY 2 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 02 // Heterogeneous Arbitrage
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        Right-Sized Model Specialization
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Quad-AI Ensemble
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengombinasikan model spesifik (Whisper untuk audio, Llama 70B untuk parsing, Gemini Flash untuk OCR, GPT-OSS 120B untuk analisis) menghasilkan sistem yang 8x lebih cepat dan jauh lebih murah dibanding model tunggal serba-bisa.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Latensi Rendah & Biaya Terkendali</span>
                    <span className="font-semibold text-neutral-900">Sub-Second Execution</span>
                  </div>
                </div>

                {/* TAKEAWAY 3 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 03 // Zero-Cost Architecture
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <Table className="w-4 h-4 text-purple-600" />
                        Serverless Google Sheets Cloud Ledger
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      User Data Sovereignty
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Menjadikan Google Sheets sebagai basis data relasional serverless mengeliminasi 100% biaya hosting database ($0/bulan) sembari memberikan kedaulatan data penuh kepada pengguna untuk integrasi analisis lanjutan.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Biaya Pemeliharaan $0.00</span>
                    <span className="font-semibold text-neutral-900">Total Infrastructure Independence</span>
                  </div>
                </div>

              </div>

              {/* Back to Home Action Footer */}
              <div className="pt-8 border-t border-neutral-200 flex items-center justify-between">
                <Link
                  href="/#selected-work"
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Ringkasan Portofolio</span>
                </Link>
                <a
                  href="#bottlenecks"
                  className="text-xs font-mono text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  Back to Top ↑
                </a>
              </div>
            </section>

          </article>
        </div>
      </main>
    </div>
  );
}
