import useSWR from "swr";
import React, {useEffect, useState} from "react";

import UserAvatar from "./UserAvatar";
import RemoteDataTable from "./RemoteDataTable";
import PageHeader from "../components/PageHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import {useConfirmation} from "../components/ConfirmationService";
import {func} from "prop-types";
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
  const {data: appointments} = useSWR(`/api/clinic/doctors/${data?.id}/appointments/`);

  return (
    <DashboardLayout>
      <PageHeader title="Appointments"/>
      <AppointmentTable appointments={appointments}/>
    </DashboardLayout>
  );
}