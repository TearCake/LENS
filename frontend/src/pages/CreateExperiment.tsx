import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CreateExperiment() {
  const [selectedModels, setSelectedModels] = useState<string[]>(['logistic_regression']);
  const navigate = useNavigate();

  const toggleModel = (model: string) => {
    setSelectedModels(prev => 
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  return (
    <div className="max-w-max-width-content mx-auto w-full mt-xxl flex flex-col gap-xxl">
      {/* Page Header */}
      <header>
        <h2 className="font-page-title text-page-title text-on-surface mb-2">Create an Experiment</h2>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
          Upload your dataset and configure a machine learning experiment. We'll handle the heavy lifting while you fine-tune the objectives.
        </p>
      </header>

      {/* Grid Layout for Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column (Dataset & Target) */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Dataset Upload / Status Card */}
          <section className="bg-surface border border-border-hairline rounded-[12px] p-lg flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <h3 className="font-feature-title text-feature-title text-on-surface">Dataset</h3>
              <button className="text-primary font-label-caps text-label-caps hover:underline">Change File</button>
            </div>
            
            {/* Uploaded State */}
            <div className="border border-border-hairline rounded-lg bg-surface-bright p-md flex items-center gap-md">
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-border-hairline shrink-0">
                <span className="material-symbols-outlined text-primary">table_view</span>
              </div>
              <div className="flex-1">
                <div className="font-body-base text-body-base font-semibold text-on-surface">loan_data.csv</div>
                <div className="font-body-sm text-body-sm text-ink-muted">12,480 rows • 18 features • 2.4 MB</div>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-accent-green bg-accent-green/10 px-2 py-1 rounded-sm font-label-caps text-label-caps">
                <span className="material-symbols-outlined text-[16px]">check_circle</span> Ready
              </div>
            </div>

            {/* Data Preview Table (Compact) */}
            <div className="mt-sm border border-border-hairline rounded-lg overflow-hidden">
              <div className="bg-surface-bright px-4 py-2 border-b border-border-hairline">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Data Preview</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface font-label-caps text-label-caps text-on-surface-variant border-b border-border-hairline">
                      <th className="py-2 px-4 font-medium">Age</th>
                      <th className="py-2 px-4 font-medium">Income</th>
                      <th className="py-2 px-4 font-medium">Credit Score</th>
                      <th className="py-2 px-4 font-medium">Debt</th>
                      <th className="py-2 px-4 font-medium">Education</th>
                      <th className="py-2 px-4 font-medium">Default</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm text-on-surface">
                    <tr className="border-b border-border-hairline hover:bg-surface-bright transition-colors">
                      <td className="py-2 px-4">34</td>
                      <td className="py-2 px-4">$65,000</td>
                      <td className="py-2 px-4">720</td>
                      <td className="py-2 px-4">$12,000</td>
                      <td className="py-2 px-4">Bachelors</td>
                      <td className="py-2 px-4">0</td>
                    </tr>
                    <tr className="border-b border-border-hairline hover:bg-surface-bright transition-colors">
                      <td className="py-2 px-4">45</td>
                      <td className="py-2 px-4">$92,000</td>
                      <td className="py-2 px-4">680</td>
                      <td className="py-2 px-4">$34,000</td>
                      <td className="py-2 px-4">Masters</td>
                      <td className="py-2 px-4">1</td>
                    </tr>
                    <tr className="hover:bg-surface-bright transition-colors">
                      <td className="py-2 px-4">28</td>
                      <td className="py-2 px-4">$45,000</td>
                      <td className="py-2 px-4">610</td>
                      <td className="py-2 px-4">$8,000</td>
                      <td className="py-2 px-4">High School</td>
                      <td className="py-2 px-4">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Target Selection & Preprocessing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Target Selection */}
            <section className="bg-surface border border-border-hairline rounded-[12px] p-lg flex flex-col gap-md">
              <div>
                <h3 className="font-feature-title text-feature-title text-on-surface">Target Selection</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Select the column you want to predict.</p>
              </div>
              <div className="mt-auto">
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Target Column</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface border border-border-hairline text-on-surface rounded-lg py-2 pl-4 pr-10 font-body-base text-body-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
                    <option>Default (Binary)</option>
                    <option>Income (Continuous)</option>
                    <option>Credit Score (Continuous)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Preprocessing */}
            <section className="bg-surface border border-border-hairline rounded-[12px] p-lg flex flex-col gap-md">
              <div>
                <h3 className="font-feature-title text-feature-title text-on-surface">Preprocessing</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Automated data preparation steps.</p>
              </div>
              <div className="flex flex-col gap-3 mt-auto">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5">
                    <input defaultChecked className="w-4 h-4 text-primary border-border-hairline rounded-sm focus:ring-primary focus:ring-2" type="checkbox" />
                  </div>
                  <div className="flex-1 font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">
                    Handle missing values
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5">
                    <input defaultChecked className="w-4 h-4 text-primary border-border-hairline rounded-sm focus:ring-primary focus:ring-2" type="checkbox" />
                  </div>
                  <div className="flex-1 font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">
                    Encode categorical features
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5">
                    <input defaultChecked className="w-4 h-4 text-primary border-border-hairline rounded-sm focus:ring-primary focus:ring-2" type="checkbox" />
                  </div>
                  <div className="flex-1 font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">
                    Scale numerical features
                  </div>
                </label>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column (Models) */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          <section className="bg-surface border border-border-hairline rounded-[12px] p-lg flex flex-col gap-md h-full">
            <header>
              <h3 className="font-feature-title text-feature-title text-on-surface">Model Architecture</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Select the algorithm for training.</p>
            </header>
            <div className="flex flex-col gap-md mt-sm flex-1">
              {/* Model Card 1 */}
              <label 
                className={`relative block bg-surface border rounded-lg p-md cursor-pointer transition-all active:scale-[0.98] ${selectedModels.includes('logistic_regression') ? 'border-primary ring-2 ring-primary/20 shadow-[0_4px_24px_rgba(0,117,222,0.05)]' : 'border-border-hairline hover:border-primary/50 hover:bg-surface-bright'}`}
              >
                <input 
                  className="sr-only" 
                  name="model_selection_1" 
                  type="checkbox" 
                  checked={selectedModels.includes('logistic_regression')}
                  onChange={() => toggleModel('logistic_regression')}
                />
                <div className="flex justify-between items-start mb-2">
                  <div className="font-body-base text-body-base font-semibold text-on-surface">Logistic Regression</div>
                  <span 
                    className={`material-symbols-outlined text-[20px] ${selectedModels.includes('logistic_regression') ? 'text-primary' : 'text-border-hairline'}`} 
                    style={selectedModels.includes('logistic_regression') ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {selectedModels.includes('logistic_regression') ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Fast, interpretable baseline model. Best for linear relationships.</div>
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-accent-sky bg-accent-sky/10 font-label-caps text-[10px] uppercase">Fast</span>
                </div>
              </label>

              {/* Model Card 2 */}
              <label 
                className={`relative block bg-surface border rounded-lg p-md cursor-pointer transition-all active:scale-[0.98] ${selectedModels.includes('random_forest') ? 'border-primary ring-2 ring-primary/20 shadow-[0_4px_24px_rgba(0,117,222,0.05)]' : 'border-border-hairline hover:border-primary/50 hover:bg-surface-bright'}`}
              >
                <input 
                  className="sr-only" 
                  name="model_selection_2" 
                  type="checkbox" 
                  checked={selectedModels.includes('random_forest')}
                  onChange={() => toggleModel('random_forest')}
                />
                <div className="flex justify-between items-start mb-2">
                  <div className="font-body-base text-body-base font-semibold text-on-surface">Random Forest</div>
                  <span 
                    className={`material-symbols-outlined text-[20px] ${selectedModels.includes('random_forest') ? 'text-primary' : 'text-border-hairline'}`}
                    style={selectedModels.includes('random_forest') ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {selectedModels.includes('random_forest') ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Ensemble method balancing variance and bias. Robust to outliers.</div>
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-accent-teal bg-accent-teal/10 font-label-caps text-[10px] uppercase">Balanced</span>
                </div>
              </label>

              {/* Model Card 3 */}
              <label 
                className={`relative block bg-surface border rounded-lg p-md cursor-pointer transition-all active:scale-[0.98] ${selectedModels.includes('xgboost') ? 'border-primary ring-2 ring-primary/20 shadow-[0_4px_24px_rgba(0,117,222,0.05)]' : 'border-border-hairline hover:border-primary/50 hover:bg-surface-bright'}`}
              >
                <input 
                  className="sr-only" 
                  name="model_selection_3" 
                  type="checkbox"
                  checked={selectedModels.includes('xgboost')}
                  onChange={() => toggleModel('xgboost')}
                />
                <div className="flex justify-between items-start mb-2">
                  <div className="font-body-base text-body-base font-semibold text-on-surface">XGBoost</div>
                  <span 
                    className={`material-symbols-outlined text-[20px] ${selectedModels.includes('xgboost') ? 'text-primary' : 'text-border-hairline'}`}
                    style={selectedModels.includes('xgboost') ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {selectedModels.includes('xgboost') ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Gradient boosted trees for maximum predictive accuracy.</div>
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-accent-purple bg-accent-purple/10 font-label-caps text-[10px] uppercase">High Performance</span>
                </div>
              </label>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex justify-end pt-lg">
        <button 
          onClick={() => navigate('/training-progress')}
          className="bg-primary-container text-on-primary-container hover:bg-primary transition-all active:scale-[0.98] px-xl py-3 rounded-lg font-label-caps text-label-caps flex items-center gap-2 shadow-[0_4px_12px_rgba(0,117,222,0.2)]"
        >
          Start Training
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
