import { DecodedIdToken } from 'firebase-admin/auth';
import { Item, ItemAccess } from "../api/items/route"
import { cookies } from "next/headers"
import { auth } from '../../../firebase/server';

export default async function UserPage() {

  const cookieStore = cookies()
  const authToken = cookieStore.get("firebaseIdToken")?.value;

  if (!authToken || !auth) {
    return <h1 className='text-black text-xl mb-10'>Restricted Page</h1>
  }

  let user: DecodedIdToken | null = null
  try {
    user = await auth.verifyIdToken(authToken)
    console.log("user page: ", user)
  } catch (error) {
    console.log("user page ", error)
  }

  if (!user) {
    return <h1 className='text-black text-xl mb-10'>Restricted Page</h1>
  }

  let userInfo = null;
  const userInfoResponse = await fetch(`${process.env.API_URL}/api/users/${user.uid}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    }
  });

  if (userInfoResponse.ok) {
    userInfo = await userInfoResponse.json();
    console.log("userinfo ", userInfo)
  }

  const isPro = userInfo?.isPro;

  if (!isPro) {
    return <h1 className='text-black text-xl mb-10'>Restricted Page isPro</h1>
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


  return (

    <div className="container flex flex-col h-auto w-full">
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className='flex items-center justify-center w-full gap-20'
          >
            <p>{item.title}</p>
            <span
              className={`${item.access === ItemAccess.ADMIN ? "bg-orange-600" : "bg-emerald-500"
                } text-white text-xs px-2 py-1 rounded-full`}
            >
              {item.access}
            </span>
          </div>
        )
      })}
    </div>
  )
}