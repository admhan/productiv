import { useRef, useState } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { exportData, importData } from '../../services/storage';
import type { AppData } from '../../types';

interface DataManagerProps {
  onImport: (data: AppData) => void;
}

export function DataManager({ onImport }: DataManagerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingJson, setPendingJson] = useState<string | null>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productiv-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setPendingJson(reader.result as string); setShowConfirm(true); };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = () => {
    if (!pendingJson) return;
    const data = importData(pendingJson);
    onImport(data);
    setPendingJson(null);
    setShowConfirm(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[#1a1d2e]">Data Management</h3>
      <div className="flex gap-3">
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f8f9fc] hover:bg-[#f1f3f9] border border-[#e2e5ef] text-[#1a1d2e] text-sm rounded-xl transition-colors">
          <Download className="w-4 h-4" /> Export JSON
        </button>
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f8f9fc] hover:bg-[#f1f3f9] border border-[#e2e5ef] text-[#1a1d2e] text-sm rounded-xl transition-colors">
          <Upload className="w-4 h-4" /> Import JSON
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
      </div>

      {showConfirm && (
        <div className="p-4 bg-[#ff6b6b]/8 border border-[#ff6b6b]/15 rounded-xl">
          <div className="flex items-center gap-2 text-[#ff6b6b] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">Confirm Import</span>
          </div>
          <p className="text-xs text-[#6b7194] mb-3">This will replace all current data. This action cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={confirmImport}
              className="px-3.5 py-2 bg-[#ff6b6b] hover:bg-[#ee5a5a] text-white text-xs rounded-xl transition-colors font-medium">
              Replace All Data
            </button>
            <button onClick={() => { setShowConfirm(false); setPendingJson(null); }}
              className="px-3.5 py-2 bg-[#f8f9fc] text-[#6b7194] text-xs rounded-xl hover:bg-[#f1f3f9]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
