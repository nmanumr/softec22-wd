import Axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";

import LinkTo from "../../components/LinkTo";
import Button from "../../components/Button";
import CompactLayout from "../../layouts/CompactLayout";
import ErrorMessage from "../../components/ErrorMessage";
import { isAuthenticated, setToken } from "../../providers/auth";
import { Form, FormField, FormInputFuncProps } from "../../components/form";


export default function Login() {
  const [apiError, setApiError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isAuthenticated()) {
    router.push('/')
    return <></>;
  }

  const onSubmit = async (value: Record<string, any>) => {
    value.email = value.CC + value.email;
    delete value.CC
    setApiError('');
    setLoading(true);

    Axios.post('/api/user/authenticate/', value)
      .then((response) => {
        setToken(response.data.accessToken);
        router.push('/');
      })
      .catch((e) => {
        setApiError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <CompactLayout title="Sign in to your account">
      <Form onSubmit={onSubmit} className="space-y-4" model={{ CC: '+92' }}>

        {apiError && <ErrorMessage error={apiError}/>}

        <FormField pattern={{ value: /^\d{10}$/, message: 'Invalid Phone number' }} type="tel" name="email"
                   label={"Phone"}
                   required>
          {({ errors, label, ...props }: FormInputFuncProps) => (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{label}</label>
              <div className="flex space-x-4">
                <Controller
                  name="CC"
                  render={({ field: { value, onChange } }) => (
                    <select
                      value={value}
                      onChange={onChange}
                      className="appearance-none shadow-sm block  pl-3  pr-8 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option>+92</option>
                      <option>+922</option>
                    </select>
                  )}
                />

                <input
                  id="email" placeholder="300 0000000" autoComplete="tel" {...props}
                  className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <FormField name="password" type="password" label={'Password'} required>
          {({ errors, label, ...props }: FormInputFuncProps) => (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="password" type="password" autoComplete="current-password" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <div className="flex items-center">
          <div className="text-sm">
            Don&apos;t have account?&nbsp;
            <LinkTo href="/accounts/register" className="font-medium text-indigo-600 hover:text-indigo-700">
              Goto Register
            </LinkTo>
            <br/>
            <LinkTo href="/accounts/forget_pass" className="font-medium text-indigo-600 hover:text-indigo-700">
              Forget Password?
            </LinkTo>
          </div>
        </div>

        <div className="pt-2">
          <Button className="w-full" type="submit" loading={loading}>Sign In</Button>
        </div>
      </Form>
    </CompactLayout>
  )
}
