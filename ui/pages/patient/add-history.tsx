import useSWR from 'swr';
import Axios from "axios";
import {useState} from "react";
import {Controller, UseFormReturn} from "react-hook-form";

import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import {Form, FormField, FormInputFuncProps} from "../../components/form";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ProfileEdit() {
  const [apiError, setApiError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const {data, mutate} = useSWR('/api/user/current');

  const onSubmit = async (value: Record<string, any>, Form: UseFormReturn) => {
    value.patient = data.id

    // @ts-ignore
    setLoading(true);

    Axios.post('/api/user/current', value)
      .then(() => mutate())
      .catch((e) => setApiError(e))
      .finally(() => setLoading(false));
  };

  // @ts-ignore
  return (
    <DashboardLayout>
      <div className="flex">
        <h1 className="align-center mx-auto font-bold space-y-4 mt-6 max-w-lg px-4 sm:px-6 lg:px-8">
          Add Patients Medical History
        </h1>
      </div>
      <Form
        model={{type: "major"}}
        onSubmit={onSubmit}
        className="mx-auto space-y-4 mt-6 max-w-lg px-4 sm:px-6 lg:px-8"
      >
        {apiError && <ErrorMessage error={apiError}/>}
        <FormField type="title" name="title" label={"Title"} required>
          {({errors, label, ...props}: FormInputFuncProps) => (
            <div>
              <label htmlFor="name"
                     className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="title" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <FormField type="type" name="type" label={"Type"} required>
          {({errors, label, ...props}: FormInputFuncProps) => (
            <div>
              <label htmlFor="name"
                     className="block text-sm font-medium text-gray-700">{label}</label>
              <div className="flex space-x-4">
                <Controller
                  name="type"
                  render={({field: {value, onChange}}) => (
                    <select value={value} onChange={onChange}
                            className="appearance-none shadow-sm block  pl-3  pr-8 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 w-full">
                      <option value="disease">Major Disease</option>
                      <option value="surgery">Surgery</option>
                      <option value="allergy">Allergy</option>
                    </select>
                  )}
                />
              </div>
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <FormField type="date" name="date" label="Date" required>
          {({errors, label, ...props}: FormInputFuncProps) => (
            <div>
              <label htmlFor="name"
                     className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="date" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <FormField type="text" name="description" label={"Description"} required>
          {({errors, label, ...props}: FormInputFuncProps) => (
            <div>
              <label
                className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <div className="pt-2">
          <Button loading={loading} className="w-full" type="submit">Save</Button>
        </div>
      </Form>
    </DashboardLayout>
  )
}