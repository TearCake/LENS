import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { api, type DashboardStats, type Experiment } from '../api/client';

export function OverviewDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const res = await api.uploadDataset(file);
      navigate(`/create-experiment?dataset_id=${res.dataset_id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to upload dataset');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, expData] = await Promise.all([
          api.getDashboardStats(),
          api.getExperiments()
        ]);
        setStats(statsData);
        // Sort descending by start time, grab top 5
        const sorted = expData.sort((a, b) => b.start_time - a.start_time).slice(0, 5);
        setExperiments(sorted);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-max-width-content mx-auto w-full flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-max-width-content mx-auto w-full flex flex-col gap-xxl mt-lg">
      {/* Page Header & Actions */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <h2 className="font-page-title text-page-title text-on-surface mb-2">Overview Dashboard</h2>
          <p className="font-body-base text-body-base text-ink-muted max-w-2xl">
            Understand your models. Track your experiments. Explain every prediction.
          </p>
        </div>
        <div className="flex items-center gap-md shrink-0">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="font-body-base text-body-base font-medium px-6 py-2.5 rounded-lg border border-border-hairline bg-surface text-primary hover:bg-surface-container-low transition-colors interactive-scale inline-block disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? <span className="material-symbols-outlined text-[18px] animate-spin">sync</span> : <span className="material-symbols-outlined text-[18px]">upload_file</span>}
            Upload Dataset
          </button>
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Metric 1 */}
        <div className="bg-surface border border-border-hairline p-lg flex flex-col gap-2 rounded-lg">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="material-symbols-outlined text-[20px]">flip_camera_ios</span>
            <span className="font-label-caps text-label-caps">ACTIVE EXPERIMENTS</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface mt-1">{stats?.metrics.active_experiments || 0}</div>
          <div className="font-body-sm text-body-sm text-accent-green mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> Live
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface border border-border-hairline p-lg flex flex-col gap-2 rounded-lg">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="material-symbols-outlined text-[20px]">hub</span>
            <span className="font-label-caps text-label-caps">TOTAL MODELS</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface mt-1">{stats?.metrics.total_models || 0}</div>
          <div className="font-body-sm text-body-sm text-ink-muted mt-2">Finished training</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface border border-border-hairline p-lg flex flex-col gap-2 rounded-lg">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="material-symbols-outlined text-[20px]">military_tech</span>
            <span className="font-label-caps text-label-caps">SUCCESS RATE</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface mt-1">{stats?.metrics.success_rate || 0}<span className="text-3xl">%</span></div>
          <div className="font-body-sm text-body-sm text-ink-muted mt-2">Completed without errors</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface border border-border-hairline p-lg flex flex-col gap-2 rounded-lg">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="material-symbols-outlined text-[20px]">database</span>
            <span className="font-label-caps text-label-caps">STORAGE HEALTH</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface mt-1">{stats?.health.storage_used_mb || 0}<span className="text-3xl">MB</span></div>
          <div className="font-body-sm text-body-sm text-ink-muted mt-2 flex items-center gap-2">
            MLflow <span className={`w-2 h-2 rounded-full ${stats?.health.mlflow === 'online' ? 'bg-accent-green' : 'bg-error'}`}></span>
          </div>
        </div>
      </section>

      {/* Mixed Layout: Charts and Quick Start */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Left Col (Span 2): Model Performance Chart */}
        <section className="lg:col-span-2 bg-surface border border-border-hairline rounded-xl p-lg flex flex-col">
          <h3 className="font-feature-title text-feature-title text-on-surface mb-6">Top Model Performance</h3>
          <div className="flex-1 flex flex-col justify-end gap-6 pb-2">
            {/* Bar 1 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="font-medium text-on-surface">XGBoost (Prod)</span>
                <span className="font-bold text-primary">95.4%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '95.4%' }}></div>
              </div>
            </div>

            {/* Bar 2 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="font-medium text-on-surface">Random Forest</span>
                <span className="font-bold text-accent-teal">92.1%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-accent-teal rounded-full" style={{ width: '92.1%' }}></div>
              </div>
            </div>

            {/* Bar 3 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="font-medium text-on-surface">Logistic Regression</span>
                <span className="font-bold text-outline">88.5%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-outline rounded-full" style={{ width: '88.5%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Col: Quick Start Actions */}
        <section className="flex flex-col gap-md">
          <h3 className="font-feature-title text-feature-title text-on-surface mb-2">Quick Start</h3>

          <Link to="/create-experiment" className="bg-surface border border-border-hairline p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors text-left interactive-scale group rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
              <span className="material-symbols-outlined">play_arrow</span>
            </div>
            <div>
              <h4 className="font-body-base text-body-base font-medium text-on-surface group-hover:text-primary transition-colors">Train a Model</h4>
              <p className="font-body-sm text-body-sm text-ink-muted mt-0.5">Start a new training pipeline</p>
            </div>
          </Link>

          <Link to="/explainability" className="bg-surface border border-border-hairline p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors text-left interactive-scale group rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-accent-purple bg-opacity-20 flex items-center justify-center text-on-secondary-container shrink-0">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <div>
              <h4 className="font-body-base text-body-base font-medium text-on-surface group-hover:text-primary transition-colors">Explain a Prediction</h4>
              <p className="font-body-sm text-body-sm text-ink-muted mt-0.5">Run SHAP or LIME analysis</p>
            </div>
          </Link>

          <Link to="/time-machine" className="bg-surface border border-border-hairline p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors text-left interactive-scale group rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shrink-0">
              <span className="material-symbols-outlined">compare_arrows</span>
            </div>
            <div>
              <h4 className="font-body-base text-body-base font-medium text-on-surface group-hover:text-primary transition-colors">Compare Models</h4>
              <p className="font-body-sm text-body-sm text-ink-muted mt-0.5">Evaluate metrics side-by-side</p>
            </div>
          </Link>
        </section>
      </div>

      {/* Recent Experiments Table */}
      <section className="bg-surface border border-border-hairline rounded-xl overflow-hidden flex flex-col">
        <div className="p-lg border-b border-border-hairline flex justify-between items-center">
          <h3 className="font-feature-title text-feature-title text-on-surface">Recent Experiments</h3>
          <button className="font-body-sm text-body-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-border-hairline">
                <th className="py-3 px-6 font-label-caps text-label-caps text-ink-muted font-medium">Experiment</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-ink-muted font-medium">Model</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-ink-muted font-medium">Dataset</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-ink-muted font-medium">Accuracy</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-ink-muted font-medium">F1 Score</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-ink-muted font-medium">Status</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-ink-muted font-medium text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-border-hairline">
              {experiments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ink-muted">No recent experiments found.</td>
                </tr>
              ) : (
                experiments.map((exp) => (
                  <tr key={exp.run_id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-6 font-medium text-on-surface font-mono text-xs">{exp.run_id.substring(0, 8)}...</td>
                    <td className="py-4 px-6">{exp.model_name}</td>
                    <td className="py-4 px-6 text-ink-muted">{exp.dataset_id}</td>
                    <td className="py-4 px-6">{exp.accuracy ? (exp.accuracy * 100).toFixed(1) + '%' : '--'}</td>
                    <td className="py-4 px-6">{exp.f1_score ? exp.f1_score.toFixed(3) : '--'}</td>
                    <td className="py-4 px-6">
                      {exp.status?.toUpperCase() === 'FINISHED' || exp.status?.toUpperCase() === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent-green bg-opacity-10 text-accent-green text-[12px] font-medium border border-accent-green border-opacity-20">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span> Completed
                        </span>
                      ) : exp.status?.toUpperCase() === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-error bg-opacity-10 text-error text-[12px] font-medium border border-error border-opacity-20">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary bg-opacity-10 text-primary text-[12px] font-medium border border-primary border-opacity-20">
                          <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> Running
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right text-ink-muted">
                      {new Date(exp.start_time).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
