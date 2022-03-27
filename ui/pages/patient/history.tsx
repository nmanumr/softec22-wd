import React from "react";
import {router} from "next/client";

import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import useSWR from "swr";
import RemoteDataTable from "../../components/RemoteDataTable";

const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' });

export default function History() {
  const {data: userData} = useSWR('/api/user/current');
  const {data} = useSWR(() => `/api/clinic/patient/${userData.id}/history`);
  console.log(data);

  const columns = [
    {
      key: 'title',
      name: '',
      render: (row: any) => (
        <div>
          <div className="font-medium text-gray-800">{row.title}</div>
          <div className="text-gray-600 mt-1">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'date',
      name: '',
      render: (row: any) => (
          <div className="">{formatter.format(new Date(row.date))}</div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Patient History">
        <Button href="/patient/add-history" kind="secondary">Add History</Button>
      </PageHeader>

      {userData && <RemoteDataTable columns={columns} apiUrl={`/api/clinic/patient/${userData.id}/history`}/>}
    </DashboardLayout>
  )
}