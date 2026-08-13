import { useState } from 'react';

export function ModelTimeMachine() {
  const [baselineModel, setBaselineModel] = useState<string | null>(null);
  const [comparisonModel, setComparisonModel] = useState<string | null>(null);

  const isSelected = baselineModel && comparisonModel;

  return (
    <div className="max-w-max-width-content mx-auto w-full flex flex-col gap-xxl mt-lg">
      {/* Page Header */}
      <div className="mb-xl flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-page-title text-page-title-mobile md:text-page-title text-on-surface mb-2">Model Time Machine</h2>
          <p className="font-body-base text-body-base text-ink-muted max-w-2xl">Compare how model versions change performance and predictions.</p>
        </div>
        <div className="flex gap-4 items-center">
          {/* Version Selectors */}
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-ink-muted">Baseline</label>
            <select 
              className="bg-surface border border-border-hairline rounded-lg px-4 py-2 text-body-sm focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none min-w-[140px]"
              value={baselineModel || ""}
              onChange={(e) => setBaselineModel(e.target.value)}
            >
              <option value="" disabled>Select baseline...</option>
              <option value="xgboost_v2">XGBoost v2</option>
              <option value="xgboost_v1">XGBoost v1</option>
            </select>
          </div>
          <div className="text-ink-muted mt-5">
            <span className="material-symbols-outlined">compare_arrows</span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-ink-muted">Comparison</label>
            <select 
              className="bg-surface border border-border-hairline rounded-lg px-4 py-2 text-body-sm focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none min-w-[140px]"
              value={comparisonModel || ""}
              onChange={(e) => setComparisonModel(e.target.value)}
            >
              <option value="" disabled>Select comparison...</option>
              <option value="xgboost_v3">XGBoost v3</option>
              <option value="xgboost_v2_1">XGBoost v2.1</option>
            </select>
          </div>
        </div>
      </div>

      {!isSelected ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 mt-lg bg-surface rounded-xl border border-border-hairline border-dashed">
          <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-ink-muted text-3xl">compare_arrows</span>
          </div>
          <h3 className="font-section-heading text-section-heading text-on-surface mb-2">Select Models to Compare</h3>
          <p className="font-body-base text-body-base text-ink-muted text-center max-w-md">
            Please choose a baseline model and a comparison model from the dropdowns above to analyze performance shifts and feature contribution changes.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch">
        {/* Performance Comparison (Span 2) */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border-hairline p-lg flex flex-col">
          <h3 className="font-feature-title text-feature-title mb-6">Performance Delta</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline">
                  <th className="py-3 font-label-caps text-label-caps text-ink-muted">Metric</th>
                  <th className="py-3 font-label-caps text-label-caps text-ink-muted">XGBoost v2</th>
                  <th className="py-3 font-label-caps text-label-caps text-ink-muted">XGBoost v3</th>
                  <th className="py-3 font-label-caps text-label-caps text-ink-muted text-right">Change</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                <tr className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                  <td className="py-4 font-semibold">Accuracy</td>
                  <td className="py-4">84.5%</td>
                  <td className="py-4">88.7%</td>
                  <td className="py-4 text-right text-accent-green font-semibold flex items-center justify-end gap-1"><span className="material-symbols-outlined text-sm">trending_up</span> +4.2%</td>
                </tr>
                <tr className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                  <td className="py-4 font-semibold">F1 Score</td>
                  <td className="py-4">0.82</td>
                  <td className="py-4">0.87</td>
                  <td className="py-4 text-right text-accent-green font-semibold flex items-center justify-end gap-1"><span className="material-symbols-outlined text-sm">trending_up</span> +0.05</td>
                </tr>
                <tr className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                  <td className="py-4 font-semibold">Recall</td>
                  <td className="py-4">79.1%</td>
                  <td className="py-4">78.5%</td>
                  <td className="py-4 text-right text-error font-semibold flex items-center justify-end gap-1"><span className="material-symbols-outlined text-sm">trending_down</span> -0.6%</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 font-semibold">Precision</td>
                  <td className="py-4">85.2%</td>
                  <td className="py-4">89.8%</td>
                  <td className="py-4 text-right text-accent-green font-semibold flex items-center justify-end gap-1"><span className="material-symbols-outlined text-sm">trending_up</span> +4.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Prediction Shift Card (Span 1) */}
        <div className="bg-surface rounded-xl border border-border-hairline p-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-feature-title text-feature-title">Prediction Shift</h3>
            <span className="bg-surface-container-low text-ink-muted px-2 py-1 rounded text-xs font-mono">ID: #052</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            {/* v2 Prediction */}
            <div className="p-4 border border-error-container bg-error-container/10 rounded-lg relative overflow-hidden group hover:scale-[0.98] transition-transform cursor-default">
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-error"></div>
              <p className="font-label-caps text-label-caps text-ink-muted mb-1">XGBoost v2</p>
              <div className="flex justify-between items-end">
                <p className="font-section-heading text-section-heading text-error">Rejected</p>
                <p className="font-body-sm text-body-sm text-ink-muted">Confidence: <span className="font-semibold text-on-surface">68%</span></p>
              </div>
            </div>
            <div className="flex justify-center -my-3 z-10">
              <div className="bg-surface border border-border-hairline rounded-full p-1 shadow-sm w-8 h-8 flex items-center justify-center">
                <span className="material-symbols-outlined text-ink-muted text-sm">arrow_downward</span>
              </div>
            </div>
            {/* v3 Prediction */}
            <div className="p-4 border border-accent-green/20 bg-accent-green/5 rounded-lg relative overflow-hidden group hover:scale-[0.98] transition-transform cursor-default">
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-accent-green"></div>
              <p className="font-label-caps text-label-caps text-ink-muted mb-1">XGBoost v3</p>
              <div className="flex justify-between items-end">
                <p className="font-section-heading text-section-heading text-accent-green">Approved</p>
                <p className="font-body-sm text-body-sm text-ink-muted">Confidence: <span className="font-semibold text-on-surface">89%</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Contribution Delta (Span 3) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-3 bg-surface rounded-xl border border-border-hairline p-lg">
            <h3 className="font-feature-title text-feature-title mb-6">Feature Contribution Delta</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-hairline">
                    <th className="py-3 font-label-caps text-label-caps text-ink-muted">Feature</th>
                    <th className="py-3 font-label-caps text-label-caps text-ink-muted">v2 Impact</th>
                    <th className="py-3 font-label-caps text-label-caps text-ink-muted">v3 Impact</th>
                    <th className="py-3 font-label-caps text-label-caps text-ink-muted text-right">Delta</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm">
                  <tr className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-mono">Income_Annual</td>
                    <td className="py-3"><div className="w-24 bg-surface-container-high h-2 rounded overflow-hidden"><div className="bg-primary h-full" style={{ width: '40%' }}></div></div></td>
                    <td className="py-3"><div className="w-24 bg-surface-container-high h-2 rounded overflow-hidden"><div className="bg-primary h-full" style={{ width: '75%' }}></div></div></td>
                    <td className="py-3 text-right text-accent-green">+0.35</td>
                  </tr>
                  <tr className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-mono">Credit_History_Length</td>
                    <td className="py-3"><div className="w-24 bg-surface-container-high h-2 rounded overflow-hidden"><div className="bg-primary h-full" style={{ width: '60%' }}></div></div></td>
                    <td className="py-3"><div className="w-24 bg-surface-container-high h-2 rounded overflow-hidden"><div className="bg-primary h-full" style={{ width: '55%' }}></div></div></td>
                    <td className="py-3 text-right text-error">-0.05</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-mono">Debt_to_Income_Ratio</td>
                    <td className="py-3"><div className="w-24 bg-surface-container-high h-2 rounded overflow-hidden"><div className="bg-error h-full" style={{ width: '80%' }}></div></div></td>
                    <td className="py-3"><div className="w-24 bg-surface-container-high h-2 rounded overflow-hidden"><div className="bg-error h-full" style={{ width: '65%' }}></div></div></td>
                    <td className="py-3 text-right text-accent-green">+0.15 (Less Negative)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Insight Card */}
          <div className="md:col-span-1 bg-primary-fixed/30 rounded-xl border border-primary-fixed p-lg flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <h4 className="font-feature-title text-feature-title text-on-surface">What changed?</h4>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Model v3 improved overall accuracy by <span className="font-bold text-accent-green">4.2%</span>. This was driven by a <span className="font-mono bg-surface/50 px-1 rounded text-xs">+0.35</span> increase in <span className="font-mono bg-surface/50 px-1 rounded text-xs">Income_Annual</span> impact, shifting Customer #052 from Rejected to Approved while reducing the penalty of the Debt ratio by <span className="font-mono bg-surface/50 px-1 rounded text-xs">0.15</span>.</p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
