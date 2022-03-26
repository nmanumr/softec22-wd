import React, {Fragment} from "react";
import c from 'classnames';
import {Popover, Transition} from "@headlessui/react";
import {BellIcon} from "@heroicons/react/outline";

export default function NotificationsDropDown() {
  return (
    <Popover className="relative">
      {({open}) => (
        <>
          <Popover.Button
            className={c(
              open ? 'text-gray-500' : 'text-gray-400 hover:text-gray-500',
              'ml-5 flex-shrink-0 bg-white rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600'
            )}
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true"/>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className="absolute z-10 max-w-sm w-full px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">

                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}