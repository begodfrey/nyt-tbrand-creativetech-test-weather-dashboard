import React, { FormEvent, useState } from 'react';

interface SearchBarProps {
  onSubmit: (zip: string) => void;
  isLoading?: boolean;
  inputClassName: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSubmit, isLoading, inputClassName }) => {
  const [zip, setZip] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmed = zip.trim();
    if (!/^\d{5}$/.test(trimmed)) {
      setInputError('Enter a 5-digit US ZIP code.');
      return;
    }

    setInputError(null);
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-1" aria-label="Search by ZIP code">
      <label className="block text-xs font-medium uppercase tracking-wide opacity-80" htmlFor="zip">
        Search by ZIP
      </label>
      <div className="flex gap-2">
        <input
          id="zip"
          name="zip"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          className={`flex-1 rounded-lg px-3 py-2 text-sm outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 ${inputClassName}`}
          placeholder="e.g. 10001"
          value={zip}
          onChange={(event) => setZip(event.target.value)}
          aria-invalid={inputError ? 'true' : 'false'}
          aria-describedby={inputError ? 'zip-error' : undefined}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          {isLoading ? 'Searching\u2026' : 'Go'}
        </button>
      </div>
      {inputError ? (
        <p id="zip-error" className="text-xs text-red-300">
          {inputError}
        </p>
      ) : null}
    </form>
  );
};

