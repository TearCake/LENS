import { Link } from 'react-router-dom';

export function TrainingProgress() {
  return (
    <div className="max-w-max-width-content mx-auto w-full mt-xxl flex flex-col gap-xxl">
      {/* Page Header */}
      <div className="mb-xl">
        <h2 className="font-page-title text-page-title md:font-page-title-mobile md:text-page-title-mobile font-bold text-on-background mb-2">Training Models</h2>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">LENS is training and evaluating your selected models.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Pipeline & Status (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          {/* Status Banner */}
          <div className="bg-surface border border-border-hairline rounded-xl p-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center relative">
                <span className="material-symbols-outlined text-primary text-[24px]">sync</span>
                {/* Simple CSS pulse animation for loading indicator */}
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20"></div>
              </div>
              <div>
                <div className="font-feature-title text-feature-title font-semibold text-on-surface">Run Status: <span className="font-mono text-primary">02:41</span></div>
                <div className="font-body-sm text-body-sm text-ink-muted">Models Completed: 1 / 3</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/experiment-results" className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined text-[18px]">visibility</span> View Results
              </Link>
              <button className="bg-surface border border-border-hairline hover:bg-surface-container-low text-error font-label-caps text-label-caps px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined text-[18px]">stop_circle</span> Stop Run
              </button>
            </div>
          </div>

          {/* Vertical Pipeline Card */}
          <div className="bg-surface border border-border-hairline rounded-xl p-lg relative overflow-hidden">
            <h3 className="font-section-heading text-section-heading font-bold mb-md text-on-surface">Execution Pipeline</h3>
            <div className="relative pl-6 py-4">
              {/* Vertical connecting line */}
              <div className="absolute left-[11px] top-[24px] bottom-[24px] w-[2px] bg-gradient-to-b from-accent-green via-primary to-border-hairline z-0"></div>
              <ul className="space-y-8 relative z-10">
                {/* Step 1: Dataset */}
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent-green text-on-primary flex items-center justify-center shrink-0 shadow-sm relative -left-[3px] top-1">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-body-base text-body-base font-semibold text-on-surface">Dataset Validation</p>
                    <p className="font-body-sm text-body-sm text-ink-muted">Customer_Churn_2023.csv (4.2 MB)</p>
                  </div>
                </li>
                {/* Step 2: Preprocessing */}
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent-green text-on-primary flex items-center justify-center shrink-0 shadow-sm relative -left-[3px] top-1">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-body-base text-body-base font-semibold text-on-surface">Preprocessing</p>
                    <p className="font-body-sm text-body-sm text-ink-muted">Imputation, Scaling, One-Hot Encoding</p>
                  </div>
                </li>
                {/* Step 3: Logistic Regression */}
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent-green text-on-primary flex items-center justify-center shrink-0 shadow-sm relative -left-[3px] top-1">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <div className="flex-1 bg-surface-bright border border-border-hairline rounded-lg p-3 -mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-body-base text-body-base font-semibold text-on-surface">Logistic Regression</p>
                      <span className="font-label-caps text-label-caps text-accent-green bg-accent-green/10 px-2 py-0.5 rounded">Completed</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-ink-muted font-mono">Accuracy: 0.842 | F1: 0.810</p>
                  </div>
                </li>
                {/* Step 4: Random Forest (Active) */}
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/40 relative -left-[3px] top-1 z-10">
                    <div className="absolute w-full h-full bg-primary rounded-full animate-ping opacity-75"></div>
                    <div className="w-2 h-2 bg-on-primary rounded-full relative z-20"></div>
                  </div>
                  <div className="flex-1 bg-surface-bright border border-border-hairline rounded-lg p-3 -mt-2 relative overflow-hidden">
                    {/* Progress bar background */}
                    <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full">
                      <div className="h-full bg-primary w-[60%] transition-all duration-1000"></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 mb-1">
                      <p className="font-body-base text-body-base font-semibold text-on-surface">Random Forest</p>
                      <span className="font-label-caps text-label-caps text-primary animate-pulse">Training</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-body-sm text-body-sm text-ink-muted font-mono">Building trees: 120 / 200</p>
                      <p className="font-body-sm text-body-sm text-ink-muted">~1m remaining</p>
                    </div>
                  </div>
                </li>
                {/* Step 5: XGBoost (Queued) */}
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-surface border-2 border-outline-variant flex items-center justify-center shrink-0 relative -left-[3px] top-1"></div>
                  <div className="flex-1 pt-1 opacity-50">
                    <p className="font-body-base text-body-base font-semibold text-on-surface">XGBoost</p>
                    <p className="font-body-sm text-body-sm text-ink-muted">Waiting in queue...</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: MLflow Panel (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Current Model Params */}
          <div className="bg-surface border border-border-hairline rounded-xl p-lg sticky top-[100px]">
            <div className="flex items-center gap-2 mb-md border-b border-border-hairline pb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              <h3 className="font-section-heading text-section-heading font-bold text-on-surface">Active Parameters</h3>
            </div>
            <p className="font-body-sm text-body-sm text-ink-muted mb-4">MLflow tracked hyperparameters for <strong className="text-on-surface">Random Forest</strong> currently executing.</p>
            <div className="space-y-0 border border-border-hairline rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 bg-surface-container-lowest border-b border-border-hairline">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">n_estimators</span>
                <span className="font-body-sm text-body-sm text-on-surface font-semibold bg-surface-container px-2 py-0.5 rounded">200</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-bright border-b border-border-hairline">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">max_depth</span>
                <span className="font-body-sm text-body-sm text-on-surface font-semibold bg-surface-container px-2 py-0.5 rounded">6</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-lowest">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">criterion</span>
                <span className="font-body-sm text-body-sm text-on-surface font-semibold bg-surface-container px-2 py-0.5 rounded">gini</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border-hairline">
              <a className="text-primary hover:text-on-primary-fixed-variant font-body-sm text-body-sm flex items-center gap-1 transition-colors" href="#">
                View in MLflow UI <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
