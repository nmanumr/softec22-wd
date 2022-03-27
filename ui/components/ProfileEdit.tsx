import useSWR from 'swr';
import Axios from "axios";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import { Form, FormField, FormInputFuncProps } from "./form";

export default function ProfileEdit() {
  const [apiError, setApiError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { data, mutate } = useSWR('/api/user/current');

  const onSubmit = async (value: Record<string, any>, Form: UseFormReturn) => {
    value.type = data.type;
    if (value.password !== value.confirmPassword) {
      Form.setError('confirmPassword', { message: "Password doesn't match" });
      return;
    }

    // @ts-ignore
    setLoading(true);
    delete value.confirmPassword

    Axios.put('/api/user/current', value)
      .then(() => mutate())
      .catch((e) => setApiError(e))
      .finally(() => setLoading(false));
  };

  return (
    <Form
      model={data}
      onSubmit={onSubmit}
      className="space-y-4 mt-6 max-w-lg px-4 sm:px-6 lg:px-8"
    >

      {apiError && <ErrorMessage error={apiError}/>}

      <FormField type="tel" name="email" label={"Phone"} required>
        {({ errors, label, ...props }: FormInputFuncProps) => (
          <div>
            <label htmlFor="name"
                   className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              disabled={true}
              id="email" placeholder="300 0000000" autoComplete="tel" {...props}
              className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
          </div>
        )}
      </FormField>

      <FormField type="gender" name="gender" label={"Gender"} required>
        {({ errors, label, ...props }: FormInputFuncProps) => (
          <div>
            <label htmlFor="name"
                   className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex space-x-4">
              <Controller
                name="gender"
                render={({ field: { value, onChange } }) => (
                  <select value={value} onChange={onChange}
                          className="appearance-none shadow-sm block  pl-3  pr-8 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 w-full">
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                )}
              />
            </div>

            {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
          </div>
        )}
      </FormField>

      <FormField type="text" name="address" label={"Address"} required>
        {({ errors, label, ...props }: FormInputFuncProps) => (
          <div>
            <label htmlFor="name"
                   className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              id="address" {...props}
              className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
          </div>
        )}
      </FormField>

      <FormField type="text" name="specialization" label={"Specialization"} required>
        {({ errors, label, ...props }: FormInputFuncProps) => (
          <div>
            <label htmlFor="name"
                   className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              id="specialization" {...props}
              className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
          </div>
        )}
      </FormField>

      <FormField type="date" name="dob" label="Date of Birth" required>
        {({ errors, label, ...props }: FormInputFuncProps) => (
          <div>
            <label htmlFor="name"
                   className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              id="DOB" {...props}
              className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
          </div>
        )}
      </FormField>

      <FormField type="number" name="appointmentDuration" label={"Appointment Duration"} required>
        {({ errors, label, ...props }: FormInputFuncProps) => (
          <div>
            <label
              className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              step={15}
              min={15}

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
  )
}