import useSWR from "swr";
import React from "react";

import UserAvatar from "./UserAvatar";
import RemoteDataTable from "./RemoteDataTable";
import PageHeader from "../components/PageHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import {useConfirmation} from "./ConfirmationService";
import AppointmentTable from "./AppointmentTable";

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
  const {data} = useSWR('/api/user/current');
  const {data: appointments} = useSWR('/api/clinic/appointments/');

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
        <AppointmentTable appointments={appointments}/>
      )}
    </DashboardLayout>
  );
}