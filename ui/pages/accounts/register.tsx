import Axios from "axios";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {UseFormReturn} from "react-hook-form";

import LinkTo from "../../components/LinkTo";
import CompactLayout from "../../layouts/CompactLayout";
import ErrorMessage from "../../components/ErrorMessage";
import {isAuthenticated, setToken} from "../../providers/auth";
import {Form, FormField, FormInputFuncProps} from "../../components/form";
import Button from "../../components/Button";


export default function Register() {
  const [apiError, setApiError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isAuthenticated()) {
    router.push('/');
  }

  const onSubmit = async (value: Record<string, any>, Form: UseFormReturn) => {
    setApiError('');

    if (value.password !== value.confirmPassword) {
      Form.setError('confirmPassword', { message: "Password doesn't match" });
      return;
    }

    setLoading(true);
    const { password, name, email, username } = value;

    Axios.post('/api/user/create/', { password, name, email, username })
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
    <CompactLayout title="Create new account">
      <Form onSubmit={onSubmit} className="space-y-4">

        {apiError && <ErrorMessage error={apiError}/>}

        <FormField name="username" type="text" label={"Username"} required>
          {({errors, label, ...props}: FormInputFuncProps) => (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="username" type="text" autoComplete="name" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <FormField name="email" type="email" label={"Email"} required>
          {({errors, label, ...props}: FormInputFuncProps) => (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="email" type="email" autoComplete="email" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <FormField name="password" type="password" label={'Password'} required>
          {({errors, label, ...props}: FormInputFuncProps) => (
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

        <FormField name="confirmPassword" type="password" label={"Confirm Password"} required>
          {({ errors, label, ...props }: FormInputFuncProps) => (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="confirmPassword" type="password" autoComplete="current-password" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <div className="flex items-center text-sm space-x-1">
          <span>Already have account?</span>
          <LinkTo href="/accounts/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Goto Login
          </LinkTo>
        </div>

        <div className="pt-2">
          <Button className="w-full" loading={loading} type="submit">Sign up</Button>
        </div>
      </Form>
    </CompactLayout>
  );
}
