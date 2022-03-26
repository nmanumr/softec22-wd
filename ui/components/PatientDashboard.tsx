import useSWR from "swr";
import React from "react";
import {} from 'date-fns'

import UserAvatar from "./UserAvatar";
import RemoteDataTable from "./RemoteDataTable";
import PageHeader from "../components/PageHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import { useConfirmation } from "./ConfirmationService";
import Button from "./Button";

const formatter = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', dateStyle: 'long' });

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
      <PageHeader title="Appointments">
        <Button kind="secondary">New Appointment</Button>
      </PageHeader>
      {data && (
        <RemoteDataTable
          columns={[
            {
              key: 'patient',
              name: 'Patient',
              render: (row: any) => (
                <div className="flex items-center space-x-2">
                  <UserAvatar user={row.doctor} classNames="h-8 w-8" />
                  <div className="font-medium text-gray-800">{row.doctor.displayName}</div>
                </div>
              ),
            },
            {
              key: 'time',
              name: 'Time',
              render: (row: any) => (
                <div className="font-medium text-gray-800">{formatter.format(new Date(row.time))}</div>
              ),
            },
            {
              key: 'accepted',
              name: 'Accepted',
              render: (row: any) => (
                row.accepted
                  ? <div className="font-medium text-green-600" >Appointment accepted</div>
                  : <div className="font-medium text-red-600">Not accepted yet</div>
              ),
            },
          ]}
          apiUrl={`/api/clinic/appointments/`}
        />
      )}
    </DashboardLayout>
  );
}