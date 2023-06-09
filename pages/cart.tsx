import styles from '@/styles/Cart.module.css'
import { NextPage } from 'next'
import { useRecoilState } from 'recoil'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { cartState } from '@/atom/cartState'
import { formatEther } from 'viem'
import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CartItem from '@/components/cart/cartItem'


const Cart : NextPage = () => {
    const [cartItem, setCartItem] = useRecoilState(cartState)
    console.log(cartItem)
    console.log(cartState)


    const {address, isConnected} = useAccount()

    const [tokenIDs, setTokenIDs] = useState<bigint[]>([])
    const [quantities, setQuantities] = useState<bigint[]>([])
    const [cartPrice, setCartPrice] = useState<bigint>(BigInt(0))
    const [totalCartPrice, setTotalCartPrice] = useState<String>()
    const [connected, setConnected] = useState<boolean>(false)

    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        }
    },[isConnected])

    useEffect(() => {
        const _tokenIDs = []
        const _quantities = []
        const _values = []
        if (cartItem.length !== 0) {
            for (let i = 0; i < cartItem.length; i++) {
            
                const price = (BigInt(cartItem[i].price))
                const total = (price)*(BigInt(cartItem[i].quantity))
                
                _values.push(total)
                _tokenIDs.push(BigInt(cartItem[i].product.tokenId))
                _quantities.push(BigInt(cartItem[i].quantity))
    
                console.log((price))
                console.log(cartItem[i].quantity)
                console.log(total)
            }
            const sumTotal = _values.reduce((acc: bigint, curr: bigint) => acc + curr, BigInt(0));
            console.log(sumTotal)
            
            setCartPrice(((sumTotal)))
            setTotalCartPrice(formatEther(sumTotal) ) //onst etherPrice = ethers.utils.formatEther(cartPrice?._hex!) sumTotal.toString()
            setTokenIDs(_tokenIDs)
            setQuantities(_quantities)   
        }
     }, [cartItem]);
    
     const { config } = usePrepareContractWrite({
        address: '0x23477F5DbeBFeec97eEC4C39c408FA0e6868b239',
        abi: [
            {
              name: 'buyBulk',
              inputs: [ {internalType: "address", name: "to", type: "address"}, {internalType: "uint256[]", name: "ids", type: "uint256[]"}, {internalType: "uint256[]", name: "amounts", type: "uint256[]" } ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
          ],
        functionName: 'buyBulk',
        args: [ (address!), (tokenIDs), (quantities) ],
        value: cartPrice,
        chainId: 11155111,
     })
    const contractWrite = useContractWrite(config)

    const waitForTransaction = useWaitForTransaction({
        hash: contractWrite.data?.hash,
        confirmations: 2,
        onSuccess() {
            /*
            addToast(`Your Order is Paid in full! You can ship anytime!!`, { 
                appearance: 'success',
                autoDismiss: true,     // Whether the toast should automatically dismiss
                autoDismissTimeout: 1500, // Timeout in milliseconds before the toast automatically dismisses
    
            });
            */
            setCartItem([])
        },
    })

    const handleBuy = async () => {
        try {
          await contractWrite.writeAsync?.()
        } catch (err) {
          console.log(err)
        }
    }
    
    return (
        <>
            <Navbar/>
                <div className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.cart}>
                            <div className={styles.cartItems}>
                                {
                                    cartItem.length <= 0 
                                    ? <h1>your cart is empty</h1>
                                    : cartItem.map(item => <CartItem key={item.product.tokenId} product={item.product} quantity={item.quantity} price={item.price}/> )
                                }
                            </div>
                            <div>
                                    {
                                        cartItem.length <= 0 
                                        ? <></>
                                        : <p className={styles.cartTotal}>TOTAL: {totalCartPrice}</p>
                                    }
                            </div>
                            <div className={styles.buy}>
                                <button className={styles.buyBtn} onClick={handleBuy} disabled={!connected || cartItem.length <= 0}>
                                    Buy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer/>
        </>
    )
}

export default Cart