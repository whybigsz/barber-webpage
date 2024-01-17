import { DecodedIdToken } from 'firebase-admin/auth';
import { auth, firestore } from "../../../../../firebase/server";
import { NextRequest, NextResponse } from "next/server";
import { useTheme } from '@emotion/react';
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {



  try {
    if (!firestore)
      return new NextResponse("Internal Error firestore ", { status: 500 });

    const authToken = request.headers.get("authorization")?.match(/Bearer (.+)/)?.[1] || null;

    let user: DecodedIdToken | null = null;

    if (auth && authToken) {
      try {
        user = await auth.verifyIdToken(authToken);
        console.log("user/route ", user);
      } catch (error) {
        console.log("user/route ", error);
        // Handle the error or return an appropriate response
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const isAdmin = user?.role === "admin"

    const valid = isAdmin || user?.uid === params.userId;
    if (!valid) return new NextResponse("Unauhorized", { status: 401 })

    const userDocument = await firestore.collection("users")
      .doc(params.userId)
      .get();
    const userData = userDocument.data();

    return NextResponse.json(userData)
  } catch (error) {
    return new NextResponse("Internal Error userdata", { status: 500 });
  }

}