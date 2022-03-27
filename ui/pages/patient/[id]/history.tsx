import React from "react";
import { useRouter } from "next/router";

import Button from "../../../components/Button";
import PageHeader from "../../../components/PageHeader";
import DashboardLayout from "../../../layouts/DashboardLayout";
import RemoteDataTable from "../../../components/RemoteDataTable";

const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' });

export default function History() {
  const router = useRouter();
  const { id } = router.query;

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

      {id && <RemoteDataTable columns={columns} apiUrl={`/api/clinic/patient/${id}/history`}/>}
    </DashboardLayout>
  )
}