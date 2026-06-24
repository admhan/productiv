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
    reader.onload = () => {
      setPendingJson(reader.result as string);
      setShowConfirm(true);
    };
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
      <h3 className="text-sm font-medium text-zinc-300">Data Management</h3>

      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Import JSON
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
      </div>

      {showConfirm && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Confirm Import</span>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            This will replace all current data. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={confirmImport}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors"
            >
              Replace All Data
            </button>
            <button
              onClick={() => { setShowConfirm(false); setPendingJson(null); }}
              className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs rounded-lg hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
