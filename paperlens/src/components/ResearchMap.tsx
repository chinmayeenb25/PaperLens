import React, { useState, useRef, useEffect } from 'react';
import { GraphNode, GraphEdge, NodeCategory } from '../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ArrowRight,
  Move,
  CornerDownRight,
  HelpCircle,
  Layers,
  Filter,
} from 'lucide-react';

interface ResearchMapProps {
  initialNodes: GraphNode[];
  edges: GraphEdge[];
  onAskAboutNode: (node: GraphNode) => void;
}

// Restrained, serious academic category color palette
const CATEGORY_META: Record<
  NodeCategory,
  { label: string; code: string; color: string; bgBadge: string; textBadge: string; borderAccent: string }
> = {
  problem: {
    label: 'Research Problem',
    code: 'PRB',
    color: '#9a3412', // Rust / terracotta
    bgBadge: 'bg-stone-100',
    textBadge: 'text-[#9a3412]',
    borderAccent: '#9a3412',
  },
  method: {
    label: 'Methodology',
    code: 'MTH',
    color: '#1e3a5f', // Deep navy
    bgBadge: 'bg-stone-100',
    textBadge: 'text-[#1e3a5f]',
    borderAccent: '#1e3a5f',
  },
  dataset: {
    label: 'Dataset',
    code: 'DAT',
    color: '#166534', // Deep forest
    bgBadge: 'bg-stone-100',
    textBadge: 'text-[#166534]',
    borderAccent: '#166534',
  },
  model: {
    label: 'Model / Architecture',
    code: 'MOD',
    color: '#4338ca', // Indigo
    bgBadge: 'bg-stone-100',
    textBadge: 'text-[#4338ca]',
    borderAccent: '#4338ca',
  },
  experiments: {
    label: 'Experiment Protocol',
    code: 'EXP',
    color: '#0369a1', // Deep cyan
    bgBadge: 'bg-stone-100',
    textBadge: 'text-[#0369a1]',
    borderAccent: '#0369a1',
  },
  findings: {
    label: 'Key Finding',
    code: 'FND',
    color: '#0f766e', // Deep teal
    bgBadge: 'bg-stone-100',
    textBadge: 'text-[#0f766e]',
    borderAccent: '#0f766e',
  },
  limitations: {
    label: 'Limitation',
    code: 'LIM',
    color: '#991b1b', // Deep crimson
    bgBadge: 'bg-stone-100',
    textBadge: 'text-[#991b1b]',
    borderAccent: '#991b1b',
  },
  future_work: {
    label: 'Future Work',
    code: 'FUT',
    color: '#6b21a8', // Deep purple
    bgBadge: 'bg-stone-100',
    textBadge: 'text-[#6b21a8]',
    borderAccent: '#6b21a8',
  },
};

export const ResearchMap: React.FC<ResearchMapProps> = ({
  initialNodes,
  edges,
  onAskAboutNode,
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<NodeCategory | 'all'>('all');

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNodes(initialNodes);
    setSelectedNode(null);
    setZoom(1);
    setPan({ x: 30, y: 30 });
  }, [initialNodes]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 30, y: 30 });
  };

  const handleNodeMouseDown = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    const clientX = e.clientX;
    const clientY = e.clientY;
    setDragOffset({
      x: (clientX - pan.x) / zoom - (node.x || 0),
      y: (clientY - pan.y) / zoom - (node.y || 0),
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const newX = (e.clientX - pan.x) / zoom - dragOffset.x;
      const newY = (e.clientY - pan.y) / zoom - dragOffset.y;
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === draggingNodeId ? { ...n, x: Math.round(newX), y: Math.round(newY) } : n
        )
      );
    } else if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const inboundEdges = selectedNode ? edges.filter((e) => e.target === selectedNode.id) : [];
  const outboundEdges = selectedNode ? edges.filter((e) => e.source === selectedNode.id) : [];

  const NODE_WIDTH = 220;
  const NODE_HEIGHT = 90;

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[580px] bg-[#fbfbf9] border border-stone-200 overflow-hidden flex flex-col font-sans">
      {/* Top Academic Toolbar */}
      <div className="z-10 bg-white border-b border-stone-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Filters in Clean Text Segments */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mr-1.5 shrink-0">
            FILTER:
          </span>

          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-2 py-1 font-mono text-[11px] uppercase transition-colors shrink-0 ${
              activeCategoryFilter === 'all'
                ? 'bg-stone-900 text-white font-semibold'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            All [{nodes.length}]
          </button>

          {(Object.keys(CATEGORY_META) as NodeCategory[]).map((cat) => {
            const count = nodes.filter((n) => n.category === cat).length;
            if (count === 0) return null;
            const meta = CATEGORY_META[cat];
            const isSelected = activeCategoryFilter === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(isSelected ? 'all' : cat)}
                className={`px-2 py-1 font-mono text-[11px] uppercase transition-colors shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span>{meta.code}</span>
                <span className="text-stone-400">[{count}]</span>
              </button>
            );
          })}
        </div>

        {/* View Controls: Scale & Positioning */}
        <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
          <button
            onClick={handleZoomIn}
            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition text-[11px]"
            title="Reset Scale"
          >
            {Math.round(zoom * 100)}%
          </button>
          <span className="text-stone-300">|</span>
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Move className="w-3 h-3 text-stone-400" />
            <span>Pan / Drag</span>
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 flex overflow-hidden">
        <div
          ref={containerRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative flex-1 cursor-${isPanning ? 'grabbing' : 'grab'} select-none overflow-hidden`}
          style={{
            backgroundColor: '#fbfbf9',
            backgroundImage:
              'linear-gradient(to right, #ecece7 1px, transparent 1px), linear-gradient(to bottom, #ecece7 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        >
          {/* SVG Connector Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <defs>
              <marker
                id="marker-arrow"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#78716c" />
              </marker>
              <marker
                id="marker-arrow-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#1c1917" />
              </marker>
            </defs>

            {/* Edge rendering */}
            {edges.map((edge) => {
              const sourceNode = nodeMap.get(edge.source);
              const targetNode = nodeMap.get(edge.target);
              if (!sourceNode || !targetNode) return null;

              const sx = (sourceNode.x || 0) + NODE_WIDTH / 2;
              const sy = (sourceNode.y || 0) + NODE_HEIGHT / 2;
              const tx = (targetNode.x || 0) + NODE_WIDTH / 2;
              const ty = (targetNode.y || 0) + NODE_HEIGHT / 2;

              const isConnectedToSelected =
                selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              const isFilteredOut =
                activeCategoryFilter !== 'all' &&
                sourceNode.category !== activeCategoryFilter &&
                targetNode.category !== activeCategoryFilter;

              const dx = tx - sx;
              const dy = ty - sy;
              const cx1 = sx + dx * 0.45;
              const cy1 = sy;
              const cx2 = sx + dx * 0.55;
              const cy2 = ty;

              const mx = (sx + tx) / 2;
              const my = (sy + ty) / 2 - 3;

              return (
                <g
                  key={edge.id}
                  className={`transition-opacity duration-150 ${
                    isFilteredOut ? 'opacity-15' : isConnectedToSelected ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <path
                    d={`M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`}
                    fill="none"
                    stroke={isConnectedToSelected ? '#1c1917' : '#a8a29e'}
                    strokeWidth={isConnectedToSelected ? 1.75 : 1.2}
                    strokeDasharray={edge.label === 'limited by' ? '3 3' : undefined}
                    markerEnd={
                      isConnectedToSelected ? 'url(#marker-arrow-active)' : 'url(#marker-arrow)'
                    }
                  />

                  {/* Minimal rectangular edge label */}
                  <g transform={`translate(${mx}, ${my})`}>
                    <rect
                      x="-38"
                      y="-9"
                      width="76"
                      height="16"
                      fill="#ffffff"
                      stroke={isConnectedToSelected ? '#1c1917' : '#d6d3d1'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill={isConnectedToSelected ? '#1c1917' : '#57534e'}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="500"
                    >
                      {edge.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Draggable Compact Rectangular Nodes Layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {nodes.map((node) => {
              const meta = CATEGORY_META[node.category] || CATEGORY_META.method;
              const isSelected = selectedNode?.id === node.id;
              const isCategoryMatch =
                activeCategoryFilter === 'all' || node.category === activeCategoryFilter;

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  style={{
                    transform: `translate(${node.x || 0}px, ${node.y || 0}px)`,
                    width: `${NODE_WIDTH}px`,
                    minHeight: `${NODE_HEIGHT}px`,
                    borderLeftColor: meta.borderAccent,
                    borderLeftWidth: '3px',
                  }}
                  className={`absolute pointer-events-auto bg-white border border-stone-300 p-2.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'ring-1 ring-stone-900 border-stone-900 z-20 shadow-xs'
                      : 'hover:border-stone-400 z-10'
                  } ${!isCategoryMatch ? 'opacity-25' : 'opacity-100'}`}
                >
                  {/* Top metadata line: Category Code & Label */}
                  <div className="flex items-center justify-between gap-1 mb-1 text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    <span className="font-semibold" style={{ color: meta.color }}>
                      [{meta.code}] {meta.label}
                    </span>
                    <span className="text-stone-400">#{node.id.replace('n_', '')}</span>
                  </div>

                  {/* Node Label */}
                  <h4 className="text-xs font-semibold text-stone-900 leading-snug line-clamp-2">
                    {node.label}
                  </h4>

                  {/* Compact Description */}
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-normal font-sans">
                    {node.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slim Docked Information Panel on Node Click */}
        {selectedNode && (
          <aside className="w-80 sm:w-96 bg-[#fcfcfb] border-l border-stone-200 p-5 flex flex-col justify-between overflow-y-auto shrink-0 z-20">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2"
                    style={{ backgroundColor: CATEGORY_META[selectedNode.category]?.color }}
                  />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-600 font-semibold">
                    {CATEGORY_META[selectedNode.category]?.label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 text-stone-400 hover:text-stone-900 transition"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-stone-900 leading-snug font-sans">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {selectedNode.description}
                </p>
              </div>

              {/* Technical / Mathematical Formulation */}
              {selectedNode.details && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                    Formulation / Context:
                  </span>
                  <div className="p-3 bg-stone-100/70 border border-stone-200 text-xs text-stone-800 font-mono leading-relaxed break-words">
                    {selectedNode.details}
                  </div>
                </div>
              )}

              {/* Inbound & Outbound Connections Matrix */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                  Connected Graph Relations:
                </span>

                {inboundEdges.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase">Incoming:</span>
                    {inboundEdges.map((e) => {
                      const src = nodeMap.get(e.source);
                      return (
                        <div
                          key={e.id}
                          onClick={() => src && setSelectedNode(src)}
                          className="p-2 bg-white hover:bg-stone-50 border border-stone-200 cursor-pointer text-xs flex items-center justify-between"
                        >
                          <span className="text-stone-800 line-clamp-1 font-medium">{src?.label}</span>
                          <span className="text-[10px] font-mono text-stone-500 shrink-0 ml-2">
                            --{e.label}→
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {outboundEdges.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase">Outgoing:</span>
                    {outboundEdges.map((e) => {
                      const tgt = nodeMap.get(e.target);
                      return (
                        <div
                          key={e.id}
                          onClick={() => tgt && setSelectedNode(tgt)}
                          className="p-2 bg-white hover:bg-stone-50 border border-stone-200 cursor-pointer text-xs flex items-center justify-between"
                        >
                          <span className="text-[10px] font-mono text-stone-500 shrink-0 mr-2">
                            →{e.label}--
                          </span>
                          <span className="text-stone-800 line-clamp-1 font-medium text-right">{tgt?.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Inquire Action Button */}
            <div className="pt-4 mt-6 border-t border-stone-200">
              <button
                onClick={() => onAskAboutNode(selectedNode)}
                className="w-full py-2 px-3 text-xs font-mono font-medium text-stone-800 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition flex items-center justify-center gap-1.5"
              >
                <span>Ask the Paper about this node →</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Status Rule */}
      <footer className="bg-white border-t border-stone-200 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-stone-500">
        <div className="flex items-center gap-3">
          <span>KNOWLEDGE GRAPH VIEW</span>
          <span className="text-stone-300">/</span>
          <span>{nodes.length} Nodes</span>
          <span className="text-stone-300">/</span>
          <span>{edges.length} Directed Edges</span>
        </div>
        <div className="hidden sm:block text-stone-400">
          SELECT NODE TO INSPECT RELATIONS
        </div>
      </footer>
    </div>
  );
};
