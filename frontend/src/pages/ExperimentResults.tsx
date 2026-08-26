import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api, type Experiment } from '../api/client';

export function ExperimentResults() {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run_id');
  const [experiment, setExperiment] = useState<Experiment | null>(null);

  useEffect(() => {
    if (!runId) return;
    api.getExperimentDetails(runId).then(setExperiment).catch(console.error);
  }, [runId]);
  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header Section */}
      <div className="mb-xxl">
        <div className="flex items-center gap-2 font-body-sm text-body-sm text-ink-muted mb-sm">
          <a className="hover:text-primary transition-colors" href="#">Experiments</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-mono">{runId?.substring(0, 8)}...</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-page-title text-page-title text-on-surface mb-md">Experiment Results</h1>
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-sm font-label-caps text-label-caps bg-[rgba(0,117,222,0.1)] text-primary">{experiment?.dataset_id || 'Dataset'}</span>
              <span className={`px-3 py-1 rounded-sm font-label-caps text-label-caps flex items-center gap-1 ${(experiment?.status?.toUpperCase() === 'FINISHED' || experiment?.status?.toUpperCase() === 'COMPLETED') ? 'bg-[rgba(26,174,57,0.1)] text-accent-green' : 'bg-surface-container text-ink-muted'}`}>
                <span className="material-symbols-outlined text-[14px]">check_circle</span> {experiment?.status || 'Unknown'}
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
                  <th className="py-3 px-4 font-label-caps text-label-caps text-ink-muted text-right">F1 Score</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                {(experiment?.models && experiment.models.length > 0 ? experiment.models : [experiment]).map((m, idx) => {
                  if (!m) return null;
                  const isChampion = idx === 0;
                  return (
                    <tr 
                      key={m.run_id || idx} 
                      className={`border-b border-border-hairline hover:bg-surface-container-low transition-colors group ${isChampion ? 'bg-[rgba(0,117,222,0.03)] border-l-2 border-l-primary' : ''}`}
                    >
                      <td className="py-4 px-4 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isChampion ? 'bg-primary' : 'bg-ink-muted'}`}></div>
                        <span className={`font-semibold ${isChampion ? 'text-on-surface' : 'text-ink-muted'}`}>{m.model_name || 'Loading...'}</span>
                        {isChampion && (
                          <span className="px-2 py-0.5 rounded-sm bg-primary-container text-on-primary-container font-label-caps text-[10px] ml-2">CHAMPION</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-on-surface">{m.accuracy !== null && m.accuracy !== undefined ? (m.accuracy * 100).toFixed(1) + '%' : '--'}</td>
                      <td className="py-4 px-4 text-right font-semibold text-primary">{m.f1_score !== null && m.f1_score !== undefined ? m.f1_score.toFixed(3) : '--'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SHAP Plot (Left Column) */}
        <div className="col-span-12 md:col-span-7 bg-surface rounded-lg border border-border-hairline p-lg flex flex-col min-h-[400px]">
          <h2 className="font-feature-title text-feature-title text-on-surface mb-sm">SHAP Summary Plot</h2>
          <p className="font-body-sm text-body-sm text-ink-muted mb-lg">Feature importance based on champion model evaluation.</p>
          <div className="flex-grow relative flex items-center justify-center bg-surface-container-lowest rounded-lg border border-border-hairline p-4">
            {runId ? (
              <img 
                src={`http://localhost:8000/api/experiments/${experiment?.run_id || runId}/artifacts/shap_summary.png`} 
                alt="SHAP Plot" 
                className="max-w-full max-h-[320px] object-contain rounded" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent && !parent.querySelector('.shap-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'text-ink-muted font-body-sm shap-fallback';
                    fallback.innerText = 'SHAP Summary Plot generated and stored in MLflow artifacts.';
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="text-ink-muted font-body-sm">Plot unavailable</div>
            )}
          </div>
        </div>

        {/* Feature Importance (Right Column) */}
        <div className="col-span-12 md:col-span-5 bg-surface rounded-lg border border-border-hairline p-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-md">
              <h2 className="font-feature-title text-feature-title text-on-surface">Top 5 Features</h2>
              <span className="px-2 py-1 bg-surface-container-low rounded text-ink-muted font-label-caps text-[10px]">SHAP VALUES</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {experiment?.top_features && experiment.top_features.length > 0 ? (
                (() => {
                  const maxImp = Math.max(...experiment.top_features.map(f => f.importance), 0.001);
                  return experiment.top_features.map((feat, idx) => {
                    const widthPct = Math.max(10, Math.min(100, (feat.importance / maxImp) * 100));
                    return (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-body-sm">
                          <span className="font-medium text-on-surface truncate max-w-[200px]" title={feat.feature}>
                            {feat.feature.replace(/^num__|^cat__/, '')}
                          </span>
                          <span className="font-semibold text-primary">+{feat.importance.toFixed(3)}</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ width: `${widthPct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  });
                })()
              ) : (
                <div className="text-ink-muted font-body-sm text-center py-8">
                  Loading top features...
                </div>
              )}
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
