import { useState } from 'react';
import { ExperimentTable } from '../components/experiments/ExperimentTable';

export function ExplainabilityWorkspace() {
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-sm mt-lg">
      <section className="flex flex-col gap-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-page-title text-on-surface mb-2">Explainability</h2>
            <p className="font-body-base text-body-base text-on-surface-variant mt-1 max-w-2xl">Understand why the model makes its predictions.</p>
          </div>
        </div>
      </section>

      <ExperimentTable 
        actionType="select" 
        selectedId={selectedExperiment} 
        onSelect={setSelectedExperiment} 
      />

      {selectedExperiment && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mt-lg">
        {/* Global Explanation (Left Column, spans 7) */}
        <div className="lg:col-span-7 flex flex-col gap-lg">
          <div className="bg-surface rounded-[12px] border border-border-hairline flex flex-col h-full px-lg py-md">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-feature-title text-on-surface">Global Explanation</h3>
              <div className="px-2 py-1 bg-surface-container-low text-on-surface-variant rounded font-label-caps text-label-caps">SHAP Feature Importance</div>
            </div>
            <p className="font-body-sm text-body-sm text-ink-muted mb-lg">Mean |SHAP value| (average impact on model output magnitude)</p>
            {/* Mock Bar Chart */}
            <div className="flex-1 flex flex-col justify-center gap-sm">
              {/* Bar 1 */}
              <div className="flex items-center gap-md group cursor-default">
                <div className="text-right font-body-sm text-body-sm text-on-surface truncate group-hover:text-primary transition-colors w-24">Relationship</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-6 bg-primary-container rounded-r-sm w-full relative">
                    <div className="absolute inset-y-0 right-0 w-1 bg-primary/20"></div>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant w-12">+1.24</span>
                </div>
              </div>
              {/* Bar 2 */}
              <div className="flex items-center gap-md group cursor-default">
                <div className="text-right font-body-sm text-body-sm text-on-surface truncate group-hover:text-primary transition-colors w-24">Age</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-6 bg-primary-container/80 rounded-r-sm w-[80%] relative"></div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant w-12">+0.98</span>
                </div>
              </div>
              {/* Bar 3 */}
              <div className="flex items-center gap-md group cursor-default">
                <div className="text-right font-body-sm text-body-sm text-on-surface truncate group-hover:text-primary transition-colors w-24">Education-Num</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-6 bg-primary-container/60 rounded-r-sm w-[65%] relative"></div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant w-12">+0.75</span>
                </div>
              </div>
              {/* Bar 4 */}
              <div className="flex items-center gap-md group cursor-default">
                <div className="text-right font-body-sm text-body-sm text-on-surface truncate group-hover:text-primary transition-colors w-24">Occupation</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-6 bg-primary-container/40 rounded-r-sm w-[45%] relative"></div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant w-12">+0.42</span>
                </div>
              </div>
              {/* Bar 5 */}
              <div className="flex items-center gap-md group cursor-default">
                <div className="text-right font-body-sm text-body-sm text-on-surface truncate group-hover:text-primary transition-colors w-24">Capital Gain</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-6 bg-primary-container/20 rounded-r-sm w-[20%] relative"></div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant w-12">+0.18</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Explorer & Local SHAP (Right Column, spans 5) */}
        <div className="lg:col-span-5 flex flex-col gap-lg">
          {/* Prediction Explorer Panel */}
          <div className="bg-surface rounded-[12px] border border-border-hairline p-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-feature-title text-on-surface">Prediction Explorer</h3>
            </div>
            <div className="flex gap-sm mb-lg">
              <div className="flex-1 relative">
                <input className="w-full pl-3 pr-4 py-2 bg-surface border border-border-hairline rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all" type="text" defaultValue="#customer_052" />
              </div>
              <button className="bg-surface border border-border-hairline text-primary px-4 py-2 rounded-lg font-body-sm text-body-sm hover:bg-surface-container-low transition-colors active:scale-[0.98]">
                Explain
              </button>
            </div>
            <div className="p-md bg-error-container/20 border border-error-container rounded-lg flex items-center justify-between">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Result</p>
                <p className="font-section-heading text-section-heading font-bold text-on-error-container">High Risk</p>
              </div>
              <div className="text-right">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Probability</p>
                <p className="font-section-heading text-section-heading font-bold text-on-error-container">87%</p>
              </div>
            </div>
          </div>

          {/* Local SHAP Visualization */}
          <div className="bg-surface rounded-[12px] border border-border-hairline p-lg flex-1 flex flex-col">
            <h3 className="text-feature-title text-on-surface mb-sm">Local SHAP Visualization</h3>
            <p className="font-body-sm text-body-sm text-ink-muted mb-lg">Feature contributions for #customer_052</p>
            {/* Waterfull/Force Plot Mockup */}
            <div className="flex-1 flex flex-col justify-center mb-lg relative gap-md py-md">
              {/* Zero Line (Baseline) */}
              <div className="absolute left-24 top-0 bottom-0 w-px bg-on-surface-variant/30 z-10"></div>
              
              {/* High Debt (+0.38) */}
              <div className="flex items-center relative group h-8">
                <div className="w-24 pr-4 text-right shrink-0">
                  <p className="font-body-sm text-body-sm text-on-surface truncate">High Debt</p>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-6 bg-error/20 border border-error rounded-r w-[60%] flex items-center justify-end px-2 transition-all group-hover:bg-error/30">
                    <span className="font-label-caps text-label-caps text-on-error-container">+0.38</span>
                  </div>
                </div>
              </div>

              {/* Low Income (+0.27) */}
              <div className="flex items-center relative group h-8">
                <div className="w-24 pr-4 text-right shrink-0">
                  <p className="font-body-sm text-body-sm text-on-surface truncate">Low Income</p>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-6 bg-error/20 border border-error rounded-r w-[45%] flex items-center justify-end px-2 transition-all group-hover:bg-error/30">
                    <span className="font-label-caps text-label-caps text-on-error-container">+0.27</span>
                  </div>
                </div>
              </div>

              {/* Credit Score (+0.21) */}
              <div className="flex items-center relative group h-8">
                <div className="w-24 pr-4 text-right shrink-0">
                  <p className="font-body-sm text-body-sm text-on-surface truncate">Credit Score</p>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-6 bg-error/20 border border-error rounded-r w-[35%] flex items-center justify-end px-2 transition-all group-hover:bg-error/30">
                    <span className="font-label-caps text-label-caps text-on-error-container">+0.21</span>
                  </div>
                </div>
              </div>

              {/* Age (-0.05) */}
              <div className="flex items-center relative group h-8">
                <div className="w-24 pr-4 text-right shrink-0">
                  <p className="font-body-sm text-body-sm text-on-surface truncate">Age</p>
                </div>
                <div className="flex-1 flex items-center justify-end flex-row-reverse">
                  <div className="h-6 bg-accent-green/20 border border-accent-green rounded-l w-[10%] flex items-center justify-start px-2 transition-all group-hover:bg-accent-green/30">
                    <span className="font-label-caps text-label-caps text-accent-green">-0.05</span>
                  </div>
                  <div className="flex-1"></div>
                </div>
              </div>
            </div>
            {/* Narrative Summary */}
            <div className="bg-surface-container-low p-md rounded-lg border border-border-hairline flex gap-3 items-start">
              <span className="material-symbols-outlined text-primary mt-0.5">insights</span>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                <strong className="text-on-error-container">High debt</strong> and <strong className="text-on-error-container">low income</strong> were the strongest factors pushing this prediction toward High Risk.
              </p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
