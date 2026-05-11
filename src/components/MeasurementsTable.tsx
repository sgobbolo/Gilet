import React from "react";
import { VestDimensions } from "../types";
import { Ruler, Scissors, Square, ArrowUp } from "lucide-react";

interface MeasurementsTableProps {
  dimensions: VestDimensions;
  onChange: (key: keyof VestDimensions, value: number) => void;
}

export const MeasurementsTable: React.FC<MeasurementsTableProps> = ({ dimensions, onChange }) => {
  const fields: { key: keyof VestDimensions; label: string; icon: any }[] = [
    { key: "totalHeight", label: "Altezza Totale", icon: ArrowUp },
    { key: "bottomWidth", label: "Larghezza Fondo", icon: Ruler },
    { key: "bustWidth", label: "Larghezza Busto", icon: Ruler },
    { key: "armholeHeight", label: "Altezza Giro Manica", icon: Scissors },
    { key: "bodyHeight", label: "Altezza Busto", icon: Ruler },
    { key: "hemHeight", label: "Altezza Bordo", icon: Square },
    { key: "shoulderWidth", label: "Larghezza Spalle", icon: Ruler },
    { key: "neckWidth", label: "Larghezza Scollo", icon: Ruler },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map(({ key, label, icon: Icon }) => (
        <div key={key} className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg flex flex-col gap-2 transition-all hover:border-[#3f3f46]">
          <div className="flex items-center gap-2 text-[#a1a1aa] text-sm">
            <Icon size={14} />
            <span>{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dimensions[key]}
              onChange={(e) => onChange(key, parseFloat(e.target.value) || 0)}
              className="bg-[#27272a] border-none text-[#f4f4f5] rounded px-2 py-1 w-20 focus:ring-1 focus:ring-[#52525b] outline-none"
            />
            <span className="text-[#71717a] text-xs">cm</span>
          </div>
        </div>
      ))}
    </div>
  );
};
