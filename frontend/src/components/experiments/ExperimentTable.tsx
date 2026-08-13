import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export interface Experiment {
  id: string;
  model: string;
  dataset: string;
  accuracy: number | null;
  f1: number | null;
  status: 'Completed' | 'Running' | 'Failed';
  updatedAt: string;
}

const MOCK_EXPERIMENTS: Experiment[] = [
  { id: 'EXP-204', model: 'XGBoost', dataset: 'customer_churn_q3', accuracy: 95.4, f1: 0.92, status: 'Completed', updatedAt: '2 hrs ago' },
  { id: 'EXP-203', model: 'Random Forest', dataset: 'customer_churn_q3', accuracy: 92.1, f1: 0.89, status: 'Completed', updatedAt: '5 hrs ago' },
  { id: 'EXP-202', model: 'Neural Net (Deep)', dataset: 'image_classify_v2', accuracy: null, f1: null, status: 'Running', updatedAt: '12 hrs ago' },
  { id: 'EXP-201', model: 'Logistic Regression', dataset: 'sales_forecast_24', accuracy: 88.5, f1: 0.81, status: 'Failed', updatedAt: '1 day ago' },
  { id: 'EXP-200', model: 'XGBoost', dataset: 'sales_forecast_24', accuracy: 94.2, f1: 0.90, status: 'Completed', updatedAt: '2 days ago' },
];

interface ExperimentTableProps {
  actionType: 'link' | 'select';
  onSelect?: (experimentId: string) => void;
  selectedId?: string | null;
}

export function ExperimentTable({ actionType, onSelect, selectedId }: ExperimentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredAndSortedExperiments = useMemo(() => {
    let result = [...MOCK_EXPERIMENTS];

    // Search filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(exp => 
        exp.id.toLowerCase().includes(lowerTerm) ||
        exp.model.toLowerCase().includes(lowerTerm) ||
        exp.dataset.toLowerCase().includes(lowerTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(exp => exp.status.toLowerCase() === statusFilter);
    }

    // Model filter (simple includes logic)
    if (modelFilter !== 'all') {
      if (modelFilter === 'xgboost') result = result.filter(exp => exp.model.includes('XGBoost'));
      else if (modelFilter === 'rf') result = result.filter(exp => exp.model.includes('Random Forest'));
      else if (modelFilter === 'lr') result = result.filter(exp => exp.model.includes('Logistic Regression'));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        // Mock sorting by ID descending since they are sequential
        return b.id.localeCompare(a.id);
      } else if (sortBy === 'accuracy_desc') {
        return (b.accuracy || 0) - (a.accuracy || 0);
      } else if (sortBy === 'accuracy_asc') {
        return (a.accuracy || 0) - (b.accuracy || 0);
      }
      return 0;
    });

    return result;
  }, [searchTerm, statusFilter, modelFilter, sortBy]);

  const renderStatus = (status: Experiment['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent-green bg-opacity-10 text-accent-green text-[12px] font-medium border border-accent-green border-opacity-20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span> Completed
          </span>
        );
      case 'Running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary bg-opacity-10 text-primary text-[12px] font-medium border border-primary border-opacity-20">
            <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> Running
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-error bg-opacity-10 text-error text-[12px] font-medium border border-error border-opacity-20">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Failed
          </span>
        );
    }
  };

  const handleRowClick = (expId: string) => {
    if (actionType === 'select' && onSelect) {
      onSelect(expId);
    }
  };

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Filters and Controls */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-xl border border-border-hairline">
        <div className="flex gap-4 items-center w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search experiments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-border-hairline rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          {/* Filter Status */}
          <select 
            className="bg-surface-container-lowest border border-border-hairline rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
          </select>
          {/* Filter Model */}
          <select 
            className="bg-surface-container-lowest border border-border-hairline rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
          >
            <option value="all">All Models</option>
            <option value="xgboost">XGBoost</option>
            <option value="rf">Random Forest</option>
            <option value="lr">Logistic Regression</option>
          </select>
        </div>
        <div className="flex gap-4 items-center w-full md:w-auto justify-end">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps text-ink-muted uppercase">Sort By:</span>
            <select 
              className="bg-surface-container-lowest border border-border-hairline rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="accuracy_desc">Accuracy (High to Low)</option>
              <option value="accuracy_asc">Accuracy (Low to High)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Experiments Table */}
      <section className="bg-surface border border-border-hairline rounded-xl overflow-hidden flex flex-col">
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
              {filteredAndSortedExperiments.length > 0 ? (
                filteredAndSortedExperiments.map((exp) => {
                  const isSelected = selectedId === exp.id;
                  return (
                    <tr 
                      key={exp.id} 
                      onClick={() => handleRowClick(exp.id)}
                      className={`transition-colors group ${actionType === 'select' ? 'cursor-pointer' : ''} ${isSelected ? 'bg-primary-container bg-opacity-20' : 'hover:bg-surface-container-low'}`}
                    >
                      <td className="py-4 px-6 font-medium text-on-surface">
                        {actionType === 'link' ? (
                          <Link to="/experiment-results" className="group-hover:text-primary transition-colors">
                            {exp.id}
                          </Link>
                        ) : (
                          <span className={isSelected ? 'text-primary' : 'group-hover:text-primary transition-colors'}>{exp.id}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">{exp.model}</td>
                      <td className="py-4 px-6 text-ink-muted">{exp.dataset}</td>
                      <td className="py-4 px-6">{exp.accuracy !== null ? `${exp.accuracy}%` : '--'}</td>
                      <td className="py-4 px-6">{exp.f1 !== null ? exp.f1 : '--'}</td>
                      <td className="py-4 px-6">
                        {renderStatus(exp.status)}
                      </td>
                      <td className="py-4 px-6 text-right text-ink-muted">{exp.updatedAt}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ink-muted font-body-sm">
                    No experiments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border-hairline flex justify-between items-center text-ink-muted font-body-sm text-body-sm">
          <span>Showing {filteredAndSortedExperiments.length > 0 ? 1 : 0} to {filteredAndSortedExperiments.length} of {MOCK_EXPERIMENTS.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-border-hairline hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded border border-border-hairline hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
