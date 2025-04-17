import { isAuthenticated } from '@/lib/actions/auth.actions'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import{ ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated()
  if (!isUserAuthenticated) redirect("/sign-in")
  
  return (

    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-2'>
          <Image
            src="/logo.svg"
            width={38}
            height={32}
            alt='Logo'
          />
          <h2 className='text-primary-100'> Stack Prep</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout