import React from "react";
import useSWR from "swr";
import { StarIcon } from '@heroicons/react/solid';
import c from 'classnames';

export default function DoctorRating(){
  let { data } = useSWR('/api/user/current');
  const reviews = [
    {
      id: 1,
      title: "Can't say enough good things",
      rating: 5,
      content: `I was really pleased with the overall shopping experience. My order even included a little personal, handwritten note, which delighted me! The product quality is amazing, it looks and feel even better than I had anticipated. Brilliant stuff! I would gladly recommend this store to my friends. And, now that I think of it... I actually have, many times!`,
      author: 'Risako M',
      date: 'May 16, 2021',
      datetime: '2021-01-06',
    }
  ];
  ({data} = useSWR(`/api/clinic/doctors/${data.id}/rating`));
  console.log(data);
  if(!data) return <></> ;
  if(data.count<1) return(<p>
    No ratings to display
  </p>);
  return(
    <div className="max-w-sm sm:max-w-full px-4 sm:px-6 lg:px-8">
        <div>
          <div className="max-w-2xl px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-lg font-medium text-gray-900">Your Reviews</h2>
            <div className="mt-6 pb-10 border-t border-b border-gray-200 divide-y divide-gray-200 space-y-10">
              {data.results.map((review,k) => (
                <div key={k} className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-start-5 lg:col-span-8 xl:col-start-4 xl:col-span-9 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:items-start">
                    <div className="flex items-center xl:col-span-1">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={c(
                              review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                              'h-5 w-5 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="ml-3 text-sm text-gray-700">
                        {review.rating}
                        <span className="sr-only"> out of 5 stars</span>
                      </p>
                    </div>

                    <div className="mt-4 lg:mt-6 xl:mt-0 xl:col-span-2">

                      <div
                        className="mt-3 space-y-6 text-sm text-gray-500"
                        dangerouslySetInnerHTML={{ __html: review.description}}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-sm lg:mt-0 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:flex-col lg:items-start xl:col-span-3">
                    <p className="font-medium text-gray-900">{review.patient.displayName}</p>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}