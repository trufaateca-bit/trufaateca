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
        <h2>Las mejores trufas de España</h2>
        <p>Trufas de diferentes variedades</p>
      </div>

      <div className='products-container'>
        {productos?.map((product) => <Producto key={product._id} product={product}/> )}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]}/>
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