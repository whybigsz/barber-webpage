"use client"
import ReactCalendar from "react-calendar"
import React, { useState, useEffect } from 'react';
import { add, format } from "date-fns"
import { IoArrowBackCircle } from "react-icons/io5";
import { AgendaConfirm } from "./AgendaConfirm";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Import the styles

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
  },
  buttonsStyling: false
});


const Agenda = ({ handleConfirmBooking, handleCancelBooking, fetchBookings, onClose, fetchClosedDatesFromFirebase, fetchWorkingDaysFromFirebase }) => {


  const [bookings, setBookings] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [closedDays, setClosedDays] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      const fetchedBookings = await fetchBookings();
      setBookings(fetchedBookings);
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 3000); // 3 seconds
    // Fetch closed dates immediately
    fetchClosedDatesFromFirebase()
      .then((newData) => {
        setClosedDays(newData);
      })
      .catch((error) => console.error('Error fetching closed dates:', error));

    // Set up interval to fetch closed dates every 3 seconds
    setInterval(() => {
      fetchClosedDatesFromFirebase()
        .then((newData) => {
          setClosedDays(newData);
        })
        .catch((error) => console.error('Error fetching closed dates:', error));
    }, 3000); // 3 seconds

    // Fetch working days initially
    fetchWorkingDaysFromFirebase()
      .then((workingData) => {
        setWorkingDays(workingData);
      })
      .catch((error) => console.error('Error fetching working days:', error));

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);

  }, [fetchClosedDatesFromFirebase]);

  console.log("closedDays ", closedDays)
  console.log('workingDays', workingDays);

  const [date, setDate] = useState({
    justDate: null,
    dateTime: null,
  });

  const getTimes = () => {
    if (!date.justDate) return;

    const { justDate } = date;
    const workingDay = workingDays.find((day) => day.date === justDate.toISOString());

    if (workingDay) {
      const { openTime, closeTime } = workingDay;
      const beginning = add(justDate, { hours: parseInt(openTime.split(':')[0]), minutes: parseInt(openTime.split(':')[1]) });
      const end = add(justDate, { hours: parseInt(closeTime.split(':')[0]), minutes: parseInt(closeTime.split(':')[1]) });
      const interval = 30; // in minutes

      const currentTime = new Date(); // Get the current time

      const times = [];
      for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
        // Only include times that are in the future and within working hours
        if (i > currentTime) {
          times.push(i);
        }
      }
      return times;
    } else {
      // Handle days that are not part of working days
      const beginning = add(justDate, { hours: 8 });
      const end = add(justDate, { hours: 19 });
      const interval = 30; // in minutes

      const currentTime = new Date(); // Get the current time

      const times = [];
      for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
        // Only include times that are in the future and within working hours
        if (i > currentTime) {
          times.push(i);
        }
      }
      return times;
    }
  };

  const times = getTimes();

  const formatMonthYear = (locale, date) => {
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString(locale, options);

    // Make the first letter uppercase and apply bold style
    return (
      <span style={{ fontWeight: 'bold', cursor: 'none' }} onClick={() => null}>
        {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
      </span>
    );
  };

  const tileClassName = ({ date }) => {
    const formattedDate = new Date(date).toISOString();

    // Check if the date is in closedDates or openDates
    const isClosed = closedDays.includes(formattedDate);

    // Apply appropriate class based on conditions
    if (isClosed) {
      return 'closed';
    } else {
      return '';
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  let weekday = capitalizeFirstLetter(new Date(date.justDate).toLocaleDateString('pt-BR', { weekday: 'long' }));

  const updateConfirmation = () => {
    setConfirmation(false);
  };

  const currentBrowserIdentifier = localStorage.getItem('browserIdentifier');


  return (
    <section id='agenda'>

      {date.justDate && !confirmation ? (
        <div className='flex flex-col items-center'>
          <p className='p-2 font-semibold text-white text-lg'>
            {weekday}
          </p>
          <div className='grid grid-cols-4 xs:grid-cols-3 gap-4 p-2 rounded-lg relative '>
            {times.map((time, i) => {
              const booking = bookings.find(
                booking => booking.date === date.justDate.toISOString() && booking.time === format(time, 'kk:mm')
              );

              const isBooked = Boolean(booking);
              const canCancel = isBooked && booking.browserIdentifier === currentBrowserIdentifier;

              return (
                <div key={`time-${i}`} className='p-1 rounded-lg text-white' style={{ backgroundColor: isBooked ? 'rgba(112,61,52,255)' : 'rgb(48,52,68)' }}>
                  <button
                    type='button'
                    onClick={() => {
                      if (canCancel) {
                        // Show confirmation dialog before canceling
                        Swal.fire({
                          text: "Deseja cancelar marcação?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "rgb(48,52,68)",
                          cancelButtonColor: "rgba(112,61,52,255)",
                          confirmButtonText: "Sim",
                          cancelButtonText: "Não",
                          reverseButtons: false
                        }).then((result) => {
                          if (result.isConfirmed) {
                            swalWithBootstrapButtons.fire({
                              text: "A tua marcação foi cancelada.",
                              icon: "success"
                            });
                            handleCancelBooking(booking.time, booking.weekday, booking.browserIdentifier)
                          }
                        });
                      } else {
                        console.log(time);
                        setSelectedTime(format(time, 'kk:mm'));
                        setConfirmation(true);
                      }
                    }}
                    disabled={isBooked && !canCancel}
                  >
                    {!isBooked ? (format(time, 'kk:mm')) : <BsFillBookmarkCheckFill color='white' />}
                  </button>
                </div>
              );
            })}
            {/* Add a button to go back to React Calendar */}

          </div>
          <div>
            <IoArrowBackCircle
              className="mt-3 w-10 h-10 cursor-pointer"
              color='white'
              onClick={() => {
                setDate((prev) => ({ ...prev, justDate: null }));
              }}
            />
          </div>
        </div>
      ) : (
        date.justDate && confirmation ? (
          // Add your JSX for the confirmation state here
          <AgendaConfirm handleConfirmBooking={handleConfirmBooking} weekday={weekday} date={date.justDate} time={selectedTime} updateConfirmation={updateConfirmation} onClose={() => { onClose(); }} />
        ) : (
          <div className="calendar-container">
            <ReactCalendar
              selectionColor='transparent'
              showOnFocus={false}
              className='react-calendar p-2 text-white font-bold overflow-hidden'
              view='month'
              minDate={new Date()}
              onClickDay={(selectedDate) => setDate((prev) => ({ ...prev, justDate: selectedDate }))}
              formatShortWeekday={(locale, date) => ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][date.getDay()]}
              formatMonthYear={formatMonthYear}
              tileClassName={tileClassName}
              tileDisabled={({ date }) => [0].includes(date.getDay())}
            />
            {/* Add a button inside the calendar */}
            <IoArrowBackCircle
              className="absolute top-[85%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 mt-10 cursor-pointer"
              color='white'
              onClick={() => {
                onClose();
                // You can also perform other actions related to the button click here
                // For example, resetting state or performing additional logic
              }}
            />
          </div>
        )
      )}
    </section>
  )
}

export default Agenda