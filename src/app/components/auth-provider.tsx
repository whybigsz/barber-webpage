"use client"
import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import { createContext, useContext, useState } from "react";
import { auth } from '../../../firebase/client';
import { useEffect } from 'react';
import Cookies from "js-cookie"



export function getAuthToken(): string | undefined {
  return Cookies.get("firebaseIdToken")
}

export function setAuthToken(token: string): string | undefined {
  return Cookies.set("firebaseIdToken", token, { secure: true })
}

export function removeAuthToken(): void {
  return Cookies.remove("firebaseIdToken")
}


type AuthContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  isPro: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: any }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    console.log("Before onAuthStateChanged");
    console.log("auth in AuthProvider:", auth);
    if (!auth) return;

    return auth.onAuthStateChanged(async (user) => {

      if (!user) {
        console.log("setCurrentUser(null);");
        setCurrentUser(null);
        setIsAdmin(false);
        setIsPro(false);
        removeAuthToken();
      }

      if (user) {
        const token = await user.getIdToken()
        //await user.getIdTokenResult(true);
        setCurrentUser(user);
        setAuthToken(token)

        console.log("user provider ", user)

        const tokenValues = await user.getIdTokenResult(true);
        console.log("tokenValues ", tokenValues)
        setIsAdmin(tokenValues.claims.role === "admin");

        const userResponse = await fetch(`/api/users/${user.uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })

        if (userResponse.ok) {
          const userJson = await userResponse.json()
          if (userJson?.isPro) setIsPro(true);
        } else {
          console.error("Could not get user info")
        }
      }
    });
  }, []);

  function loginGoogle(): Promise<void> {
    console.log("login google");
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }
      console.log("Before signInWithPopup");
      signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
          const user = result.user;
          console.log("Signed in!", user);
          window.location.reload(); // Reload the page
          resolve();
        })
        .catch((error) => {
          console.error("Something went wrong", error);
          reject();
        });
    });
  }
  function logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }
      auth
        .signOut()
        .then((user) => {
          console.log("Signed out!");
          removeAuthToken(); // Clear the authentication token
          window.location.reload(); // Reload the page
          resolve();
        })
        .catch(() => {
          console.error("Something went wrong");
          reject();
        });
    });
  }

  return (

    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isPro,
        loginGoogle,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

// Separate export for loginGoogle
export const useAuth = () => useContext(AuthContext)