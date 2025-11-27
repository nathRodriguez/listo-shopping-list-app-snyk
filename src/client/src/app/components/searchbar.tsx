import { useState } from "react";
import { Product } from '../shopList/types'

interface SearchBarProps {
  items: Product[];
  onSelect: (item: Product, is_new: string) => void;
}

export default function SearchBar({ items, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const itemDefault: Product = {
    id: "default",
    name: query,
    is_predefined: false,
    user_id: null
  };

  //Aqui se refilterea despues de escribir
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    //El input debe capturar el texto, y reacciona con el onChange
    <div className="relative">
      <input
        type="text"
        placeholder="Find and add a product by click..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-64 border px-3 py-2 rounded"
      />

      {/* Rellenamos las sugerencias*/}
      {query !== "" && (
        <div className="w-64 absolute top-full left-0 border mt-2 rounded max-h-60 overflow-y-auto bg-white">
          {filtered.length === 0 && (
            <div
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {onSelect(itemDefault, query); setQuery("")}}
            >
              {query}
              <span className="block text-xs text-gray-500">
                (Click to create and add as a new product)
              </span>
            </div>
          )}

          {filtered.map(item => (
            <div
              key={item.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {onSelect(item, "No"); setQuery("")}}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
