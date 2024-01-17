import { firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from 'firebase-admin/auth';
import { auth, config } from "firebase-functions";

initializeApp(config().firebase);
export const onUserCreate = auth.user().onCreate(async (user) => {

  if (user.email && user.email === "admin@example.com") {
    await firestore().doc(`users/${user.uid}`).create({
      isPro: true,
    });

    const customClaims = {
      role: "admin"
    };

    try {
      await getAuth().setCustomUserClaims(user.uid, customClaims);
    } catch (error) {
      console.log(error);
    }

    return;
  }

  if (user.email && user.email === "pro@example.com") {
    await firestore().doc(`users/${user.uid}`).create({
      isPro: true,
    });
    return;
  }

  await firestore().doc(`users/${user.uid}`).create({
    isPro: false,
  });
});