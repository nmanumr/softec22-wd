import { Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import c from 'classnames';
import { AxiosError } from "axios";

function formatErrorArray(obj: Array<string>) {
  return (
    <ul>
      {/* eslint-disable-next-line no-use-before-define,react/no-array-index-key */}
      {obj.map((error, i) => <li key={i}>{formatError(error)}</li>)}
    </ul>
  );
}

function formatErrorObject(obj: Record<string, string | string[]>) {
  if (obj.message && obj.code) {
    return obj.message;
  }

  return (
    <ul>
      {
        Object.keys(obj)
          .filter((k) => k !== 'nonFieldErrors')
          .map((key) => (
            <li key={key}>
              <b>
                {key}
                :
                {/* eslint-disable-next-line no-use-before-define */}
                {formatError(obj[key])}
              </b>
            </li>
          ))
      }
    </ul>
  );
}

function formatError(obj?: Array<AxiosError | string> | Record<string, string | string[]> | any) {
  if (obj === null || obj === undefined) {
    return '';
  }

  if (Array.isArray(obj)) {
    return formatErrorArray(obj);
  }

  if (typeof obj === 'object') {
    return formatErrorObject(obj);
  }

  return obj.toString();
}

export function formatRequestError(e: AxiosError | string) {
  if (typeof e === 'string') {
    return e;
  }

  if (!e.response || e.response.headers['content-type'] !== 'application/json') {
    return e.message || e.response?.statusText;
  }

  if (e.request.status >= 500) {
    return 'Internal server error while handling your request. Please try again later';
  }

  return formatError(e.response.data);
}

interface Props {
  title?: string;
  className?: string;
  error: AxiosError | string;
  isClosable?: boolean;
}

export default function ErrorMessage({
  title, className, error, isClosable = true, ...props
}: Props) {
  const [visible, setVisible] = useState(true);

  return (
    <Transition
      show={visible && !!error}
      as={Fragment}
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95"
    >
      <div className={c(className, 'flex bg-red-50 p-4 rounded')} {...props}>
        <div className="flex-shrink-0 text-red-400">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd" clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            />
          </svg>
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm leading-5 font-medium mt-5 text-red-800">
              {{ title }}
            </h3>
          )}
          <div className="text-sm leading-5 text-red-700">
            {formatRequestError(error)}
          </div>
        </div>
        {isClosable && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button" onClick={() => setVisible(false)}
                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100
                focus:outline-none focus:bg-red-100 transition ease-in-out duration-150"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd" clipRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414
                    10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0
                    01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </Transition>
  );
}
