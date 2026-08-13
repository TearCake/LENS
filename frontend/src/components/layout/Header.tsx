export function Header() {
  return (
    <header className="fixed top-0 right-0 left-[260px] h-16 border-b border-border-hairline bg-surface z-10">
      <div className="flex justify-between items-center px-xl w-full h-full">
        {/* Brand / Search (Left) */}
        <div className="flex items-center gap-lg">
          <span className="font-section-heading text-section-heading font-bold text-on-surface">ML OPERATIONS</span>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-2 border-l border-border-hairline pl-md ml-sm">
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-border-hairline ml-2 cursor-pointer">
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfFL7O_6fGYdq7vtIrzhP1YebpEaVh5d1ZS84MULXS2yWJUcjmmxtGCY7V6KxvpbIqeF1J4iFGTK1hsJKWbcO_tAnS1gkUUTkx7ryg52Tw7Y0ih1UYZ8BpCQIUYaNXbS6n70dnX9xtT6aVb0WWbXvgI2etZ84UCAdBW_BZ8reYrckpu8oxp7OGh9jIu4pJuF8OnGVaXhGKcOCv-AFUpJBNoc_beNbvWNaen3qq3cwFrhT9ikA4GPsQvg" 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
