import React from "react";
import { VestDimensions, Gauge } from "../types";
import { Scissors, Ruler, ChevronRight } from "lucide-react";

interface DetailedCalculationsProps {
  dimensions: VestDimensions;
  gauge: Gauge;
}

export const DetailedCalculations: React.FC<DetailedCalculationsProps> = ({ dimensions, gauge }) => {
  const st = (cm: number) => Math.round((cm * gauge.stitchesPer10cm) / 10);
  const rows = (cm: number) => Math.round((cm * gauge.rowsPer10cm) / 10);

  // Armhole Shaping
  // Total Shoulder-to-Shoulder Width = (ShoulderWidth * 2 + NeckWidth)
  const totalShoulderWidthCm = (dimensions.shoulderWidth * 2 + dimensions.neckWidth);
  const armholeWidthCm = (dimensions.bustWidth - totalShoulderWidthCm) / 2;
  const armholeStitches = st(armholeWidthCm);
  const armholeRows = rows(dimensions.armholeHeight);

  // Neckline Shaping (V-neck)
  // Starts at the same time as armhole in the sketch
  const neckWidthHalfCm = dimensions.neckWidth / 2;
  const neckStitches = st(neckWidthHalfCm);
  const neckRows = rows(dimensions.armholeHeight); // V-neck height is the same as armhole in this design

  // Frequencies
  const neckFrequency = Math.floor(neckRows / neckStitches);
  const armholeInitialCastOff = Math.floor(armholeStitches * 0.4);
  const armholeRemainingSt = armholeStitches - armholeInitialCastOff;

  return (
    <div className="space-y-8">
      {/* Armhole Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#f4f4f5] font-medium">
          <Scissors size={16} className="text-[#10b981]" />
          <h2>Giro Manica (Armhole)</h2>
        </div>
        
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#27272a]/50 p-3 rounded-lg col-span-2">
              <p className="text-[10px] text-[#71717a] uppercase mb-1">Passaggio 1: Ampiezza Totale Spalle</p>
              <div className="flex justify-between items-center">
                <p className="text-sm font-mono text-[#a1a1aa]">({dimensions.shoulderWidth} + {dimensions.neckWidth} + {dimensions.shoulderWidth}) cm</p>
                <p className="text-lg font-bold text-[#f4f4f5]">{totalShoulderWidthCm.toFixed(1)} cm</p>
              </div>
            </div>
            <div className="bg-[#27272a]/50 p-3 rounded-lg">
              <p className="text-[10px] text-[#71717a] uppercase mb-1">Passaggio 2: Scavo (un lato)</p>
              <p className="text-xs text-[#a1a1aa] mb-1">({dimensions.bustWidth} - {totalShoulderWidthCm.toFixed(1)}) / 2</p>
              <p className="text-lg font-mono text-[#f4f4f5]">{armholeWidthCm.toFixed(1)} cm</p>
            </div>
            <div className="bg-[#27272a]/50 p-3 rounded-lg flex flex-col justify-end">
              <p className="text-[10px] text-[#71717a] uppercase mb-1">Punti da Calare</p>
              <p className="text-lg font-mono text-[#34d399]">{armholeStitches} pt</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-[#a1a1aa] font-medium px-1 uppercase tracking-wider">Sequenza Calo</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between bg-[#09090b] p-2 rounded border border-[#27272a]/50">
                <span className="text-xs text-[#71717a]">Avvio (Subito)</span>
                <span className="text-sm font-mono text-[#10b981]">-{armholeInitialCastOff} pt</span>
              </div>
              <div className="flex items-center justify-between bg-[#09090b] p-2 rounded border border-[#27272a]/50">
                <span className="text-xs text-[#71717a]">Graduali (Ogni 2 giri)</span>
                <span className="text-sm font-mono text-[#10b981]">-{armholeRemainingSt} x 1 pt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neckline Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#f4f4f5] font-medium">
          <Ruler size={16} className="text-[#10b981]" />
          <h2>Scollo a V (Neckline)</h2>
        </div>
        
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#27272a]/50 p-3 rounded-lg">
              <p className="text-[10px] text-[#71717a] uppercase">Altezza Scollo</p>
              <p className="text-lg font-mono text-[#f4f4f5]">{dimensions.armholeHeight} cm</p>
            </div>
            <div className="bg-[#27272a]/50 p-3 rounded-lg">
              <p className="text-[10px] text-[#71717a] uppercase">Punti da Calare</p>
              <p className="text-lg font-mono text-[#34d399]">{neckStitches}</p>
            </div>
          </div>

          <div className="p-4 bg-[#09090b] rounded-lg border border-[#27272a]/50 border-l-2 border-l-[#10b981]">
             <p className="text-xs text-[#71717a] mb-1 italic">Istruzione tecnica:</p>
             <p className="text-sm text-[#d4d4d8] leading-relaxed">
                Calare <span className="text-[#34d399] font-mono">1 punto</span> ogni <span className="text-[#34d399] font-mono">{neckFrequency} giri</span> per un totale di <span className="text-[#34d399] font-mono">{neckStitches} volte</span>.
             </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#27272a]">
             <div className="flex items-center justify-between text-xs">
               <span className="text-[#71717a]">Larghezza Spalla Finale</span>
               <span className="text-[#d4d4d8] font-mono">{st(dimensions.shoulderWidth)} pt ({dimensions.shoulderWidth}cm)</span>
             </div>
          </div>
        </div>
      </section>

      {/* Recap */}
      <div className="bg-[#10b981]/5 border border-[#10b981]/10 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-[#34d399] text-xs font-semibold uppercase tracking-widest mb-3">
          <ChevronRight size={14} />
          <span>Verifica Tecnica</span>
        </div>
        <ul className="space-y-2">
          <li className="flex justify-between text-[11px]">
            <span className="text-[#71717a]">Punti iniziali lato</span>
            <span className="text-[#d4d4d8]">{st(dimensions.bustWidth / 2)}</span>
          </li>
          <li className="flex justify-between text-[11px]">
            <span className="text-[#71717a]">Meno cali manica</span>
            <span className="text-[#a1a1aa]">-{armholeStitches}</span>
          </li>
          <li className="flex justify-between text-[11px]">
            <span className="text-[#71717a]">Meno cali scollo</span>
            <span className="text-[#a1a1aa]">-{neckStitches}</span>
          </li>
          <li className="h-px bg-[#27272a] my-1" />
          <li className="flex justify-between text-xs font-bold">
            <span className="text-[#f4f4f5]">Punti Spalla Rimasti</span>
            <span className="text-[#34d399]">{st(dimensions.shoulderWidth)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
