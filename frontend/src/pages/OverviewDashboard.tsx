import { Link } from 'react-router-dom';

export function OverviewDashboard() {
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
          <Link to="/create-experiment" className="font-body-base text-body-base font-medium px-6 py-2.5 rounded-lg border border-border-hairline bg-surface text-primary hover:bg-surface-container-low transition-colors interactive-scale inline-block">
            Upload Dataset
          </Link>
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Metric 1 */}
        <div className="bg-surface border border-border-hairline p-lg flex flex-col gap-2 rounded-lg">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="material-symbols-outlined text-[20px]">flip_camera_ios</span>
            <span className="font-label-caps text-label-caps">EXPERIMENTS</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface mt-1">48</div>
          <div className="font-body-sm text-body-sm text-accent-green mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> +12 this week
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface border border-border-hairline p-lg flex flex-col gap-2 rounded-lg">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="material-symbols-outlined text-[20px]">hub</span>
            <span className="font-label-caps text-label-caps">MODELS</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface mt-1">12</div>
          <div className="font-body-sm text-body-sm text-ink-muted mt-2">3 in production</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface border border-border-hairline p-lg flex flex-col gap-2 rounded-lg">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="material-symbols-outlined text-[20px]">military_tech</span>
            <span className="font-label-caps text-label-caps">BEST ACCURACY</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface mt-1">95.4<span className="text-3xl">%</span></div>
          <div className="font-body-sm text-body-sm text-ink-muted mt-2">XGBoost-V4 (Prod)</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface border border-border-hairline p-lg flex flex-col gap-2 rounded-lg">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="material-symbols-outlined text-[20px]">database</span>
            <span className="font-label-caps text-label-caps">DATASETS</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface mt-1">6</div>
          <div className="font-body-sm text-body-sm text-ink-muted mt-2">124GB total volume</div>
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
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-6 font-medium text-on-surface">EXP-204</td>
                <td className="py-4 px-6">XGBoost</td>
                <td className="py-4 px-6 text-ink-muted">customer_churn_q3</td>
                <td className="py-4 px-6">95.4%</td>
                <td className="py-4 px-6">0.92</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent-green bg-opacity-10 text-accent-green text-[12px] font-medium border border-accent-green border-opacity-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span> Completed
                  </span>
                </td>
                <td className="py-4 px-6 text-right text-ink-muted">2 hrs ago</td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-6 font-medium text-on-surface">EXP-203</td>
                <td className="py-4 px-6">Random Forest</td>
                <td className="py-4 px-6 text-ink-muted">customer_churn_q3</td>
                <td className="py-4 px-6">92.1%</td>
                <td className="py-4 px-6">0.89</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent-green bg-opacity-10 text-accent-green text-[12px] font-medium border border-accent-green border-opacity-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span> Completed
                  </span>
                </td>
                <td className="py-4 px-6 text-right text-ink-muted">5 hrs ago</td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-6 font-medium text-on-surface">EXP-202</td>
                <td className="py-4 px-6">Neural Net (Deep)</td>
                <td className="py-4 px-6 text-ink-muted">image_classify_v2</td>
                <td className="py-4 px-6 text-ink-muted">--</td>
                <td className="py-4 px-6 text-ink-muted">--</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary bg-opacity-10 text-primary text-[12px] font-medium border border-primary border-opacity-20">
                    <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> Running
                  </span>
                </td>
                <td className="py-4 px-6 text-right text-ink-muted">12 hrs ago</td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-6 font-medium text-on-surface">EXP-201</td>
                <td className="py-4 px-6">Logistic Regression</td>
                <td className="py-4 px-6 text-ink-muted">sales_forecast_24</td>
                <td className="py-4 px-6">88.5%</td>
                <td className="py-4 px-6">0.81</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-error bg-opacity-10 text-error text-[12px] font-medium border border-error border-opacity-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Failed
                  </span>
                </td>
                <td className="py-4 px-6 text-right text-ink-muted">1 day ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
