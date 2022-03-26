import { Form } from "./form";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export default function ClinicTiming() {
  const [apiError, setApiError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (value: Record<string, any>, Form: UseFormReturn) => {
    console.log(value);
  };

  return (
    <Form onSubmit={onSubmit} className="space-y-4 mt-6 max-w-lg px-4 sm:px-6 lg:px-8 grid grid-cols-[100px_1fr]">
      <div className="font-medium text-gray-600">Monday</div>
      <div className="flex items-center">
        <input
          type="text"
          className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
        />
        <input
          type="text"
          className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="font-medium text-gray-600">Tuesday</div>
      <div />
      <div className="font-medium text-gray-600">Wednesday</div>
      <div />
      <div className="font-medium text-gray-600">Thursday</div>
      <div />
      <div className="font-medium text-gray-600">Friday</div>
      <div />
      <div className="font-medium text-gray-600">Saturday</div>
      <div />
      <div className="font-medium text-gray-600">Sunday</div>
      <div />
    </Form>
  );
}