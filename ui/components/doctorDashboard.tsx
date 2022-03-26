import PageHeader from "../components/PageHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/DataTable";
import React from "react";
import { useConfirmation } from "../components/ConfirmationService";
import RemoteDataTable from "./RemoteDataTable";
import useSWR from "swr";
import UserAvatar from "./UserAvatar";

const columns = [
  {
    key: 'title',
    name: 'My Watchlist',
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

export default function Home() {
  const confirm = useConfirmation();
  const { data } = useSWR('/api/user/current');
  const { data: data2 } = useSWR(`/api/clinic/doctors/${data?.id}/appointments/`);
  console.log(data2);

  const actions = [
    {
      label: 'Remove',
      danger: true,
      perform(data: any) {
        console.log("here");
        confirm({
          title: 'Are you sure?',
          description: `Are you sure, you want to remove "${data.symbol}" from you watchlist?`,
          actionLabel: 'Remove',
          callback() {
            console.log("TODO: remove", data);
            return;
          },
        })
      },
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Appointments"/>
      {data && (
        <RemoteDataTable
          columns={[
            {
              key: 'patient',
              name: 'Patient',
              render: (row: any) => (
                <div className="flex items-center space-x-2">
                  <UserAvatar user={row.patient} classNames="h-8 w-8" />
                  <div className="font-medium text-gray-800">{row.patient.displayName}</div>
                </div>
              ),
            },
            {
              key: 'time',
              name: 'Time',
              render: (row: any) => (
                <div className="font-medium text-gray-800">{row.patient.displayName}</div>
              ),
            }
          ]}
          apiUrl={`/api/clinic/doctors/${data?.id}/appointments/`}
        />
      )}
    </DashboardLayout>
  );
}