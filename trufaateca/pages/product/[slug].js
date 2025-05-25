import React ,{useState} from 'react'
import { urlFor,client } from '@/lib/sanity_client'
import { AiFillStar, AiOutlineMinus, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai'
import { Producto } from '@/components'

const gramOptions = ['300gr', '500gr', '750gr', '1kg'];

const ProductDetails = ({product,products}) => {
    const {image,name,details,price} = product;
    const [index,setIndex] = useState(0)
    const [gramIndex, setGramIndex] = useState(0);

  const handleMinus = () => {
    setGramIndex(prev => Math.max(prev - 1, 0));
  };

  const handlePlus = () => {
    setGramIndex(prev => Math.min(prev + 1, gramOptions.length - 1));
  };

  return (
    <div>
        <div className='product-detail-container'>
            <div>
                <div className='image-container'>
                    <img className='product-detail-image' src={urlFor(image && image[index])}/>
                </div>
                <div className='small-images-container'>
                    {image?.map((item,i) => (
                        <img 
                            src={urlFor(item)}
                            className={i === index ? 'small-image selected-image':'small-image'}
                            onMouseEnter={() => setIndex(i)}
                        />
                    ))}
                </div>
            </div>
            <div className='product-detail-desc'>
                <h1>{name}</h1>
                <div className='reviews'>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiOutlineStar/>
                </div>
                <p>(20)</p>
                <h4>Details:</h4>
                <p>{details}</p>
                <h3>Cantidad:</h3>
                <div className="gram-buttons">
                {gramOptions.map((gram, i) => (
                    <button
                    key={gram}
                    className={`gram-button ${i === gramIndex ? 'selected' : ''}`}
                    onClick={() => setGramIndex(i)}
                    >
                    {gram}
                    </button>
                ))}
                </div>
                <div className='quantity'>
                    <p className='quantity-desc'>
                    <span className='minus' onClick={handleMinus}><AiOutlineMinus /></span>
                    <span className='num'>{gramOptions[gramIndex]}</span>
                    <span className='plus' onClick={handlePlus}><AiOutlinePlus /></span>
                    </p>
                </div>
                <div className='buttons'>
                    <button type='button'
                    className='add-to-cart'
                    onClick=""
                    >
                        Añadir a la cesta
                    </button>
                    <button type='button'
                    className='buy-now'
                    onClick=""
                    >
                        Comprar ahora
                    </button>
                </div>
            </div>
        </div>
        <div className='maylike-products-wrapper'>
            <h2>Quizás tambien te guste</h2>
            <div className='marquee'>
                <div className='maylike-products-container track'>
                    {products.map((item) => (
                        <Producto key={item._id}
                        product={item}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export const getStaticPaths = async () =>{
    const query = `*[_type == "product"] {
        slug {
        current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map((product)=>({
        params: {
            slug: product.slug.current
        }
    }));

    return{
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async({params: {slug}}) => {
    const productQuery = `*[_type == "products" && slug.current 
    == '${slug}'][0]`

    const productosQuery = '*[_type == "products"]'

    const product = await client.fetch(productQuery);
    const products = await client.fetch(productosQuery);

  
    return{
      props: {products,product}
    }
  }

export default ProductDetails