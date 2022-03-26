import Axios from 'axios';
import {useState} from 'react';
import {useRouter} from 'next/router';
import {UseFormReturn} from "react-hook-form";

import Button from "../../components/Button";
import {setToken} from "../../providers/auth";
import CompactLayout from '../../layouts/CompactLayout';
import ErrorMessage from '../../components/ErrorMessage';
import {Form, FormField, FormInputFuncProps} from '../../components/form';


export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const router = useRouter();
  const onSubmit = (value: Record<string, any>, Form: UseFormReturn) => {
    setApiError('');
    if (value.password !== value.confirmPassword) {
      Form.setError('confirmPassword', {message: "Passwords does not match"});
      return;
    }

    setLoading(true);

    const {password} = value;
    const {uid, token} = router.query;
    Axios.post('/api/user/reset', {uid, token, password})
      .then((res) => {
        setToken(res.data.token);
        router.push('/accounts/login');
      })
      .catch((e) => {
        setApiError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <CompactLayout title="Reset your Password">
      <div className="mb-6 text-base">
        Please enter your new password
      </div>
      <Form onSubmit={onSubmit} className="space-y-4">
        {apiError && <ErrorMessage error={apiError}/>}

        <FormField name="password" type="password" label="New Password" required>
          {({errors, label, ...props}: FormInputFuncProps) => (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="password" type="password" autoComplete="current-password" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>
        <FormField name="confirmPassword" type="password" label="Confirm Password" required>
          {({errors, label, ...props}: FormInputFuncProps) => (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id="confirmPassword" type="password" autoComplete="current-password" {...props}
                className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
            </div>
          )}
        </FormField>
        <div className="pt-2">
          <Button className="w-full" type="submit" loading={loading}>Reset</Button>
        </div>
      </Form>
    </CompactLayout>
  );
}
