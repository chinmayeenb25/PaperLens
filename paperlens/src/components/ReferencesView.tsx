import React, { useState } from 'react';
import { Search, ArrowUpDown, ExternalLink, Bookmark, Check } from 'lucide-react';

interface ReferenceItem {
  citation: string;
  relevance: string;
}

interface ReferencesViewProps {
  references: ReferenceItem[];
  paperTitle: string;
}

export const ReferencesView: React.FC<ReferencesViewProps> = ({
  references,
  paperTitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefIndex, setSelectedRefIndex] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'az'>('default');

  const filteredReferences = references
    .filter(
      (r) =>
        r.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.relevance.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'az') {
        return a.citation.localeCompare(b.citation);
      }
      return 0;
    });

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 sm:px-6 font-sans">
      {/* Header */}
      <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold">
            Bibliography & Cited Literature
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Key scholarly works referenced in {paperTitle}.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search references..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs font-sans bg-white border border-stone-300 focus:outline-none focus:border-stone-900 w-48 sm:w-56"
            />
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'default' ? 'az' : 'default')}
            className={`px-2 py-1 text-xs font-mono uppercase border transition-colors flex items-center gap-1 ${
              sortOrder === 'az'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-300 hover:text-stone-900'
            }`}
            title="Sort A-Z by author"
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>{sortOrder === 'az' ? 'A-Z' : 'Default'}</span>
          </button>
        </div>
      </div>

      {/* Bibliography Compact Table / Rows */}
      <div className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
        {filteredReferences.map((ref, idx) => {
          const isSelected = selectedRefIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => setSelectedRefIndex(isSelected ? null : idx)}
              className={`p-3.5 transition-colors cursor-pointer text-xs ${
                isSelected ? 'bg-stone-50' : 'hover:bg-stone-50/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-[11px] text-stone-400 w-6 shrink-0 pt-0.5">
                  [{idx + 1}]
                </span>

                <div className="space-y-1 flex-1">
                  <p className="font-serif-academic text-sm text-stone-900 leading-snug">
                    {ref.citation}
                  </p>

                  {/* Scholarly Relevance Note */}
                  <div className="pt-1 text-xs text-stone-600 font-sans flex items-start gap-1.5">
                    <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wide shrink-0">
                      Relevance Context:
                    </span>
                    <span className="leading-relaxed">{ref.relevance}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredReferences.length === 0 && (
          <div className="p-8 text-center text-xs font-mono text-stone-400">
            No bibliographic citations matched "{searchQuery}".
          </div>
        )}
      </div>

      <div className="text-[11px] font-mono text-stone-400 text-right">
        DISPLAYING {filteredReferences.length} OF {references.length} CITATIONS
      </div>
    </div>
  );
};
