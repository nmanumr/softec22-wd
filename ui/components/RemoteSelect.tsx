import useSWR from 'swr';
import Select from './Select';
import ErrorMessage from './ErrorMessage';

export default function RemoteSelect({
  apiUrl, valueKey, ...props
}: { apiUrl: string; valueKey: string, [key: string]: any }) {
  const { data, error } = useSWR(apiUrl);
  const results = data && data.results ? data.results : data || [];

  return (
    <div>
      {error && <ErrorMessage error={error}/>}
      <Select loading={!data} data={results} valueKey={valueKey || 'publicId'} {...props} />
    </div>
  );
}