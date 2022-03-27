import useSWR from "swr";
import React, { Fragment, useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DashboardLayout from "../layouts/DashboardLayout";
import AppointmentTable from "./AppointmentTable";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import Button from "./Button";
import Axios from "axios";
import {Form, FormField, FormInputFuncProps} from "./form";
import {setToken} from "../providers/auth";
import {router} from "next/client";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const [apiError, setApiError] = useState<string>();
  const { data } = useSWR('/api/user/current');
  const { data: appointments, mutate } = useSWR('/api/clinic/appointments');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [appointment, setAppointment]: any = useState(undefined);
  const [open, setOpen]: any = useState(false);

  const onApprove = () => {
    setLoading(true);

    Axios.patch(`/api/clinic/appointments/${appointment.id}`, { status: 'ACCEPTED' })
      .then(() => {
        setOpen(false);
        return mutate();
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  };

  const onDecline = () => {
    setLoading(true);

    Axios.patch(`/api/clinic/appointments/${appointment.id}`, { status: 'REJECTED' })
      .then(() => {
        setOpen(false);
        return mutate();
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  };

  const onSubmit = async (value: Record<string, any>) => {
    setApiError('');
    setLoading(true);

    Axios.patch(`/api/clinic/appointments/${appointment.id}`, value)
      .then((response) => {
        setOpen(false)
        console.log(response.data.notes)
        appointment['notes'] = response.data.notes;
        setAppointment(appointment)
      })
      .catch((e) => {
        setApiError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (appointments && appointments.count > 0) {
      setAppointment(appointments['results'][0])
      console.log(appointment)
    }
  }, [appointments]);

  return (
    <DashboardLayout>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden z-[3001]" onClose={setOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0 bg-black bg-opacity-30"/>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 id="slide-over-heading" className="text-lg font-medium text-gray-900">
                          Appointment
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={setOpen}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true"/>
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    {
                      appointment &&
                      <div>
                        <div className="pb-1 sm:pb-6">
                          <div>
                            <div className="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
                              <div className="sm:flex-1">
                                <div>
                                  <div className="flex items-center">
                                    <h3
                                      className="text-xl font-bold text-gray-900 sm:text-2xl">{appointment['patient']['displayName']}</h3>
                                  </div>
                                </div>
                                {appointment['status'] == 'PENDING' && (
                                  <div className="mt-5 flex space-y-3 sm:space-y-0 sm:space-x-3">
                                    <Button
                                      type="button" className="w-full justify-center"
                                      loading={loading}
                                      onClick={onApprove}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      type="button" className="w-full justify-center"
                                      kind="secondary"
                                      onClick={onDecline}
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 pt-5 pb-5 sm:px-0 sm:pt-0">
                          <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Phone</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <p>
                                  {appointment['patient']['email']}
                                </p>
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Appointment
                                Time
                              </dt>
                              <dd
                                className="mt-1 text-sm text-gray-900 sm:col-span-2">{format(new Date(appointment['time']), "dd/MM/yyyy - h:m a")}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Gender</dt>
                              <dd
                                className="mt-1 text-sm text-gray-900 sm:col-span-2">{appointment['patient']['gender'] ?? 'Unknown'}</dd>
                            </div>
                          </dl>
                        </div>
                        {appointment['status'] == 'ACCEPTED' && new Date(appointment.time) > new Date() &&
                          <Form onSubmit={onSubmit} className="px-4 pt-5 pb-5 sm:px-6" model={{notes:appointment.notes}}>
                              <FormField name="notes" type="text" label={'Notes'} required>
                                {({ errors, label, ...props }: FormInputFuncProps) => (
                                  <div>
                                    <label htmlFor="text" className="block text-sm font-medium text-gray-700">{label}</label>
                                    <textarea
                                      rows = {10}
                                      id="notes" {...props}
                                      className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
                                  </div>
                                )}
                              </FormField>
                              <div className="pt-2">
                              <Button className="w-full" type="submit" loading={loading}>Submit</Button>
                          </div>

                        </Form>}
                      </div>
                    }
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <PageHeader title="Appointments"/>
      {data && (
        <AppointmentTable appointments={appointments} onClick={(app: any) => {
          setAppointment(app);
          setOpen(true)
        }}/>
      )}
    </DashboardLayout>
  );
}