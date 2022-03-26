import useSWR from "swr";
import c from 'classnames';
import React, { useState } from 'react';

import UserAvatar from "../../components/UserAvatar";
import ProfileEdit from "../../components/ProfileEdit";
import DashboardLayout from "../../layouts/DashboardLayout";
import DoctorRating from "../../components/DoctorRating";


export default function Profile() {
  const { data } = useSWR('/api/user/current');
  let [currentTab, selectCurrentTab] = useState("Profile")

  const tabs = data?.type === 'doctor' ? ['Profile', 'Clinic Timing', 'Ratings'] : [];

  if (!data) {
    return <DashboardLayout/>;
  }

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
                {tabs.length > 0 && (
                  <div className="mt-6 sm:mt-2 2xl:mt-5">
                    <div className="border-b border-gray-200">
                      <div className="max-w-5xl px-4 sm:px-6 lg:px-8">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                          {tabs.map((tab) => (
                            <button
                              key={tab}
                              onClick={() => selectCurrentTab(tab)}
                              className={c(
                                currentTab === tab
                                  ? 'border-indigo-600 text-gray-900'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                              )}
                            >
                              {tab}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
                {currentTab === "Profile" && <ProfileEdit/>}

                {currentTab === "Ratings" && <DoctorRating/>}
              </article>
            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

