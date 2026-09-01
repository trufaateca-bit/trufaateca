import React, { useState, useEffect } from 'react';
import { urlFor, client } from '@/lib/sanity_client';
import { AiFillStar, AiOutlineMinus, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai';
import { Producto } from '@/components';
import { useStateContext } from '../../context/StateContext';

const gramOptions = [300, 500, 750, 1000];

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd } = useStateContext();
  const [gramIndex, setGramIndex] = useState(0);
  const grams = gramOptions[gramIndex]; // Current selected grams

  const handleMinus = () => {
    setGramIndex(prev => Math.max(prev - 1, 0));
  };

  const handlePlus = () => {
    setGramIndex(prev => Math.min(prev + 1, gramOptions.length - 1));
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img className="product-detail-image" src={urlFor(image && image[index])} />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
          </div>
          <p>(20)</p>
          <h3>Details:</h3>
          <p>{details}</p>

          <h3>Gramos</h3>
          <div className="gram-buttons">
            {gramOptions.map((gram, i) => (
              <button
                key={gram}
                className={`gram-button ${i === gramIndex ? 'selected' : ''}`}
                onClick={() => setGramIndex(i)}
              >
                {gram}gr
              </button>
            ))}
          </div>

          <div className="quantity">
            <p className="quantity-desc">
              <span className="minus" onClick={handleMinus}><AiOutlineMinus /></span>
              <span className="num">{grams}</span>
              <span className="plus" onClick={handlePlus}><AiOutlinePlus /></span>
            </p>
          </div>

          <h3>Cantidad</h3>
          <div className="quantity">
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>

          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => onAdd(product, qty, grams)}
            >
              Añadir a la cesta
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>Quizás también te guste</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Producto key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: { slug: product.slug.current },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const productQuery = `*[_type == "products" && slug.current == '${slug}'][0]`;
  const productosQuery = '*[_type == "products"]';

  const product = await client.fetch(productQuery);
  const products = await client.fetch(productosQuery);

  const bannerQuery = `*[_type == "banner"]`;
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, product , bannerData},
  };
};

export default ProductDetails;
