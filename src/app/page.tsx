"use client"

import Button from '@/components/ui/Button'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  return (<div className="relative h-screen">
            <div className="absolute inset-0">
                <Image
                    src="/background.jpeg"
                    alt="background image"
                    fill
                />
            </div>
            <button onClick={() => signOut()}>Sign out</button>
            // <div className="relative z-10 flex flex-col items-center justify-center h-full">
                // <h1 className='text-2xl font-bold text-gray-200'>Next JS 13 Background Image with Tailwind CSS </h1>
                // <p className='mt-4 text-sm text-white'>lorem ipsom Next JS 13 Background Image with Tailwind CSS</p>
            // </div>
        </div>)
  // return <button onClick={() => signOut()}>Sign out</button>
}
