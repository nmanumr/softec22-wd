import axios from "axios";
import {KeyboardEventHandler, useEffect, useState} from 'react';
import {
  useForm, FormProvider, useFormContext,
  Mode, UseFormReturn, FieldError,
  UseFormRegisterReturn,
} from 'react-hook-form';
import {formatRequestError} from "./ErrorMessage";

interface FormProps {
  mode?: Mode;
  reValidateMode?: Exclude<Mode, 'onTouched' | 'all'>;
  criteriaMode?: 'firstError' | 'all',
  onSubmit: (e: Record<string, any>, form: UseFormReturn) => void;
  className?: string;
  model?: Record<string, any>;
}

interface FormInputProps {
  name: string,
  label?: string,
  required?: boolean,
  type: string,
  pattern?: RegExp,
  minLength?: number,
  maxLength?: number,
  onChange?: (e: {target: any, type?: any}, form: UseFormReturn) => void,
}

interface PatchableFormFieldProps extends Exclude<FormInputProps, 'required'> {
  endpoint: string;
  onSave?: () => void;
  onCancel?: () => void;
  formClassName?: string;
  value?: string;
}

export interface FormInputFuncProps extends UseFormRegisterReturn {
  label: string;
  errors: FieldError
}

export interface SingleFieldFormFuncProps extends FormInputFuncProps {
  autoFocus: true;
  cancel: () => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  loading: boolean;
}

export function Form(props: React.PropsWithChildren<FormProps>) {
  const mode = props.mode || 'onSubmit';
  const criteriaMode = props.criteriaMode || 'all';
  const reValidateMode = props.reValidateMode || 'onChange';
  const { model, onSubmit, children, className } = props;

  const form = useForm({
    mode, reValidateMode, defaultValues: model, criteriaMode,
  });

  useEffect(() => {
    if (model) {
      Object.entries(model).forEach(([k, v]) => {
        form.setValue(k, v);
      });
    } else {
      form.reset();
    }
  }, [form, model]);

  return (
    <FormProvider {...form}>
      {typeof children === 'function'
        ? children(form)
        : (
          <form
            className={className} noValidate
            onSubmit={form.handleSubmit((e) => onSubmit(e, form))}
          >
            {children}
          </form>
        )}
    </FormProvider>
  );
}

export function FormField({
  name, label, required, type, pattern,
  minLength, maxLength, children, onChange,
}: React.PropsWithChildren<FormInputProps>) {
  const form = useFormContext();

  // onBlur, onChange, name, ref
  const inputProps = form.register(name, {
    required: required ? `${label || name} field is required` : false,
    pattern: type === 'email' ? {
      value: /^([^\s@])+@(([^\s@.])+\.)+([^\s.]{2,})+$/i,
      message: 'Invalid email address',
    } : pattern,
    minLength: minLength ? {
      value: minLength,
      message: `${label || name} should be at least ${minLength} character long`,
    } : undefined,
    maxLength: maxLength ? {
      value: maxLength,
      message: `${label || name} should be less than ${maxLength} character long`,
    } : undefined,
  });

  if (onChange) {
    const inputOnChange = inputProps.onChange;

    inputProps.onChange = (e) => {
      onChange(e, form);
      return inputOnChange(e);
    };
  }

  if (typeof children === 'function') {
    return children({
      ...inputProps,
      type,
      label,
      errors: form.formState.errors[name],
    });
  }

  return children;
}

export function SingleFieldForm({
  formClassName, value, children, endpoint,
  onSave = () => {}, onCancel = () => {},
  ...formFieldProps
}: React.PropsWithChildren<PatchableFormFieldProps>) {
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: Record<string, any>, form: UseFormReturn) => {
    setLoading(true);
    axios.patch(endpoint, {[formFieldProps.name]: data[formFieldProps.name]})
      .then(() => onSave())
      .catch((e) => {
        form.setError(formFieldProps.name, formatRequestError(e));
      })
      .finally(() => setLoading(false));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
      e.preventDefault();
    }
  }

  return (
    <Form onSubmit={onSubmit} model={{[formFieldProps.name]: value}} className={formClassName}>
      <FormField {...formFieldProps}>
        {(props: FormInputFuncProps) => (
          typeof children === 'function'
            ? children({
              ...props,
              autoFocus: true,
              cancel: onCancel,
              onKeyDown,
              loading
            })
            : children
        )}
      </FormField>
    </Form>
  )
}