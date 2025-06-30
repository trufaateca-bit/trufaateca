import React from 'react'

import { Producto , FooterBanner, HeroBanner,Footer} from '../components'

import {client} from '../lib/sanity_client'

const Home = ({productos,bannerData}) => {
  return (
    <>
      <HeroBanner heroBanner = {bannerData.length && bannerData[0]}/>
      {console.log(bannerData)}
      {console.log(productos)}
      <div className='products-heading'>
        <h1>¿Qué variedad eliges?</h1>
      </div>

      <div className='products-container'>
        {productos?.map((product) => <Producto key={product._id} product={product}/> )}
      </div>
    </>
  )
}

export const getServerSideProps = async() => {
  const productQuery = '*[_type == "products"]'
  const productos = await client.fetch(productQuery);

  const bannerQuery = '*[_type == "banner"]'
  const bannerData = await client.fetch(bannerQuery);

  return{
    props: {productos,bannerData}
  }
}

export default Home