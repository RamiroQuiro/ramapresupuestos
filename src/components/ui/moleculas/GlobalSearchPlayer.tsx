import { Search, User, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Text } from "../atoms/Text";

type PlayerResult = {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
};

export default function GlobalSearchPlayer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounce = useRef<any>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setShow(false);
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
        const res = await fetch(
          `/api/players?search=${encodeURIComponent(value)}`,
        );
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
    window.location.href = `/dashboard/jugadores/${player.id}`;
    setShow(false);
    setQuery("");
  }

  return (
    <div ref={ref} className="relative w-full max-w-xs md:max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setShow(true)}
          placeholder="Buscar jugador..."
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
        {loading && (
          <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>

      {show && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
          <div className="bg-gray-50 px-4 py-2">
            <Text as="span">Resultados</Text>
          </div>
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p)}
              className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-indigo-50"
            >
              <div className="text-primary-600 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <Text as="p" className="text-primary-textoTitle font-semibold">
                  {p.firstName} {p.lastName}
                </Text>
                <Text
                  as="p"
                  className="wider text-[10px] text-gray-400 uppercase"
                >
                  DNI: {p.dni || "—"}
                </Text>
              </div>
            </button>
          ))}
        </div>
      )}

      {show && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-100 bg-white p-6 text-center shadow-2xl">
          <p className="text-sm font-bold text-gray-500">
            Sin resultados para "{query}"
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Intentá con otro nombre o DNI
          </p>
        </div>
      )}
    </div>
  );
}
