import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, type Dataset, type DatasetDetails } from '../api/client';

export function CreateExperiment() {
  const [searchParams] = useSearchParams();
  const initialDatasetId = searchParams.get('dataset_id') || '';
  const [selectedModels, setSelectedModels] = useState<string[]>(['logistic_regression']);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(initialDatasetId);
  const [datasetDetails, setDatasetDetails] = useState<DatasetDetails | null>(null);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDatasets() {
      try {
        const data = await api.getDatasets();
        setDatasets(data);
        if (data.length > 0 && !selectedDatasetId) {
          setSelectedDatasetId(data[0].dataset_id);
        }
      } catch (err) {
        console.error("Failed to load datasets:", err);
      }
    }
    loadDatasets();
  }, []);

  useEffect(() => {
    if (!selectedDatasetId) return;
    setDatasetDetails(null);
    api.getDatasetDetails(selectedDatasetId)
      .then(details => {
        setDatasetDetails(details);
        if (details.columns.length > 0 && (!targetColumn || !details.columns.includes(targetColumn))) {
           // Default to the last column (often the target in simple CSVs)
           setTargetColumn(details.columns[details.columns.length - 1]);
        }
      })
      .catch(console.error);
  }, [selectedDatasetId]);

  const toggleModel = (model: string) => {
    setSelectedModels(prev => 
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const handleStartTraining = async () => {
    if (!selectedDatasetId || !targetColumn || selectedModels.length === 0) return;
    try {
      setLoading(true);
      const res = await api.startTraining(selectedDatasetId, targetColumn, selectedModels);
      navigate(`/training-progress?run_id=${res.run_id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start training. See console for details.");
      setLoading(false);
    }
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
            
            {/* Dataset Selection */}
            <div className="border border-border-hairline rounded-lg bg-surface-bright p-md flex flex-col gap-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Select Dataset</label>
              <select 
                className="w-full bg-surface border border-border-hairline rounded-lg p-2 font-body-sm focus:outline-none focus:border-primary"
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
              >
                {datasets.length === 0 ? (
                  <option value="" disabled>No datasets found. Please upload one via backend.</option>
                ) : (
                  datasets.map(d => (
                    <option key={d.dataset_id} value={d.dataset_id}>
                      {d.filename} ({d.size_kb} KB)
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Data Preview Table (Compact) */}
            <div className="mt-sm border border-border-hairline rounded-lg overflow-hidden">
              <div className="bg-surface-bright px-4 py-2 border-b border-border-hairline flex justify-between items-center">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Data Preview</span>
                {datasetDetails && (
                  <span className="font-label-caps text-[10px] text-ink-muted">{datasetDetails.row_count} rows, {datasetDetails.column_count} cols</span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface font-label-caps text-label-caps text-on-surface-variant border-b border-border-hairline">
                      {datasetDetails?.columns.map(col => (
                        <th key={col} className="py-2 px-4 font-medium whitespace-nowrap">{col}</th>
                      )) || <th className="py-2 px-4 font-medium">Loading...</th>}
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm text-on-surface">
                    {datasetDetails?.sample_rows.map((row, i) => (
                      <tr key={i} className="border-b border-border-hairline hover:bg-surface-bright transition-colors">
                        {datasetDetails.columns.map(col => (
                          <td key={col} className="py-2 px-4 whitespace-nowrap truncate max-w-[150px]">{String(row[col])}</td>
                        ))}
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={100} className="py-4 text-center text-ink-muted">No data available</td>
                      </tr>
                    )}
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
                  <select 
                    className="w-full bg-surface border border-border-hairline text-on-surface rounded-lg py-2 pl-4 pr-10 font-body-base text-body-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value)}
                    disabled={!datasetDetails}
                  >
                    <option value="" disabled>Select target column...</option>
                    {datasetDetails?.columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-[10px] text-ink-muted pointer-events-none">expand_more</span>
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
          onClick={handleStartTraining}
          disabled={loading || !selectedDatasetId || !targetColumn || selectedModels.length === 0}
          className="bg-primary-container text-on-primary-container hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 px-xl py-3 rounded-lg font-label-caps text-label-caps flex items-center gap-2 shadow-[0_4px_12px_rgba(0,117,222,0.2)]"
        >
          {loading ? 'Starting...' : 'Start Training'}
          <span className="material-symbols-outlined text-[18px]">{loading ? 'sync' : 'arrow_forward'}</span>
        </button>
      </div>
    </div>
  );
}
