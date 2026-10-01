import React, { useState } from 'react';
import { PaperAnalysis } from '../types';
import { GitCompare, ArrowRightLeft, BookOpen, Layers } from 'lucide-react';

interface PaperComparisonProps {
  papers: PaperAnalysis[];
  currentPaper: PaperAnalysis;
}

export const PaperComparison: React.FC<PaperComparisonProps> = ({
  papers,
  currentPaper,
}) => {
  // Select Paper A and Paper B
  const [paperAId, setPaperAId] = useState<string>(currentPaper.id);
  const [paperBId, setPaperBId] = useState<string>(
    papers.find((p) => p.id !== currentPaper.id)?.id || papers[0].id
  );

  const paperA = papers.find((p) => p.id === paperAId) || papers[0];
  const paperB = papers.find((p) => p.id === paperBId) || papers[1] || papers[0];

  const handleSwap = () => {
    setPaperAId(paperBId);
    setPaperBId(paperAId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6 font-sans">
      {/* Header */}
      <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold">
            Comparative Literature Workspace
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Systematic side-by-side dimensional contrast across problem formulation, architecture, and empirical bounds.
          </p>
        </div>
        <span className="text-[11px] font-mono text-stone-400">
          NEUTRAL SCIENTIFIC TAXONOMY
        </span>
      </div>

      {/* Selectors for Paper A and Paper B */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-white p-4 border border-stone-300">
        {/* Paper A Picker */}
        <div className="md:col-span-5 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block font-semibold">
            Primary Study (Paper A)
          </label>
          <select
            value={paperA.id}
            onChange={(e) => setPaperAId(e.target.value)}
            className="w-full text-xs font-sans bg-stone-50 border border-stone-300 p-2 text-stone-900 font-medium focus:outline-none focus:border-stone-900"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.year})
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="md:col-span-1 flex justify-center py-1">
          <button
            onClick={handleSwap}
            className="p-1.5 border border-stone-300 hover:border-stone-900 text-stone-600 hover:text-stone-900 transition"
            title="Swap Papers"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Paper B Picker */}
        <div className="md:col-span-5 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block font-semibold">
            Comparative Study (Paper B)
          </label>
          <select
            value={paperB.id}
            onChange={(e) => setPaperBId(e.target.value)}
            className="w-full text-xs font-sans bg-stone-50 border border-stone-300 p-2 text-stone-900 font-medium focus:outline-none focus:border-stone-900"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.year})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two-Column Academic Comparison Table */}
      <div className="border border-stone-300 bg-white overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-300 font-mono text-[11px] text-stone-700 uppercase">
              <th className="py-3 px-4 font-semibold w-1/4 border-r border-stone-200">
                Dimension
              </th>
              <th className="py-3 px-4 font-semibold w-[37.5%] border-r border-stone-200">
                PAPER A: {paperA.title.slice(0, 32)}... ({paperA.year})
              </th>
              <th className="py-3 px-4 font-semibold w-[37.5%]">
                PAPER B: {paperB.title.slice(0, 32)}... ({paperB.year})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {/* Row 1: Authors & Venue */}
            <tr className="hover:bg-stone-50/60">
              <td className="py-3 px-4 font-mono font-semibold text-stone-600 border-r border-stone-200 uppercase text-[11px]">
                Authors & Venue
              </td>
              <td className="py-3 px-4 text-stone-800 border-r border-stone-200">
                <div className="font-serif-academic text-sm">{paperA.authors.slice(0, 4).join(', ')}{paperA.authors.length > 4 ? ' et al.' : ''}</div>
                <div className="text-[11px] font-mono text-stone-500 mt-0.5">{paperA.venue}</div>
              </td>
              <td className="py-3 px-4 text-stone-800">
                <div className="font-serif-academic text-sm">{paperB.authors.slice(0, 4).join(', ')}{paperB.authors.length > 4 ? ' et al.' : ''}</div>
                <div className="text-[11px] font-mono text-stone-500 mt-0.5">{paperB.venue}</div>
              </td>
            </tr>

            {/* Row 2: Research Question */}
            <tr className="hover:bg-stone-50/60">
              <td className="py-3 px-4 font-mono font-semibold text-stone-600 border-r border-stone-200 uppercase text-[11px]">
                Research Question
              </td>
              <td className="py-3 px-4 text-stone-800 border-r border-stone-200 leading-relaxed font-sans">
                <div className="font-medium text-stone-900 mb-1">{paperA.atAGlance.problem.title}</div>
                <div>{paperA.researchProblem}</div>
              </td>
              <td className="py-3 px-4 text-stone-800 leading-relaxed font-sans">
                <div className="font-medium text-stone-900 mb-1">{paperB.atAGlance.problem.title}</div>
                <div>{paperB.researchProblem}</div>
              </td>
            </tr>

            {/* Row 3: Dataset & Corpus */}
            <tr className="hover:bg-stone-50/60">
              <td className="py-3 px-4 font-mono font-semibold text-stone-600 border-r border-stone-200 uppercase text-[11px]">
                Dataset & Benchmarks
              </td>
              <td className="py-3 px-4 text-stone-800 border-r border-stone-200">
                <div className="space-y-1 font-mono text-[11px]">
                  {paperA.atAGlance.data.benchmarks.map((b, i) => (
                    <div key={i} className="p-1 bg-stone-50 border border-stone-200">
                      • {b}
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4 text-stone-800">
                <div className="space-y-1 font-mono text-[11px]">
                  {paperB.atAGlance.data.benchmarks.map((b, i) => (
                    <div key={i} className="p-1 bg-stone-50 border border-stone-200">
                      • {b}
                    </div>
                  ))}
                </div>
              </td>
            </tr>

            {/* Row 4: Method & Approach */}
            <tr className="hover:bg-stone-50/60">
              <td className="py-3 px-4 font-mono font-semibold text-stone-600 border-r border-stone-200 uppercase text-[11px]">
                Method & Technique
              </td>
              <td className="py-3 px-4 text-stone-800 border-r border-stone-200 leading-relaxed">
                <div className="font-medium text-stone-900 mb-1">{paperA.atAGlance.approach.title}</div>
                <div>{paperA.atAGlance.approach.summary}</div>
                <div className="mt-2 p-2 bg-stone-50 border border-stone-200 font-mono text-[11px] text-stone-700">
                  {paperA.atAGlance.approach.keyInnovation}
                </div>
              </td>
              <td className="py-3 px-4 text-stone-800 leading-relaxed">
                <div className="font-medium text-stone-900 mb-1">{paperB.atAGlance.approach.title}</div>
                <div>{paperB.atAGlance.approach.summary}</div>
                <div className="mt-2 p-2 bg-stone-50 border border-stone-200 font-mono text-[11px] text-stone-700">
                  {paperB.atAGlance.approach.keyInnovation}
                </div>
              </td>
            </tr>

            {/* Row 5: Model & Architecture */}
            <tr className="hover:bg-stone-50/60">
              <td className="py-3 px-4 font-mono font-semibold text-stone-600 border-r border-stone-200 uppercase text-[11px]">
                Model Architecture
              </td>
              <td className="py-3 px-4 text-stone-800 border-r border-stone-200">
                <div className="text-xs font-sans leading-relaxed">
                  {paperA.researchMap.nodes.find((n) => n.category === 'model')?.description ||
                    paperA.atAGlance.approach.summary}
                </div>
              </td>
              <td className="py-3 px-4 text-stone-800">
                <div className="text-xs font-sans leading-relaxed">
                  {paperB.researchMap.nodes.find((n) => n.category === 'model')?.description ||
                    paperB.atAGlance.approach.summary}
                </div>
              </td>
            </tr>

            {/* Row 6: Key Results */}
            <tr className="hover:bg-stone-50/60">
              <td className="py-3 px-4 font-mono font-semibold text-stone-600 border-r border-stone-200 uppercase text-[11px]">
                Empirical Results
              </td>
              <td className="py-3 px-4 text-stone-800 border-r border-stone-200">
                <div className="font-medium text-stone-900 mb-1">{paperA.atAGlance.results.title}</div>
                <div className="font-serif-academic text-sm italic pl-2 border-l border-stone-300 mb-2">
                  "{paperA.atAGlance.results.highlight}"
                </div>
                <div className="font-mono text-[11px] text-stone-600 space-y-0.5">
                  {paperA.keyFindings.quantitative.slice(0, 2).map((q, i) => (
                    <div key={i}>
                      › {q.metricName}: <span className="font-bold">{q.paperValue}</span> (vs {q.baselineValue})
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4 text-stone-800">
                <div className="font-medium text-stone-900 mb-1">{paperB.atAGlance.results.title}</div>
                <div className="font-serif-academic text-sm italic pl-2 border-l border-stone-300 mb-2">
                  "{paperB.atAGlance.results.highlight}"
                </div>
                <div className="font-mono text-[11px] text-stone-600 space-y-0.5">
                  {paperB.keyFindings.quantitative.slice(0, 2).map((q, i) => (
                    <div key={i}>
                      › {q.metricName}: <span className="font-bold">{q.paperValue}</span> (vs {q.baselineValue})
                    </div>
                  ))}
                </div>
              </td>
            </tr>

            {/* Row 7: Limitations */}
            <tr className="hover:bg-stone-50/60">
              <td className="py-3 px-4 font-mono font-semibold text-stone-600 border-r border-stone-200 uppercase text-[11px]">
                Limitations & Bounds
              </td>
              <td className="py-3 px-4 text-stone-800 border-r border-stone-200 leading-relaxed">
                <div className="font-medium text-stone-900 mb-1">{paperA.atAGlance.limitations.title}</div>
                <div>{paperA.atAGlance.limitations.summary}</div>
                <div className="text-[11px] font-mono text-stone-500 mt-1">
                  Bottleneck: {paperA.atAGlance.limitations.criticalBottleneck}
                </div>
              </td>
              <td className="py-3 px-4 text-stone-800 leading-relaxed">
                <div className="font-medium text-stone-900 mb-1">{paperB.atAGlance.limitations.title}</div>
                <div>{paperB.atAGlance.limitations.summary}</div>
                <div className="text-[11px] font-mono text-stone-500 mt-1">
                  Bottleneck: {paperB.atAGlance.limitations.criticalBottleneck}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visual Overlap / Difference Matrix */}
      <section className="space-y-4 pt-2">
        <div className="border-b border-stone-200 pb-1.5 flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
            Technical Overlap & Divergence Diagram
          </h3>
          <span className="text-[11px] font-mono text-stone-400">
            TAXONOMIC MAPPING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Shared Foundations */}
          <div className="bg-white border border-stone-300 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
              01. Shared Foundations
            </span>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Both investigations address foundational scalability barriers in deep parameter spaces, evaluating performance rigorously against canonical benchmark datasets without relying on heuristics.
            </p>
          </div>

          {/* Divergent Architectural Philosophies */}
          <div className="bg-white border border-stone-300 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
              02. Divergent Philosophies
            </span>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Paper A emphasizes eliminating sequential processing in favor of parallel relational lookups, whereas Paper B focuses on low-rank manifold parameterization or residual shortcut routing.
            </p>
          </div>

          {/* Trade-Off Boundaries */}
          <div className="bg-white border border-stone-300 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
              03. Operational Trade-Offs
            </span>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Contrasting computational FLOP scaling versus memory storage budgets: trade-offs dictate hardware deployment viability across server GPUs versus multi-task inference clusters.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
