import React, { useState } from 'react';
import { PaperAnalysis } from '../types';
import { X, Copy, Check, Download, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: PaperAnalysis;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  paper,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownBrief = (): string => {
    return `# ${paper.title}

**Authors:** ${paper.authors.join(', ')}  
**Year & Venue:** ${paper.year} | ${paper.venue}  
${paper.doi ? `**DOI:** ${paper.doi}  \n` : ''}
---

## Abstract
${paper.abstract}

---

## 1. Problem Formulation
- **Core Challenge:** ${paper.atAGlance.problem.title}
- **Context:** ${paper.atAGlance.problem.summary}
- **Significance:** ${paper.atAGlance.problem.significance}

## 2. Methodology & Architecture
- **Approach:** ${paper.atAGlance.approach.title}
- **Summary:** ${paper.atAGlance.approach.summary}
- **Core Innovation:** \`${paper.atAGlance.approach.keyInnovation}\`

## 3. Data & Benchmarks
${paper.atAGlance.data.benchmarks.map((b) => `- ${b}`).join('\n')}

## 4. Key Empirical Findings
${paper.keyFindings.quantitative
  .map(
    (q) =>
      `* **${q.metricName}** on ${q.benchmarkOrDataset}: Baseline = ${q.baselineValue} | Paper = ${q.paperValue} (${q.improvement || 'N/A'}). Note: ${q.notes}`
  )
  .join('\n')}

### Qualitative Discoveries
${paper.keyFindings.qualitative
  .map((ql) => `- **${ql.title}:** ${ql.insight} *(Significance: ${ql.significance})*`)
  .join('\n')}

## 5. Limitations & Boundary Conditions
- **Limitation:** ${paper.atAGlance.limitations.title}
- **Analysis:** ${paper.atAGlance.limitations.summary}
- **Bottleneck:** ${paper.atAGlance.limitations.criticalBottleneck}

---
*Generated via PaperLens Scholarly Taxonomy Workspace*
`;
  };

  const markdownContent = generateMarkdownBrief();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}_Academic_Brief.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans">
      <div className="bg-[#fcfcfb] border border-stone-300 shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold">
              Export Scholarly Literature Brief
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Structured markdown documentation for research notebooks and literature reviews.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <textarea
            readOnly
            value={markdownContent}
            rows={14}
            className="w-full flex-1 p-3 border border-stone-300 bg-white font-mono text-[11px] text-stone-700 leading-relaxed focus:outline-none resize-none select-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200 font-mono text-xs uppercase">
          <span className="text-[10px] text-stone-400">
            MARKDOWN FORMAT (.MD)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 transition font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
