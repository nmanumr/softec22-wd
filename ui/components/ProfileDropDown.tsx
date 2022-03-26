import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import c from 'classnames';
import useSWR from 'swr';
import LinkTo from './LinkTo';
import { setToken } from '../providers/auth';
import UserAvatar from "./UserAvatar";

export default function ProfileDropDown() {
  const { data } = useSWR('/api/user/current');
  const router = useRouter();

  const logout = async () => {
    setToken();
    await router.push('/login');
  };

  if (!data) {
    return <></>;
  }

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
          <span className="sr-only">Open user menu</span>
          <UserAvatar user={data} classNames="h-8 w-8" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-200 flex flex-col px-4 py-2 mb-2 text-sm">
            <span className="text-gray-600">Signed in as:</span>
            <span className="font-medium truncate">{data.email}</span>
          </div>
          <Menu.Item>
            {({ active }) => (
              <LinkTo href="/profile" className={c(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                My Account
              </LinkTo>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button type="submit" onClick={logout} className={c(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-left')}>
                Logout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
