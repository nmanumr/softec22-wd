import {SearchIcon} from "@heroicons/react/solid";


interface Props {
  onSearchChange?: (tag: string) => any
}

export default function SearchBar({onSearchChange = (e: any) => undefined,}: Props) {
  return (
    <div className="bg-white rounded-full shadow-sm overflow-hidden border border-gray-200">
      <div className="relative mx-auto px-4">
        <div
          className="flex w-full items-center"
        >
          <SearchIcon className="pointer-events-none absolute left-6 h-6 w-6 text-gray-400"/>
          <input
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border-transparent bg-transparent py-4 pl-12 pr-4 placeholder:text-gray-500 focus:outline-none"
            placeholder="Search for doctors"
          />
        </div>
      </div>
    </div>
  );
}
