import React from "react";
import {router} from "next/client";

import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";
import useSWR from "swr";
import RemoteDataTable from "../../components/RemoteDataTable";


export default function History() {
  const {data: userData} = useSWR('/api/user/current');
  const {data} = useSWR(() => `/api/clinic/patient/${userData.id}/history`);
  console.log(data);

  const columns = [
    {
      key: 'title',
      name: 'Title',
      render: (row: any) => <div className="font-medium text-gray-800">{row.title}</div>,
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