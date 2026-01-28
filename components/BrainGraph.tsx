import React, { useState, useMemo, useRef } from 'react';
import { brainData } from '../data/brainData';

const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 300;

const BrainGraph: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to scale normalized coordinates to SVG viewbox
  const xScale = (val: number) => (val / 100) * VIEWBOX_WIDTH;
  const yScale = (val: number) => (val / 100) * VIEWBOX_HEIGHT;

  // Determine connectedness
  const { connectedNodeIds, connectedLinkIndices } = useMemo(() => {
    if (!hoveredNode) return { connectedNodeIds: new Set(), connectedLinkIndices: new Set() };

    const nodeIds = new Set<string>();
    const linkIndices = new Set<number>();

    brainData.links.forEach((link, index) => {
      if (link.source === hoveredNode) {
        nodeIds.add(link.target);
        linkIndices.add(index);
      } else if (link.target === hoveredNode) {
        nodeIds.add(link.source);
        linkIndices.add(index);
      }
    });
    
    // Add self
    nodeIds.add(hoveredNode);

    return { connectedNodeIds: nodeIds, connectedLinkIndices: linkIndices };
  }, [hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }
  };

  // Get active node details
  const activeNodeData = hoveredNode ? brainData.nodes.find(n => n.id === hoveredNode) : null;

  // Brain silhouette path definition
  // Carefully drawn to encompass the nodes in a recognizable brain shape
  const brainPath = `
    M ${xScale(48)} ${yScale(92)} 
    C ${xScale(30)} ${yScale(92)}, ${xScale(5)} ${yScale(80)}, ${xScale(5)} ${yScale(45)} 
    C ${xScale(5)} ${yScale(15)}, ${xScale(35)} ${yScale(0)}, ${xScale(65)} ${yScale(5)} 
    C ${xScale(95)} ${yScale(10)}, ${xScale(100)} ${yScale(35)}, ${xScale(95)} ${yScale(60)} 
    C ${xScale(90)} ${yScale(85)}, ${xScale(70)} ${yScale(65)}, ${xScale(55)} ${yScale(85)} 
    Q ${xScale(52)} ${yScale(92)} ${xScale(48)} ${yScale(92)}
    Z
  `;

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center select-none"
        onMouseMove={handleMouseMove}
    >
      <svg 
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} 
        className="w-full h-full max-w-[600px] overflow-visible"
        style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.05))' }}
      >
        {/* Subtle Brain Outline Background */}
        <path 
          d={brainPath}
          fill="#f8fafc" // Very light slate/gray
          stroke="#e2e8f0" // Slate-200
          strokeWidth="2"
          className="transition-all duration-500"
          style={{ opacity: 0.8 }}
        />
        
        {/* Draw Links */}
        {brainData.links.map((link, i) => {
          const sourceNode = brainData.nodes.find(n => n.id === link.source)!;
          const targetNode = brainData.nodes.find(n => n.id === link.target)!;
          const isConnected = connectedLinkIndices.has(i);
          const isDimmed = hoveredNode && !isConnected;

          return (
            <line
              key={`${link.source}-${link.target}`}
              x1={xScale(sourceNode.x)}
              y1={yScale(sourceNode.y)}
              x2={xScale(targetNode.x)}
              y2={yScale(targetNode.y)}
              stroke={isConnected ? "#D93025" : "#CBD5E1"} 
              strokeWidth={isConnected ? 2.5 : 1}
              strokeOpacity={isDimmed ? 0.2 : 0.6}
              className="transition-all duration-300 ease-out"
            />
          );
        })}

        {/* Draw Nodes */}
        {brainData.nodes.map((node, i) => {
          const isHovered = hoveredNode === node.id;
          const isConnected = connectedNodeIds.has(node.id);
          const isDimmed = hoveredNode && !isConnected;

          let fill = "#94A3B8"; 
          if (isHovered) fill = "#D93025";
          else if (isConnected) fill = "#334155";

          // Expand size on hover - made slightly larger for "interactive/fun" feel
          const r = isHovered ? 12 : (isConnected ? 6 : 4);

          return (
            <g 
                key={node.id} 
                className={isDimmed ? "" : "cursor-pointer"}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ 
                    animationDelay: `${i * 0.1}s` 
                }}
            >
              {/* Invisible larger hit area */}
              <circle 
                cx={xScale(node.x)} 
                cy={yScale(node.y)} 
                r={25} 
                fill="transparent" 
              />
              {/* Visible Node */}
              <circle
                cx={xScale(node.x)}
                cy={yScale(node.y)}
                r={r}
                fill={fill}
                className={`transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${!isHovered ? 'animate-float' : ''}`}
                fillOpacity={isDimmed ? 0.3 : 1}
                stroke={isHovered ? "white" : "none"}
                strokeWidth={2}
              />
              {/* Halo effect */}
              {isHovered && (
                 <circle
                 cx={xScale(node.x)}
                 cy={yScale(node.y)}
                 r={20}
                 fill="#D93025"
                 opacity={0.15}
                 className="animate-pulse"
               />
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card */}
      {activeNodeData && (
        <div 
            className="absolute z-20 pointer-events-none transition-all duration-200 ease-out"
            style={{
                left: mousePos.x + 20, 
                top: mousePos.y - 20,
                opacity: hoveredNode ? 1 : 0,
                transform: hoveredNode ? 'translateY(0)' : 'translateY(10px)'
            }}
        >
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-100 w-72 text-left relative overflow-hidden">
                {/* Category Color Indicator */}
                <div className={`absolute top-0 left-0 w-1 h-full ${activeNodeData.category === 'systems' ? 'bg-blue-500' : (activeNodeData.category === 'fundamental' ? 'bg-emerald-500' : 'bg-brand-red')}`}></div>
                
                <div className="pl-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{activeNodeData.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">{activeNodeData.label}</h3>
                    <p className="text-sm text-gray-600 mb-3 leading-snug">{activeNodeData.description}</p>
                    
                    <div className="text-xs text-gray-400 border-t border-gray-100 pt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        <span>Interconnected with <span className="font-semibold text-gray-700">{connectedNodeIds.size - 1}</span> subjects</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BrainGraph;