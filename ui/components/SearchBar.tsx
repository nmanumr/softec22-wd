import c from "classnames";
import { HTMLProps, useRef, useState } from "react";
import { SearchIcon } from "@heroicons/react/solid";


interface Props {
  selectedTag?: string;
  onTagChange?: (tag: string) => void;
  isAuthenticated?: boolean;
}
const topics = ['nearby','search based','recommended','all'];

function Tag({
  isActive,
  className,
  children,
  x = false,
  type = "button",
  ...props
}: { isActive: boolean; x?: boolean } & HTMLProps<HTMLButtonElement>) {
  let classNames = c(
    className,
    "flex items-end space-x-0.5 whitespace-nowrap rounded-full border px-4 py-1 transition duration-200"
  );

  if (x) {
    if (isActive) {
      classNames = c(classNames, "bg-sky-600 text-white");
    } else {
      classNames = c(
        classNames,
        "border-sky-500 bg-white text-sky-600 hover:bg-sky-200"
      );
    }
  } else {
    if (isActive) {
      classNames = c(classNames, "bg-slate-600 text-white");
    } else {
      classNames = c(
        classNames,
        "border-gray-300 bg-white text-gray-600 hover:bg-gray-200"
      );
    }
  }

  return (
    <button type={type as any} {...props} className={classNames}>
      {children}
    </button>
  );
}

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

export default function SearchBar({
  onTagChange = () => {},
  selectedTag,
  isAuthenticated,
}: Props) {
  const [scroll, setScroll] = useState(0);
  const tagsRef = useRef<HTMLDivElement>(null);
  const opacity = easeOutQuart(Math.max(0, 1 - scroll / 180));

  return (
    <div className="bg-white rounded-full shadow-sm overflow-hidden border border-gray-200">
      <div className="relative mx-auto max-w-screen-xl pr-4 sm:pr-6">
        <div
          className="absolute inset-y-0 ml-4 flex w-full max-w-sm items-center"
          style={{ opacity, pointerEvents: opacity === 0 ? "none" : "all" }}
        >
          <SearchIcon className="pointer-events-none absolute left-4 h-6 w-6 text-gray-400" />
          <input
            onFocus={() => {
              tagsRef.current?.scroll({ left: 0, behavior: "smooth" });
            }}
            onKeyPress={() => {
              tagsRef.current?.scroll({ left: 0, behavior: "smooth" });
            }}
            className="w-full border-transparent bg-transparent py-6 pl-14 pr-4 placeholder:text-gray-500 focus:outline-none"
            placeholder="Search for doctors"
          />
        </div>
        <div
          className="flex flex-1 overflow-y-auto"
          ref={tagsRef}
          onScroll={(e) => setScroll((e.target as any)?.scrollLeft)}
        >
          <div className="min-w-content flex">
            <div className="sticky left-0 z-20 h-full w-8 bg-gradient-to-r from-white" />

            <div className="relative z-10 ml-96 flex items-center space-x-3 py-5">
              <Tag
                onClick={() => onTagChange("all")}
                isActive={selectedTag === "all"}
              >
                All
              </Tag>

              {topics.map((name,k) => (
                <Tag
                  key={k}
                  onClick={() => onTagChange(name)}
                  isActive={selectedTag === name}
                >
                  {name}
                </Tag>
              ))}
            </div>
            <div className="sticky right-0 z-20 h-full w-8 bg-gradient-to-l from-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
