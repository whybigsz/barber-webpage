
import { cookies } from 'next/headers';
import { auth } from '../../../firebase/server';
import { DecodedIdToken } from 'firebase-admin/auth';

export const getAuthToken = (): string | undefined => {
  const cookieStore = cookies();
  return cookieStore.get('firebaseIdToken')?.value;
};

export const verifyIdToken = async (token: string | undefined): Promise<DecodedIdToken | null> => {
  try {
    if (token && auth) {
      return await auth.verifyIdToken(token);
    }
    return null;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
};

// firebaseUtils.ts

import { firestore } from '../../../firebase/server';
import { format } from 'date-fns';

export const handleConfirmBooking = async (bookingDate: any, bookingWeekday: any, bookingTime: any, bookingName: any, bookingCellphone: any, browserIdentifier: any) => {
  "use server"
  try {

    const formattedDate = new Date(bookingDate).toISOString();

    // Create a unique identifier by concatenating date and time
    const uniqueId = `${bookingTime} ${bookingWeekday} ${browserIdentifier}`;


    const bookingsRef = firestore?.collection('bookings');
    const existingDoc = await bookingsRef?.doc(uniqueId).get();

    if (!existingDoc?.exists) {
      await bookingsRef?.doc(uniqueId).set({
        id: uniqueId,
        date: formattedDate,
        time: bookingTime,
        weekday: bookingWeekday,
        name: bookingName,
        cellphone: bookingCellphone,
        browserIdentifier: browserIdentifier,
      });
    }

    console.log('Booking confirmed:', uniqueId);
    // You can add additional logic here, such as sending notifications or updating UI.
  } catch (error) {
    console.error('Error confirming booking:', error);
  }
};

export const handleCancelBooking = async (bookingTime: any, bookingWeekday: any, browserIdentifier: any) => {
  "use server"
  try {
    // Create a unique identifier by concatenating date and time
    const uniqueId = `${bookingTime} ${bookingWeekday} ${browserIdentifier}`;

    const bookingsRef = firestore?.collection('bookings');
    const existingDoc = await bookingsRef?.doc(uniqueId).get();

    if (existingDoc?.exists) {
      await bookingsRef?.doc(uniqueId).delete();
      console.log('Booking canceled:', uniqueId);
      // You can add additional logic here, such as sending notifications or updating UI.
    } else {
      console.warn('Booking not found:', uniqueId);
      // Handle the case where the booking to cancel doesn't exist
    }
  } catch (error) {
    console.error('Error canceling booking:', error);
  }
};

export const fetchBookings = async () => {
  "use server"
  try {
    const bookingsRef = firestore?.collection('bookings');
    const snapshot = await bookingsRef?.get();

    if (!snapshot?.empty) {
      const bookings = snapshot?.docs.map(doc => doc.data());
      return bookings;
    } else {
      console.log('No bookings found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};


export const saveClosedDatesToFirebase = async (selectedDates: any[]): Promise<void> => {
  "use server"
  try {
    const closedDaysRef = firestore?.collection('closedDays');
    await Promise.all(selectedDates.map(async (date: string | number | Date) => {
      const timestamp = new Date(date).toISOString();
      const existingDoc = await closedDaysRef?.doc(timestamp).get();
      if (!existingDoc?.exists) {
        await closedDaysRef?.doc(timestamp).set({ date: timestamp });
      }
    }));

    console.log('Selected Closed Dates saved:', selectedDates);
  } catch (error) {
    console.error('Error saving closed dates:', error);
  }
};

export const fetchClosedDatesFromFirebase = async () => {
  "use server";
  try {
    const closedDaysRef = firestore?.collection('closedDays');
    const closedDaysSnapshot = await closedDaysRef?.get();

    if (closedDaysSnapshot) {
      return closedDaysSnapshot?.docs.map((doc) => doc.id) || [];
    }
  } catch (error) {
    console.error('Error fetching closed dates from Firebase:', error);
    return [];
  }
};

export const fetchWorkingDaysFromFirebase = async () => {
  "use server"
  try {
    const workingDaysRef = firestore?.collection('workingDays');
    const workingDaysSnapshot = await workingDaysRef?.get();

    if (workingDaysSnapshot) {
      return workingDaysSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          date: doc.id,
          name: data.name,
          openTime: data.openTime,
          closeTime: data.closeTime,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching working days from Firebase:', error);
    return [];
  }
};
