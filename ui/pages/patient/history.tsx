import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import React from "react";

export default function History() {
  return (
    <DashboardLayout>
      <PageHeader title="Patient History">
        <Button kind="secondary">Add History</Button>
      </PageHeader>

      <div>Test</div>
    </DashboardLayout>
  )
}