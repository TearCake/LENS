import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const navItems = [
    { name: 'Overview', path: '/overview', icon: 'grid_view' },
    { name: 'Experiments', path: '/create-experiment', icon: 'science' },
    { name: 'History', path: '/history', icon: 'history' },
    { name: 'Explainability', path: '/explainability', icon: 'lightbulb' },
    { name: 'Models', path: '/time-machine', icon: 'hub' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-[260px] border-r border-border-hairline bg-surface flex flex-col py-lg z-20">
      {/* Brand/Header */}
      <div className="px-lg pb-md flex items-center gap-sm">
        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary">lens</span>
        </div>
        <div>
          <h1 className="font-page-title text-section-heading font-black text-primary tracking-tight">LENS</h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Learning System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 mt-lg flex flex-col gap-base">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-sm rounded-r-lg font-body-base text-body-base transition-colors ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container border-r-4 border-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span 
                  className="material-symbols-outlined" 
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer Links */}
      <div className="flex flex-col gap-base mt-auto">
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors font-body-base text-body-base mx-sm rounded-r-lg" href="#">
          <span className="material-symbols-outlined">help</span>
          Help
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors font-body-base text-body-base mx-sm rounded-r-lg" href="#">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </a>
      </div>
    </nav>
  );
}
