import useSWR from "swr";
import { useState } from "react";

import SearchBar from "../../components/SearchBar";
import DashboardLayout from "../../layouts/DashboardLayout";
import UserAvatar from "../../components/UserAvatar";

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data } = useSWR(`/api/clinic/doctors/search?query=${encodeURIComponent(searchQuery)}`);

  console.log(data);

  return (
    <DashboardLayout>
      <SearchBar onSearchChange={setSearchQuery}/>

      <div className="space-y-4 divide-y divide-gray-200 mt-10">
        {data?.map((doc: any) => (
          <div className="flex items-center py-4 px-4 sm:px-6 space-x-4" key={doc.id}>
            <div className="flex-shrink-0">
              <UserAvatar user={doc} classNames="h-12 w-12 xl:w-12 xl:h-12"/>
            </div>
            <div className="flex-grow">
              <div className="font-medium text-lg leading-6">{doc.displayName}</div>
              <div className="text-sm text-gray-600">{doc.specialization}</div>
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