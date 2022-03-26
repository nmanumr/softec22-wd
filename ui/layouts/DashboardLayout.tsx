import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import c from 'classnames'
import { useRouter } from "next/router";
import ProfileDropDown from "../components/ProfileDropDown";

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'History', href: '#' },
  { name: 'Appointments', href: '/appointments' },
]
const userNavigation = [
  { name: 'Profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function DashboardLayout({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-white shadow-sm">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-4 h-16">
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    <img
                      className="block h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt="Workflow"
                    />
                    <h4 className="font-medium font-2xl">ClinicX</h4>
                  </div>

                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={c(
                          item.href == router.pathname
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>

                  <div className="flex-grow" />

                  <div className="flex items-center">
                    <ProfileDropDown />
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button
                      className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true"/>
                      ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={c(
                        item.href == router.pathname
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                        'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>
      </div>
    </>
  )
}