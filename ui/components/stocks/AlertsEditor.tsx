import Drawer from "../Drawer";
import {Form} from "../form";
import ErrorMessage from "../ErrorMessage";
import {useState} from "react";
import Button from "../Button";
import {PlusIcon, XIcon} from '@heroicons/react/solid';

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function AlertsEditor({show, onClose}: React.PropsWithChildren<Props>) {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      conditions: [
        {comp: '>', val: 500},
        {comp: '<', val: 700},
      ]
    },
    {
      id: 2,
      conditions: [
        {comp: '==', val: 500},
      ]
    },
  ]);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: Record<string, any>) => {
    console.log(values);
  };

  return (
    <Drawer
      show={show} onClose={onClose}
      title="Edit Alerts"
    >
      <Form onSubmit={onSubmit} className="flex flex-col h-full divide-y divide-gray-200">
        <div className="flex-1">
          {apiError && <ErrorMessage error={apiError}/>}

          <div className="space-y-2 mt-1 divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert.id} className="pt-4 first:pt-0">
                <span className="block text-sm font-medium text-gray-700">Alert when stocks are</span>
                <div className="space-y-2 mt-1">
                  {alert.conditions.map((condition, i) => (
                    <div key={`${alert.id}-${i}`} className="flex items-center space-x-1">
                      <div className="rounded-md shadow-sm -space-x-px flex flex-1">
                        <div className="w-34 shrink-0">
                          <label htmlFor={`${alert.id}-condition`} className="sr-only">
                            Condition
                          </label>
                          <select
                            className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-l-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                            id={`${alert.id}-condition`}>
                            <option>Lesser than</option>
                            <option>Greater than</option>
                            <option>Equal to</option>
                          </select>
                        </div>
                        <div className="flex-1 min-w-0">
                          <label htmlFor={`${alert.id}-value`} className="sr-only">
                            CVC
                          </label>
                          <input
                            type="text"
                            id={`${alert.id}-value`}
                            className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-r-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                            placeholder="Value"
                          />
                        </div>
                      </div>
                      <button
                        className="px-2 py-2 text-gray-400 hover:text-gray-600"
                        onClick={() => setAlerts((a) => a.filter((a) => a.id != alert.id))}
                      >
                        <XIcon className="w-5 h-5"/>
                      </button>
                    </div>
                  ))}

                  <div>
                    <button
                      onClick={() => setAlerts((a) => [
                        ...a,
                        {id: (a[a.length - 1]?.id || 0) + 1, conditions: [{comp: '>', val: 0}], value: 0}
                      ])}
                      className="text-sm flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 pt-1 pb-2"
                    >
                      <PlusIcon className="h-4 w-5"/>
                      <span>Add Condition</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div>
              <button
                onClick={() => setAlerts((a) => [
                  ...a,
                  {id: (a[a.length - 1]?.id || 0) + 1, conditions: [{comp: '>', val: 0}], value: 0}
                ])}
                className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 py-4"
              >
                <PlusIcon className="h-4 w-5"/>
                <span>Add Alert</span>
              </button>
            </div>
          </div>


        </div>

        <div className="shrink-0 flex justify-end space-x-4 pt-4">
          <Button type="button" kind="secondary" onClick={() => onClose()}>Cancel</Button>
          <Button className="flex-1" type="submit" loading={loading}>Save</Button>
        </div>
      </Form>
    </Drawer>
  );
}