"use client"

import { getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC44OQqkp6XLB2Bf5WcVurWM-m6TqLVsm4",
  authDomain: "nextjs-barber-auth.firebaseapp.com",
  projectId: "nextjs-barber-auth",
  storageBucket: "nextjs-barber-auth.appspot.com",
  messagingSenderId: "443299750330",
  appId: "1:443299750330:web:3312d1fe4647130348fd83"
};

let auth: Auth | undefined = undefined;



const currentApps = getApps();

if (currentApps.length <= 0) {

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(auth,
      `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`)
  }
} else {

  auth = getAuth(currentApps[0]);

  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(auth,
      `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`)
  }
}

export { auth };