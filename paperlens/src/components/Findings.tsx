import React from 'react';
import { QuantitativeFinding, QualitativeFinding } from '../types';
import { HelpCircle, AlertCircle, FileText, BarChart2 } from 'lucide-react';

interface FindingsProps {
  quantitative: QuantitativeFinding[];
  qualitative: QualitativeFinding[];
  paperTitle: string;
}

export const Findings: React.FC<FindingsProps> = ({
  quantitative,
  qualitative,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 px-4 sm:px-6 font-sans">
      {/* Header */}
      <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold">
            Empirical Results & Key Findings
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Quantitative benchmarks and qualitative observations reported in the original publication.
          </p>
        </div>
        <span className="text-[11px] font-mono text-stone-400">
          STRICT GROUNDING · NO ESTIMATED DATA
        </span>
      </div>

      {/* 1. Quantitative Benchmark Results Table & Visual Comparison */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
            Table 1: Quantitative Evaluation on Standard Benchmarks
          </h3>
          <span className="text-[11px] font-mono text-stone-400">
            {quantitative.length} Reported Benchmarks
          </span>
        </div>

        {/* Scientific Data Table */}
        <div className="overflow-x-auto border border-stone-300 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-300 font-mono text-[11px] text-stone-700 uppercase">
                <th className="py-2.5 px-3 font-semibold border-r border-stone-200">Benchmark / Task</th>
                <th className="py-2.5 px-3 font-semibold border-r border-stone-200">Metric</th>
                <th className="py-2.5 px-3 font-semibold border-r border-stone-200">Baseline (Model)</th>
                <th className="py-2.5 px-3 font-semibold border-r border-stone-200">Proposed (This Paper)</th>
                <th className="py-2.5 px-3 font-semibold border-r border-stone-200">Delta / Improvement</th>
                <th className="py-2.5 px-3 font-semibold">Visual Scale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {quantitative.map((row, idx) => {
                const isBaselineReported =
                  row.baselineValue && row.baselineValue.toLowerCase() !== 'not reported';
                const isPaperReported =
                  row.paperValue && row.paperValue.toLowerCase() !== 'not reported';

                const hasChartValues =
                  isBaselineReported &&
                  isPaperReported &&
                  typeof row.numericBaseline === 'number' &&
                  typeof row.numericPaper === 'number' &&
                  row.numericBaseline > 0 &&
                  row.numericPaper > 0;

                let baselinePct = 50;
                let paperPct = 50;
                if (hasChartValues) {
                  const max = Math.max(row.numericBaseline!, row.numericPaper!) * 1.15;
                  baselinePct = Math.min(100, Math.max(6, (row.numericBaseline! / max) * 100));
                  paperPct = Math.min(100, Math.max(6, (row.numericPaper! / max) * 100));
                }

                return (
                  <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-stone-900 border-r border-stone-200">
                      {row.benchmarkOrDataset}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600 border-r border-stone-200">
                      {row.metricName}
                    </td>
                    <td className="py-2.5 px-3 border-r border-stone-200">
                      {isBaselineReported ? (
                        <div>
                          <span className="font-mono font-medium text-stone-700">{row.baselineValue}</span>
                          {row.baselineModel && (
                            <span className="block text-[10px] text-stone-400 font-sans">
                              {row.baselineModel}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-1 py-0.5 border border-amber-200">
                          Not reported
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 border-r border-stone-200">
                      {isPaperReported ? (
                        <div>
                          <span className="font-mono font-bold text-stone-900">{row.paperValue}</span>
                          {row.paperModel && (
                            <span className="block text-[10px] text-stone-500 font-sans">
                              {row.paperModel}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-1 py-0.5 border border-amber-200">
                          Not reported
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-stone-800 border-r border-stone-200">
                      {row.improvement || '—'}
                    </td>
                    <td className="py-2.5 px-3 min-w-[140px]">
                      {hasChartValues ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-stone-400 w-6">Base</span>
                            <div className="h-1.5 flex-1 bg-stone-100 border border-stone-200">
                              <div
                                className="h-full bg-stone-400 transition-all"
                                style={{ width: `${baselinePct}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-stone-700 font-semibold w-6">Paper</span>
                            <div className="h-1.5 flex-1 bg-stone-100 border border-stone-300">
                              <div
                                className="h-full bg-stone-900 transition-all"
                                style={{ width: `${paperPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-stone-400 italic">
                          Quantitative scale unavailable
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Notes Footnote */}
        <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
          <div className="font-mono text-[10px] uppercase text-stone-500 font-semibold">
            Methodological Notes:
          </div>
          <ul className="space-y-0.5 list-disc list-inside text-[11px] text-stone-600">
            {quantitative.map((q, idx) => (
              <li key={idx}>
                <span className="font-medium text-stone-800">{q.metricName}:</span> {q.notes}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Qualitative Discoveries & Excerpts */}
      <section className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
            Qualitative Observations & Analytical Findings
          </h3>
          <span className="text-[11px] font-mono text-stone-400">
            Academic Excerpts & Analysis
          </span>
        </div>

        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {qualitative.map((finding, idx) => (
            <div key={idx} className="py-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-stone-500 uppercase">
                  Observation 0{idx + 1}
                </span>
                <span className="text-stone-300">·</span>
                <h4 className="text-sm font-semibold text-stone-900 font-sans">
                  {finding.title}
                </h4>
              </div>

              {/* Highlighted Excerpt in Editorial Serif */}
              <div className="pl-3.5 border-l-2 border-stone-400 py-1 font-serif-academic text-sm sm:text-[15px] text-stone-800 leading-relaxed italic bg-stone-50/50">
                "{finding.insight}"
              </div>

              {/* Significance Commentary */}
              <div className="text-xs text-stone-600 font-sans pt-1">
                <span className="font-mono text-[11px] text-stone-500 uppercase tracking-wide mr-1.5 font-semibold">
                  Significance:
                </span>
                {finding.significance}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
