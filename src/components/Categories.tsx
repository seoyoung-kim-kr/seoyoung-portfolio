type Props = {
  categories: string[];
  selected: string;
  onClick: (category: string) => void;
};

export default function Categories({ categories, selected, onClick }: Props) {
  return (
    <ul className="flex flex-wrap md:flex-col gap-1.5 w-full">
      {categories.map((category) => {
        const isActive = category === selected;
        return (
          <li key={category} className="w-auto md:w-full">
            <button
              type="button"
              onClick={() => onClick(category)}
              className={`w-full text-left px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isActive
                  ? "bg-brand-muted text-brand-dark shadow-sm font-bold scale-[1.02]"
                  : "text-brand-dark/80 dark:text-brand-light/80 hover:text-brand-dark dark:hover:text-white hover:bg-brand-muted/20"
              }`}
            >
              <span>{category}</span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-brand-dark hidden md:inline-block" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
