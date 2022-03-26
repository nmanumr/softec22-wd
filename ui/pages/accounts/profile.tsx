import Axios from "axios";
import useSWR from "swr";
import c from 'classnames';
import React, { useState } from 'react';

import Button from "../../components/Button";
import UserAvatar from "../../components/UserAvatar";
import ErrorMessage from "../../components/ErrorMessage";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Controller, UseFormReturn } from "react-hook-form";
import { Form, FormField, FormInputFuncProps } from "../../components/form";


export default function Profile() {
  const [apiError, setApiError] = useState<string>();
  const { data, mutate } = useSWR('/api/user/current');
  let [currentTab, selectCurrentTab] = useState("Profile")
  let [loading, setLoading] = useState(false);

  const onSubmit = async (value: Record<string, any>, Form: UseFormReturn) => {
    value.type = data.type;
    console.log(value);
    if (value.password !== value.confirmPassword) {
      Form.setError('confirmPassword', { message: "Password doesn't match" });
      return;
    }

    // @ts-ignore
    setLoading(true);
    delete value.confirmPassword

    Axios.put('/api/user/current/', value)
      .then(() => mutate())
      .catch((e) => setApiError(e))
      .finally(() => setLoading(false));
  };
  const tabs = [
    { name: 'Profile', href: '#', current: currentTab === "Profile" },
    { name: 'Ratings', href: '#', current: currentTab === "Ratings" },
  ]
  if (!data) return (
    <DashboardLayout/>
  )
  console.log(data)
  return (
    <DashboardLayout>
      <div className="h-full flex -mt-10 relative">
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">

          <div className="flex-1 relative z-0 flex overflow-hidden">
            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">

              <article>
                {/* Profile header */}
                <div>
                  <div>
                    <img className="h-32 w-full object-cover lg:h-48"
                         src={"https://media.istockphoto.com/photos/colorful-background-red-blue-and-yellow-orange-colors-abstract-modern-picture-id1332601848?b=1&k=20&m=1332601848&s=170667a&w=0&h=_zrnj0NBLjjuMfPvSqxEHn2-oVlExHhOPXP9HsOO_eI="}
                         alt=""/>
                  </div>
                  <div className="max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                      <div className="flex">
                        <UserAvatar
                          user={data}
                          classNames={"h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 object-cover"}
                        />


                      </div>
                      <div
                        className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                          <h1 className="text-2xl font-bold text-gray-900 truncate">{data.displayName}</h1>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">{data.displayName}</h1>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 sm:mt-2 2xl:mt-5">
                  <div className="border-b border-gray-200">
                    <div className="max-w-5xl px-4 sm:px-6 lg:px-8">
                      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            onClick={() => {
                              selectCurrentTab(tab.name)
                            }}
                            className={c(
                              tab.current
                                ? 'border-pink-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
                {currentTab === "Profile" &&
                  <div className="mt-6 max-w-lg  px-4 sm:px-6 lg:px-8">

                    <Form
                      model={data}
                      onSubmit={onSubmit}
                      className="space-y-4">

                      {apiError && <ErrorMessage error={apiError}/>}

                      <FormField type="tel" name="email"
                                 label={"Phone"}
                                 required>
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

                      <FormField type="gender" name="gender"
                                 label={"Gender"}
                                 required>
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

                      <FormField type="text" name="address"
                                 label={"Address"}
                                 required>
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

                      <FormField type="text" name="specialization"
                                 label={"Specialization"}
                                 required>
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

                      <FormField type="number" name="appointmentDuration"
                                 label={"Appointment Duration"}
                                 required>
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
                  </div>
                }

                {currentTab === "Ratings" &&
                  <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <p className="text-sm text-gray">Ratings Appear Here</p>
                    </dl>
                  </div>
                }

              </article>
            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

