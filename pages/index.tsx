import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import styles from '@/styles/Home.module.css'
import type { GetServerSideProps, NextPage } from 'next'
import { Network, Alchemy } from 'alchemy-sdk';
import { Product } from '../models/models'
import ProductItem from '@/components/product/productItem';

export const getServerSideProps: GetServerSideProps = async () => {
  
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, //"wQhhyq4-jQcPzFRui3PljR6pzRwd5N_n",
    network: Network.ETH_SEPOLIA,
  };

  // init with key and chain info 
  const alchemy = new Alchemy(settings);
  // Print total NFT collection returned in the response:
  const { nfts } = await alchemy.nft.getNftsForContract("0x23477F5DbeBFeec97eEC4C39c408FA0e6868b239")
  const loadedProducts = JSON.stringify(nfts)
  // console.log(nfts) 
  // Pass data to the page via props
  return { props: { loadedProducts } }
}

const Products : NextPage <{ loadedProducts: string }> = ({ loadedProducts })=> {

  const loadProducts = (JSON.parse(loadedProducts))
  console.log(loadProducts) 

  return (
    <>
      <Navbar/>
        <div className={styles.container}>
            <div className={styles.wrapper}>
              
              <div className={styles.products}>
                {loadProducts.map(( product: Product) =>(
                  <ProductItem product={product} key={product.tokenId}/>
                ))}
              </div>
         
            </div>
          </div>
      <Footer/>
    </>
  )
}

export default Products
