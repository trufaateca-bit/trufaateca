import React from 'react'
import Head from 'next/head';
import { Footer, NavegacionBar } from '.';

const Layaout = ({children}) => {
  return (
    <div className='layout'>
      <Head>
        <title>Tienda Trufaateca</title>
      </Head>
      <header>
        <NavegacionBar/>
      </header>
      <main className='main-container'>
        {children}
      </main>
      <footer>
        <Footer/>
      </footer>
    </div>
  )
}

export default Layaout