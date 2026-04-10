import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
      <input
        type="text"
        placeholder="Buscar productos... (ej: cemento, martillo)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 pl-13 pr-12 rounded-xl bg-card text-foreground text-lg border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
        style={{ paddingLeft: "3.25rem" }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
