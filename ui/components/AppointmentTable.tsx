/* This example requires Tailwind CSS v2.0+ */
import {useEffect, useRef} from 'react'
import {addDays, format, getDay} from 'date-fns'

export default function AppointmentTable({appointments, startingHour = 8, onClick}: React.PropsWithChildren<any>) {
  const container: any = useRef(null)
  const containerNav: any = useRef(null)
  const containerOffset: any = useRef(null)

  function scrollToHour(hour: number) {
    const currentMinute = hour * 60
    container.current.scrollTop =
      ((container.current.scrollHeight - containerNav.current.offsetHeight - containerOffset.current.offsetHeight) *
        currentMinute) /
      1440
  }

  useEffect(() => {
    scrollToHour(startingHour);
  }, [])

  return (
    <div className="flex h-full max-h-[900px] flex-col">
      <div ref={container} className="flex flex-auto flex-col overflow-auto bg-white">
        <div style={{width: '165%'}} className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
          >
            <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                M <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">10</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                T <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">11</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                W{' '}
                <span
                  className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                  12
                </span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                T <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">13</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                F <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">14</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                S <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">15</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                S <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">16</span>
              </button>
            </div>

            <div
              className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
              <div className="col-end-1 w-14"/>
              {
                Array(7).fill(0).map((_, i) => {
                  return (
                    <div className="flex items-center justify-center py-3">
                      <span>
                        {format(addDays(new Date(), i), "EEE")} <span
                        className="items-center justify-center font-semibold text-gray-900">{format(addDays(new Date(), i), "d")}</span>
                      </span>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100"/>
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))'}}
              >
                <div ref={containerOffset} className="row-end-1 h-7"/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    12AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    1AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    2AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    3AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    4AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    5AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11AM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    12PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    1PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    2PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    3PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    4PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    5PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10PM
                  </div>
                </div>
                <div/>
                <div>
                  <div
                    className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11PM
                  </div>
                </div>
                <div/>
              </div>

              {/* Vertical lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                <div className="col-start-1 row-span-full"/>
                <div className="col-start-2 row-span-full"/>
                <div className="col-start-3 row-span-full"/>
                <div className="col-start-4 row-span-full"/>
                <div className="col-start-5 row-span-full"/>
                <div className="col-start-6 row-span-full"/>
                <div className="col-start-7 row-span-full"/>
                <div className="col-start-8 row-span-full w-8"/>
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto'}}
              >
                {
                  appointments && appointments['results'].map((appointment: any) => {

                    const duration = Math.abs(appointment['doctor']['appointmentDuration'] / 5);
                    let time = new Date(appointment['time']);
                    appointment['hourOffset'] = Math.floor((((time.getHours() * 60) + time.getMinutes()) / 5) + 2);
                    appointment['dateOffset'] = time.getDate() - new Date().getDate();

                    return (
                      <li onClick={() => onClick && onClick(appointment)}
                          className={`${onClick && 'cursor-pointer'} relative mt-px flex sm:col-start-${appointment['dateOffset']}`}
                          style={{gridRow: `${appointment['hourOffset']} / span ${duration}`}}>
                        <div
                          className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                        >
                          <p className="order-1 font-semibold text-blue-700">{appointment['patient']['displayName']}</p>
                          <p className="text-blue-500 group-hover:text-blue-700">
                            <time
                              dateTime={appointment['time'].toString()}>{format(new Date(appointment['time']), 'K:mm a')}</time>
                          </p>
                        </div>
                      </li>
                    );
                  })
                }
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
