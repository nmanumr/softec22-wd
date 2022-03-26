import c from 'classnames';
import React, {useState} from 'react';
import {
  BellIcon,
  ChartBarIcon,
  HomeIcon,
  MenuIcon,
  NewspaperIcon,
  SearchIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline';
import {Popover} from '@headlessui/react';

import ProfileDropDown from '../components/ProfileDropDown';
import LinkTo from "../components/LinkTo";
import NotificationsDropDown from "../components/NotificationsDropDown";

const navigation = [
  {name: 'Home', href: '/', icon: HomeIcon, matchExact: true},
  {name: 'News', href: '/news', icon: NewspaperIcon},
  {name: 'People', href: '/people', icon: UsersIcon},
  {name: 'Stocks', href: '/stocks', icon: ChartBarIcon},
];

const userNavigation = [
  {name: 'Your Profile', href: '#'},
  {name: 'Settings', href: '#'},
  {name: 'Sign out', href: '#'},
];

const userStocks = [
  {title: 'Apple, Inc.', symbol: 'AAPL', volume: '164.77', change: '-0.53'},
  {title: 'Tesla, Inc.', symbol: 'TSLA', volume: '1095.00', change: '-49.75'},
  {title: 'Alphabet, Inc.', symbol: 'GOOG', volume: '2832.36', change: '-16.68'},
  {title: 'Microsoft, Inc.', symbol: 'MSFT', volume: '330.08', change: '-0.51'},
  {title: 'Facebook, Inc.', symbol: 'FB', volume: '310.60', change: '-13.46'},
];

export default function DashboardLayout({children}: React.PropsWithChildren<{}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-full">
      <Popover
        as="header"
        className={({open}: { open: boolean }) =>
          c(
            open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
            'bg-white shadow-sm lg:static lg:overflow-y-visible'
          )
        }
      >
        {({open}: { open: boolean }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex justify-between lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static lg:col-span-3">
                  <div className="flex-shrink-0 flex items-center">
                    <a href="#">
                      <img
                        className="block h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark.svg?color=rose&shade=500"
                        alt="Workflow"
                      />
                    </a>
                  </div>
                </div>
                <div className="min-w-0 flex-1 md:px-8 lg:px-0 lg:col-span-7">
                  <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                    <div className="w-full">
                      <label htmlFor="search" className="sr-only">
                        Search people, stocks or watch lists
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                        </div>
                        <input
                          id="search"
                          name="search"
                          className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                          placeholder="Search people, stocks or watch lists"
                          type="search"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button
                    className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true"/>
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                    )}
                  </Popover.Button>
                </div>
                <div className="hidden lg:flex lg:items-center lg:justify-end lg:col-span-2">
                  <NotificationsDropDown />
                  <ProfileDropDown/>
                </div>
              </div>
            </div>

            <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
              <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={!item ? 'page' : undefined}
                    className={c(
                      !item ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50',
                      'block rounded-md py-2 px-3 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src="" alt=""/>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800"></div>
                    <div className="text-sm font-medium text-gray-500"></div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true"/>
                  </button>
                </div>
                <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
                  {userNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>

      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:block lg:col-span-3">
            <nav aria-label="Sidebar" className="sticky top-4 divide-y divide-gray-300">
              <div className="pb-8 space-y-1">
                {navigation.map((item) => (
                  <LinkTo
                    key={item.name}
                    href={item.href}
                    matchExact={item.matchExact || false}
                    passHref
                  >
                    {(active: boolean) => (
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <a
                        className={c(
                          'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                          active ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50',
                        )}
                      >
                        <item.icon
                          className={c(
                            'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                            active ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </a>
                    )}
                  </LinkTo>
                ))}
              </div>
              <div className="pt-3">
                <p
                  className="px-3 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  id="communities-headline"
                >
                  My Stocks
                </p>
                {userStocks.map((stock) => (
                  <LinkTo
                    key={stock.symbol}
                    href={`/stocks/${stock.symbol}`}
                    passHref
                  >
                    {(active: boolean) => (
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <a
                        className={c(
                          'flex flex-col px-3 py-2 text-sm rounded-md',
                          active ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50',
                        )}
                      >
                        <span className="flex justify-between">
                          <span className="font-semibold">{stock.symbol}</span>
                          <span className="font-medium">{stock.volume}</span>
                        </span>
                        <span className="flex justify-between">
                          <span className="text-xs">{stock.title}</span>
                          <span className="text-xs text-red-700 font-medium">{stock.change}</span>
                        </span>
                      </a>
                    )}
                  </LinkTo>
                ))}
              </div>
            </nav>
          </div>
          <main className="lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
