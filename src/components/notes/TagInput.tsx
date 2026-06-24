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
      if (!tags.includes(tag)) {
        onChange([...tags, tag]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3.5 py-2.5 bg-[#f8f9fc] border border-[#e2e5ef] rounded-xl min-h-[38px]">
      {tags.map((tag) => (
        <span key={tag} className="flex items-center gap-1 px-2.5 py-0.5 bg-[#6c5ce7]/10 text-[#6c5ce7] text-xs rounded-full font-medium">
          {tag}
          {!disabled && (
            <button onClick={() => onChange(tags.filter((t) => t !== tag))} className="hover:text-[#5a4bd6]">
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
      {!disabled && (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[60px] bg-transparent text-sm text-[#1a1d2e] placeholder-[#9ca3c4] outline-none"
        />
      )}
    </div>
  );
}
