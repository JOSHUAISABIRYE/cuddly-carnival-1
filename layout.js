

import { Fugaz_One, Open_Sans, } from 'next/font/google';
 

import Link from 'next/link';
import './globals.css';
import AppWrapper from './AppWrapper';
import Head from './head'




const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] })
const openSans = Open_Sans({ subsets: ['latin'], weight: ['400'] })

export const metadata = {
title: 'Broodl',
  description: 'Track your daily mood, every day of the year!',
}

export default function RootLayout({children}) {
const header = (
    <header className='p-4 sm:p-8 flex items-center justify-between gap-4 '>
      <Link href={'/'} >
      <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className }>Broodl</h1>
        </Link>
      <div className=' flex items-center justify-between '>PLACEHOLDER CTA || STATS</div>
    </header>
  )

  const footer = (
    <footer className='p-4 sm:p-8 grid place-items-center '>
      <p className={ ' text-indigo-600 ' + fugaz.className }>&copy; 2025 Broodl. All rights reserved.</p>
    </footer>)
  
  return (
    <html lang="en">
    <Head/>
      <body className={'w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800 ' + openSans.className }>
        {header}
        <AppWrapper>
          {children}
        </AppWrapper>
        {footer}
      </body>
       
    </html>
  );
}
