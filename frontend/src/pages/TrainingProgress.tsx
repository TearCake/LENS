import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api, type TrainingStatus } from '../api/client';

export function TrainingProgress() {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run_id');
  const [status, setStatus] = useState<TrainingStatus | null>(null);

  useEffect(() => {
    if (!runId) return;
    // Initial fetch
    api.getTrainingStatus(runId).then(setStatus).catch(console.error);
    
    const interval = setInterval(async () => {
      try {
        const data = await api.getTrainingStatus(runId);
        setStatus(data);
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [runId]);

  const progress = status?.progress || 0;
  const isFinished = status?.status === 'completed';
  const isFailed = status?.status === 'failed';
  const stepText = status?.current_step || 'Initializing...';
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
              <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${isFinished ? 'bg-accent-green/20' : isFailed ? 'bg-error/20' : 'bg-primary-fixed'}`}>
                {isFinished ? (
                   <span className="material-symbols-outlined text-accent-green text-[24px]">check_circle</span>
                ) : isFailed ? (
                   <span className="material-symbols-outlined text-error text-[24px]">error</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-primary text-[24px]">sync</span>
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20"></div>
                  </>
                )}
              </div>
              <div>
                <div className="font-feature-title text-feature-title font-semibold text-on-surface">
                  Run Status: <span className={`font-mono ${isFinished ? 'text-accent-green' : isFailed ? 'text-error' : 'text-primary'}`}>{status?.status || 'pending'}</span>
                </div>
                <div className="font-body-sm text-body-sm text-ink-muted">Run ID: {runId?.substring(0, 8)}...</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/experiment-results?run_id=${status?.results?.[0]?.run_id || runId}`} className={`font-label-caps text-label-caps px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center ${isFinished ? 'bg-primary text-on-primary' : 'bg-surface-container text-ink-muted pointer-events-none'}`}>
                <span className="material-symbols-outlined text-[18px]">visibility</span> View Results
              </Link>
            </div>
          </div>

          {/* Vertical Pipeline Card */}
          <div className="bg-surface border border-border-hairline rounded-xl p-lg relative overflow-hidden">
            <h3 className="font-section-heading text-section-heading font-bold mb-md text-on-surface">Execution Pipeline</h3>
            <div className="relative pl-6 py-4">
              <div className="absolute left-[11px] top-[24px] bottom-[24px] w-[2px] bg-gradient-to-b from-accent-green via-primary to-border-hairline z-0"></div>
              <ul className="space-y-8 relative z-10">
                {/* Current Active Step */}
                <li className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 relative -left-[3px] top-1 z-10 ${isFinished ? 'bg-accent-green text-on-primary' : isFailed ? 'bg-error text-on-primary' : 'bg-primary shadow-lg shadow-primary/40'}`}>
                    {isFinished ? (
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    ) : isFailed ? (
                      <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                    ) : (
                      <>
                        <div className="absolute w-full h-full bg-primary rounded-full animate-ping opacity-75"></div>
                        <div className="w-2 h-2 bg-on-primary rounded-full relative z-20"></div>
                      </>
                    )}
                  </div>
                  <div className="flex-1 bg-surface-bright border border-border-hairline rounded-lg p-3 -mt-2 relative overflow-hidden">
                    {/* Progress bar background */}
                    <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full">
                      <div className={`h-full transition-all duration-1000 ${isFinished ? 'bg-accent-green' : isFailed ? 'bg-error' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 mb-1">
                      <p className="font-body-base text-body-base font-semibold text-on-surface">{stepText}</p>
                      <span className={`font-label-caps text-label-caps ${isFinished ? 'text-accent-green' : isFailed ? 'text-error' : 'text-primary animate-pulse'}`}>
                        {progress}%
                      </span>
                    </div>
                    {isFailed && (
                      <div className="mt-2 text-error text-sm font-mono p-2 bg-error/10 rounded">
                        {status?.error}
                      </div>
                    )}
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
            <p className="font-body-sm text-body-sm text-ink-muted mb-4">MLflow hyperparameters are actively being logged.</p>
            {isFinished && status?.results && (
              <div className="space-y-0 border border-border-hairline rounded-lg overflow-hidden">
                {status.results.map((r: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-surface-bright border-b border-border-hairline">
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">{r.model_name}</span>
                    <span className="font-body-sm text-body-sm text-accent-green font-semibold bg-accent-green/10 px-2 py-0.5 rounded">Completed</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-border-hairline">
              <a className="text-primary hover:text-on-primary-fixed-variant font-body-sm text-body-sm flex items-center gap-1 transition-colors" href="http://localhost:5000" target="_blank" rel="noreferrer">
                View in MLflow UI <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
