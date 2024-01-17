import { cookies } from 'next/headers';
import { Item, ItemAccess } from "../api/items/route"
import { auth, firestore } from '../../../firebase/server';
import { DecodedIdToken } from 'firebase-admin/auth';
import AdminCalendar from '../components/AdminCalendar';
import AdminLayout from './layout';
import { pt } from 'date-fns/locale';
import { format } from 'date-fns';


interface Day {
  id: number;
  date: string;
  name: string;

}

interface OpeningHour {
  name: string;
  openTime: string;
  closeTime: string;
}

const AdminPage: React.FC = async () => {


  const cookieStore = cookies()
  const authToken = cookieStore.get("firebaseIdToken")?.value;

  if (!authToken || !auth) {
    return <h1 className='text-white text-xl mb-10'>Restricted Page auth</h1>
  }

  let user: DecodedIdToken | null = null
  try {
    user = await auth.verifyIdToken(authToken)
    console.log("admin page: ", user)
  } catch (error) {
    console.log("admin page ", error)
  }

  if (!user) {
    return <h1 className='text-white text-xl mb-10'>Restricted Page</h1>
  }
  const isAdmin = user.role === "admin"

  if (!isAdmin) {
    return <h1 className='text-white text-xl mb-10'>Restricted Page admin</h1>
  }

  let items: Item[] = [];
  const response = await fetch(`${process.env.API_URL}/api/items?${Date.now()}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    }
  });
  if (response.ok) {
    const itemsJson = await response.json();
    console.log(itemsJson)
    if (itemsJson && itemsJson.length > 0) items = itemsJson;
  }



  const handleSaveClosedDate = async (selectedDate: string | number | Date): Promise<void> => {
    "use server";
    try {
      // Extract the date part from the provided string
      const dateString = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate;
      const dateWithoutDayName = dateString.split(' ')[1];  // Assuming the day name is separated by a space
      const dateObject = new Date(dateWithoutDayName);

      console.log("dateObject:", dateObject);
      // // Check if dateObject is a valid date
      // if (isNaN(dateObject.getTime())) {
      //   console.error('Invalid date:', dateString);
      //   return;
      // }

      // Add the selected date to the 'closedDays' collection in Firestore
      const closedDaysRef = firestore?.collection('closedDays');
      const formattedDate = format(dateObject, 'yyyy-MM-dd');
      const dayName = format(dateObject, 'EEEE', { locale: pt });
      const timestamp = new Date(dateObject).toISOString();
      const existingDoc = await closedDaysRef?.doc(timestamp).get();
      if (!existingDoc?.exists) {
        // Assuming openTime and closeTime are hardcoded for illustration purposes
        const openTime = '09:00';
        const closeTime = '17:00';

        await closedDaysRef?.doc(timestamp).set({
          id: formattedDate,
          name: dayName,
          openTime,
          closeTime,
        });
      }

      console.log('Selected Closed Date saved:', formattedDate);
      // Send WebSocket update to clients
      //sendUpdateToClients({ type: 'closeDate', date: formattedDate });
      //updateClosedDates([formattedDate]);
    } catch (error) {
      console.error('Error saving closed date:', error);
    }
  };


  const handleReopenClosedDay = async (selectedDate: string | number | Date): Promise<void> => {
    "use server";
    try {
      // Remove the selected date from the 'closedDays' collection in Firestore
      const closedDaysRef = firestore?.collection('closedDays');
      const timestamp = new Date(selectedDate).toISOString();
      const existingDoc = await closedDaysRef?.doc(timestamp).get();
      if (existingDoc?.exists) {
        await closedDaysRef?.doc(timestamp).delete();
      }

      console.log('Selected Closed Date reopened:', selectedDate);
    } catch (error) {
      console.error('Error reopening closed date:', error);
    }
  };



  const fetchClosedDatesFromFirebase = async () => {
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

  // Call the function directly when the component mounts
  let closedDatesFromFirebase = fetchClosedDatesFromFirebase();

  const saveHours = async (openingHrs: OpeningHour[], days: Day[]): Promise<void> => {
    "use server"
    try {
      // Loop through each day and save the working hours to Firestore
      for (const day of days) {
        const workingDayData = {
          name: day.name,
          openTime: openingHrs.find((x) => x.name === day.name)?.openTime || '08:00',
          closeTime: openingHrs.find((x) => x.name === day.name)?.closeTime || '19:00',
        };

        // Assuming you have a Firebase instance initialized
        await firestore?.collection('workingDays').doc(String(day.date)).set(workingDayData);
      }

      console.log('Working hours saved successfully!');
    } catch (error) {
      console.error('Error saving working hours:', error);
    }
  };



  return (
    <AdminLayout>
      <div className="container flex flex-col h-auto w-full">
        <AdminCalendar handleSaveClosedDate={handleSaveClosedDate}
          handleReopenClosedDay={handleReopenClosedDay}
          initialClosedDates={closedDatesFromFirebase}
          fetchClosedDatesFromFirebase={fetchClosedDatesFromFirebase}
          saveHours={saveHours} />
      </div>
    </AdminLayout>
  )
}


export default AdminPage;