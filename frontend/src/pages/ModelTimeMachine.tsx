import { useState, useEffect } from 'react';
import { api, type Experiment, type ModelComparison } from '../api/client';

export function ModelTimeMachine() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [baselineModel, setBaselineModel] = useState<string | null>(null);
  const [comparisonModel, setComparisonModel] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<ModelComparison | null>(null);

  useEffect(() => {
    api.getExperiments().then(data => {
      // Only keep completed/finished runs
      setExperiments(data.filter(d => d.status && (d.status.toUpperCase() === 'FINISHED' || d.status.toUpperCase() === 'COMPLETED')));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (baselineModel && comparisonModel) {
      api.compareModels(baselineModel, comparisonModel)
        .then(setComparisonData)
        .catch(console.error);
    }
  }, [baselineModel, comparisonModel]);

  const isSelected = baselineModel && comparisonModel && comparisonData;

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
              {experiments.map(e => (
                <option key={e.run_id} value={e.run_id}>{e.model_name} ({e.run_id.substring(0,6)})</option>
              ))}
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
              {experiments.map(e => (
                <option key={e.run_id} value={e.run_id}>{e.model_name} ({e.run_id.substring(0,6)})</option>
              ))}
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
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-feature-title text-feature-title text-on-surface">Performance Delta</h3>
            <span className="font-label-caps text-label-caps text-ink-muted">Comparison Metrics</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline">
                  <th className="py-3 font-label-caps text-label-caps text-ink-muted">Metric</th>
                  <th className="py-3 font-label-caps text-label-caps text-ink-muted">
                    {comparisonData?.version_a?.model_name || 'Baseline'} ({baselineModel?.substring(0, 6)})
                  </th>
                  <th className="py-3 font-label-caps text-label-caps text-ink-muted">
                    {comparisonData?.version_b?.model_name || 'Comparison'} ({comparisonModel?.substring(0, 6)})
                  </th>
                  <th className="py-3 font-label-caps text-label-caps text-ink-muted text-right">Change</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                {Object.entries(comparisonData?.performance_delta || {}).map(([metric, delta]) => {
                  const baseVal = comparisonData?.version_a?.metrics?.[metric];
                  const compVal = comparisonData?.version_b?.metrics?.[metric];
                  const isPositive = delta > 0;
                  const isNegative = delta < 0;
                  const isPct = metric.includes('acc') || metric.includes('score');
                  
                  return (
                    <tr key={metric} className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                      <td className="py-4 font-semibold capitalize text-on-surface">{metric.replace(/_/g, ' ')}</td>
                      <td className="py-4 text-on-surface-variant font-mono">
                        {baseVal !== undefined && baseVal !== null ? (isPct ? `${(baseVal * 100).toFixed(1)}%` : Number(baseVal).toFixed(3)) : '--'}
                      </td>
                      <td className="py-4 text-on-surface-variant font-mono">
                        {compVal !== undefined && compVal !== null ? (isPct ? `${(compVal * 100).toFixed(1)}%` : Number(compVal).toFixed(3)) : '--'}
                      </td>
                      <td className={`py-4 text-right font-semibold flex items-center justify-end gap-1 ${isPositive ? 'text-accent-green' : isNegative ? 'text-error' : 'text-ink-muted'}`}>
                        {isPositive ? <span className="material-symbols-outlined text-sm">trending_up</span> : isNegative ? <span className="material-symbols-outlined text-sm">trending_down</span> : <span className="material-symbols-outlined text-sm">horizontal_rule</span>}
                        {delta > 0 ? '+' : ''}{isPct ? `${(delta * 100).toFixed(1)}%` : Number(delta).toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prediction Shift Card (Span 1) */}
        <div className="bg-surface rounded-xl border border-border-hairline p-lg flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-feature-title text-feature-title text-on-surface">Model Overview</h3>
            <span className="bg-surface-container-low text-ink-muted px-2 py-0.5 rounded text-xs font-mono">Comparing 2 Models</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-4 py-2">
            {/* Baseline Model Box */}
            <div className="p-4 border border-border-hairline bg-surface-container-lowest rounded-lg relative overflow-hidden group hover:border-primary/40 transition-colors">
              <p className="font-label-caps text-label-caps text-ink-muted mb-1">Baseline Model</p>
              <div className="flex justify-between items-end">
                <p className="font-section-heading text-section-heading font-semibold text-on-surface capitalize">{comparisonData?.version_a?.model_name || 'Model A'}</p>
                <p className="font-body-sm text-body-sm text-ink-muted font-mono">
                  Acc: <span className="font-semibold text-on-surface">{((comparisonData?.version_a?.metrics?.accuracy || 0) * 100).toFixed(1)}%</span>
                </p>
              </div>
            </div>

            <div className="flex justify-center -my-2 z-10">
              <div className="bg-surface border border-border-hairline rounded-full p-1 shadow-sm w-7 h-7 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xs">swap_vert</span>
              </div>
            </div>

            {/* Comparison Model Box */}
            <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg relative overflow-hidden group hover:border-primary/40 transition-colors">
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary"></div>
              <p className="font-label-caps text-label-caps text-primary mb-1">Comparison Model</p>
              <div className="flex justify-between items-end">
                <p className="font-section-heading text-section-heading font-semibold text-primary capitalize">{comparisonData?.version_b?.model_name || 'Model B'}</p>
                <p className="font-body-sm text-body-sm text-ink-muted font-mono">
                  Acc: <span className="font-semibold text-on-surface">{((comparisonData?.version_b?.metrics?.accuracy || 0) * 100).toFixed(1)}%</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Contribution Delta (Span 3) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-gutter items-start">
          <div className="md:col-span-3 bg-surface rounded-xl border border-border-hairline p-lg">
            <h3 className="font-feature-title text-feature-title text-on-surface mb-6">Feature Contribution Delta</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-hairline">
                    <th className="py-3 font-label-caps text-label-caps text-ink-muted">Feature</th>
                    <th className="py-3 font-label-caps text-label-caps text-ink-muted">
                      {comparisonData?.version_a?.model_name || 'Baseline'}
                    </th>
                    <th className="py-3 font-label-caps text-label-caps text-ink-muted">
                      {comparisonData?.version_b?.model_name || 'Comparison'}
                    </th>
                    <th className="py-3 font-label-caps text-label-caps text-ink-muted text-right">Delta</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm">
                  {comparisonData?.feature_contribution_delta && comparisonData.feature_contribution_delta.length > 0 ? (
                    comparisonData.feature_contribution_delta.map((f, idx) => {
                      const isPositive = f.delta > 0;
                      return (
                        <tr key={idx} className="border-b border-border-hairline hover:bg-surface-container-low transition-colors">
                          <td className="py-3 font-mono truncate max-w-[200px] text-on-surface" title={f.feature}>
                            {f.feature.replace(/^num__|^cat__/, '')}
                          </td>
                          <td className="py-3 font-mono text-ink-muted">{f.baseline.toFixed(3)}</td>
                          <td className="py-3 font-mono text-ink-muted">{f.comparison.toFixed(3)}</td>
                          <td className={`py-3 text-right font-mono font-semibold ${isPositive ? 'text-accent-green' : 'text-error'}`}>
                            {f.delta > 0 ? '+' : ''}{f.delta.toFixed(3)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-ink-muted font-body-sm">
                        No feature contribution shifts found between selected models.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* What changed? Insight Card - height fit to inside text content */}
          <div className="md:col-span-1 bg-primary-fixed/20 rounded-xl border border-primary-fixed/40 p-lg flex flex-col h-fit self-start shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
              <h4 className="font-feature-title text-feature-title text-on-surface text-base font-semibold">What changed?</h4>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-3">
              Comparing <strong className="text-on-surface capitalize">{comparisonData?.version_a?.model_name || 'Baseline'}</strong> vs <strong className="text-primary capitalize">{comparisonData?.version_b?.model_name || 'Comparison'}</strong> across {comparisonData?.feature_contribution_delta?.length || 0} features.
            </p>
            {(() => {
              const baseAcc = comparisonData?.version_a?.metrics?.accuracy || 0;
              const compAcc = comparisonData?.version_b?.metrics?.accuracy || 0;
              const diff = (compAcc - baseAcc) * 100;
              return (
                <div className="p-3 bg-surface rounded-lg border border-border-hairline text-xs text-ink-muted leading-relaxed">
                  <span className="font-medium text-on-surface">Accuracy Delta: </span>
                  <span className={diff >= 0 ? 'text-accent-green font-bold' : 'text-error font-bold'}>
                    {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                  </span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
