import { ExperimentTable } from '../components/experiments/ExperimentTable';

export function History() {
  return (
    <div className="max-w-max-width-content mx-auto w-full flex flex-col gap-lg mt-lg">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-4">
        <div>
          <h2 className="font-page-title text-page-title text-on-surface mb-2">History</h2>
          <p className="font-body-base text-body-base text-ink-muted max-w-2xl">
            Browse and manage your past experiments and model training runs.
          </p>
        </div>
      </section>

      <ExperimentTable actionType="link" />
    </div>
  );
}
