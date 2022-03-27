import useSWR from "swr";
import c from 'classnames';
import { useState } from "react";
import { StarIcon } from "@heroicons/react/solid";

import SearchBar from "../../components/SearchBar";
import UserAvatar from "../../components/UserAvatar";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data } = useSWR(`/api/clinic/doctors/search?query=${encodeURIComponent(searchQuery)}`);

  return (
    <DashboardLayout>
      <SearchBar onSearchChange={setSearchQuery}/>

      <div className="space-y-4 divide-y divide-gray-200 mt-10">
        {data?.map((doc: any) => (
          <div className="flex items-start py-4 px-4 sm:px-6 space-x-4" key={doc.id}>
            <div className="shrink-0">
              <UserAvatar user={doc} classNames="h-12 w-12 xl:w-12 xl:h-12"/>
            </div>
            <div className="grow">
              <div className="font-medium text-lg leading-6">{doc.displayName}</div>
              <div className="text-sm text-gray-600">{doc.specialization}</div>
              <div className="flex items-center mt-2">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={c(
                      Math.floor(doc.rating) > rating ? 'text-yellow-400' : 'text-gray-300',
                      'flex-shrink-0 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
            <div>
              <a
                href={`/patient/add-appointment?doc=${doc.id}`}
                className="text-sm text-indigo-600 font-medium py-2 px-4 bg-indigo-50 rounded"
              >
                Add Appointment
              </a>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}