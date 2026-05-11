import React from "react";
import { VestDimensions, Gauge } from "../types";

interface PatternViewProps {
  dimensions: VestDimensions;
  gauge: Gauge;
  printMode?: boolean;
}

export const PatternView: React.FC<PatternViewProps> = ({ dimensions, gauge, printMode = false }) => {
  const scale = 5; // Pixels per cm
  const padding = 140;
  
  const width = dimensions.bustWidth * scale + padding * 2;
  const height = dimensions.totalHeight * scale + padding * 2;

  // Colors based on mode
  const colors = {
    bg: printMode ? "#ffffff" : "#18181b",
    border: printMode ? "#cccccc" : "#27272a",
    fabricFill: printMode ? "#f8f8f8" : "url(#fabric)",
    fabricStroke: printMode ? "#000000" : "#71717a",
    guideStroke: printMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.05)",
    text: printMode ? "#000000" : "#ffffff",
    vMeasure: printMode ? "#000000" : "#10b981",
    hMeasure: printMode ? "#000000" : "#06b6d4",
    scavo: printMode ? "#000000" : "#ef4444",
    scavoLabel: printMode ? "#000000" : "#ef4444",
  };

  // Measurement helpers
  const st = (cm: number) => Math.round((cm * gauge.stitchesPer10cm) / 10);
  const rows = (cm: number) => Math.round((cm * gauge.rowsPer10cm) / 10);

  // Coordinate calculations
  const centerX = width / 2;
  const bottomY = height - padding;
  
  const halfBottom = (dimensions.bottomWidth * scale) / 2;
  const halfBust = (dimensions.bustWidth * scale) / 2;
  const halfNeck = (dimensions.neckWidth * scale) / 2;
  const shoulderW = dimensions.shoulderWidth * scale;
  
  const bodyH = dimensions.bodyHeight * scale;
  const armH = dimensions.armholeHeight * scale;
  const hemH = dimensions.hemHeight * scale;
  
  const armholeStartY = bottomY - bodyH;
  const topY = armholeStartY - armH;

  // The "indentation" (scavo) is the difference between bust and total shoulder span
  const totalShoulderSpan = halfNeck * 2 + shoulderW * 2;
  const indentX = halfBust - (halfNeck + shoulderW);
  const flatX = Math.max(8, indentX * 0.3); // Initial cast-off representation

  const pathData = `
    M ${centerX - halfBottom} ${bottomY}
    L ${centerX - halfBottom} ${bottomY - hemH}
    Q ${centerX - halfBottom} ${bottomY - hemH - 20}, ${centerX - halfBust} ${armholeStartY}
    L ${centerX - halfBust + flatX} ${armholeStartY}
    C ${centerX - halfBust + flatX + 10} ${armholeStartY}, ${centerX - halfNeck - shoulderW} ${armholeStartY + 20}, ${centerX - halfNeck - shoulderW} ${topY}
    L ${centerX - halfNeck} ${topY}
    L ${centerX} ${armholeStartY}
    L ${centerX + halfNeck} ${topY}
    L ${centerX + halfNeck + shoulderW} ${topY}
    C ${centerX + halfNeck + shoulderW} ${armholeStartY + 20}, ${centerX + halfBust - flatX - 10} ${armholeStartY}, ${centerX + halfBust - flatX} ${armholeStartY}
    L ${centerX + halfBust} ${armholeStartY}
    Q ${centerX + halfBottom} ${bottomY - hemH - 20}, ${centerX + halfBottom} ${bottomY - hemH}
    L ${centerX + halfBottom} ${bottomY}
    Z
  `;

  const Label = ({ x, y, cm, type, anchor = "middle" }: any) => {
    const isW = type === "st";
    const labelColor = isW ? colors.hMeasure : colors.vMeasure; 
    const labelWidth = 64;
    const labelHeight = 32;
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect 
          x={anchor === "middle" ? -labelWidth/2 : (anchor === "end" ? -labelWidth : 0)} 
          y={-labelHeight/2} 
          width={labelWidth} 
          height={labelHeight} 
          rx="6" 
          fill={printMode ? "white" : "black"} 
          fillOpacity={printMode ? 1 : 0.85} 
          stroke={labelColor} 
          strokeWidth={printMode ? 1.5 : 1} 
        />
        <text textAnchor={anchor} fill={printMode ? "black" : "white"} fontSize="13" fontWeight="bold" dy="2">
          {cm}cm
        </text>
        <text textAnchor={anchor} y={15} fill={labelColor} fontSize="10" fontWeight="black" className="font-mono uppercase tracking-tighter">
          {isW ? `${st(cm)} pt` : `${rows(cm)} rg`}
        </text>
      </g>
    );
  };

  return (
    <div 
      className={`w-full flex justify-center p-4 border rounded-2xl overflow-hidden relative ${printMode ? "" : "bg-[#18181b] border-[#27272a] pattern-grid"}`}
      style={printMode ? { backgroundColor: '#ffffff', borderColor: '#cccccc' } : {}}
    >
      {!printMode && (
        <div className="absolute top-6 left-6 flex gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#a1a1aa] uppercase tracking-widest font-bold">Campione Punti</span>
            <span className="text-sm font-mono text-[#22d3ee]">{gauge.stitchesPer10cm} / 10cm</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[#a1a1aa] uppercase tracking-widest font-bold">Campione Giri</span>
            <span className="text-sm font-mono text-[#34d399]">{gauge.rowsPer10cm} / 10cm</span>
          </div>
        </div>
      )}

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={printMode ? "" : "drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"}>
        <defs>
          {!printMode && (
            <linearGradient id="fabric" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>
          )}
          <marker id="arrow-v" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.vMeasure} />
          </marker>
          <marker id="arrow-h" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.hMeasure} />
          </marker>
        </defs>
        
        {/* Main Pattern */}
        <path
          d={pathData}
          fill={colors.fabricFill}
          stroke={colors.fabricStroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Technical Guidelines & Armhole Indent Highlight */}
        <g stroke={colors.guideStroke} strokeDasharray="4 4" fill="none">
          <line x1={centerX - halfBust} y1={armholeStartY} x2={centerX - halfBust} y2={topY} />
          <line x1={centerX + halfBust} y1={armholeStartY} x2={centerX + halfBust} y2={topY} />
        </g>

        <path
          d={`
            M ${centerX - dimensions.placketWidth * scale} ${bottomY}
            L ${centerX - dimensions.placketWidth * scale} ${armholeStartY}
            L ${centerX - halfNeck} ${topY}
            M ${centerX + dimensions.placketWidth * scale} ${bottomY}
            L ${centerX + dimensions.placketWidth * scale} ${armholeStartY}
            L ${centerX + halfNeck} ${topY}
          `}
          fill="none"
          stroke={printMode ? "#999" : "#444"}
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Vertical Measurements */}
        <g stroke={colors.vMeasure} strokeWidth="1.5" opacity={printMode ? 1 : 0.8}>
          <line x1={padding - 45} y1={topY} x2={padding - 45} y2={bottomY} markerStart="url(#arrow-v)" markerEnd="url(#arrow-v)" />
          <line x1={centerX + halfBottom + 25} y1={bottomY} x2={centerX + halfBottom + 25} y2={bottomY - hemH} markerStart="url(#arrow-v)" markerEnd="url(#arrow-v)" />
          <line x1={centerX + halfBust + 25} y1={bottomY} x2={centerX + halfBust + 25} y2={armholeStartY} markerStart="url(#arrow-v)" markerEnd="url(#arrow-v)" />
          <line x1={centerX + halfBust + 25} y1={armholeStartY} x2={centerX + halfBust + 25} y2={topY} markerStart="url(#arrow-v)" markerEnd="url(#arrow-v)" />
        </g>

        {/* Labels for Vertical */}
        <g transform={`translate(${padding - 65}, ${(topY + bottomY) / 2}) rotate(-90)`}>
          <Label x={0} y={0} cm={dimensions.totalHeight} type="rows" />
        </g>
        <Label x={centerX + halfBottom + 65} y={bottomY - hemH / 2} cm={dimensions.hemHeight} type="rows" anchor="start" />
        <Label x={centerX + halfBust + 65} y={(bottomY + armholeStartY) / 2} cm={dimensions.bodyHeight} type="rows" anchor="start" />
        <Label x={centerX + halfBust + 65} y={(armholeStartY + topY) / 2} cm={dimensions.armholeHeight} type="rows" anchor="start" />

        {/* Horizontal Measurements */}
        <g stroke={colors.hMeasure} strokeWidth="1.5" opacity={printMode ? 1 : 0.8}>
          <line x1={centerX - halfBottom} y1={bottomY + 35} x2={centerX + halfBottom} y2={bottomY + 35} markerStart="url(#arrow-h)" markerEnd="url(#arrow-h)" />
          <line x1={centerX - halfBust} y1={armholeStartY + 30} x2={centerX + halfBust} y2={armholeStartY + 30} markerStart="url(#arrow-h)" markerEnd="url(#arrow-h)" />
          <line x1={centerX - halfNeck - shoulderW} y1={topY - 75} x2={centerX + halfNeck + shoulderW} y2={topY - 75} markerStart="url(#arrow-h)" markerEnd="url(#arrow-h)" />
          <line x1={centerX - halfNeck - shoulderW} y1={topY - 35} x2={centerX - halfNeck} y2={topY - 35} markerStart="url(#arrow-h)" markerEnd="url(#arrow-h)" />
          <line x1={centerX - halfNeck} y1={topY - 35} x2={centerX + halfNeck} y2={topY - 35} markerStart="url(#arrow-h)" markerEnd="url(#arrow-h)" />
        </g>

        {/* Labels for Horizontal */}
        <Label x={centerX} y={bottomY + 55} cm={dimensions.bottomWidth} type="st" />
        <Label x={centerX} y={armholeStartY + 50} cm={dimensions.bustWidth} type="st" />
        <Label x={centerX} y={topY - 95} cm={dimensions.shoulderWidth * 2 + dimensions.neckWidth} type="st" />
        <Label x={centerX - halfNeck - shoulderW / 2} y={topY - 55} cm={dimensions.shoulderWidth} type="st" />
        <Label x={centerX} y={topY - 55} cm={dimensions.neckWidth} type="st" />
        
        {/* Armhole Indentation Highlights */}
        <g stroke={colors.scavo} strokeWidth="1.5" strokeDasharray="3 3">
           <line x1={centerX - halfBust} y1={armholeStartY} x2={centerX - (halfNeck + shoulderW)} y2={armholeStartY} />
           <line x1={centerX + halfBust} y1={armholeStartY} x2={centerX + (halfNeck + shoulderW)} y2={armholeStartY} />
        </g>
        
        {/* Armhole Decrease Labels */}
        <g transform={`translate(${centerX - halfBust - 30}, ${armholeStartY - 10})`}>
          <rect x="-35" y="-12" width="70" height="24" rx="4" fill={colors.scavoLabel} />
          <text textAnchor="middle" dy="4" fill="white" fontSize="9" fontWeight="bold" className="font-mono">
             -{st((dimensions.bustWidth - (dimensions.shoulderWidth * 2 + dimensions.neckWidth)) / 2)} PT
          </text>
          {printMode ? null : <text textAnchor="middle" dy="18" fill="#fca5a5" fontSize="8" fontWeight="medium" className="uppercase">Scavo</text>}
        </g>

        <g transform={`translate(${centerX + halfBust + 30}, ${armholeStartY - 10})`}>
          <rect x="-35" y="-12" width="70" height="24" rx="4" fill={colors.scavoLabel} />
          <text textAnchor="middle" dy="4" fill="white" fontSize="9" fontWeight="bold" className="font-mono">
             -{st((dimensions.bustWidth - (dimensions.shoulderWidth * 2 + dimensions.neckWidth)) / 2)} PT
          </text>
          {printMode ? null : <text textAnchor="middle" dy="18" fill="#fca5a5" fontSize="8" fontWeight="medium" className="uppercase">Scavo</text>}
        </g>
      </svg>
    </div>
  );
};
