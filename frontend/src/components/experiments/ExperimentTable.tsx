import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, type Experiment } from '../../api/client';

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
  
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    api.getExperiments().then(setExperiments).catch(console.error);
  }, []);

  const filteredAndSortedExperiments = useMemo(() => {
    let result = [...experiments];

    // Search filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(exp => 
        (exp.run_id && exp.run_id.toLowerCase().includes(lowerTerm)) ||
        (exp.model_name && exp.model_name.toLowerCase().includes(lowerTerm)) ||
        (exp.dataset_id && exp.dataset_id.toLowerCase().includes(lowerTerm))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(exp => {
        if (!exp.status) return false;
        const s = exp.status.toLowerCase();
        if (statusFilter === 'finished') return s === 'finished' || s === 'completed';
        if (statusFilter === 'running') return s === 'running' || s === 'pending';
        if (statusFilter === 'failed') return s === 'failed';
        return s === statusFilter;
      });
    }

    // Model filter
    if (modelFilter !== 'all') {
      result = result.filter(exp => {
        if (!exp.model_name) return false;
        const m = exp.model_name.toLowerCase();
        if (modelFilter === 'xgboost') return m.includes('xgboost');
        if (modelFilter === 'rf') return m.includes('rf') || m.includes('random') || m.includes('forest');
        if (modelFilter === 'lr') return m.includes('lr') || m.includes('logistic') || m.includes('regression');
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = new Date(a.start_time).getTime() || 0;
        const timeB = new Date(b.start_time).getTime() || 0;
        return timeB - timeA;
      } else if (sortBy === 'accuracy_desc') {
        return (b.accuracy || 0) - (a.accuracy || 0);
      } else if (sortBy === 'accuracy_asc') {
        return (a.accuracy || 0) - (b.accuracy || 0);
      }
      return 0;
    });

    return result;
  }, [experiments, searchTerm, statusFilter, modelFilter, sortBy]);

  const renderStatus = (status: Experiment['status']) => {
    const s = status ? status.toUpperCase() : '';
    switch (s) {
      case 'FINISHED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent-green bg-opacity-10 text-accent-green text-[12px] font-medium border border-accent-green border-opacity-20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span> Completed
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-error bg-opacity-10 text-error text-[12px] font-medium border border-error border-opacity-20">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary bg-opacity-10 text-primary text-[12px] font-medium border border-primary border-opacity-20">
            <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> Running
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
            <option value="finished">Completed</option>
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
                  const isSelected = selectedId === exp.run_id;
                  return (
                    <tr 
                      key={exp.run_id} 
                      onClick={() => handleRowClick(exp.run_id)}
                      className={`transition-colors group ${actionType === 'select' ? 'cursor-pointer' : ''} ${isSelected ? 'bg-primary-container bg-opacity-20' : 'hover:bg-surface-container-low'}`}
                    >
                      <td className="py-4 px-6 font-medium text-on-surface font-mono text-xs">
                        {actionType === 'link' ? (
                          <Link to={`/experiment-results?run_id=${exp.run_id}`} className="group-hover:text-primary transition-colors">
                            {exp.run_id.substring(0, 8)}...
                          </Link>
                        ) : (
                          <span className={isSelected ? 'text-primary' : 'group-hover:text-primary transition-colors'}>{exp.run_id.substring(0, 8)}...</span>
                        )}
                      </td>
                      <td className="py-4 px-6">{exp.model_name}</td>
                      <td className="py-4 px-6 text-ink-muted">{exp.dataset_id}</td>
                      <td className="py-4 px-6">{exp.accuracy !== null ? `${(exp.accuracy * 100).toFixed(1)}%` : '--'}</td>
                      <td className="py-4 px-6">{exp.f1_score !== null ? exp.f1_score.toFixed(3) : '--'}</td>
                      <td className="py-4 px-6">
                        {renderStatus(exp.status)}
                      </td>
                      <td className="py-4 px-6 text-right text-ink-muted">{new Date(exp.start_time).toLocaleString()}</td>
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
          <span>Showing {filteredAndSortedExperiments.length > 0 ? 1 : 0} to {filteredAndSortedExperiments.length} of {experiments.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-border-hairline hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded border border-border-hairline hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
