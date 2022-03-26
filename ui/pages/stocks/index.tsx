import PageHeader from "../../components/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import React from "react";

const columns = [
  {
    key: 'title',
    name: 'Stocks',
    render: (row: any) => (
      <div>
        <div className="font-medium text-gray-800">{row.symbol}</div>
        <div className="text-sm text-gray-600">{row.title}</div>
      </div>
    ),
  },
  {
    key: 'details',
    name: '',
    render: (row: any) => (
      <div>
        <div className="font-medium text-gray-600">{row.volume}</div>
        <div className="text-sm text-red-700 font-medium">{row.change}</div>
      </div>
    )
  },
];

const actions = [
  {label: 'View Details', perform: (data: any) => console.log(data)},
];

const data = [
  {title: 'Apple, Inc.', symbol: 'AAPL', volume: '164.77', change: '-0.53'},
  {title: 'Tesla, Inc.', symbol: 'TSLA', volume: '1095.00', change: '-49.75'},
  {title: 'Alphabet, Inc.', symbol: 'GOOG', volume: '2832.36', change: '-16.68'},
  {title: 'Microsoft, Inc.', symbol: 'MSFT', volume: '330.08', change: '-0.51'},
  {title: 'Facebook, Inc.', symbol: 'FB', volume: '310.60', change: '-13.46'},
  {title: 'Apple, Inc.', symbol: 'AAPL', volume: '164.77', change: '-0.53'},
  {title: 'Tesla, Inc.', symbol: 'TSLA', volume: '1095.00', change: '-49.75'},
  {title: 'Alphabet, Inc.', symbol: 'GOOG', volume: '2832.36', change: '-16.68'},
  {title: 'Microsoft, Inc.', symbol: 'MSFT', volume: '330.08', change: '-0.51'},
  {title: 'Facebook, Inc.', symbol: 'FB', volume: '310.60', change: '-13.46'},
]

export default function Stock() {
  return (
    <DashboardLayout>
      <PageHeader title="Stocks" />
      <DataTable columns={columns} data={data} actions={actions} />
    </DashboardLayout>
  );
}