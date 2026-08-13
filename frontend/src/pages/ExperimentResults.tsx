import { Link } from 'react-router-dom';

export function ExperimentResults() {
  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header Section */}
      <div className="mb-xxl">
        <div className="flex items-center gap-2 font-body-sm text-body-sm text-ink-muted mb-sm">
          <a className="hover:text-primary transition-colors" href="#">Experiments</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface">Run #28491</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-page-title text-page-title text-on-surface mb-md">Experiment Results</h1>
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-sm font-label-caps text-label-caps bg-[rgba(0,117,222,0.1)] text-primary">Loan Risk Classification</span>
              <span className="px-3 py-1 rounded-sm font-label-caps text-label-caps bg-[rgba(26,174,57,0.1)] text-accent-green flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Completed
              </span>
            </div>
          </div>
          <div className="flex gap-4 font-body-sm text-body-sm text-ink-muted bg-surface px-4 py-3 rounded-lg border border-border-hairline">
            <div className="flex items-center gap-2 border-r border-border-hairline pr-4">
              <span className="material-symbols-outlined text-[18px]">dns</span>
              <span>Env: <strong className="text-on-surface font-medium">local-ml</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">track_changes</span>
              <span>Tracking: <strong className="text-on-surface font-medium">MLflow</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Model Comparison Table (Full Width) */}
        <div className="col-span-12 bg-surface rounded-lg border border-border-hairline p-lg">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-feature-title text-feature-title text-on-surface">Model Comparison</h2>
            <button className="font-label-caps text-label-caps text-primary flex items-center gap-1 hover:underline">
              Export CSV <span className="material-symbols-outlined text-[16px]">download</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline">
                  <th className="py-3 px-4 font-label-caps text-label-caps text-ink-muted">Model Architecture</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-ink-muted text-right">Accuracy</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-ink-muted text-right">Precision</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-ink-muted text-right">Recall</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-ink-muted text-right">F1 Score</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-ink-muted text-right">Training Time</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                <tr className="border-b border-border-hairline hover:bg-surface-container-low transition-colors group bg-[rgba(0,117,222,0.03)] border-l-2 border-l-primary">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="font-semibold text-on-surface">XGBoost Classifier v2.1</span>
                    <span className="px-2 py-0.5 rounded-sm bg-primary-container text-on-primary-container font-label-caps text-[10px] ml-2">CHAMPION</span>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-on-surface">0.942</td>
                  <td className="py-4 px-4 text-right">0.938</td>
                  <td className="py-4 px-4 text-right">0.951</td>
                  <td className="py-4 px-4 text-right font-semibold text-primary">0.944</td>
                  <td className="py-4 px-4 text-right text-ink-muted">14m 23s</td>
                </tr>
                <tr className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></div>
                    <span className="text-on-surface-variant">Random Forest (Baseline)</span>
                  </td>
                  <td className="py-4 px-4 text-right">0.915</td>
                  <td className="py-4 px-4 text-right">0.920</td>
                  <td className="py-4 px-4 text-right">0.899</td>
                  <td className="py-4 px-4 text-right">0.909</td>
                  <td className="py-4 px-4 text-right text-ink-muted">8m 45s</td>
                </tr>
                <tr className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></div>
                    <span className="text-on-surface-variant">Logistic Regression</span>
                  </td>
                  <td className="py-4 px-4 text-right">0.864</td>
                  <td className="py-4 px-4 text-right">0.855</td>
                  <td className="py-4 px-4 text-right">0.840</td>
                  <td className="py-4 px-4 text-right">0.847</td>
                  <td className="py-4 px-4 text-right text-ink-muted">1m 12s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Comparison Chart (Left Column) */}
        <div className="col-span-12 md:col-span-7 bg-surface rounded-lg border border-border-hairline p-lg flex flex-col min-h-[400px]">
          <h2 className="font-feature-title text-feature-title text-on-surface mb-sm">ROC Curve Comparison</h2>
          <p className="font-body-sm text-body-sm text-ink-muted mb-lg">True Positive Rate vs. False Positive Rate across evaluated models.</p>
          <div className="flex-grow relative border-l border-b border-border-hairline mt-4 ml-6 mb-6">
            {/* Y-Axis Labels */}
            <div className="absolute -left-8 top-0 font-label-caps text-[10px] text-ink-muted">1.0</div>
            <div className="absolute -left-8 top-[50%] font-label-caps text-[10px] text-ink-muted translate-y-[-50%]">0.5</div>
            <div className="absolute -left-8 bottom-0 font-label-caps text-[10px] text-ink-muted">0.0</div>
            {/* X-Axis Labels */}
            <div className="absolute -bottom-6 left-0 font-label-caps text-[10px] text-ink-muted">0.0</div>
            <div className="absolute -bottom-6 left-[50%] font-label-caps text-[10px] text-ink-muted translate-x-[-50%]">0.5</div>
            <div className="absolute -bottom-6 right-0 font-label-caps text-[10px] text-ink-muted">1.0</div>
            {/* Grid Lines */}
            <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #E6E6E6 1px, transparent 1px), linear-gradient(to bottom, #E6E6E6 1px, transparent 1px)', backgroundSize: '25% 25%', opacity: 0.3 }}></div>
            {/* Diagonal Reference Line */}
            {/* Simulated Chart Lines (SVG for crispness) */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* XGBoost (Primary) */}
              <path className="drop-shadow-sm" d="M0,100 C5,50 20,10 100,0" fill="none" stroke="#0075de" strokeWidth="2.5"></path>
              {/* Random Forest */}
              <path d="M0,100 C10,60 30,20 100,5" fill="none" stroke="#7a7571" strokeDasharray="4 2" strokeWidth="1.5"></path>
              {/* Logistic Regression */}
              <path d="M0,100 C20,70 40,30 100,15" fill="none" stroke="#ccc5c0" strokeWidth="1.5"></path>
            </svg>
          </div>
          <div className="flex justify-center gap-md mt-4">
            <div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface">
              <div className="w-3 h-1 bg-primary rounded-full"></div> XGBoost (AUC 0.98)
            </div>
            <div className="flex items-center gap-2 font-label-caps text-[11px] text-on-surface">
              <div className="w-3 h-1 bg-tertiary-container rounded-full border-dashed border-t-2"></div> Random Forest (AUC 0.94)
            </div>
          </div>
        </div>

        {/* Feature Importance (Right Column) */}
        <div className="col-span-12 md:col-span-5 bg-surface rounded-lg border border-border-hairline p-lg flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-feature-title text-feature-title text-on-surface">Top 5 Features</h2>
            <span className="px-2 py-1 bg-surface-container-low rounded text-ink-muted font-label-caps text-[10px]">SHAP VALUES</span>
          </div>
          <div className="flex-grow flex flex-col justify-center gap-md mt-sm">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm font-medium text-on-surface">credit_score_history</span>
                  <span className="text-body-sm font-bold text-primary">0.42</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full chart-bar-fill transition-all duration-1000" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm font-medium text-on-surface">debt_to_income_ratio</span>
                  <span className="text-body-sm font-bold text-on-surface-variant">0.28</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container rounded-full chart-bar-fill transition-all duration-1000" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm font-medium text-on-surface">annual_income</span>
                  <span className="text-body-sm font-bold text-on-surface-variant">0.19</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-outline-variant rounded-full chart-bar-fill transition-all duration-1000" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm font-medium text-on-surface">employment_length</span>
                  <span className="text-body-sm font-bold text-on-surface-variant">0.11</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-outline-variant rounded-full chart-bar-fill transition-all duration-1000" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm font-medium text-on-surface">num_open_accounts</span>
                  <span className="text-body-sm font-bold text-on-surface-variant">0.05</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-outline-variant rounded-full chart-bar-fill transition-all duration-1000" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <Link className="mt-xl font-label-caps text-label-caps text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center justify-center gap-1 w-full py-3 border border-border-hairline rounded-lg hover:bg-surface-container-low group" to="/explainability">
            View Full Explanation <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
