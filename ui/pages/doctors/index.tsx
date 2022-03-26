import DashboardLayout
    from "../../layouts/DashboardLayout";
import SearchBar from "../../components/SearchBar";

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
    // More people...
]

export default function Doctors() {
    return (
        <DashboardLayout>
            <SearchBar/>
            <div className="bg-slate">
                <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
                        <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                        </div>
                        <ul role="list" className="sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:grid-cols-3 lg:gap-8">
                            {people.map((person) => (
                                <li key={person.name} className="py-10 px-6 text-center rounded-lg xl:px-10 xl:text-left">
                                    <div className="flex">
                                        <img className="h-20 w-20 rounded-full xl:w-22 xl:h-22 object-cover" src={person.imageUrl} alt="" />
                                        <div className="space-y-2 ml-8 flex ">
                                            <div className="font-medium text-lg leading-6 flex flex-col justify-items-start align-start content-start">
                                                <h3 className="text-black">{person.name}</h3>
                                                <p className="text-indigo-400">{person.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                </div>
            </div>
        </DashboardLayout>
    )
}