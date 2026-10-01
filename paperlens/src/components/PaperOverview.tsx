import React, { useState } from 'react';
import { PaperAnalysis } from '../types';
import { Copy, Check, ExternalLink, FileText, Bookmark } from 'lucide-react';

interface PaperOverviewProps {
  paper: PaperAnalysis;
  onNavigateTab: (tab: string) => void;
}

export const PaperOverview: React.FC<PaperOverviewProps> = ({
  paper,
  onNavigateTab,
}) => {
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  const handleCopyDoi = () => {
    if (paper.doi) {
      navigator.clipboard.writeText(paper.doi);
      setCopiedDoi(true);
      setTimeout(() => setCopiedDoi(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 px-4 sm:px-6">
      {/* Academic Paper Header */}
      <header className="space-y-4 border-b border-stone-200 pb-8">
        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-stone-500 uppercase tracking-wider">
          <span>{paper.year}</span>
          <span className="text-stone-300 font-sans">/</span>
          <span className="text-stone-700">{paper.venue}</span>
          {paper.doi && (
            <>
              <span className="text-stone-300 font-sans">/</span>
              <button
                onClick={handleCopyDoi}
                className="hover:text-stone-900 transition flex items-center gap-1 normal-case font-mono"
                title="Copy DOI identifier"
              >
                <span>doi:{paper.doi}</span>
                {copiedDoi ? (
                  <Check className="w-3 h-3 text-stone-700" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-400" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Paper Title in Academic Editorial Serif */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-academic text-stone-900 font-normal tracking-tight leading-tight">
          {paper.title}
        </h1>

        {/* Author List */}
        <div className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
          {paper.authors.map((author, idx) => (
            <span key={author}>
              <span className="text-stone-800 font-medium">{author}</span>
              {idx < paper.authors.length - 1 ? (
                <span className="text-stone-400 mr-2">,</span>
              ) : null}
            </span>
          ))}
        </div>

        {/* Abstract Box - Scholarly Style */}
        <div className="mt-6 pt-5 border-t border-stone-200/80">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-semibold">
              Abstract
            </h2>
            <button
              onClick={() => setShowFullAbstract(!showFullAbstract)}
              className="text-[11px] font-mono text-stone-500 hover:text-stone-900 transition"
            >
              {showFullAbstract ? '[Collapse]' : '[Expand Full Text]'}
            </button>
          </div>
          <p
            className={`text-sm sm:text-[15px] font-serif-academic text-stone-800 leading-relaxed pl-4 border-l-2 border-stone-300 ${
              !showFullAbstract ? 'line-clamp-4' : ''
            }`}
          >
            {paper.abstract}
          </p>
        </div>
      </header>

      {/* Structured Research Summary: Typography and Hairline Rules, No Floating Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold">
            Structured Research Summary
          </h2>
          <span className="text-[11px] font-mono text-stone-400">
            Dimension Analysis
          </span>
        </div>

        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {/* Row 1: Research Question */}
          <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
            <div className="md:col-span-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                Research Question
              </span>
              <span className="text-xs text-stone-400 font-mono">Problem Formulation</span>
            </div>
            <div className="md:col-span-9 space-y-2">
              <p className="text-sm font-medium text-stone-900 leading-snug">
                {paper.atAGlance.problem.title}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {paper.atAGlance.problem.summary}
              </p>
              <div className="text-xs text-stone-500 pt-1 flex items-start gap-1.5">
                <span className="font-mono text-[11px] text-stone-400 uppercase shrink-0">Significance:</span>
                <span>{paper.atAGlance.problem.significance}</span>
              </div>
            </div>
          </div>

          {/* Row 2: Method & Core Approach */}
          <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
            <div className="md:col-span-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                Method
              </span>
              <span className="text-xs text-stone-400 font-mono">Architecture & Approach</span>
            </div>
            <div className="md:col-span-9 space-y-2">
              <p className="text-sm font-medium text-stone-900 leading-snug">
                {paper.atAGlance.approach.title}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {paper.atAGlance.approach.summary}
              </p>
              <div className="text-xs text-stone-700 bg-stone-100/70 p-2.5 rounded-xs border border-stone-200/60 font-mono text-[12px]">
                <span className="text-stone-400 uppercase text-[10px] block mb-0.5">Core Innovation</span>
                {paper.atAGlance.approach.keyInnovation}
              </div>
            </div>
          </div>

          {/* Row 3: Data & Benchmarks */}
          <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
            <div className="md:col-span-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                Data & Corpus
              </span>
              <span className="text-xs text-stone-400 font-mono">Training & Evaluation</span>
            </div>
            <div className="md:col-span-9 space-y-2">
              <p className="text-sm font-medium text-stone-900 leading-snug">
                {paper.atAGlance.data.title}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {paper.atAGlance.data.summary}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {paper.atAGlance.data.benchmarks.map((benchmark, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono text-stone-700 bg-stone-100 px-2 py-0.5 border border-stone-200"
                  >
                    {benchmark}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Key Findings */}
          <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
            <div className="md:col-span-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                Key Finding
              </span>
              <span className="text-xs text-stone-400 font-mono">Empirical Breakthrough</span>
            </div>
            <div className="md:col-span-9 space-y-2">
              <p className="text-sm font-medium text-stone-900 leading-snug">
                {paper.atAGlance.results.title}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {paper.atAGlance.results.summary}
              </p>
              <div className="text-xs font-serif-academic text-stone-900 italic pl-3 border-l-2 border-stone-400">
                "{paper.atAGlance.results.highlight}"
              </div>
            </div>
          </div>

          {/* Row 5: Limitations */}
          <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
            <div className="md:col-span-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                Limitation
              </span>
              <span className="text-xs text-stone-400 font-mono">Boundaries & Failure Modes</span>
            </div>
            <div className="md:col-span-9 space-y-2">
              <p className="text-sm font-medium text-stone-900 leading-snug">
                {paper.atAGlance.limitations.title}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {paper.atAGlance.limitations.summary}
              </p>
              <div className="text-xs text-stone-600 font-mono">
                <span className="text-stone-400 uppercase text-[10px] mr-1.5">Critical Bottleneck:</span>
                {paper.atAGlance.limitations.criticalBottleneck}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Objectives & Scope */}
      <section className="space-y-4 pt-2">
        <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold border-b border-stone-200 pb-2">
          Research Objectives
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paper.researchObjectives.map((obj, idx) => (
            <li
              key={idx}
              className="text-xs text-stone-700 font-sans p-3 bg-white border border-stone-200/90 flex items-start gap-2.5"
            >
              <span className="text-[11px] font-mono font-bold text-stone-400 shrink-0">
                0{idx + 1}.
              </span>
              <span className="leading-relaxed">{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Deep Dive Quick Anchors */}
      <section className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-500">
        <span>Deep exploration views:</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('map')}
            className="hover:text-stone-900 underline underline-offset-4 transition"
          >
            Explore Research Map →
          </button>
          <span className="text-stone-300">/</span>
          <button
            onClick={() => onNavigateTab('flow')}
            className="hover:text-stone-900 underline underline-offset-4 transition"
          >
            Methodology Flowchart →
          </button>
          <span className="text-stone-300">/</span>
          <button
            onClick={() => onNavigateTab('findings')}
            className="hover:text-stone-900 underline underline-offset-4 transition"
          >
            Empirical Findings →
          </button>
        </div>
      </section>
    </div>
  );
};
