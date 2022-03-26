import c from 'classnames';
import useSwr from 'swr';

import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";

const f = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric',
});

function renderImpact(val: 'High' | 'Low' | 'Medium') {
  const classMap = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-gray-100 text-gray-800',
  }
  return (
    <span className={c(classMap[val], 'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium')}>
      {val}
    </span>
  );
}

function renderNumberColor(val: string) {
  if (val.startsWith('-')) {
    return <span className="text-red-700">{val}</span>
  } else {
    return <span className="text-green-700">{val}</span>
  }
}

export default function News() {
  const {data} = useSwr('/news/thisweek');

  const columns = [
    {key: 'title', name: 'Title', render: (row: any) => (<span className="font-medium text-gray-900">{row['title']}</span>)},
    {key: 'country', name: 'Country'},
    {key: 'date', name: 'Date', render: (row: any) => (<span>{f.format(new Date(row['date']))}</span>)},
    {
      key: 'impact',
      name: 'Impact',
      render: (row: any) => renderImpact(row['impact'])
    },
    {key: 'forecast', name: 'Forecast', render: (row: any) => renderNumberColor(row['forecast'])},
    {key: 'previous', name: 'Previous', render: (row: any) => renderNumberColor(row['previous'])},
  ]


  return (
    <DashboardLayout>
      <PageHeader title="News" />
      {data ? <DataTable columns={columns} data={data.reverse()}/> : 'Loading...'}
    </DashboardLayout>
  )
}