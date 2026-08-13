import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { CreateExperiment } from './pages/CreateExperiment';
import { TrainingProgress } from './pages/TrainingProgress';
import { ExperimentResults } from './pages/ExperimentResults';
import { History } from './pages/History';
import { ExplainabilityWorkspace } from './pages/ExplainabilityWorkspace';
import { ModelTimeMachine } from './pages/ModelTimeMachine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewDashboard />} />
          <Route path="create-experiment" element={<CreateExperiment />} />
          <Route path="training-progress" element={<TrainingProgress />} />
          <Route path="experiment-results" element={<ExperimentResults />} />
          <Route path="history" element={<History />} />
          <Route path="explainability" element={<ExplainabilityWorkspace />} />
          <Route path="time-machine" element={<ModelTimeMachine />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
