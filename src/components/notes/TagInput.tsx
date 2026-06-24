import { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagInput({ tags, onChange, disabled }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const tag = input.trim().toLowerCase();
      if (!tags.includes(tag)) onChange([...tags, tag]);
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) onChange(tags.slice(0, -1));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-md min-h-[36px]"
      style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
      {tags.map((tag) => (
        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-medium"
          style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
          {tag}
          {!disabled && (
            <button onClick={() => onChange(tags.filter((t) => t !== tag))}
              style={{ color: 'var(--color-accent)' }}><X className="w-3 h-3" /></button>
          )}
        </span>
      ))}
      {!disabled && (
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[60px] bg-transparent text-[13px] outline-none"
          style={{ color: 'var(--color-text-primary)' }} />
      )}
    </div>
  );
}
