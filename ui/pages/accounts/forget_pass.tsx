import Axios from 'axios';
import {useState} from 'react';

import Button from "../../components/Button";
import LinkTo from "../../components/LinkTo";
import CompactLayout from '../../layouts/CompactLayout';
import ErrorMessage from '../../components/ErrorMessage';
import {Form, FormField, FormInputFuncProps} from "../../components/form";


export default function ForgetPassword() {
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (value: Record<string, any>) => {
    setApiError('');
    setEmailSent(false);
    setLoading(true);

    Axios.post('/api/user/forget/', value)
      .then(() => {
        setEmailSent(true);
      })
      .catch((e) => {
        setApiError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <CompactLayout title={"Recover Password"}>
      {!emailSent
        ? (
          <Form onSubmit={onSubmit} className="space-y-4">
            <div className="mb-6 text-gray-600 text-center">
              Please enter your email address to search for your account.
            </div>
            {apiError && <ErrorMessage error={apiError}/>}
            <FormField name="email" type="email" label="Email" required>
              {({errors, label, ...props}: FormInputFuncProps) => (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    id="email" type="email" autoComplete="email" {...props}
                    className="appearance-none shadow-sm block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 sm:text-sm focus:z-10 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors && <p className="text-xs mt-1.5 text-red-600">{errors.message}</p>}
                </div>
              )}
            </FormField>
            <div className="flex">
              <Button className="w-full" type="submit" loading={loading}>Recover Password</Button>
            </div>
          </Form>
        ) : (
          <div className="text-center">
            <h1 className="text-xl font-bold">Email Sent Successfully</h1>
            <p className="mt-2 text-gray-600">Please check your email to continue.</p>
            <div className="pt-4 text-center">
              <LinkTo href="/accounts/login" className="font-medium text-indigo-600 hover:text-indigo-700">Goto
                Login</LinkTo>
            </div>
          </div>
        )}
    </CompactLayout>
  );
}
