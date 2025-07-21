import { Loader2, Calculator } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white/80 z-50 fixed inset-0">
      <div className="flex items-center gap-4 mb-4">
        <Calculator className="w-10 h-10 text-blue-500 animate-bounce" />
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
      <div className="text-lg font-semibold text-blue-700">Loading...</div>
    </div>
  );
} 