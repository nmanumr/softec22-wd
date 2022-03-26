import Axios from 'axios';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

import {setToken} from "../../providers/auth";
import ErrorMessage from '../../components/ErrorMessage';


export default function VerifyEmail() {
  const [apiError, setApiError] = useState();
  const router = useRouter();

  useEffect(() => {
    Axios.post('/api/user/verify-email', {token: router.query.token})
      .then(() => {
        router.push(`/`);
      })
      .catch((e) => {
        setApiError(e);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      {
        apiError
          ? (
            <div className="flex flex-col items-center max-w-md w-full space-y-4">
              <div className="w-full">
                {apiError && <ErrorMessage error={apiError} isClosable={false}/>}
              </div>
              <p className="text-sm">
                <button type="button" onClick={() => window.location.reload()}
                        className="text-gray-700 shadow-sm border border-gray-200 bg-white rounded px-3 py-1.5">
                  Try Again
                </button>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="border-[3px] border-gray-300 border-t-gray-600 w-8 h-8 rounded-full animate-spin"/>
              <p className="text-sm text-gray-700">
                Verifying your token...
              </p>
            </div>
          )
      }
    </div>
  );
}
