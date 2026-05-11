import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, 
  Settings2, 
  Maximize2, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Scissors,
  Calculator
} from "lucide-react";
import { VestDimensions, Gauge, DEFAULT_DIMENSIONS, DEFAULT_GAUGE } from "./types";
import { PatternView } from "./components/PatternView";
import { MeasurementsTable } from "./components/MeasurementsTable";
import { GaugeControl } from "./components/GaugeControl";
import { DetailedCalculations } from "./components/DetailedCalculations";
import { analyzeVestSketch } from "./services/geminiService";
import { exportToPDF } from "./services/pdfService";

export default function App() {
  const [dimensions, setDimensions] = useState<VestDimensions>(DEFAULT_DIMENSIONS);
  const [gauge, setGauge] = useState<Gauge>(DEFAULT_GAUGE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"dimensions" | "gauge" | "technical">("dimensions");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDimensionChange = (key: keyof VestDimensions, value: number) => {
    setDimensions(prev => ({ ...prev, [key]: value }));
  };

  const handleGaugeChange = (key: keyof Gauge, value: number) => {
    setGauge(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await analyzeVestSketch(arrayBuffer, file.type);
      
      if (result) {
        setDimensions(result.dimensions);
        setGauge(result.gauge);
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    await exportToPDF("pattern-content", dimensions, gauge);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 px-6 border-b border-[#27272a] flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#e4e4e7] to-[#71717a] flex items-center justify-center">
            <Scissors className="text-black" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-medium tracking-tight">Atelier Marco</h1>
            <p className="text-[10px] text-[#71717a] uppercase tracking-widest leading-none">Professional Knitwear Design</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-[#f4f4f5] text-black text-sm font-medium rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
            {isAnalyzing ? "Analisi in corso..." : "Analizza Schizzo"}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={handleDownloadPDF}
            className="p-2 text-[#71717a] hover:text-[#f4f4f5] transition-colors"
            title="Scarica PDF"
          >
            <Download size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Hidden Container for PDF Export (Black & White) */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div id="pdf-print-container" style={{ backgroundColor: '#ffffff', padding: '32px' }}>
            <PatternView dimensions={dimensions} gauge={gauge} printMode={true} />
          </div>
        </div>

        {/* Left Side: Pattern Preview */}
        <div id="pattern-content" className="flex-1 overflow-auto p-6 flex flex-col bg-black">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs text-[#71717a] uppercase tracking-wider">
              <Maximize2 size={12} />
              <span>Anteprima Cartamodello</span>
            </div>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs text-[#34d399]"
              >
                <Loader2 className="animate-spin" size={12} />
                <span>Aggiornamento in corso...</span>
              </motion.div>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
             <PatternView dimensions={dimensions} gauge={gauge} />
          </div>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
               <p className="text-[10px] text-[#71717a] uppercase mb-1">Taglia Approx.</p>
               <p className="text-xl font-medium text-[#f4f4f5]">L-XL</p>
            </div>
            <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
               <p className="text-[10px] text-[#71717a] uppercase mb-1">Punti Totali</p>
               <p className="text-xl font-medium text-[#34d399]">{Math.round((dimensions.bottomWidth * gauge.stitchesPer10cm) / 10)}</p>
            </div>
            <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
               <p className="text-[10px] text-[#71717a] uppercase mb-1">Giri Totali</p>
               <p className="text-xl font-medium text-[#f4f4f5]">{Math.round((dimensions.totalHeight * gauge.rowsPer10cm) / 10)}</p>
            </div>
            <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
               <p className="text-[10px] text-[#71717a] uppercase mb-1">Status Progetto</p>
               <div className="flex items-center gap-2 mt-1">
                 <CheckCircle2 size={16} className="text-[#10b981]" />
                 <span className="text-sm">Pronto</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="w-full lg:w-[400px] bg-[#09090b] border-l border-[#27272a] flex flex-col">
          <div className="p-1 m-4 bg-[#18181b] rounded-lg flex">
            <button 
              onClick={() => setActiveTab("dimensions")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all ${activeTab === "dimensions" ? "bg-[#27272a] text-white shadow-sm" : "text-[#71717a] hover:text-[#d4d4d8]"}`}
            >
              <Settings2 size={12} />
              Misure
            </button>
            <button 
              onClick={() => setActiveTab("gauge")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all ${activeTab === "gauge" ? "bg-[#27272a] text-white shadow-sm" : "text-[#71717a] hover:text-[#d4d4d8]"}`}
            >
              <Hash size={12} />
              Campione
            </button>
            <button 
              onClick={() => setActiveTab("technical")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all ${activeTab === "technical" ? "bg-[#27272a] text-white shadow-sm" : "text-[#71717a] hover:text-[#d4d4d8]"}`}
            >
              <Calculator size={12} />
              Tecnico
            </button>
          </div>

          <div className="flex-1 overflow-auto px-6 pb-6">
            <AnimatePresence mode="wait">
              {activeTab === "dimensions" && (
                <motion.div
                  key="dimensions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                   <MeasurementsTable dimensions={dimensions} onChange={handleDimensionChange} />
                </motion.div>
              )}
              {activeTab === "gauge" && (
                <motion.div
                  key="gauge"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                   <GaugeControl gauge={gauge} dimensions={dimensions} onChange={handleGaugeChange} />
                </motion.div>
              )}
              {activeTab === "technical" && (
                <motion.div
                  key="technical"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                   <DetailedCalculations dimensions={dimensions} gauge={gauge} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-[#27272a] bg-[#09090b]/50">
             <div className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)]">
               <AlertCircle size={16} className="text-[#f97316] shrink-0 mt-0.5" />
               <p className="text-[11px] text-[#ffedd5] opacity-70 leading-relaxed">
                 Le misure sono espresse in cm. Ricorda che il calcolo dei punti è arrotondato. Verifica sempre il campione lavorato prima di avviare.
               </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-icons for tabs
function Hash({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="4" y1="9" x2="20" y2="9"></line>
      <line x1="4" y1="15" x2="20" y2="15"></line>
      <line x1="10" y1="3" x2="8" y2="21"></line>
      <line x1="16" y1="3" x2="14" y2="21"></line>
    </svg>
  );
}
