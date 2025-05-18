import React from 'react'
import { AiFillInstagram } from 'react-icons/ai'

import { urlFor } from '@/lib/sanity_client'

const Footer = ({footerBanner}) => {
  return (
    <div className='footer-container'>
      <p>2025 Trufaateca , todos los derechos reservados</p>
      <p className='icons'>
        <AiFillInstagram/>
      </p>
    </div>
  )
}

export default Footer