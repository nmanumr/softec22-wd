import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import RemoteSelect from "../../components/RemoteSelect";
import ErrorMessage from "../../components/ErrorMessage";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Form, FormField, FormInputFuncProps } from "../../components/form";
import Axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function AddAppointment() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [times, setTimes] = useState([]);
  const router = useRouter();

  const { doc: docId } = router.query;
  const [doctor, setDoctor] = useState(docId);

  useEffect(() => {
    if (docId) {
      setDoctor(docId);
    }
  }, [docId]);

  const onDateChange = (e: any) => {
    const date = e.target.value;
    Axios.get(`/api/clinic/doctors/${doctor}/times?date=${date}`)
      .then((res) => setTimes(res.data))
      .catch();
  };

  const onSubmit = (val: Record<string, any>) => {
    setError('');
    setLoading(true);

    Axios.post('/api/clinic/appointments/', { doctor, time: `${val.date}T${val.time}.000Z` })
      .then(() => router.push('/'))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  };

  return (
    <DashboardLayout>
      <PageHeader title="Add Appointment"/>
      <div>
        <Form onSubmit={onSubmit} model={{ doctor: docId }} className="max-w-md space-y-6">

          {error && <ErrorMessage error={error}/>}

          <div className={docId ? 'hidden' : ''}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Doctor</label>
            <Controller
              name="doctor"
              render={({ field: { value, onChange } }) => (
                <RemoteSelect
                  apiUrl='/api/clinic/doctors'
                  valueKey="id"
                  labelKey="displayName"
                  defaultValue={value}
                  onChange={(val: any) => {
                    onChange(val);
                    setDoctor(val);
                  }}
                />
              )}
            />
          </div>

          <FormField name="date" type="date" label="Date" required onChange={onDateChange}>
            {({ errors, label, ...props }: FormInputFuncProps) => (
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  id="date" {...props}
                  className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
              </div>
            )}
          </FormField>

          <FormField name="time" type="text" label="Time" required>
            {({ errors, label, ...props }: FormInputFuncProps) => (
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">{label}</label>
                <select
                  id="time" {...props}
                  className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {times.map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
              </div>
            )}
          </FormField>

          <div>
            <Button loading={loading} type="submit">Add Appointment</Button>
          </div>
        </Form>
      </div>
    </DashboardLayout>
  );
}