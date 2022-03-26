import DashboardLayout
  from "../../layouts/DashboardLayout";
import SearchBar from "../../components/SearchBar";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import UserAvatar from "../../components/UserAvatar";
import Button from "../../components/Button";

const people = [
  {
    name: 'Dr Steven Horse',
    role: 'General Physician',
    imageUrl:
      'https://media.istockphoto.com/photos/doctor-holding-digital-tablet-at-meeting-room-picture-id1189304032?k=20&m=1189304032&s=612x612&w=0&h=ovTNnR0JX2cRZkzMBed9exRO_PamZLlysLDFkXesr4Q=',
    twitterUrl: '#',
    linkedinUrl: '#',
  },
  {
    name: 'Dr Lindsay Walton',
    role: 'Skin Specialist',
    imageUrl:
      'https://media.istockphoto.com/photos/portrait-of-mature-male-doctor-wearing-white-coat-standing-in-picture-id1203995945?k=20&m=1203995945&s=612x612&w=0&h=g0_ioNezBqP0NXrR_36-A5NDHIR0nLabFFrAQVk4PhA=',
    twitterUrl: '#',
    linkedinUrl: '#',
  },
  {
    name: 'Dr Patrica Gray',
    role: 'Neuro Surgeon',
    imageUrl:
      'https://previews.123rf.com/images/stockasso/stockasso1507/stockasso150700127/42512102-%E8%87%AA%E4%BF%A1%E3%82%92%E6%8C%81%E3%81%A3%E3%81%A6%E5%A5%B3%E6%80%A7%E5%8C%BB%E8%80%85%E5%BD%BC%E5%A5%B3%E3%81%AE%E3%82%AA%E3%83%95%E3%82%A3%E3%82%B9%E3%81%A7%E3%83%9D%E3%83%BC%E3%82%BA%E3%80%81%E3%82%AB%E3%83%A1%E3%83%A9%E3%80%81%E5%8C%BB%E7%99%82%E3%80%81%E4%BA%88%E9%98%B2%E3%81%AE%E6%A6%82%E5%BF%B5%E3%81%A7%E7%AC%91%E9%A1%94.jpg',
    twitterUrl: '#',
    linkedinUrl: '#',
  },
]

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
               <UserAvatar user={doc} classNames="h-12 w-12 xl:w-12 xl:h-12" />
            </div>
            <div className="flex-grow">
              <div className="font-medium text-lg leading-6">{doc.displayName}</div>
              <div className="text-sm text-gray-600">{doc.specialization}</div>
            </div>
            <div>
              <button className="text-sm text-indigo-600 font-medium py-2 px-4 bg-indigo-50 rounded">Add Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}