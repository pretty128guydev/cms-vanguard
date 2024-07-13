import { Image } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Logo = ({variant}) => {
  return (
    <div>
        <Link href="/" className="flex md:me-24 items-center">
          {/* <Image
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-6 sm:h-8 me-1 sm:me-2"
            alt="FlowBite Logo"
            width={32}
            height={32}
          />
          <span className="text-lg md:text-2xl font-bold tracking-tight sm:text-xl whitespace-nowrap ">
            Vanguard Landmark
          </span> */}

          <div className="flex items-center justify-center mb-6">
            <Image
              src="/icons/logo2019.png"
              alt="FlowBite Logo"
              width={100}
              height={32}
            />
          </div>
        </Link>
    </div>
  )
}

export default Logo
