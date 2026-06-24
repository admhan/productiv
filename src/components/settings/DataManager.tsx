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
      <h3 className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>Data Management</h3>
      <div className="flex gap-3">
        <button onClick={handleExport}
          className="flex items-center gap-2 h-9 px-3 rounded-md text-[13px] transition-colors"
          style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}>
          <Download className="w-4 h-4" /> Export JSON
        </button>
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 h-9 px-3 rounded-md text-[13px] transition-colors"
          style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}>
          <Upload className="w-4 h-4" /> Import JSON
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
      </div>

      {showConfirm && (
        <div className="p-4 rounded-lg" style={{ background: 'rgba(229, 72, 77, 0.08)', border: '1px solid rgba(229, 72, 77, 0.15)' }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-danger)' }}>
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[13px] font-semibold">Confirm Import</span>
          </div>
          <p className="text-[12px] mb-3" style={{ color: 'var(--color-text-secondary)' }}>This will replace all current data. This action cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={confirmImport}
              className="h-9 px-3 rounded-md text-[13px] font-medium text-white transition-colors"
              style={{ background: 'var(--color-danger)' }}>
              Replace All Data
            </button>
            <button onClick={() => { setShowConfirm(false); setPendingJson(null); }}
              className="h-9 px-3 rounded-md text-[13px]"
              style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
