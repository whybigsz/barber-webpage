import { NextRequest, NextResponse } from 'next/server';
import { auth, firestore } from '../../../../firebase/server';
import { DecodedIdToken } from 'firebase-admin/auth';

export enum ItemAccess {
  PUBLIC = "PUBLIC",
  USER = "USER",
  PRO = "PRO",
  ADMIN = "ADMIN"
}

export type Item = {
  id: string;
  title: string;
  access: ItemAccess;
}

const defaultItems: Item[] = [

  { id: "item-1", title: "I am a public item", access: ItemAccess.PUBLIC },
  { id: "item-2", title: "I am a user item", access: ItemAccess.USER },
  { id: "item-3", title: "I am a admin item", access: ItemAccess.ADMIN },
];


export async function GET(request: NextRequest) {

  try {

    if (!firestore) {
      return new NextResponse("Error: No Firestore", { status: 500 })
    }

    const authToken = request.headers.get("authorization")?.match(/Bearer (.+)/)?.[1] || null;

    let user: DecodedIdToken | null = null;

    if (auth && authToken) {
      try {
        user = await auth.verifyIdToken(authToken);
        console.log("items/route ", user);
      } catch (error) {
        console.log("items/route ", error);
        // Handle the error or return an appropriate response
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const isAdmin = user?.role === "admin"

    let userInfo = null;
    if (user) {
      const userInfoResponse = await fetch(`${process.env.API_URL}/api/users/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
      );
      if (userInfoResponse.ok) {
        userInfo = await userInfoResponse.json();
      }
    }

    const isPro = userInfo?.isPro;

    const firestoreCall = user && !isPro && !isAdmin ? firestore.collection("items")
      .where("access", "in", [
        ItemAccess.PUBLIC,
        ItemAccess.USER,
      ])
      .get() : isPro && !isAdmin ? firestore.collection("items")
        .where("access", "in", [
          ItemAccess.PUBLIC,
          ItemAccess.USER,
          ItemAccess.PRO,
        ]).get() : isAdmin ? firestore.collection("items").get() : firestore.collection("items")
          .where("access", "==", ItemAccess.PUBLIC).get();



    const response = await firestoreCall;
    const items = response.docs.map((doc) => doc.data())

    if (items.length <= 0) {
      const batch = firestore.batch();
      defaultItems.forEach((item) => {
        const itemRef = firestore?.collection("items").doc()
        if (itemRef) batch.set(itemRef, item)
      })
      batch.commit()
      return NextResponse.json(defaultItems)
    }

    return NextResponse.json(items)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}