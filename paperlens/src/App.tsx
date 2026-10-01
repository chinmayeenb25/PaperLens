/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DEMO_PAPERS } from './data/demoPapers';
import { PaperAnalysis, GraphNode } from './types';
import { PaperOverview } from './components/PaperOverview';
import { ResearchMap } from './components/ResearchMap';
import { Methodology } from './components/Methodology';
import { Findings } from './components/Findings';
import { ReferencesView } from './components/ReferencesView';
import { AskThePaper } from './components/AskThePaper';
import { PaperComparison } from './components/PaperComparison';
import { UploadModal } from './components/UploadModal';
import { ExportModal } from './components/ExportModal';
import {
  FileText,
  Network,
  GitCommit,
  BarChart2,
  BookOpen,
  MessageSquare,
  Columns,
  Upload,
  Download,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

export type NavigationTab =
  | 'overview'
  | 'map'
  | 'methodology'
  | 'findings'
  | 'references'
  | 'ask'
  | 'compare';

export default function App() {
  const [papers, setPapers] = useState<PaperAnalysis[]>(DEMO_PAPERS);
  const [currentPaper, setCurrentPaper] = useState<PaperAnalysis>(DEMO_PAPERS[0]);
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [copilotQuestion, setCopilotQuestion] = useState<string | undefined>(undefined);

  const handleSelectPaper = (paper: PaperAnalysis) => {
    setCurrentPaper(paper);
    setCopilotQuestion(undefined);
  };

  const handlePaperAnalyzed = (newPaper: PaperAnalysis) => {
    setPapers((prev) => [newPaper, ...prev]);
    setCurrentPaper(newPaper);
    setActiveTab('overview');
  };

  const handleAskAboutNode = (node: GraphNode) => {
    setCopilotQuestion(`Analyze the role, equations, and context of "${node.label}" in this manuscript.`);
    setActiveTab('ask');
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#1c1917] flex flex-col font-sans selection:bg-stone-200 selection:text-stone-900">
      {/* 1. TOP BAR: Professional Research Workspace */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 px-4 py-2 transition-all">
        <div className="flex items-center justify-between gap-4 max-w-full">
          {/* Left: Wordmark & Mobile Nav toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-1 text-stone-600 hover:text-stone-900"
              title="Toggle Menu"
            >
              {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-tight uppercase text-stone-900">
                Paper<span className="text-stone-500 font-normal">Lens</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest border border-stone-200 px-1 py-0.2">
                Workstation
              </span>
            </div>
          </div>

          {/* Center: Current Paper Selector */}
          <div className="relative group max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl truncate">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs text-stone-800 cursor-pointer transition">
              <span className="font-mono text-[10px] text-stone-400 uppercase shrink-0">
                ACTIVE:
              </span>
              <span className="truncate font-serif-academic text-[13px] text-stone-900 font-medium">
                {currentPaper.title}
              </span>
              <span className="font-mono text-[10px] text-stone-500 shrink-0">
                [{currentPaper.year}]
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400 shrink-0 ml-auto" />
            </div>

            {/* Dropdown list of indexed papers */}
            <div className="absolute left-0 mt-1 w-96 bg-white border border-stone-300 shadow-md p-1.5 hidden group-hover:block hover:block z-50">
              <div className="px-2 py-1 text-[10px] font-mono text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
                Select Manuscript ({papers.length} Indexed)
              </div>
              <div className="space-y-0.5 max-h-64 overflow-y-auto">
                {papers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPaper(p)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs transition flex flex-col ${
                      p.id === currentPaper.id
                        ? 'bg-stone-100 text-stone-900 font-semibold border-l-2 border-stone-900'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-serif-academic text-stone-900 line-clamp-1">{p.title}</span>
                    <span className="text-[10px] font-mono text-stone-500">
                      {p.year} · {p.venue.split('(')[0].trim()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Actions: Upload, Compare, Export */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('compare')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase transition border ${
                activeTab === 'compare'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 hover:text-stone-900 transition"
              title="Export literature review brief"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase font-semibold bg-stone-900 text-white hover:bg-stone-800 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Paper</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY SHELL: Left Navigation + Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation: Narrow & Functional Academic Tree */}
        <nav
          className={`w-56 shrink-0 bg-[#fcfcfb] border-r border-stone-200 flex flex-col justify-between transition-all z-30 ${
            isMobileNavOpen
              ? 'fixed inset-y-12 left-0 z-50 w-64 shadow-lg'
              : 'hidden lg:flex'
          }`}
        >
          <div className="p-3 space-y-6">
            {/* SECTION: PAPER */}
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-mono text-stone-400 uppercase tracking-widest font-semibold block mb-1.5">
                PAPER
              </span>

              <button
                onClick={() => {
                  setActiveTab('overview');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-sans flex items-center gap-2.5 transition ${
                  activeTab === 'overview'
                    ? 'bg-stone-200/70 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('map');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-sans flex items-center justify-between transition ${
                  activeTab === 'map'
                    ? 'bg-stone-200/70 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Network className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Research Map</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  {currentPaper.researchMap.nodes.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('methodology');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-sans flex items-center justify-between transition ${
                  activeTab === 'methodology'
                    ? 'bg-stone-200/70 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GitCommit className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Methodology</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  {currentPaper.methodologyFlowchart.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('findings');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-sans flex items-center justify-between transition ${
                  activeTab === 'findings'
                    ? 'bg-stone-200/70 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Findings</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  {currentPaper.keyFindings.quantitative.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('references');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-sans flex items-center justify-between transition ${
                  activeTab === 'references'
                    ? 'bg-stone-200/70 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>References</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  {currentPaper.importantReferences.length}
                </span>
              </button>
            </div>

            {/* SECTION: TOOLS */}
            <div className="space-y-1 pt-2 border-t border-stone-200">
              <span className="px-2 text-[10px] font-mono text-stone-400 uppercase tracking-widest font-semibold block mb-1.5">
                TOOLS
              </span>

              <button
                onClick={() => {
                  setActiveTab('ask');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-sans flex items-center gap-2.5 transition ${
                  activeTab === 'ask'
                    ? 'bg-stone-200/70 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Ask the Paper</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('compare');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-sans flex items-center gap-2.5 transition ${
                  activeTab === 'compare'
                    ? 'bg-stone-200/70 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Compare Papers</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer Metadata */}
          <div className="p-3 border-t border-stone-200 text-[10px] font-mono text-stone-500 space-y-1">
            <div className="truncate text-stone-700 font-serif-academic font-medium">{currentPaper.title}</div>
            <div className="text-stone-400">{currentPaper.year} · {currentPaper.authors.length} authors</div>
            {currentPaper.doi && <div className="truncate text-stone-400">doi:{currentPaper.doi}</div>}
          </div>
        </nav>

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#fbfbf9]">
          {activeTab === 'overview' && (
            <PaperOverview
              paper={currentPaper}
              onNavigateTab={(tab) => setActiveTab(tab as NavigationTab)}
            />
          )}

          {activeTab === 'map' && (
            <div className="p-3 sm:p-4">
              <ResearchMap
                initialNodes={currentPaper.researchMap.nodes}
                edges={currentPaper.researchMap.edges}
                onAskAboutNode={handleAskAboutNode}
              />
            </div>
          )}

          {activeTab === 'methodology' && (
            <Methodology
              steps={currentPaper.methodologyFlowchart}
              paperTitle={currentPaper.title}
            />
          )}

          {activeTab === 'findings' && (
            <Findings
              quantitative={currentPaper.keyFindings.quantitative}
              qualitative={currentPaper.keyFindings.qualitative}
              paperTitle={currentPaper.title}
            />
          )}

          {activeTab === 'references' && (
            <ReferencesView
              references={currentPaper.importantReferences}
              paperTitle={currentPaper.title}
            />
          )}

          {activeTab === 'ask' && (
            <AskThePaper
              paper={currentPaper}
              initialQuestion={copilotQuestion}
            />
          )}

          {activeTab === 'compare' && (
            <PaperComparison
              papers={papers}
              currentPaper={currentPaper}
            />
          )}
        </main>
      </div>

      {/* Upload Paper Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onPaperAnalyzed={handlePaperAnalyzed}
        demoPapers={papers}
        onSelectDemoPaper={handleSelectPaper}
      />

      {/* Export Literature Brief Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        paper={currentPaper}
      />
    </div>
  );
}
