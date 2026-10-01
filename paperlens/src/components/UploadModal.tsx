import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
  FileCode,
} from 'lucide-react';
import { PaperAnalysis } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperAnalyzed: (paper: PaperAnalysis) => void;
  demoPapers: PaperAnalysis[];
  onSelectDemoPaper: (paper: PaperAnalysis) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onPaperAnalyzed,
  demoPapers,
  onSelectDemoPaper,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'text'>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrorMessage('Invalid file format. Please upload a standard PDF (.pdf) manuscript.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        setErrorMessage('Invalid file format. Please upload a standard PDF (.pdf) manuscript.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleAnalyze = async () => {
    if (activeTab === 'pdf' && !selectedFile) {
      setErrorMessage('Please select a PDF document first.');
      return;
    }
    if (activeTab === 'text' && !textInput.trim()) {
      setErrorMessage('Please provide research paper text.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let payload: { pdfBase64?: string; paperText?: string; filename?: string } = {};

      if (activeTab === 'pdf' && selectedFile) {
        setProgressStage('Encoding manuscript document...');
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        payload = {
          pdfBase64: base64,
          filename: selectedFile.name,
        };
      } else {
        payload = {
          paperText: textInput,
          filename: 'Manuscript_Excerpt.txt',
        };
      }

      setProgressStage('Extracting scholarly taxonomy and methodology...');
      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze manuscript.');
      }

      setProgressStage('Constructing knowledge graph & empirical tables...');
      const result: PaperAnalysis = await response.json();

      onPaperAnalyzed(result);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during paper ingestion.');
    } finally {
      setIsProcessing(false);
      setProgressStage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs font-sans">
      <div className="bg-[#fcfcfb] border border-stone-300 shadow-xl max-w-xl w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold">
              Import Research Manuscript
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Ingest preprint or published PDF to generate structured knowledge map.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-stone-400 hover:text-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canonical Benchmark Manuscripts Picker */}
        <div className="space-y-1.5 bg-stone-100/60 p-3 border border-stone-200">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
            Load Pre-indexed Benchmark Studies:
          </span>
          <div className="space-y-1 font-mono text-xs">
            {demoPapers.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectDemoPaper(p);
                  onClose();
                }}
                className="w-full text-left p-1.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 flex items-center justify-between transition"
              >
                <span className="truncate mr-2 font-medium">{p.title}</span>
                <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                  [{p.year} / {p.venue.split('(')[0].trim()}]
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ingest Format Selector */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-mono uppercase">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-2.5 py-1 border transition ${
              activeTab === 'pdf'
                ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                : 'bg-white text-stone-600 border-stone-300 hover:text-stone-900'
            }`}
          >
            PDF Manuscript File
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-2.5 py-1 border transition ${
              activeTab === 'text'
                ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                : 'bg-white text-stone-600 border-stone-300 hover:text-stone-900'
            }`}
          >
            Manuscript Plaintext
          </button>
        </div>

        {/* Tab 1: PDF Dropzone */}
        {activeTab === 'pdf' ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-stone-900 bg-stone-100'
                : selectedFile
                ? 'border-stone-500 bg-white'
                : 'border-stone-300 hover:border-stone-500 bg-stone-50/50 hover:bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile ? (
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-stone-900 block">
                  {selectedFile.name}
                </span>
                <span className="text-[11px] font-mono text-stone-500 block">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · READY FOR EXTRACTION
                </span>
                <span className="text-[11px] font-sans text-stone-400 underline block mt-2">
                  Click or drag to replace file
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-stone-700 block uppercase tracking-wider">
                  Drag and drop PDF manuscript
                </span>
                <span className="text-[11px] text-stone-400 font-sans block">
                  Supports arXiv, IEEE, ACM, NeurIPS, CVPR, and Nature formats
                </span>
                <span className="mt-2 inline-block px-2.5 py-1 bg-white border border-stone-300 font-mono text-[11px] text-stone-700">
                  Select File...
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <textarea
              rows={6}
              placeholder="Paste raw paper text or preprint excerpt..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-2.5 text-xs font-mono bg-white border border-stone-300 focus:outline-none focus:border-stone-900"
            />
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-xs font-mono text-red-800 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="p-3 bg-stone-100 border border-stone-300 flex items-center gap-2.5 text-xs font-mono text-stone-700">
            <Loader2 className="w-4 h-4 animate-spin text-stone-900 shrink-0" />
            <span>{progressStage}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 font-mono text-xs uppercase">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-3 py-1.5 border border-stone-300 hover:border-stone-500 text-stone-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAnalyze}
            disabled={
              isProcessing ||
              (activeTab === 'pdf' && !selectedFile) ||
              (activeTab === 'text' && !textInput.trim())
            }
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold transition disabled:opacity-40"
          >
            {isProcessing ? 'Processing...' : 'Run Extraction'}
          </button>
        </div>
      </div>
    </div>
  );
};
