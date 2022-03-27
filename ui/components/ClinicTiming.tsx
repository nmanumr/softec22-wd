import { Form } from "./form";
import {useState, Fragment, useEffect} from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import Button from "./Button";
import useSWR, { mutate } from "swr";
import Axios from "axios";
import ErrorMessage from "./ErrorMessage";

function TimeOptions() {
  return (
    <>
      <option value="--:--">--------</option>
      <option value="00:00:00">12:00 AM</option>
      <option value="00:30:00">12:30 AM</option>
      {
        new Array(11)
          .fill(0)
          .map((e, i) => i + 1)
          .map((num) => {
            const val = Math.abs(num);
            return (
              <Fragment key={num}>
                <option value={`${num}:00:00`.padStart(8, '0')}>{val}:00 AM</option>
                <option value={`${num}:30:00`.padStart(8, '0')}>{val}:30 AM</option>
              </Fragment>
            );
          })
      }
      <option value="12:00:00">12:00 PM</option>
      <option value="12:00:00">12:30 PM</option>
      {
        new Array(11)
          .fill(0)
          .map((e, i) => i + 1)
          .map((num) => {
            const val = Math.abs(num);
            return (
              <Fragment key={num}>
                <option value={`${num + 12}:00:00`}>{val}:00 PM</option>
                <option value={`${num + 12}:30:00`}>{val}:30 PM</option>
              </Fragment>
            );
          })
      }
      <option value="23:30:00">11:30 PM</option>
    </>
  );
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ClinicTiming() {
  const [apiError, setApiError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { data, mutate } = useSWR('/api/clinic/timings');
  const newData = data?.reduce((a: Record<string, any>, e: Record<string, any>) => ({ ...a, [e.day]: e }), {});


  const onSubmit = async (value: Record<string, any>, Form: UseFormReturn) => {
    const newVal = Object.entries(value)
      .filter(([_, val]) => val.startTime && val.endTime && val.startTime !== '--:--' && val.endTime !== '--:--')
      .map(([key, val]) => ({ day: key, ...val }));

    console.log(newVal);
    setApiError('');
    setLoading(true);

    Axios.post('/api/clinic/timings', newVal)
      .then(() => mutate())
      .catch((e) => setApiError(e))
      .finally(() => setLoading(false));
  };

  return (
    <Form
      onSubmit={onSubmit}
      model={newData}
      className="mt-6 max-w-lg px-4 sm:px-6 lg:px-8 grid grid-cols-[100px_1fr] items-center gap-y-4 gap-x-6"
    >

      {apiError && <ErrorMessage error={apiError}/>}

      {days.map((day) => (
        <Fragment key={day}>
          <div className="font-medium text-gray-600 flex h-full items-center">{day}</div>
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
            <Controller name={`${day.toLowerCase()}.startTime`} render={({ field: { value, onChange } }) => {
console.log(value);
              return (
                <select
                  value={value}
                  onChange={onChange}
                  className="appearance-none mt-0 shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <TimeOptions/>
                </select>
              );
            }}/>

            <span>TO</span>
            <Controller name={`${day.toLowerCase()}.endTime`} render={({ field: { value, onChange } }) => (
              <select
                value={value}
                onChange={onChange}
                className="appearance-none mt-0 shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              >
                <TimeOptions/>
              </select>
            )}/>
          </div>
        </Fragment>
      ))}

      <div className="mt-6 col-span-2">
        <Button loading={loading} className="w-full justify-center">Save</Button>
      </div>
    </Form>
  );
}