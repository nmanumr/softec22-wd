import classNames from 'classnames';
import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

export default function Select({
  data, defaultValue, onChange, labelKey, valueKey, label,
}: any) {
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    if (defaultValue) {
      setCurrentValue(data.find((item: any) => item[valueKey || 'value'] === defaultValue));
    } else {
      setCurrentValue(null);
    }
  }, [data, defaultValue, valueKey]);

  const wrappedOnChange = (value: any) => {
    setCurrentValue(value);
    onChange(value[valueKey || 'value']);
  };

  return (
    <Listbox value={currentValue} onChange={wrappedOnChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">{label}</Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button
              className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <span className="block truncate">{currentValue ? currentValue[labelKey || 'name'] : 'Select'}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {data.map((item: any) => (
                  <Listbox.Option
                    key={item[valueKey || 'value']}
                    className={({ active }) => classNames(
                      active ? 'text-white bg-indigo-600' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-3 pr-9',
                    )}
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {item[labelKey || 'name']}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}