interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          selected === null
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-card text-secondary-foreground border border-border hover:bg-muted"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === selected ? null : cat)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selected === cat
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card text-secondary-foreground border border-border hover:bg-muted"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
