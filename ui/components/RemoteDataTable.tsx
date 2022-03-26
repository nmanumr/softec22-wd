import useSWR from 'swr';
import DataTable, {Action, Column} from './DataTable';
import ErrorMessage from './ErrorMessage';

interface Props<R> {
  columns: Column<R>[];
  actions: Action<R>[];
  apiUrl: string;
}

export default function RemoteDataTable<R = Object>({ columns, actions, apiUrl }: Props<R>) {
  const { data, error } = useSWR(apiUrl);
  const results = data ? data.results : [];

  return (
    <div>
      {error && <ErrorMessage error={error} />}
      <DataTable columns={columns} actions={actions} loading={!data} data={results} />
    </div>
  );
}
