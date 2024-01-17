"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useAuth } from "./auth-provider"

export default function Navbar() {

  const pathname = usePathname()

  const auth = useAuth()
  console.log("auth ", auth)

  const isUserPage = pathname?.includes("/user")
  const isAdminPage = pathname?.includes("/admin")


  const loginGoogle = async () => {
    console.log('Button clicked');
    try {
      await auth?.loginGoogle();
      console.log('Login function executed');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    auth?.logout()
      .then(() => {
        console.log("Logged out!");
      })
      .catch(() => {
        console.error("Something went wrong");
      });

  };

  return (

    <div className="fixed top-12 left-0 w-full flex items-center justify-center" style={{ zIndex: 2 }}>
      <div className="flex items-center bg-slate-200/10 gap-2 py-1 px-2 rounded-full">
        {auth?.currentUser && !auth?.isPro && !auth?.isAdmin &&
          (
            <div className='bg-pink-600 text-white font-semibold'>
              User
            </div>
          )}

        {auth?.currentUser && auth?.isAdmin &&
          (
            <div className='bg-orange-600 text-white font-semibold'>
              Admin
            </div>
          )}
        {!auth?.currentUser && (
          <button
            className="text-white text-sm font-semibold bg-orange-700" onClick={loginGoogle}>
            Sign in with google
          </button>
        )}
        {auth?.currentUser && (
          <button
            className="text-white text-sm font-semibold bg-gray-800" onClick={logout}>
            Log out
          </button>
        )}
        {auth?.currentUser && (
          <div className='mr-12'>
            <p className='text-white text-sm font-semibold'>
              {auth.currentUser.displayName}
            </p>
            <p className='text-gray-400 text-xs font-semibold'>
              {auth.currentUser.email}
            </p>
          </div>
        )}
        {isUserPage || isAdminPage && (<Link
          href={"/"}
          className="text-white text-sm font-semibold p-2 Ohover:bg-slate-9">
          Go to Home page
        </Link>)}
        {!isUserPage && (<Link
          href={"user"}
          className="text-white text-sm font-semibold p-2 Ohover:bg-slate-9">
          Go to user page
        </Link>)}
        {!isAdminPage && (<Link
          href={"admin"}
          className="text-white text-sm font-semibold p-2 Ohover:bg-slate-9">
          Go to admin page
        </Link>)}
      </div>
    </div>

  )
}

