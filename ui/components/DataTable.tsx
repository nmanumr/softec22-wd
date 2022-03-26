import React, {Fragment, ReactNode} from 'react';
import {Menu, Transition} from '@headlessui/react';
import {DotsVerticalIcon} from '@heroicons/react/solid';
import c from 'classnames';

export interface Column<R> {
  key: keyof R | string;
  name: string;
  render?: (row: R) => ReactNode;
}

export interface Action<R> {
  label: string;
  danger?: boolean;
  perform: (row: R) => void;
}

const renderLoader = (columnCount: number) => (
  <tbody className="bg-white divide-y divide-gray-200 animate-pulse">
  {
    [1, 2, 3].map((i) => (
      <tr key={i}>
        {[...Array(columnCount)].map((_, j) => (
          // eslint-disable-next-line react/no-array-index-key
          <td className="px-6 py-4" key={`${i}-${j}`}>
            <div className="h-4 bg-gray-200 rounded w-3/4">&nbsp;</div>
          </td>
        ))}
      </tr>
    ))
  }
  </tbody>
);

const renderNoData = (columnCount: number) => (
  <tr className="bg-white">
    <td colSpan={columnCount} className="px-6 py-4 whitespace-nowrap text-center text-gray-500 text-sm">
      No data available
    </td>
  </tr>
);

function renderCell<R>(column: Column<R>, row: R) {
  if (column.render) {
    return column.render(row);
  }

  return row[column.key as keyof R];
}

function renderActions<R>(actions: Action<R>[], row: R) {
  if (actions.length < 3) {
    return actions.map((action) => (
      <button
        key={action.label}
        type="button" onClick={() => action.perform(row)}
        className={c(
          action.danger ? 'text-red-600 hover:text-red-800' : 'text-indigo-600 hover:text-indigo-800',
          'font-medium',
        )}
      >
        {action.label}
      </button>
    ));
  }

  return (
    <>
      <button
        key={actions[0].label}
        type="button" onClick={() => actions[0].perform(row)}
        className={actions[0].danger ? 'text-red-600 hover:text-red-800' : 'text-indigo-600 hover:text-indigo-800'}
      >
        {actions[0].label}
      </button>

      <Menu as="div">
        <Menu.Button
          className="flex z-0 items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 rounded">
          <span className="sr-only">More options</span>
          <DotsVerticalIcon className="h-5 w-5" aria-hidden="true"/>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1 z-10">
              {actions.slice(1).map((action) => (
                <Menu.Item key={action.label}>
                  <button
                    type="button" onClick={() => action.perform(row)}
                    className={c(action.danger ? 'text-red-600' : 'text-gray-700', 'hover:bg-gray-100 block px-4 py-2 text-sm w-full text-left')}
                  >
                    {action.label}
                  </button>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}

function renderTableBody<R>(data: R[], columns: Column<R>[], actions?: Action<R>[]) {
  return data.map((row, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={i.toString()}>
      {columns.map((column) => (
        // eslint-disable-next-line react/no-array-index-key
        <td key={`${i}-${column.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {renderCell(column, row)}
        </td>
      ))}
      {actions && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
          <div className="flex justify-end space-x-4">
            {renderActions(actions, row)}
          </div>
        </td>
      )}
    </tr>
  ));
}

export default function DataTable<R = Object>({
  columns, actions, loading, data,
}: {
  columns: Column<R>[],
  actions?: Action<R>[],
  loading?: boolean;
  data: R[];
}) {
  const columnCount = columns.length + ((actions && actions.length) ? 1 : 0);

  return (
    <div className="flex flex-col">
      <div className="sm:-mx-6 lg:-mx-8 ">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="border overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key as string} scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.name}
                  </th>
                ))}
                {actions && actions.length && (
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only"/>
                  </th>
                )}
              </tr>
              </thead>
              {
                loading ? renderLoader(columnCount) : (
                  <tbody className="bg-white divide-y divide-gray-200">
                  {data.length
                    ? renderTableBody(data, columns, actions)
                    : renderNoData(columnCount)}
                  </tbody>
                )
              }
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
