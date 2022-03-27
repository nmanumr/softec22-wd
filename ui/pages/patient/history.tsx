import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import React from "react";
import {router} from "next/client";

export default function History() {
  return (
    <DashboardLayout>
      <PageHeader title="Patient History">
        <Button onClick={()=> router.push('/patient/add-history')} kind="secondary">Add History</Button>
      </PageHeader>
    </DashboardLayout>
  )
}