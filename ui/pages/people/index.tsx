import React from 'react';
import useSwr from 'swr';
import {useRouter} from "next/router";

import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import UserAvatar from "../../components/UserAvatar";
import DashboardLayout from "../../layouts/DashboardLayout";

const columns = [
  {
    key: 'title',
    name: 'All People',
    render: (row: any) => (
      <div className="flex items-center space-x-3">
        <UserAvatar user={row} classNames="h-8 w-8"/>
        <div>
          <div className="font-medium text-gray-800">{row.displayName}</div>
          <div className="text-sm text-gray-600">@{row.username}</div>
        </div>
      </div>
    ),
  },
];

export default function People() {
  const {data} = useSwr('/api/user/all/');
  const router = useRouter();

  const actions = [
    {label: 'View Profile', perform: (p: any) => router.push(`/people/${p.username}`)}
  ];

  return (
    <DashboardLayout>
      <PageHeader title="People"/>
      {data && <DataTable columns={columns} data={data.results} actions={actions}/>}
    </DashboardLayout>
  );
}