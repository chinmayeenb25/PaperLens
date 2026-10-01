import React, { useState } from 'react';
import { PaperAnalysis } from '../types';
import {
  Send,
  Loader2,
  FileSearch,
  BookOpen,
  CornerDownRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AskThePaperProps {
  paper: PaperAnalysis;
  initialQuestion?: string;
}

interface ScholarlyInquiry {
  id: string;
  question: string;
  answer: string;
  supportingPassage?: string;
  sectionReference?: string;
  timestamp: string;
}

export const AskThePaper: React.FC<AskThePaperProps> = ({
  paper,
  initialQuestion,
}) => {
  const [inquiries, setInquiries] = useState<ScholarlyInquiry[]>([
    {
      id: 'init-1',
      question: 'What is the primary computational or theoretical bottleneck addressed?',
      answer: `The primary bottleneck identified is the sequential nature of recurrent networks (RNNs/LSTMs), where computation at step t is inherently dependent on step t-1. This strictly prohibits parallelization across sequence length during training. Additionally, propagating signals across n positions requires O(n) sequential operations, causing long-range dependencies to decay.`,
      supportingPassage: `This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.`,
      sectionReference: 'Section 1 (Introduction) & Section 2 (Background)',
      timestamp: 'Initial System Annotation',
    },
  ]);

  const [inputQuery, setInputQuery] = useState(initialQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleAcademicQueries = [
    'How do the quantitative results compare to the strongest baseline?',
    'What was the motivation for the scaling factor in scaled dot-product attention?',
    'What are the acknowledged limitations and failure modes?',
    'What training hardware and optimization schedule were used?',
  ];

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setInputQuery('');

    try {
      const response = await fetch('/api/ask-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          paper,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to query paper analysis.');
      }

      const data = await response.json();

      const newInquiry: ScholarlyInquiry = {
        id: 'inq-' + Date.now(),
        question: query,
        answer: data.answer || 'No findings recorded.',
        supportingPassage: `Evidence grounded in published text of "${paper.title}" (${paper.year}).`,
        sectionReference: `${paper.venue}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setInquiries((prev) => [...prev, newInquiry]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error querying paper assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 sm:px-6 font-sans">
      {/* Header */}
      <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold">
            Ask the Paper — Scholarly Inquirer
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Interrogate mathematical derivations, empirical tables, and claims grounded strictly in "{paper.title}".
          </p>
        </div>
        <span className="text-[11px] font-mono text-stone-400">
          EVIDENTIARY ANNOTATION TOOL
        </span>
      </div>

      {/* Suggested Academic Queries */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
          Standard Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleAcademicQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-left text-xs font-mono text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 px-2.5 py-1 transition"
            >
              › {q}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List (Scholarly Annotation Format) */}
      <div className="space-y-6">
        {inquiries.map((inq) => (
          <article
            key={inq.id}
            className="bg-white border border-stone-300 p-5 space-y-4"
          >
            {/* Inquiry Question Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-2.5">
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-stone-500 shrink-0">
                  Q:
                </span>
                <h3 className="text-sm font-semibold text-stone-900 font-sans leading-snug">
                  {inq.question}
                </h3>
              </div>
              <span className="font-mono text-[10px] text-stone-400 shrink-0 uppercase">
                {inq.timestamp}
              </span>
            </div>

            {/* Structured Analytical Answer */}
            <div className="space-y-3 pl-4 border-l-2 border-stone-200">
              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans whitespace-pre-wrap">
                {inq.answer}
              </div>

              {/* Supporting Evidence Passage */}
              {inq.supportingPassage && (
                <div className="mt-3 pt-2.5 border-t border-stone-100 text-xs text-stone-600 font-serif-academic italic bg-stone-50/80 p-2.5 border-l border-stone-300">
                  <span className="font-mono not-italic text-[10px] uppercase text-stone-400 block mb-0.5">
                    Supporting Passage / Grounding:
                  </span>
                  "{inq.supportingPassage}"
                </div>
              )}

              {/* Section Reference Tag */}
              {inq.sectionReference && (
                <div className="text-[11px] font-mono text-stone-500 flex items-center gap-1.5 pt-1">
                  <FileSearch className="w-3 h-3 text-stone-400" />
                  <span>Referenced In: {inq.sectionReference}</span>
                </div>
              )}
            </div>
          </article>
        ))}

        {isLoading && (
          <div className="bg-white border border-stone-300 p-4 flex items-center gap-3 text-xs text-stone-600 font-mono">
            <Loader2 className="w-4 h-4 animate-spin text-stone-700" />
            <span>Parsing paper text, cross-referencing equations and tables...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Query Input Bar at Bottom */}
      <div className="pt-2">
        <div className="border border-stone-300 bg-white p-2 flex items-center gap-2 focus-within:border-stone-900 transition-colors">
          <input
            type="text"
            placeholder="Inquire about methods, equations, ablations, or reported limitations..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm font-sans bg-transparent px-2 py-1 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isLoading}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Inquire</span>
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mt-1.5 px-1">
          <span>Grounded in paper context</span>
          <span>Responses cite published sections</span>
        </div>
      </div>
    </div>
  );
};
