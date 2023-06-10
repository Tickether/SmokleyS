import styles from '@/styles/Orders.module.css'
import { useAccount } from 'wagmi'
import { Network, Alchemy } from 'alchemy-sdk';
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Product } from '@/models/models'
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import OrderItem from '@/components/order/orderItem';
import ShipOutBulk from '@/components/shipOut/shipOutBulk';


interface ordersInfoProps { 
  names: any[]
  tokens: bigint[]
  claims: bigint[]
}


const Orders : NextPage = () => {

    const [openModal, setOpenModal] = useState(false)
    const [orders, setOrders] = useState<any[]>([]);
    const [finalOrders, setFinalOrders] = useState<ordersInfoProps>();
    const [shippable, setShippable] = useState<boolean>()
    const [ownedProducts, setOwnedProducts] = useState<any[]>([])

    const {address, isConnected} = useAccount()

    const [connected, setConnected] = useState<boolean>(false)

    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        } if (!isConnected && typeof isConnected === 'boolean') {
            setConnected((false))
        }
    },[isConnected])

    useEffect(() => {
        const fetchData = async () => {
        const settings = {
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
            network: Network.ETH_SEPOLIA,
        };

        const alchemy = new Alchemy(settings);

        try {
            const nfts = await alchemy.nft.getNftsForOwner(address!, { contractAddresses: ['0x23477F5DbeBFeec97eEC4C39c408FA0e6868b239'] });
            console.log(nfts.ownedNfts)
            setOwnedProducts(nfts.ownedNfts);
        } catch (error) {
            console.error('Failed to fetch owned NFTs:', error);
        }
        };

        fetchData();
    }, []);

    //const ownProducts = (JSON.parse(ownedProducts)).ownedNfts
    //console.log(ownProducts) 

  

    console.log(orders)
    console.log(orders.length)

    useEffect(() => {
        const tokens = []
        const claims = []
        const names = []

        for (let i = 0; i < orders.length; i++) {
            //console.log(orders.length) 
        if (orders[i].remain !== 0 && orders[i].claim !== 0) {
            names.push(orders[i].name)
            tokens.push(BigInt(orders[i].token))
            claims.push(BigInt(orders[i].claim))   
        }
        }

        const ordersInfo ={ 
        names: names,
        tokens: tokens,
        claims: claims
        }

        
        if (ordersInfo.claims.length === 0) {
        setShippable(false)
        } else {
        setShippable(true)
        }

        console.log(tokens, claims)
        setFinalOrders(ordersInfo)
    },[orders]) 

    const handleOrders = (order: any) => {
        setOrders((prevOrders) => {
        // Check if the order already exists in the array
        const orderExists = prevOrders.some((prevOrder) => prevOrder.token === order.token);

        if (orderExists) {
            // Update the existing order in the array
            return prevOrders.map((prevOrder) => (prevOrder.token === order.token ? order : prevOrder));
        } else {
            // Add the new order to the array
            return [...prevOrders, order];
        }
        });
    };

  return (
    <>
      <Navbar/>
      <div className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.claim}>
                            <div className={styles.claimItems}>
                                {
                                    ownedProducts.length <= 0 
                                    ? <h1>you have no claims</h1>
                                    : ownedProducts.map(( product: Product) => 
                                        <OrderItem 
                                            key={product.tokenId} 
                        
                                            product={product} 
                                            Order={handleOrders}
                                        /> 
                                    )
                                }
                            </div>
                            <div>
                                <button 
                                    onClick={() => setOpenModal(true)}
                                    disabled={!shippable || !connected}
                                >
                                    Ship Selected
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {openModal && <ShipOutBulk setOpen ={setOpenModal} finalOrders ={finalOrders} />}
                    
                </div>
      <Footer/>
    </>
  )
}
export default Orders
