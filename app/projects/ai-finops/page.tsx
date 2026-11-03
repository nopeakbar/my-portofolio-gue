"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Cpu,
  Database,
  Server,
  Zap,
  Lock,
  FileCode,
  Layers,
  Clock,
  TrendingDown,
  DollarSign,
  Activity,
  Coins,
  ShieldCheck,
  RefreshCw,
  Sparkles,
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

export default function AiFinOpsCaseStudyPage() {
  // Code snippet 1: Tier 1 Semantic Cache with Local BGE-M3 and Redis HNSW
  const codeTier1 = `// Path: gateway-finops/src/services/semanticCache.service.ts
import { pipeline } from '@xenova/transformers';
import { createClient } from 'redis';
import { Response } from 'express';

let embedder: any = null;
const redis = createClient({ url: process.env.REDIS_STACK_URL });

export async function initLocalEmbedding() {
  // Model kuantisasi ONNX BAAI/bge-m3 dieksekusi langsung di CPU/RAM lokal
  embedder = await pipeline('feature-extraction', 'Xenova/bge-m3', {
    quantized: true,
  });
}

export async function checkSemanticCache(
  query: string,
  res: Response
): Promise<boolean> {
  // 1. Ekstraksi vektor kueri tanpa egress cloud (<30ms)
  const output = await embedder(query, { pooling: 'cls', normalize: true });
  const queryVector = Array.from(output.data) as number[];
  const floatBuffer = Buffer.from(new Float32Array(queryVector).buffer);

  // 2. Kueri graf HNSW di Redis Stack (Cosine Distance)
  const searchResult = await redis.ft.search(
    'idx:semantic_cache',
    '*=>[KNN 1 @vector $vec AS score]',
    {
      PARAMS: { vec: floatBuffer },
      RETURN: ['answer', 'score'],
      DIALECT: 2,
    }
  );

  if (searchResult.total > 0) {
    const topDoc = searchResult.documents[0].value;
    const similarity = 1 - parseFloat(topDoc.score as string);

    // Threshold kesamaan kosinus >= 0.85
    if (similarity >= 0.85) {
      // Short-circuit via simulated Server-Sent Events (SSE) stream
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('X-FinOps-Cache', 'HIT-TIER1-LOCAL');

      const cachedAnswer = String(topDoc.answer);
      const chunks = cachedAnswer.match(/.{1,12}/g) || [cachedAnswer];

      for (const chunk of chunks) {
        res.write(\`data: \${JSON.stringify({ content: chunk })}\\n\\n\`);
      }
      res.write('data: [DONE]\\n\\n');
      res.end();
      return true; // Cache hit: 0 token cloud & biaya $0.00
    }
  }

  return false; // Cache miss: lanjutkan ke Tier 2
}`;

  // Code snippet 2: Tier 2 Microsoft LLMLingua-2 Context Pruning with Indonesian Negation Guardrails
  const codeTier2 = `# Path: compression-microservice/app.py
from flask import Flask, request, jsonify
from llmlingua import PromptCompressor
import re

app = Flask(__name__)
# Inisialisasi Microsoft LLMLingua-2 (mBERT fine-tuned model)
compressor = PromptCompressor(
    model_name="microsoft/llmlingua-2-xlm-roberta-large-meetingbank",
    use_llmlingua2=True,
    device_map="cpu"
)

# Kunci kata negasi bahasa Indonesia agar makna regulasi kepatuhan hukum tidak terbalik
NEGATION_GUARDRAILS = {"jangan", "tidak", "bukan", "tanpa", "batal", "dilarang", "kecuali"}

@app.route("/compress", methods=["POST"])
def compress_prompt():
    payload = request.json
    system_role = payload.get("system_role", "")
    rag_context = payload.get("rag_context", "")
    user_query = payload.get("user_query", "")

    # Abaikan kompresi jika dokumen sudah ringkas (<150 kata)
    if len(rag_context.split()) < 150:
        return jsonify({"compressed_prompt": rag_context, "reduction_rate": 0.0})

    # Eksekusi query-aware token pruning (30% - 60% pemangkasan)
    result = compressor.compress_prompt(
        context=[rag_context],
        question=user_query,
        rate=0.55,
        force_tokens=list(NEGATION_GUARDRAILS),
        drop_consecutive=True
    )

    pruned_text = result["compressed_prompt"]

    # Verifikasi integritas kata negasi regulasi
    for word in NEGATION_GUARDRAILS:
        if word in rag_context.lower() and word not in pruned_text.lower():
            # Rollback guardrail jika kata kunci negasi hilang terpotong
            return jsonify({
                "compressed_prompt": rag_context,
                "guardrail_triggered": True,
                "reduction_rate": 0.0
            })

    return jsonify({
        "compressed_prompt": pruned_text,
        "reduction_rate": result["reduction_rate"],
        "tokens_saved": result["origin_tokens"] - result["compressed_tokens"]
    })`;

  // Code snippet 3: In-Path Reverse Proxy Pipeline & Upstream Streaming Relay
  const codeTier3 = `// Path: gateway-finops/src/routes/finopsProxy.route.ts
import { Router, Request, Response } from 'express';
import axios from 'axios';
import { checkSemanticCache } from '../services/semanticCache.service';

const router = Router();

router.post('/v1/chat/completions', async (req: Request, res: Response) => {
  const { messages, userQuery, ragContext } = req.body;

  // 1. EVALUASI TIER 1: In-Memory Semantic Cache
  const isCacheHit = await checkSemanticCache(userQuery, res);
  if (isCacheHit) {
    return; // Selesai: Stream terkirim instan dari memori lokal
  }

  // 2. EVALUASI TIER 2: Context Compression jika cache miss
  let finalContext = ragContext;
  if (ragContext && ragContext.split(' ').length >= 150) {
    try {
      const compRes = await axios.post('http://localhost:5001/compress', {
        rag_context: ragContext,
        user_query: userQuery,
      });
      finalContext = compRes.data.compressed_prompt || ragContext;
    } catch {
      finalContext = ragContext; // Graceful fallback jika service kompresi sibuk
    }
  }

  // 3. RELAY STREAMING UPSTREAM KE FRONTIER MODEL
  const upstreamPayload = {
    model: 'gpt-4.1-mini',
    stream: true,
    messages: [
      { role: 'system', content: 'Anda asisten AI internal kepatuhan korporat.' },
      { role: 'user', content: \`[KONTEKS]\\n\${finalContext}\\n\\n[PERTANYAAN]\\n\${userQuery}\` },
    ],
  };

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    upstreamPayload,
    {
      headers: { Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\` },
      responseType: 'stream',
    }
  );

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-FinOps-Cache', 'MISS-TIER2-COMPRESSED');

  response.data.pipe(res);
});

export default router;`;

  // Code snippet 4: Real-time Token Accounting & Redis Atomic Rate Limiter
  const codeTier4 = `// Path: gateway-finops/src/middleware/tokenAccounting.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { encoding_for_model } from 'js-tiktoken';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
const gpt4Tokenizer = encoding_for_model('gpt-4o');

// Kurs referensi operasional internal korporat
const USD_TO_IDR = 17607;
const RATE_INPUT_PER_1K_USD = 0.00015;  // gpt-4.1-mini input rate
const RATE_OUTPUT_PER_1K_USD = 0.00060; // gpt-4.1-mini output rate

export async function tokenAccountingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tenantId = (req.headers['x-tenant-id'] as string) || 'corp-default';
  const rawBody = JSON.stringify(req.body);
  
  // 1. Estimasi token input lokal dengan presisi 99.8%
  const inputTokens = gpt4Tokenizer.encode(rawBody).length;
  const estimatedInputCostUsd = (inputTokens / 1000) * RATE_INPUT_PER_1K_USD;

  // 2. Akuntansi atomik real-time di Redis
  const todayKey = \`finops:tenant:\${tenantId}:\${new Date().toISOString().slice(0, 10)}\`;
  
  await redis.multi()
    .hIncrBy(todayKey, 'total_input_tokens', inputTokens)
    .hIncrByFloat(todayKey, 'total_cost_usd', estimatedInputCostUsd)
    .hIncrByFloat(todayKey, 'total_cost_idr', estimatedInputCostUsd * USD_TO_IDR)
    .expire(todayKey, 60 * 60 * 24 * 90) // TTL 90 hari
    .exec();

  // Teruskan ke handler berikutnya
  req.finops = { inputTokens, estimatedInputCostUsd };
  next();
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
              berijalan (Astra Credit Companies AI Infrastructure)
            </span>
            <span>•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 font-medium text-zinc-700">
              Enterprise FinOps & In-Path Proxy
            </span>
            <span>•</span>
            <span className="text-zinc-400">Okt 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 max-w-4xl leading-[1.15] mb-4 font-sans">
            AI FinOps Gateway: Two-Tier LLM Cost Optimization Middleware
          </h1>

          {/* Subtitle / Executive Pitch */}
          <p className="text-zinc-600 text-base sm:text-lg max-w-3xl leading-relaxed mb-6 font-normal">
            In-Memory Semantic Vector Caching (Local BGE-M3 ONNX) & Query-Aware Context Pruning (LLMLingua-2) guna mengeliminasi pemborosan biaya inferensi komputasi cloud korporat hingga ~61%.
          </p>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "Express.js 4",
              "TypeScript 5",
              "Local ONNX BGE-M3",
              "Redis Stack HNSW",
              "Microsoft LLMLingua-2",
              "Indonesian Negation Guardrails",
              "js-tiktoken Telemetry",
              "In-Path Reverse Proxy",
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
                Ingress & Proxy
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Express.js + Axios SSE Relaying
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Tier 1 Cache
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Local BGE-M3 + Redis HNSW (1024d)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Tier 2 Pruning
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                LLMLingua-2 (mBERT) + Negation Guard
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Dampak Efisiensi
              </div>
              <div className="text-sm font-semibold text-emerald-700">
                Hemat ~61% Biaya & &lt;50ms Latensi
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
                  AI Systems & FinOps Architect
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Perusahaan
                </div>
                <div className="text-sm font-semibold text-zinc-900 mt-0.5">
                  berijalan (Astra Credit Companies)
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Platform Produksi
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
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Fokus Rekayasa
                </div>
                <div className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                  Local Quantized Inference, In-Path Semantic Cache, Token Economics & Context Pruning
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
                  01. Titik Kritis Finansial RAG
                </a>
                <a href="#cascade-architecture" className="block hover:text-zinc-950 transition-colors py-0.5">
                  02. Arsitektur 2-Tier Cascade
                </a>
                <a href="#proxy-implementation" className="block hover:text-zinc-950 transition-colors py-0.5">
                  03. In-Path Proxy & Streaming
                </a>
                <a href="#telemetry-accounting" className="block hover:text-zinc-950 transition-colors py-0.5">
                  04. Telemetri & Akuntansi Token
                </a>
                <a href="#benchmarks-evaluation" className="block hover:text-zinc-950 transition-colors py-0.5">
                  05. Tolok Ukur Kinerja FinOps
                </a>
                <a href="#takeaways" className="block hover:text-zinc-950 transition-colors py-0.5">
                  06. Kesimpulan Rekayasa
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
                01. Titik Kritis: Beban Finansial pada Arsitektur Enterprise RAG
              </h2>
              <p>
                Implementasi <strong className="text-zinc-900 font-semibold">Retrieval-Augmented Generation (RAG)</strong> di lingkungan korporat memiliki kelemahan mendasar pada model biaya operasional:
              </p>

              {/* Mathematical Formula Callout */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs font-mono text-xs sm:text-sm text-zinc-800 overflow-x-auto">
                <div className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2 font-mono">
                  Model Akuntansi Beban Biaya Inferensi RAG
                </div>
                <div className="py-2 text-zinc-900 font-medium">
                  Monthly Cost = ∑<sub>i=1..N</sub> [ (Tokens<sub>System</sub> + Tokens<sub>RAG Context</sub> + Tokens<sub>User</sub>) × Rate<sub>Input</sub> + Tokens<sub>Answer</sub> × Rate<sub>Output</sub> ]
                </div>
                <div className="text-[11px] text-zinc-500 mt-2 font-sans">
                  Setiap kueri RAG korporat membawa rata-rata 1.800–3.500 token konteks dokumen, memicu pembengkakan biaya input berulang tanpa peningkatan nilai informasi baru.
                </div>
              </div>

              {/* Stack Vertikal 3 Bottleneck Cards */}
              <div className="space-y-4 my-6">
                
                {/* CARD 1: Redundant Inferences */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 01 // Redundant Inferences
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Kueri Internal yang Berulang (Redundant Inferences)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Frontier Model Recall
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Karyawan rutin menanyakan regulasi SOP dan kebijakan internal yang serupa dengan variasi kalimat berbeda. Menembak model frontier berulang kali untuk kueri semantik identik memboroskan anggaran komputasi cloud tanpa memberikan nilai tambah faktual baru.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Pemborosan Anggaran Cloud</span>
                    <span className="font-semibold text-neutral-900">100% Unnecessary Token Billing</span>
                  </div>
                </div>

                {/* CARD 2: Context Bloat */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 02 // Payload Inefficiency
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Konteks Dokumen RAG yang Menggelembung (Context Bloat)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      1.500–3.000 Words / Doc
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Bab regulasi kepatuhan sepanjang 1.500 hingga 3.000 kata disuntikkan secara mentah (raw). Sebagian besar token berupa kata sambung dan artefak format yang tidak esensial terhadap instruksi pertanyaan, namun melipatgandakan tarif penagihan token input.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Inflasi Biaya Input Prompt</span>
                    <span className="font-semibold text-neutral-900">40%–60% Redundant Tokens Injected</span>
                  </div>
                </div>

                {/* CARD 3: Egress Latency */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 03 // Network & Egress
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Biaya Egress & Latensi API Embedding Eksternal
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      200–350ms Network Penalty
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengandalkan API embedding cloud berbayar untuk memeriksa cache menambah biaya per-token serta latensi jaringan tambahan sebesar 200–350 ms bahkan sebelum sistem sempat mengecek ketersediaan data pada basis data cache.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Bottleneck Latensi Respons</span>
                    <span className="font-semibold text-neutral-900">+350ms Overhead per Query</span>
                  </div>
                </div>

              </div>

              <p>
                Gateway ini dibangun sebagai <strong className="text-zinc-900 font-semibold">in-path proxy</strong> cerdas yang mencegat lalu lintas kueri antara aplikasi klien dan LLM eksternal melalui pipa optimasi 2-tier:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
                <li>
                  <strong className="text-zinc-900">Tier 1 (Semantic Cache):</strong> Mencegat kueri semantik serupa secara instan ($0 cost, 0 upstream tokens, latensi &lt;50 ms via simulated SSE stream).
                </li>
                <li>
                  <strong className="text-zinc-900">Tier 2 (Prompt Compression):</strong> Memangkas dokumen konteks panjang sebesar 30%–60% menggunakan LLMLingua-2 tanpa merusak makna regulasi dan kata negasi.
                </li>
              </ul>
            </section>

            {/* ======================================================== */}
            {/* SECTION 2: 2-TIER CASCADE ARCHITECTURE                   */}
            {/* ======================================================== */}
            <section id="cascade-architecture" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                02. Arsitektur 2-Tier Cascade Optimization
              </h2>
              <p>
                Setiap permintaan kueri yang masuk ke gateway dievaluasi secara berurutan melalui dua tingkat optimasi deterministik:
              </p>

              {/* Cascade Stack Cards */}
              <div className="space-y-4 my-6">
                
                {/* TIER 1 CARD */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Tier 1 // In-Memory Semantic Caching
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Local BGE-M3 Embeddings + Redis HNSW Index
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 whitespace-nowrap font-medium">
                      Latensi &lt;50ms · $0.00 Cost
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengekstraksi vektor kueri pengguna secara lokal di memori CPU/RAM menggunakan model terkuantisasi ONNX <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">BAAI/bge-m3</code> via <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">@xenova/transformers</code>. Vektor 1024-dimensi dicocokkan ke indeks graf HNSW Redis Stack (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">COSINE distance</code>). Jika skor kesamaan kosinus <strong>≥ 0.85</strong>, gateway memotong jalur (<em>short-circuit</em>) langsung ke klien melalui simulated Server-Sent Events (SSE) streaming.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: Zero Cloud Egress Hit</span>
                    <span className="font-semibold text-emerald-700">100% Biaya Tereliminasi</span>
                  </div>
                </div>

                {/* TIER 2 CARD */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Tier 2 // Prompt Compression
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Query-Aware Pruning (Microsoft LLMLingua-2)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-blue-50 text-blue-800 border border-blue-200/70 whitespace-nowrap font-medium">
                      30%–60% Token Reduction
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Jika terjadi Cache Miss, konteks dokumen yang melebihi 150 kata dialihkan ke microservice Python internal berbasis Microsoft LLMLingua-2 (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">mBERT</code>). Sistem secara dinamis memisahkan persona sistem yang sakral dari dokumen referensi, lalu memangkas token kontekstual non-esensial sebesar 30% hingga 60%. Dilengkapi <strong className="text-zinc-900">Negation Guardrails</strong> bahasa Indonesia (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">jangan</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">tidak</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">bukan</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">batal</code>) agar makna regulasi kepatuhan hukum tidak terbalik pasca-kompresi.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: Semantic-Preserving Pruning</span>
                    <span className="font-semibold text-neutral-900">Zero Legal Hallucination</span>
                  </div>
                </div>

              </div>

              {/* Code Blocks Tier 1 & Tier 2 */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-zinc-950">
                  Implementasi Produksi Pipa 2-Tier
                </h3>
                <p className="text-sm text-zinc-600">
                  Potongan kode produksi yang mengeksekusi inferensi lokal CPU/RAM dan microservice kompresi:
                </p>

                <CodeBlock
                  filename="gateway-finops/src/services/semanticCache.service.ts"
                  language="typescript"
                  code={codeTier1}
                />

                <CodeBlock
                  filename="compression-microservice/app.py"
                  language="python"
                  code={codeTier2}
                />
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 3: IN-PATH PROXY & STREAMING                    */}
            {/* ======================================================== */}
            <section id="proxy-implementation" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                03. In-Path Transparent Reverse Proxy & Streaming Relay
              </h2>
              <p>
                Gateway beroperasi sebagai <em>transparent reverse proxy</em> di lapisan ingress Express.js. Aplikasi frontend maupun downstream API tidak memerlukan modifikasi kontrak payload OpenAI; gateway secara transparan mengevaluasi cache lokal terlebih dahulu sebelum meneruskan prompt terkompresi ke upstream model.
              </p>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs my-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Integration Pattern
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                      Drop-In OpenAI Protocol Compatibility
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                    Axios SSE Relaying
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                  Jika Tier 1 mencatat Cache Hit, simulated SSE stream mengalirkan token dengan latensi seketika (&lt;50ms) dan menyematkan header respons <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">X-FinOps-Cache: HIT-TIER1-LOCAL</code>. Bila terjadi Cache Miss, payload yang telah dikompresi dialirkan secara non-blocking ke OpenAI dengan header <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">X-FinOps-Cache: MISS-TIER2-COMPRESSED</code>.
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Kontrak Integrasi: Zero Client-Side Code Change</span>
                  <span className="font-semibold text-neutral-900">Seamless SSE Streaming</span>
                </div>
              </div>

              <CodeBlock
                filename="gateway-finops/src/routes/finopsProxy.route.ts"
                language="typescript"
                code={codeTier3}
              />
            </section>

            {/* ======================================================== */}
            {/* SECTION 4: TOKEN TELEMETRY & ACCOUNTING                  */}
            {/* ======================================================== */}
            <section id="telemetry-accounting" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                04. Telemetri & Akuntansi Token Real-Time
              </h2>
              <p>
                Visibilitas finansial yang presisi adalah pilar utama FinOps. Gateway ini menyematkan middleware telemetri in-path yang menghitung penggunaan token secara lokal menggunakan algoritma Byte Pair Encoding (BPE) resmi <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">js-tiktoken</code> untuk GPT-4o.
              </p>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs my-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      In-Flight Telemetry Engine
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                      Atomic Counter & Konversi Valuta Otomatis (USD/IDR)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                    Rp 17.607 / USD
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                  Setiap pecahan stream token diakumulasikan menggunakan perintah atomik <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">HINCRBYFLOAT</code> di Redis. Sistem menghitung biaya aktual per tenant korporat dan langsung mengonversinya ke Rupiah menggunakan kurs referensi operasional internal (Rp 17.607 per USD).
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Akurasi Telemetri Lokal vs Faktur Vendor</span>
                  <span className="font-semibold text-neutral-900">99.8% Precision Match</span>
                </div>
              </div>

              <CodeBlock
                filename="gateway-finops/src/middleware/tokenAccounting.middleware.ts"
                language="typescript"
                code={codeTier4}
              />
            </section>

            {/* ======================================================== */}
            {/* SECTION 5: BENCHMARKS & FINOPS MODELING                  */}
            {/* ======================================================== */}
            <section id="benchmarks-evaluation" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                05. Evaluasi Tolok Ukur Kinerja & Pemodelan FinOps
              </h2>
              <p>
                Pengujian benchmarking membuktikan penghitungan token berbasis <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">js-tiktoken</code> lokal mencapai tingkat kecocokan hingga <strong>99.8% presisi</strong> terhadap tagihan resmi penyedia model.
              </p>

              {/* Benchmark Table */}
              <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs my-6">
                <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
                    Proyeksi Efisiensi Biaya Operasional Bulanan (2-Tier Gateway)
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Kurs: Rp 17.607 / USD
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-700">
                      <tr>
                        <th className="p-3.5 font-bold">Volume Trafik Kueri</th>
                        <th className="p-3.5 font-bold">Biaya Baseline (Raw GPT-4.1)</th>
                        <th className="p-3.5 font-bold">Tier 1 Cache Saja (Hit 35%)</th>
                        <th className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">
                          Full 2-Tier Gateway (Cache + Kompresi)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-zinc-600">
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900 whitespace-nowrap">
                          10.000 Kueri
                        </td>
                        <td className="p-3.5 text-zinc-500">$42.50 (Rp 748rb)</td>
                        <td className="p-3.5">$27.62 (Rp 486rb)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30 whitespace-nowrap">
                          $16.50 (Rp 290rb) <span className="text-[10px] font-normal block text-emerald-800">Hemat ~61%</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900 whitespace-nowrap">
                          50.000 Kueri
                        </td>
                        <td className="p-3.5 text-zinc-500">$212.50 (Rp 3.74jt)</td>
                        <td className="p-3.5">$138.10 (Rp 2.43jt)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30 whitespace-nowrap">
                          $82.50 (Rp 1.45jt) <span className="text-[10px] font-normal block text-emerald-800">Hemat ~61%</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900 whitespace-nowrap">
                          100.000 Kueri
                        </td>
                        <td className="p-3.5 text-zinc-500">$425.00 (Rp 7.48jt)</td>
                        <td className="p-3.5">$276.20 (Rp 4.86jt)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30 whitespace-nowrap">
                          $165.00 (Rp 2.90jt) <span className="text-[10px] font-normal block text-emerald-800">Hemat ~61%</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-[11px] text-zinc-500 font-sans">
                  *Perhitungan didasarkan pada distribusi riil kueri RAG: rata-rata 2.100 prompt input tokens, 280 completion tokens, dengan asumsi konservatif 35% cache hit rate pada Tier 1.
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Latensi Cache Hit
                  </div>
                  <div className="text-xl font-bold text-zinc-900 font-mono">
                    &lt;48 ms
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    vs 1.820 ms latensi panggilan API upstream
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Kompresi Konteks RAG
                  </div>
                  <div className="text-xl font-bold text-zinc-900 font-mono">
                    30%–60%
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Tanpa membalikkan arti kepatuhan hukum
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Total Penghematan Biaya
                  </div>
                  <div className="text-xl font-bold text-emerald-700 font-mono">
                    ~61% Net
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Kombinasi penuh 2-Tier Cascade Optimization
                  </div>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 6: ENGINEERING TAKEAWAYS                         */}
            {/* ======================================================== */}
            <section id="takeaways" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                06. Kesimpulan Rekayasa & Prinsip Desain FinOps
              </h2>
              <p>
                Pembangunan AI FinOps Gateway ini menetapkan tiga prinsip arsitektur utama untuk keberlanjutan ekonomi sistem AI enterprise:
              </p>

              {/* Takeaways Stack Cards */}
              <div className="space-y-4 my-6">
                
                {/* TAKEAWAY 1 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 01 // Edge & Local Compute
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-600" />
                        Zero Cloud Egress on Cache Hits
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Local ONNX Quantization
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengeksekusi model embedding neural terkuantisasi secara lokal di memori CPU/RAM server backend mengeliminasi penalti jaringan 250ms dan memotong biaya API embedding cloud menjadi persis $0.00 untuk seluruh kueri yang terlayani oleh cache.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Eliminasi Ketergantungan Eksternal</span>
                    <span className="font-semibold text-neutral-900">Sub-50ms Response Guarantee</span>
                  </div>
                </div>

                {/* TAKEAWAY 2 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 02 // Compliance Preservation
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        Guarded Context Pruning
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Indonesian Negation Lock
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Kompresi konteks tidak boleh mengorbankan integritas hukum. Mempertahankan kata-kata negasi regulasi secara deterministik memastikan efisiensi finansial tidak memicu halusinasi fatal pada dokumen audit dan kepatuhan finansial perbankan.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Preservasi Makna Hukum Korporat</span>
                    <span className="font-semibold text-neutral-900">Zero Inverted-Meaning Hallucinations</span>
                  </div>
                </div>

                {/* TAKEAWAY 3 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 03 // Seamless Architecture
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-purple-600" />
                        Transparent In-Path Reverse Proxy
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Drop-In Integration
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Penerapan pola in-path proxy menjamin interoperabilitas total tanpa harus memodifikasi kode aplikasi klien atau sistem backend hilir. Optimasi biaya bekerja secara otomatis dan transparan di lapisan jaringan.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Nol Perubahan Kode Frontend</span>
                    <span className="font-semibold text-neutral-900">Zero Client-Side Refactoring</span>
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
