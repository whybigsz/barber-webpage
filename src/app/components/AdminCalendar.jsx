"use client"
import React, { useState, useEffect } from 'react';
import ReactCalendar from "react-calendar"
import { Switch } from '@headlessui/react'
import { classNames, capitalize, weekdayIndexToName } from '../utils/helpers';
import TimeSelector from './TimeSelector';
import { pt } from 'date-fns/locale';
import { format } from 'date-fns';


// Define days constant with open and close times
// const days = [
//   { id: '1', dayOfWeek: 0, name: 'domingo', openTime: '09:00', closeTime: '17:00' },
//   { id: '2', dayOfWeek: 1, name: 'segunda', openTime: '09:00', closeTime: '17:00' },
//   { id: '3', dayOfWeek: 2, name: 'terça', openTime: '09:00', closeTime: '17:00' },
//   { id: '4', dayOfWeek: 3, name: 'quarta', openTime: '09:00', closeTime: '17:00' },
//   { id: '5', dayOfWeek: 4, name: 'quinta', openTime: '09:00', closeTime: '17:00' },
//   { id: '6', dayOfWeek: 5, name: 'sexta', openTime: '09:00', closeTime: '17:00' },
//   { id: '7', dayOfWeek: 6, name: 'sábado', openTime: '09:00', closeTime: '17:00' },
// ];


const AdminCalendar = ({ handleSaveClosedDate, handleReopenClosedDay, initialClosedDates, fetchClosedDatesFromFirebase, saveHours }) => {


  const getDateOfWeekday = (dayOfWeek) => {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getUTCDay();
    const daysUntilNextDay = dayOfWeek - currentDayOfWeek + (dayOfWeek >= currentDayOfWeek ? 0 : 7);
    const nextDate = new Date(currentDate.getTime() + daysUntilNextDay * 24 * 60 * 60 * 1000);
    nextDate.setUTCHours(0, 0, 0, 0);
    return nextDate.toISOString();
  };

  const [days, setDays] = useState([
    { id: 1, date: getDateOfWeekday(1), dayOfWeek: 0, name: 'segunda', openTime: '08:00', closeTime: '19:00' },
    { id: 2, date: getDateOfWeekday(2), dayOfWeek: 1, name: 'terça', openTime: '08:00', closeTime: '19:00' },
    { id: 3, date: getDateOfWeekday(3), dayOfWeek: 2, name: 'quarta', openTime: '08:00', closeTime: '19:00' },
    { id: 4, date: getDateOfWeekday(4), dayOfWeek: 3, name: 'quinta', openTime: '08:00', closeTime: '19:00' },
    { id: 5, date: getDateOfWeekday(5), dayOfWeek: 4, name: 'sexta', openTime: '08:00', closeTime: '19:00' },
    { id: 6, date: getDateOfWeekday(6), dayOfWeek: 5, name: 'sábado', openTime: '09:00', closeTime: '13:00' },
    { id: 7, date: getDateOfWeekday(0), dayOfWeek: 6, name: 'domingo', openTime: '09:00', closeTime: '17:00' },
  ]);

  const [openingHrs, setOpeningHrs] = useState(
    days.map((day) => ({
      name: day.name,
      openTime: day.openTime,
      closeTime: day.closeTime,
    }))
  );

  function _changeTime(day) {
    return function (time, type) {
      const index = openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek));
      const newOpeningHrs = [...openingHrs];
      newOpeningHrs[index][type] = time;
      setOpeningHrs(newOpeningHrs);
    };
  }

  const [updateFlag, setUpdateFlag] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [openingHours, setOpeningHours] = useState(false);
  const [openDate, setOpenDate] = useState([]);
  const [closeDate, setCloseDate] = useState([]);
  const [closedDates, setClosedDates] = useState(JSON.parse(initialClosedDates?.value || '[]'));



  useEffect(() => {
    if (updateFlag) {

      console.log("days ", days)

      console.log("closed dates", closedDates)
      // Fetch closed dates from Firebase and set both openDates and closedDates
      fetchClosedDatesFromFirebase()
        .then(newData => {
          setClosedDates(newData);
          setOpenDate([""]); // Set initial openDate state
          setCloseDate(newData); // Set initial closeDate state
        })
        .catch(error => console.error('Error fetching closed dates:', error));

      setUpdateFlag(false);
    }
  }, [fetchClosedDatesFromFirebase, closedDates, updateFlag, days]);

  const handleDateChange = (date) => {
    // Convert the date to a string
    //console.log("date:", date);
    const dateString = new Date(date).toISOString();

    // Format the date in Portuguese
    const formattedDate = format(new Date(date), "EEEE yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { locale: pt });
    console.log("formattedDate:", formattedDate);

    // Check if the clicked date is already closed
    const isClosed = closedDates.includes(dateString);

    // If closed, add it to the openDate array
    if (isClosed) {
      setOpenDate((prevOpenDate) => {
        const updatedOpenDate = [dateString];
        // Log the updated state in the callback
        console.log("open date", updatedOpenDate);
        // Change the button text to indicate reopening
        setEnabled(true);
        return updatedOpenDate;
      });
    } else {
      // Toggle the selected date (add if not present, remove if already present)
      setCloseDate((prevCloseDate) => {
        const updatedCloseDate = [formattedDate];
        // Log the updated state in the callback
        console.log("close date", updatedCloseDate);
        // Change the button text to indicate saving closed dates
        setEnabled(false);
        return updatedCloseDate;
      });
    }
  };

  const handleSaveClosedDatesLocal = async () => {
    try {
      // Use the functional update form to ensure the latest state is used
      setCloseDate((prevCloseDates) => {
        // Update both local state and Firestore
        //const formattedDate = format(new Date(prevCloseDates), "EEEE yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { locale: pt });
        console.log("closeDate ", prevCloseDates);

        const updatedDates = handleSaveClosedDate(prevCloseDates);

        // Trigger the callback to update closed dates in AdminCalendar
        updateClosedDates();
        return updatedDates;
      });
    } catch (error) {
      console.error('Error saving closed dates:', error);
    }
  };

  const handleReopenClosedDaysLocal = async () => {
    try {
      // Update both local state and Firestore to remove selected dates
      setOpenDate((prevOpenDates) => {
        console.log("openDate ", prevOpenDates);
        // Trigger the callback to update closed dates in AdminCalendar
        updateClosedDates();
        return prevOpenDates;
      });
      // Update both local state and Firestore to remove selected dates
      const updatedDates = handleReopenClosedDay(openDate);

      // Trigger the callback to update closed dates in AdminCalendar
      updateClosedDates();
    } catch (error) {
      console.error('Error reopening closed days:', error);
    }
  };

  const tileClassName = ({ date }) => {
    if (!Array.isArray(openDate) || openDate.length === 0 || !Array.isArray(closeDate) || closeDate.length === 0) {

      return ''; // No special class when openDates is not an array or is empty
    }

    const formattedDate = new Date(date).toISOString();

    // Check if the date is in closedDates or openDates
    const isClosed = closedDates.includes(formattedDate);
    const isToBeClosed = closeDate.includes(formattedDate);

    // Apply appropriate class based on conditions
    if (isClosed) {
      return 'closed-day';
    } else if (isToBeClosed) {
      return 'close-day';
    } else {
      return '';
    }
  };

  const updateClosedDates = async () => {
    try {
      const newClosedDates = await fetchClosedDatesFromFirebase();

      setCloseDate((prevCloseDates) => []);
      setOpenDate((prevOpenDates) => []);
      setClosedDates((prevClosedDates) => newClosedDates);
      setEnabled(false);
      // Set the update flag to trigger the useEffect
      setUpdateFlag(true);

      console.log("closedDates ", newClosedDates);
    } catch (error) {
      console.error('Error fetching closed dates:', error);
    }
  };




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

  const [loading, setLoading] = useState(false);

  return (
    <div className='flex flex-col items-center absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' >
      <div className='flex justify-center gap-6'>
        <p className={`text-white ${!openingHours ? 'font-bold' : ''}`}>Abertura dias</p>
        <Switch
          checked={openingHours}
          onChange={() => setOpeningHours(!openingHours)}
          className={classNames(
            openingHours ? 'bg-indigo-600' : 'bg-gray-400',
            'mb-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          )}
        >
          <span className='text-white sr-only'>Use setting</span>
          <span
            aria-hidden='true'
            className={classNames(
              openingHours ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
        <p className={`text-white ${openingHours ? 'font-bold' : ''}`}>Abertura horas</p>
      </div>


      {openingHours ? (
        // Opening times options
        <div className='my-12 flex flex-col gap-8  items-center'>
          {days.map((day) => {
            const changeTime = _changeTime(day);
            return (
              <div className='grid grid-cols-3 place-items-center' key={day.id}>
                {/* Use optional chaining to handle potential null or undefined */}
                <h3 className='text-white  font-semibold'>{capitalize(weekdayIndexToName(day.dayOfWeek))}</h3>
                <div className='mx-4'>
                  <TimeSelector
                    type='openTime'
                    changeTime={changeTime}
                    selected={
                      openingHrs[
                        openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek))
                      ]?.openTime
                    }
                  />
                </div>

                <div className='mx-4'>
                  <TimeSelector
                    type='closeTime'
                    changeTime={changeTime}
                    selected={
                      openingHrs[
                        openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek))
                      ]?.closeTime
                    }
                  />
                </div>
              </div>
            );
          })}

          <button
            style={{ display: 'inline-flex', maxWidth: 'max-content' }}
            className={`text-center p-2 font-semibold text-white rounded-lg border-2 border-white border-solid mx-2 bg-green-500 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => {
              setLoading(true);

              // Simulate a loading delay of 1000 milliseconds (1 second)
              setTimeout(() => {
                saveHours(openingHrs, days).then(() => {
                  setLoading(false);
                });
              }, 1000);
            }}
          >
            {loading ? 'Saving...' : 'Save hours'}
          </button>
        </div>
      ) : (
        // Opening days options
        <div className='flex flex-col text-center items-center'>
          <span className='text-white font-bold mb-4 text-xl'>Dias a fechar</span>

          <div className="calendar-container">
            <ReactCalendar
              selectionColor='transparent'
              showOnFocus={false}
              className='react-calendar p-2 text-white font-bold overflow-hidden'
              view='month'
              minDate={new Date()}
              onClickDay={(selectedDate) => handleDateChange(selectedDate)}
              formatShortWeekday={(locale, date) => ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][date.getDay()]}
              formatMonthYear={formatMonthYear}
              tileClassName={tileClassName}
              tileDisabled={({ date }) => [0].includes(date.getDay())}
            />
          </div>
          <div className="flex flex-row p-4">
            <button
              className={`p-2 font-semibold text-white rounded-lg border-2 border-white border-solid mx-2 ${enabled ? 'bg-green-500' : 'bg-gray-700'
                }`}
              onClick={enabled ? handleReopenClosedDaysLocal : handleSaveClosedDatesLocal}
            >
              {enabled ? 'Reabrir a loja' : 'Fechar a loja'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCalendar;
