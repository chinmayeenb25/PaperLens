import React, { useState } from 'react';
import { FlowchartStep } from '../types';
import { ArrowDown, Code2, FileInput, FileOutput, Check } from 'lucide-react';

interface MethodologyProps {
  steps: FlowchartStep[];
  paperTitle: string;
}

export const Methodology: React.FC<MethodologyProps> = ({
  steps,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-900 font-bold">
            Methodology & Experimental Pipeline
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Sequential analytical stages extracted from experimental protocol and model formulation.
          </p>
        </div>
        <span className="text-[11px] font-mono text-stone-400">
          {steps.length} Sequenced Stages
        </span>
      </div>

      {/* Scientific Workflow Pipeline */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isSelected = selectedStageIndex === idx;

          return (
            <div key={step.stepNumber} className="relative">
              {/* Stage Container */}
              <div
                onClick={() => setSelectedStageIndex(isSelected ? null : idx)}
                className={`bg-white border p-5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                {/* Stage Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 border border-stone-200">
                      STAGE {step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                      {step.phase}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    {isSelected ? '[Click to collapse]' : '[Click to expand details]'}
                  </span>
                </div>

                {/* Stage Title */}
                <h3 className="text-base font-semibold text-stone-900 leading-snug font-sans">
                  {step.title}
                </h3>

                {/* Concise Description */}
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed font-sans">
                  {step.description}
                </p>

                {/* Key Technique & Formulation */}
                <div className="mt-3.5 pt-3 border-t border-stone-100">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Algorithmic Technique / Formulation:
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 break-words leading-relaxed">
                    {step.keyTechnique}
                  </div>
                </div>

                {/* Expandable Artifact Inputs & Outputs */}
                {isSelected && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-stone-200 text-xs">
                    {/* Inputs */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                        Inputs & Artifacts:
                      </span>
                      <ul className="space-y-1">
                        {step.inputs.map((inp, i) => (
                          <li
                            key={i}
                            className="p-1.5 bg-stone-50 border border-stone-200/80 font-mono text-[11px] text-stone-700 flex items-center gap-1.5"
                          >
                            <span className="text-stone-400">›</span>
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Outputs */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                        Outputs & State Representations:
                      </span>
                      <ul className="space-y-1">
                        {step.outputs.map((out, i) => (
                          <li
                            key={i}
                            className="p-1.5 bg-stone-50 border border-stone-200/80 font-mono text-[11px] text-stone-700 flex items-center gap-1.5"
                          >
                            <Check className="w-3 h-3 text-stone-500 shrink-0" />
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Connecting Rule & Arrow (between stages) */}
              {idx < steps.length - 1 && (
                <div className="flex flex-col items-center my-1.5 text-stone-400">
                  <div className="w-px h-3 bg-stone-300" />
                  <span className="font-mono text-xs">↓</span>
                  <div className="w-px h-3 bg-stone-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
