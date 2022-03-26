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
    <Form onSubmit={onSubmit}>

    </Form>
  );
}