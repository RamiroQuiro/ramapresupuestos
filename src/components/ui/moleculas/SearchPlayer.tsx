import { Search, User, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

type PlayerResult = {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
};

type Props = {
  onSelect: (player: PlayerResult) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  selectedId?: string;
  selectedName?: string;
};

export default function SearchPlayer({ onSelect, placeholder = "Buscar jugador por nombre o DNI...", autoFocus, className, selectedId, selectedName: initialName }: Props) {
  const [query, setQuery] = useState(initialName || "");
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounce = useRef<any>();

  // Si viene selectedId pero no nombre, lo buscamos
  useEffect(() => {
    if (selectedId && !initialName) {
      fetch(`/api/players/${selectedId}`)
        .then((r) => r.json())
        .then((res) => {
          const data = res.data;
          const p = Array.isArray(data) ? data[0] : data;
          if (p) {
            setQuery(`${p.firstName} ${p.lastName}`);
            onSelect(p);
          }
        })
        .catch(console.error);
    }
  }, [selectedId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    clearTimeout(debounce.current);

    if (value.length < 2) {
      setResults([]);
      setShow(false);
      return;
    }

    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/players?search=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data.data || []);
        setShow(true);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function select(player: PlayerResult) {
    setQuery(`${player.firstName} ${player.lastName}`);
    setShow(false);
    onSelect(player);
  }

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setShow(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />}
      </div>

      {show && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-blue-50 border-b last:border-0 border-gray-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{p.firstName} {p.lastName}</p>
                <p className="text-xs text-gray-500">DNI: {p.dni || "—"}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {show && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-400 shadow-lg">
          Sin resultados para "{query}"
        </div>
      )}
    </div>
  );
}
