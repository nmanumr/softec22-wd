import React from "react";
import {router} from "next/client";

import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import DashboardLayout from "../../layouts/DashboardLayout";



export default function History() {
  return (
    <DashboardLayout>
      <PageHeader title="Patient History">
        <Button href="/patient/add-history" kind="secondary">Add History</Button>
      </PageHeader>
    </DashboardLayout>
  )
}