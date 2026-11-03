"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Database,
  Server,
  Zap,
  Lock,
  FileCode,
  Layers,
  Clock,
  AlertTriangle,
  RefreshCw,
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

export default function AnythinkCaseStudyPage() {
  // Code snippets from the architecture spec
  const codePillar1 = `// Path: backend-anythink-express/src/utils/laravelCrypt.util.ts
import crypto from 'crypto';

const APP_KEY = Buffer.from(process.env.LARAVEL_APP_KEY || '', 'base64');

export function decryptLaravelString(payload: string): string | null {
  try {
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf8');
    const { iv: rawIv, value: rawVal, mac: rawMac } = JSON.parse(decodedPayload);

    const iv = Buffer.from(rawIv, 'base64');
    const encrypted = Buffer.from(rawVal, 'base64');

    // Validasi integritas: Rekalkulasi HMAC-SHA256
    const calculatedMac = crypto.createHmac('sha256', APP_KEY)
      .update(rawIv + rawVal)
      .digest('hex');

    const macBuf = Buffer.from(String(rawMac), 'hex');
    const calcBuf = Buffer.from(calculatedMac, 'hex');

    // Menangkal eksploitasi timing attack melalui perbandingan konstan
    if (macBuf.length !== calcBuf.length || !crypto.timingSafeEqual(macBuf, calcBuf)) {
      return null;
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', APP_KEY, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // Ekstraksi pola serialisasi string PHP: s:<panjang>:"<isi>";
    const decString = decrypted.toString();
    const match = decString.match(/^s:\\d+:"(.*)";$/);

    return match ? match[1] : decString;
  } catch (error) {
    return null;
  }
}`;

  const codePillar2 = `// Path: frontend-anythink-next/src/app/api/[...path]/route.ts
const ROUTE_FIELD_ALLOWLISTS: Record<string, string[]> = {
  '/api/user': ['id', 'name', 'email', 'role', 'tenant_id', 'tenant_name', 'is2faEnabled'],
  '/api/v1/documents': ['id', 'name', 'original_filename', 'mime_type', 'size', 'status', 'created_at'],
  '/api/v1/chat/conversations': ['id', 'title', 'updated_at', 'messages_count', 'role', 'content', 'sources'],
};

function enforceFieldAllowlist(payload: any, allowedKeys: string[]): any {
  if (Array.isArray(payload)) return payload.map(item => enforceFieldAllowlist(item, allowedKeys));
  if (payload !== null && typeof payload === 'object') {
    return Object.fromEntries(
      Object.entries(payload).filter(([k]) => allowedKeys.includes(k))
    );
  }
  return payload;
}`;

  const codePillar3 = `// Path: backend-anythink-express/src/services/azureSearch.service.ts
export const searchChunks = async (
  queryVector: number[],
  tenantId: string,
  topK: number = 5
): Promise<any[]> => {
  // Sanitasi karakter OData literal untuk menangkal injection
  const escapeOData = (val: string) => String(val).replace(/'/g, "''");

  // Konstruksi filter deterministik berbasis identitas unik tenant
  const tenantFilter = \`tenant_id eq '\${escapeOData(tenantId)}'\`;

  const payload = {
    vectorQueries: [
      {
        kind: 'vector',
        vector: queryVector,
        fields: 'embedding',
        k: topK
      }
    ],
    filter: tenantFilter, // STRICT ISOLATION BOUNDARY
    select: 'id, content, knowledge_id, tenant_id'
  };

  const response = await azureSearchClient.post('/docs/search', payload);
  return response.data?.value || [];
};`;

  const codePillar4 = `// Path: backend-anythink-express/src/queues/document.queue.ts
export const documentQueue = new Queue('document-processing', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // Menghadapi limitasi transien / rate limit Azure API
    },
    removeOnComplete: true,
    removeOnFail: false,
  }
});`;

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
            <span className="font-semibold text-zinc-900">berijalan (Astra Credit Companies)</span>
            <span>•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 font-medium text-zinc-700">
              Enterprise AI Workplace
            </span>
            <span>•</span>
            <span className="text-zinc-400">Okt 2026</span>
          </div>

          {/* Main Title (Besar & Dominan) */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 max-w-4xl leading-[1.15] mb-4 font-sans">
            Anythink: Modernisasi Arsitektur Enterprise Multi-Tenant RAG
          </h1>

          {/* Subtitle / Executive Pitch */}
          <p className="text-zinc-600 text-base sm:text-lg max-w-3xl leading-relaxed mb-6 font-normal">
            Migrasi end-to-end platform AI internal dari monolitik Laravel ke Next.js 16 App Router, Express.js 5, dan Azure AI Search guna mendukung streaming respons AI real-time, zero-trust tenant isolation, dan efisiensi inferensi.
          </p>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "Next.js 16",
              "Express.js 5",
              "Azure AI Search",
              "BullMQ",
              "Redis 7",
              "Prisma ORM",
              "AES-256-CBC Interop",
              "Zero-Trust",
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-mono rounded-md bg-white border border-zinc-200/90 text-zinc-700 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quick Metrics / Specs Box (Gaya Iqbal Ghozy: 3-4 Grid Simetris di Atas) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl border border-zinc-200/90 bg-white shadow-sm">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Pola Arsitektur
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Decoupled Micro-Monolith (BFF + Core API)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Runtime & Vector
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Node.js 22 + Azure AI Search (Hybrid)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Security & Crypto
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Timing-Safe AES-256 Laravel Interop
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Dampak Kinerja
              </div>
              <div className="text-sm font-semibold text-emerald-700">
                ~82% Latensi TTFT & 48x Throughput
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
          
          {/* SISI KIRI: SLIM STICKY RAIL (Hanya 3 dari 12 Kolom / ~25%) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-8 space-y-8">
            {/* Quick Metadata */}
            <div className="space-y-4 pb-6 border-b border-zinc-200">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Peran
                </div>
                <div className="text-sm font-semibold text-zinc-900 mt-0.5">
                  Fullstack Developer & AI Migration
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Klien / Ekosistem
                </div>
                <div className="text-sm font-semibold text-zinc-900 mt-0.5">
                  Astra Credit Companies (ACC)
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Platform Asli
                </div>
                <a
                  href="https://berijalan.co.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-950 transition-colors mt-0.5 font-mono font-medium"
                >
                  berijalan.co.id <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </div>
            </div>

            {/* Table of Contents (Ramping & Elegan) */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
                Daftar Isi
              </div>
              <nav className="space-y-2 text-xs font-mono text-zinc-500">
                <a href="#bottleneck" className="block hover:text-zinc-950 transition-colors py-0.5">
                  01. Titik Kritis Monolitik
                </a>
                <a href="#architecture" className="block hover:text-zinc-950 transition-colors py-0.5">
                  02. Arsitektur Sistem Baru
                </a>
                <a href="#crypto-bridge" className="block hover:text-zinc-950 transition-colors py-0.5">
                  03. Jembatan Kriptografi
                </a>
                <a href="#bff-defense" className="block hover:text-zinc-950 transition-colors py-0.5">
                  04. Lapisan Defensif BFF
                </a>
                <a href="#vector-isolation" className="block hover:text-zinc-950 transition-colors py-0.5">
                  05. Isolasi Vektor Multi-Tenant
                </a>
                <a href="#benchmarks" className="block hover:text-zinc-950 transition-colors py-0.5">
                  06. Tolok Ukur Kinerja
                </a>
                <a href="#takeaways" className="block hover:text-zinc-950 transition-colors py-0.5">
                  07. Kesimpulan Rekayasa
                </a>
              </nav>
            </div>
          </aside>

          {/* SISI KANAN / TENGAH: WIDE CASE STUDY CONTENT (9 dari 12 Kolom / ~75%) */}
          <article className="lg:col-span-9 space-y-14 text-zinc-700 leading-relaxed text-[15px] sm:text-base">
            
            {/* SECTION 1: BOTTLENECK */}
            <section id="bottleneck" className="space-y-5 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                01. Titik Kritis Arsitektur Monolitik Laravel
              </h2>
              <p>
                Anythink merupakan platform manajemen pengetahuan dan kecerdasan buatan terpadu (<strong className="text-zinc-900 font-semibold">Enterprise AI Workplace</strong>) yang dirancang untuk mengonsumsi ribuan dokumen kepatuhan internal, laporan keuangan, dan standar operasional prosedur (SOP). Sistem ini mengindeks struktur semantik dokumen guna menyediakan asisten cerdas berbasis Retrieval-Augmented Generation (RAG) yang bebas halusinasi bagi ribuan staf lintas divisi di Astra Credit Companies (ACC).
              </p>
              <p>
                Awalnya, platform ini dibangun secara monolitik menggunakan ekosistem Laravel (PHP). Seiring lonjakan adopsi pengguna korporat, tim rekayasa menghadapi tiga hambatan arsitektur mendasar yang tidak lagi dapat diselesaikan melalui vertical scaling:
              </p>

              {/* Container: Stack Vertikal Rapi atau Grid */}
              <div className="space-y-4 my-6">

                {/* CARD 1: Thread Starvation */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 01 // Concurrency & Streaming
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Thread Starvation pada Streaming LLM
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      PHP-FPM Worker Lock
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Protokol inferensi LLM modern mengandalkan transmisi token berkelanjutan (SSE) yang memakan waktu 15 hingga 45 detik per kueri. Pada proses sinkronis PHP-FPM, setiap koneksi streaming mengunci satu worker thread secara penuh. Akibatnya, 20–30 kueri RAG simultan menghabiskan seluruh worker pool dan memicu lonjakan error 504 Gateway Timeout.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Pool Exhaustion</span>
                    <span className="font-semibold text-neutral-900">504 Gateway Timeout</span>
                  </div>
                </div>

                {/* CARD 2: Memory Spikes */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 02 // Resource Utilization
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Lonjakan Memori (OOM Crashes) pada Parsing Dokumen
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Peak 1.8 GB / PDF
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Ekstraksi teks OCR dan segmentasi (chunking) berkas PDF korporat multi-megabyte dieksekusi secara inline atau in-process. Hal ini menimbulkan lonjakan alokasi memori drastis hingga 1.8 GB per proses yang memicu terminasi paksa kontainer (Out-Of-Memory kill) dan menggagalkan transaksi berkas pengguna lain.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Container Crash</span>
                    <span className="font-semibold text-neutral-900">Process SIGKILL (OOM)</span>
                  </div>
                </div>

                {/* CARD 3: Cryptographic Lock-in */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 03 // Data Interoperability
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Risiko Downtime & Cryptographic Lock-in Kredensial
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      PHP Serialization Envelope
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Data sensitif penyewa dienkripsi menggunakan helper bawaan Laravel (Crypt::encryptString) yang menyematkan metadata serialisasi internal PHP. Runtime modern Node.js gagal mendekripsinya secara langsung tanpa jembatan kriptografi dua arah yang valid dan aman dari serangan waktu (timing attacks).
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Migration Blocker</span>
                    <span className="font-semibold text-neutral-900">Zero Data Loss Target</span>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 2: ARCHITECTURE BLUEPRINT */}
            <section id="architecture" className="space-y-5 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 border-b border-neutral-200 pb-3">
                02. Desain Arsitektur Sistem Baru
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Arsitektur dirombak menjadi model <strong className="text-neutral-900 font-semibold">Decoupled Micro-Monolith</strong> dengan pemisahan peran yang tegas antara lapisan presentasi (BFF), orkestrasi bisnis (Core API), dan beban komputasi berat (Async Workers).
              </p>

              {/* CARD: 5-TIER ARCHITECTURE BLUEPRINT */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-100">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      System Topology // Micro-Monolith Decoupled
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-600" />
                      5-Tier Distributed Architecture Blueprint
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                    Zero-Trust Topology
                  </span>
                </div>

                {/* Tier 1 */}
                <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2 font-semibold">
                    Tier 1 // Client Ingress Tier (HTTPS / TLS 1.3)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 shadow-xs">
                      <span className="font-semibold block text-neutral-900">Enterprise Web Client</span>
                      <span className="text-neutral-500 text-[11px]">Corporate Browser · HttpOnly Cookies & Strict CSRF</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 shadow-xs">
                      <span className="font-semibold block text-neutral-900">External Tenant API Clients</span>
                      <span className="text-neutral-500 text-[11px]">Direct Bearer API Keys with Rate Limiter</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-neutral-400 font-mono text-xs">
                  ↓ HTTPS Reverse Proxy & Non-Blocking SSE Passthrough
                </div>

                {/* Tier 2 */}
                <div className="p-3.5 rounded-xl border border-emerald-200/90 bg-emerald-50/50">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-900 mb-2 flex items-center justify-between font-semibold">
                    <span>Tier 2 // Presentation & Governance: Next.js 16 BFF (Port 3000)</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-200">BFF Proxy</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-100 text-neutral-800 shadow-xs">
                      <span className="font-semibold block text-emerald-900">Dynamic Reverse Proxy</span>
                      <code className="text-[10px] font-mono text-neutral-500">/api/[...path]</code>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-100 text-neutral-800 shadow-xs">
                      <span className="font-semibold block text-emerald-900">ROUTE_FIELD_ALLOWLISTS</span>
                      <span className="text-[10px] text-neutral-500">Anti-Leak Response Guard</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-100 text-neutral-800 shadow-xs">
                      <span className="font-semibold block text-emerald-900">SSE Non-Blocking Relay</span>
                      <span className="text-[10px] text-neutral-500">Token streaming passthrough</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-neutral-400 font-mono text-xs">
                  ↓ Server-to-Server Private Handshake (X-Internal-BFF-Secret)
                </div>

                {/* Tier 3 */}
                <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2 font-semibold">
                    Tier 3 // Core Domain API: Express.js 5 (Port 6001)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 shadow-xs">
                      <span className="font-semibold block text-neutral-900">Security Gates</span>
                      <span className="text-neutral-500 text-[11px]">Helmet CSP, HSTS, RateLimiter, SlowDown</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 shadow-xs">
                      <span className="font-semibold block text-neutral-900">Private Secret Guard</span>
                      <span className="text-neutral-500 text-[11px]">stripUntrustedUserIdHeader</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 shadow-xs">
                      <span className="font-semibold block text-neutral-900">RAG Chat & Doc Engine</span>
                      <span className="text-neutral-500 text-[11px]">Prompt Sanitizer & Tenant Isolation</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-neutral-400 font-mono text-xs">
                  ↓ Async Queue Dispatch & Vector Retrieval
                </div>

                {/* Tier 4 & 5 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 text-xs">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2 font-semibold">
                      Tier 4 // Distributed Async Worker (BullMQ + Redis 7)
                    </div>
                    <ul className="space-y-1 text-neutral-600 list-disc list-inside text-[11px]">
                      <li>Ingestion Job Queue (Redis 7 cluster)</li>
                      <li>PDF Text Extraction & Recursive Chunking</li>
                      <li>Batch Embedding Dispatcher (Azure OpenAI)</li>
                      <li>Exponential backoff on rate limits</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 text-xs">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2 font-semibold">
                      Tier 5 // Storage & Vector Retrieval Tier
                    </div>
                    <ul className="space-y-1 text-neutral-600 list-disc list-inside text-[11px]">
                      <li><strong>PostgreSQL 16:</strong> Prisma ORM 7 + Multi-Tenant Index</li>
                      <li><strong>Azure AI Search:</strong> Hybrid Vector + Semantic Ranker</li>
                      <li><strong>Redis 7:</strong> Token bucket & session store</li>
                      <li>Deterministic OData tenant partition filter</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Pola Alur: Event-Driven & Stream Relay</span>
                  <span className="font-semibold text-neutral-900">Zero-Trust BFF Secret Handshake</span>
                </div>
              </div>
            </section>

            {/* SECTION 3: CRYPTO BRIDGE */}
            <section id="crypto-bridge" className="space-y-5 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 border-b border-neutral-200 pb-3">
                03. Jembatan Kriptografi Lintas Ekosistem
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Tantangan terbesar migrasi basis data adalah membaca field terenkripsi (seperti nomor kontak penyewa dan kredensial API) yang diproduksi oleh <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800">Illuminate\Support\Facades\Crypt</code> tanpa melakukan batch re-encryption script offline yang berisiko downtime.
              </p>

              {/* CARD: CRYPTO BRIDGE MODULE */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4 pb-2 border-b border-neutral-100">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Implementation // Cryptographic Interoperability
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                      Jembatan Dekripsi Dua Arah (laravelCrypt.util.ts)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                    AES-256-CBC + Timing-Safe
                  </span>
                </div>

                {/* Payload Formula */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 font-mono text-xs space-y-1.5 text-neutral-800">
                  <div className="text-neutral-950 font-semibold">Struktur Payload Enkripsi Laravel:</div>
                  <div>Payload = Base64( &#123; iv, value, mac, tag &#125; )</div>
                  <div>MAC = HMAC-SHA256( iv + value, APP_KEY )</div>
                  <div className="text-neutral-500 text-[11px] pt-1 font-sans">
                    Plaintext sebelum enkripsi dibungkus format serialisasi PHP internal (misal: <code className="text-neutral-800 font-mono">s:12:&quot;081234567890&quot;;</code>).
                  </div>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  <strong className="text-neutral-900 font-semibold">Solusi Rekayasa:</strong> Modul dekripsi independen di Node.js dirancang menggunakan <code className="text-xs font-mono text-neutral-900">node:crypto</code> bawaan. Modul membedah envelope, menghitung ulang tanda tangan HMAC, memvalidasinya melalui operasi waktu-konstan (<code className="text-xs font-mono text-neutral-900">crypto.timingSafeEqual</code>) untuk menangkal side-channel timing attacks, lalu mengekstraksi string asli via pemindaian regex:
                </p>

                <CodeBlock filename="laravelCrypt.util.ts" code={codePillar1} />

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Integritas: Rekalkulasi HMAC-SHA256 Constant-Time</span>
                  <span className="font-semibold text-emerald-700">100% Zero Data Loss</span>
                </div>
              </div>
            </section>

            {/* SECTION 4: BFF DEFENSE */}
            <section id="bff-defense" className="space-y-5 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 border-b border-neutral-200 pb-3">
                04. Lapisan Defensif BFF & Anti-Leak Filtering
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Mengekspos entitas data ORM langsung ke peramban klien berisiko membocorkan field sensitif seperti hash password, TOTP secrets, atau metadata internal tenant.
              </p>

              {/* CARD: BFF DEFENSE GATE */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4 pb-2 border-b border-neutral-100">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Implementation // Security & Governance
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                      BFF Inspection Gate (route.ts)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                    ROUTE_FIELD_ALLOWLISTS
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  Lapisan Next.js App Router dikonfigurasikan sebagai gerbang inspeksi data ketat melalui mekanisme allowlist pada setiap rute:
                </p>

                <CodeBlock filename="route.ts" code={codePillar2} />

                <p className="text-sm text-neutral-600 leading-relaxed">
                  Selain itu, pertukaran komunikasi internal antara Next.js dan Express.js diproteksi melalui verifikasi rahasia privat (<em>Private Handshake</em>). Header <code className="text-xs font-mono text-neutral-800">X-Internal-BFF-Secret</code> disuntikkan secara dinamis pada server-to-server request, sementara header identitas bawaan klien (<code className="text-xs font-mono text-neutral-800">X-User-Id</code>) dicopot secara paksa oleh middleware Express guna mencegah manipulasi konteks (identity spoofing).
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Proteksi: Anti-Leak Allowlist + Private Secret Guard</span>
                  <span className="font-semibold text-neutral-900">Zero-Trust Enforcement</span>
                </div>
              </div>
            </section>

            {/* SECTION 5: VECTOR ISOLATION */}
            <section id="vector-isolation" className="space-y-5 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 border-b border-neutral-200 pb-3">
                05. Isolasi Vektor Multi-Tenant & Antrean Asinkron
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Kebocoran konteks antar-penyewa (<em>cross-tenant data leakage</em>) adalah risiko paling fatal dalam implementasi RAG perbankan/finansial.
              </p>

              {/* CARD 1: AZURE SEARCH ISOLATION */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4 pb-2 border-b border-neutral-100">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Implementation // Vector Search Partitioning
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                      Isolasi Data Deterministic (azureSearch.service.ts)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                    OData Literal Sanitized
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  Pada integrasi <code className="text-xs font-mono text-neutral-800">azureSearch.service.ts</code>, penelusuran kemiripan vektor dikunci menggunakan klausa filter OData yang disanitasi ketat terhadap upaya injeksi karakter petik:
                </p>

                <CodeBlock filename="azureSearch.service.ts" code={codePillar3} />

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Boundary: Multi-Tenant Vector Partition</span>
                  <span className="font-semibold text-emerald-700">Strict Data Segregation</span>
                </div>
              </div>

              {/* CARD 2: BULLMQ ASYNC QUEUE */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4 pb-2 border-b border-neutral-100">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Implementation // Async Processing Cluster
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                      Orkestrasi Dokumen Tahan Guncangan (document.queue.ts)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                    BullMQ + Exponential Backoff
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  Untuk membebaskan thread utama API, alur berat pemrosesan berkas (ekstraksi teks OCR, pemotongan 600 tokens dengan overlap 100 tokens, serta komputasi embedding Azure OpenAI) dialihkan ke kluster worker BullMQ dengan konfigurasi exponential backoff:
                </p>

                <CodeBlock filename="document.queue.ts" code={codePillar4} />

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Fault-Tolerance: 3 Attempts Exponential Backoff</span>
                  <span className="font-semibold text-neutral-900">Redis 7 Ingestion Queue</span>
                </div>
              </div>

              {/* CARD 3: CONTEXTUAL XSS SANITIZER */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-4 pb-2 border-b border-neutral-100">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Implementation // Security Middleware
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                      Sanitasi XSS Kontekstual yang Mempertahankan Integritas Prompt
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                    Syntax-Preserving Sanitizer
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  Pustaka sanitasi standar kerap menghapus karakter <code className="font-mono text-neutral-800">&lt;</code> dan <code className="font-mono text-neutral-800">&gt;</code> yang memicu kerusakan sintaks pada pertanyaan teknis (misal: analisis kode <code className="font-mono text-neutral-800">if (x &lt; 10 &amp;&amp; y &gt; 20)</code>). Dibuat middleware sanitasi bertingkat yang membersihkan tag HTML berbahaya pada formulir profil, namun secara selektif mempertahankan struktur karakter matematika dan kode pemrograman pada field prompt AI (<code className="font-mono text-neutral-800">prompt, content, question, code</code>).
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Prompt Verification: Code & Math Preserved</span>
                  <span className="font-semibold text-neutral-900">XSS Neutralized</span>
                </div>
              </div>
            </section>

            {/* SECTION 6: BENCHMARKS */}
            <section id="benchmarks" className="space-y-5 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 border-b border-neutral-200 pb-3">
                06. Tolok Ukur Kinerja & Evaluasi Operasional
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Pengujian beban (stress testing) dilakukan pasca migrasi penuh untuk membandingkan kapasitas sistem monolitik lama terhadap arsitektur terdistribusi baru:
              </p>

              {/* CARD: BENCHMARK TABLE */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4 pb-2 border-b border-neutral-100">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Empirical Validation // Production Load Test
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                      Matriks Performa: Laravel Monolith vs Next.js + Express.js
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap font-semibold">
                    Production Verified
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200/90 bg-white">
                  <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50/80 font-mono text-[11px] text-neutral-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-semibold">Metrik Evaluasi Kinerja</th>
                        <th className="py-3.5 px-4 font-semibold">Monolitik Laravel Lama</th>
                        <th className="py-3.5 px-4 font-semibold text-neutral-900">Next.js 16 + Express.js 5 Baru</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Dampak Terukur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      <tr>
                        <td className="py-3.5 px-4 font-medium text-neutral-900">
                          Time to First Token (TTFT)
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 font-mono">
                          4.200 ms – 6.800 ms
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-950 font-mono">
                          620 ms – 1.100 ms
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            Latensi ↓ ~82%
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 font-medium text-neutral-900">
                          Kapasitas Konkurensi Streaming
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 font-mono">
                          ~25 user (FPM lock)
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-950 font-mono">
                          1.200+ stream aktif
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            Throughput ↑ ~48x
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 font-medium text-neutral-900">
                          Beban RAM Worker Ingesti Dokumen
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 font-mono">
                          Lonjakan hingga 1,8 GB/PDF
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-950 font-mono">
                          Stabil di 180 MB / worker
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            Memori ↓ ~90%
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 font-medium text-neutral-900">
                          Transisi & Navigasi Klien
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 font-mono">
                          Full-page reload (1,4 detik)
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-950 font-mono">
                          Transisi instan (&lt;80 ms)
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            Zero Flickering
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3.5 px-4 font-medium text-neutral-900">
                          Integritas Kredensial Historis
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 font-mono">
                          Terkunci format Laravel
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-950 font-mono">
                          100% Interoperabel
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            0% Data Loss
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Metrik Kunci: Throughput Naik 48x Lipat</span>
                  <span className="font-semibold text-emerald-700">Skalabilitas Produksi Terbukti</span>
                </div>
              </div>
            </section>

            {/* SECTION 7: TAKEAWAYS */}
            <section id="takeaways" className="space-y-5 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 border-b border-neutral-200 pb-3">
                07. Kesimpulan Rekayasa & Nilai Tambah
              </h2>

              <div className="space-y-4 my-6">

                {/* TAKEAWAY 1 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Takeaway 01 // Concurrency Model
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Efisiensi Beban AI Generatif
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Node.js Non-Blocking
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Menunjukkan bahwa pergeseran dari proses blocking thread ke model event-driven non-blocking pada Node.js adalah syarat mutlak untuk menangani transmisi streaming AI skala produksi tanpa risiko thread pool exhaustion.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Skalabilitas Streaming RAG</span>
                    <span className="font-semibold text-neutral-900">1.200+ Stream Simultan</span>
                  </div>
                </div>

                {/* TAKEAWAY 2 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Takeaway 02 // Enterprise Security
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Rekayasa Sistem Defensif Tingkat Korporat
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Bank-Grade Security
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Membuktikan bahwa proteksi data perbankan multi-tenant dapat ditegakkan di seluruh lapisan arsitektur: enkripsi aman serangan waktu (timing-safe), filtrasi respons BFF anti-bocor, sanitasi OData mesin vektor, hingga isolasi proses antrean dokumen.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Kepatuhan Regulasi Finansial</span>
                    <span className="font-semibold text-neutral-900">Zero-Trust Tenant Boundary</span>
                  </div>
                </div>

                {/* TAKEAWAY 3 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Takeaway 03 // Migration Strategy
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                        Penyelesaian Legacy Lock-in
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Reverse-Engineered PHP Crypt
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Keberhasilan mengeksekusi reverse-engineering terhadap skema serialisasi internal PHP membuktikan kemampuan mitigasi masalah teknis kompleks tanpa mengorbankan stabilitas operasional bisnis.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Transisi Sistem Nir-Downtime</span>
                    <span className="font-semibold text-neutral-900">Zero Data Loss Target</span>
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
                  href="#bottleneck"
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
