import Axios from "axios";
import c from 'classnames';
import React, { useState } from "react";
import { useRouter } from "next/router";
import { RadioGroup } from '@headlessui/react';
import { UseFormReturn, Controller } from "react-hook-form";
import { CheckCircleIcon } from '@heroicons/react/solid';

import LinkTo from "../../components/LinkTo";
import CompactLayout from "../../layouts/CompactLayout";
import ErrorMessage from "../../components/ErrorMessage";
import { isAuthenticated, setToken } from "../../providers/auth";
import { Form, FormField, FormInputFuncProps } from "../../components/form";
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
    delete value.confirmPassword

    Axios.post('/api/user/create/', value)
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
      <Form onSubmit={onSubmit} className="space-y-4" model={{ type: 'patient' }}>

        {apiError && <ErrorMessage error={apiError}/>}

        <Controller
          name="type"
          render={({ field: { value, onChange } }) => (
            <RadioGroup value={value} onChange={onChange}>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {['doctor', 'patient'].map((t) => (
                  <RadioGroup.Option
                    key={t}
                    value={t}
                    className={({ checked, active }) =>
                      c(
                        checked ? 'border-transparent' : 'border-gray-300',
                        active ? 'border-indigo-500 ring-2 ring-indigo-500' : '',
                        'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                      )
                    }
                  >
                    {({ checked, active }) => (
                      <>
                        <div className="flex-1 flex">
                          <div className="flex flex-col">
                            <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                              I&apos;m a {t}
                            </RadioGroup.Label>
                          </div>
                        </div>
                        <CheckCircleIcon
                          className={c(!checked ? 'invisible' : '', 'h-5 w-5 text-indigo-600')}
                          aria-hidden="true"
                        />
                        <div
                          className={c(
                            active ? 'border' : 'border-2',
                            checked ? 'border-indigo-500' : 'border-transparent',
                            'absolute -inset-px rounded-lg pointer-events-none'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          )}
        />

        <FormField name="email" type="tel" label={"Phone Number"} required>
          {({ errors, label, ...props }: FormInputFuncProps) => (
            <div>
              <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="phonenumber" autoComplete="tel" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <FormField name="displayName" type="text" label={"Your Name"} required>
          {({ errors, label, ...props }: FormInputFuncProps) => (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="name" autoComplete="name" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>

        <FormField name="password" type="password" label={'Password'} required>
          {({ errors, label, ...props }: FormInputFuncProps) => (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="password" autoComplete="current-password" {...props}
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
                id="confirmPassword" autoComplete="current-password" {...props}
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
