import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/Button";
import {useState} from "react";
import AlertsEditor from "../../components/stocks/AlertsEditor";

export default function StockDetail() {
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);

  return (
    <DashboardLayout>
      <AlertsEditor show={showAlertDrawer} onClose={() => setShowAlertDrawer(false)} />

      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">TSLA</h1>
          <h2 className="text-sm font-medium text-gray-600">Tasla, Inc.</h2>
        </div>
        <div>
          <Button kind="secondary" onClick={() => setShowAlertDrawer(true)}>Add Alerts</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}