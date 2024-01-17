
import Home from './components/home/Home.jsx'
import Shop from './components/shop/Shop.jsx'
import { Item, ItemAccess } from "./api/items/route"
import Navbar from './components/Navbar';

import { AuthProvider } from './components/auth-provider';
import { cookies } from "next/headers"
import {
  handleConfirmBooking,
  fetchClosedDatesFromFirebase,
  fetchWorkingDaysFromFirebase,
  fetchBookings,
  handleCancelBooking
} from './utils/serverUtils';

export default async function App() {

  const cookieStore = cookies()
  const authToken = cookieStore.get("firebaseIdToken")?.value;

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

  return (
    <div className="App">
      <Home
        handleConfirmBooking={handleConfirmBooking}
        handleCancelBooking={handleCancelBooking}
        fetchBookings={fetchBookings}
        fetchWorkingDaysFromFirebase={fetchWorkingDaysFromFirebase}
        fetchClosedDatesFromFirebase={fetchClosedDatesFromFirebase}
      />
      <Shop />
    </div>
  )
}




