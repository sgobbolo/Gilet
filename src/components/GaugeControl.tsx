import React from "react";
import { Gauge, VestDimensions } from "../types";
import { Hash, List } from "lucide-react";

interface GaugeControlProps {
  gauge: Gauge;
  dimensions: VestDimensions;
  onChange: (key: keyof Gauge, value: number) => void;
}

export const GaugeControl: React.FC<GaugeControlProps> = ({ gauge, dimensions, onChange }) => {
  const calculateStitches = (cm: number) => Math.round((cm * gauge.stitchesPer10cm) / 10);
  const calculateRows = (cm: number) => Math.round((cm * gauge.rowsPer10cm) / 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-[#a1a1aa] text-sm">
            <Hash size={14} />
            <span>Punti per 10cm</span>
          </div>
          <input
            type="number"
            value={gauge.stitchesPer10cm}
            onChange={(e) => onChange("stitchesPer10cm", parseFloat(e.target.value) || 0)}
            className="bg-[#27272a] border-none text-[#f4f4f5] rounded px-2 py-1 w-full focus:ring-1 focus:ring-[#52525b] outline-none"
          />
        </div>
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-[#a1a1aa] text-sm">
            <List size={14} />
            <span>Giri per 10cm</span>
          </div>
          <input
            type="number"
            value={gauge.rowsPer10cm}
            onChange={(e) => onChange("rowsPer10cm", parseFloat(e.target.value) || 0)}
            className="bg-[#27272a] border-none text-[#f4f4f5] rounded px-2 py-1 w-full focus:ring-1 focus:ring-[#52525b] outline-none"
          />
        </div>
      </div>

      <div className="bg-[#18181b]/50 border border-[#27272a]/50 rounded-xl p-6">
        <h3 className="text-[#a1a1aa] text-sm font-medium mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          CALCOLO PROGETTO
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-[#27272a] pb-2">
            <div>
              <p className="text-xs text-[#71717a] uppercase font-bold tracking-wider">Avvio (Fondo)</p>
              <p className="text-[#e4e4e7] font-medium">{dimensions.bottomWidth} cm</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono text-[#10b981]">{calculateStitches(dimensions.bottomWidth)}</p>
              <p className="text-[10px] text-[#52525b] uppercase font-bold tracking-widest">punti</p>
            </div>
          </div>
          
          <div className="flex justify-between items-end border-b border-[#27272a] pb-2">
            <div>
              <p className="text-xs text-[#71717a] uppercase font-bold tracking-wider">Corpo</p>
              <p className="text-[#e4e4e7] font-medium">{dimensions.bodyHeight} cm</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono text-[#10b981]">{calculateRows(dimensions.bodyHeight)}</p>
              <p className="text-[10px] text-[#52525b] uppercase font-bold tracking-widest">giri</p>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-[#71717a] uppercase font-bold tracking-wider">Scalo Spalla</p>
              <p className="text-[#e4e4e7] font-medium">{dimensions.shoulderWidth} cm</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono text-[#10b981]">{calculateStitches(dimensions.shoulderWidth)}</p>
              <p className="text-[10px] text-[#52525b] uppercase font-bold tracking-widest">punti</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
