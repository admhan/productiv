import type { AppData } from '../../types';
import { DataManager } from './DataManager';
import { ApiKeyField } from './ApiKeyField';

interface SettingsProps {
  onImport: (data: AppData) => void;
}

export function Settings({ onImport }: SettingsProps) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <DataManager onImport={onImport} />
      <div className="pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
        <ApiKeyField />
      </div>
    </div>
  );
}
