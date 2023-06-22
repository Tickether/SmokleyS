import styles from '@/styles/Home.module.css'
import { Product } from '@/models/models'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useRecoilState } from 'recoil'
import { CartProps, cartState } from '@/atom/cartState'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'


interface ProductProps {
    product: Product
}


export default function ProductItem ({product}: ProductProps) {

    const [cartItem, setCartItem] = useRecoilState(cartState)

    const {address, isConnected} = useAccount()

    const [etherPrice, setEtherPrice] = useState<string>('')

    const [connected, setConnected] = useState<boolean>(false)

    const [latestPrice, setLatestPrice] = useState<bigint>(BigInt(0))

    const [discounted, setDiscounted] = useState<bigint>(BigInt(0))

    const [discountedEther, setDiscountedEther] = useState<string>('')

    console.log(discounted)
    console.log(discountedEther)

    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        } if (!isConnected && typeof isConnected === 'boolean') {
            setConnected((false))
        }
    },[isConnected])

    const contractReadFee = useContractRead({
        address: "0x10fCd5E8F6370D6C17539bf6110f3ce12F70710f",
        abi: [
            {
              name: 'getLatestPrice',
              inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
              outputs: [{ internalType: "int256", name: "", type: "int256" }],
              stateMutability: 'view',
              type: 'function',
            },    
        ],
        functionName: 'getLatestPrice',
        args: [BigInt(product.tokenId)],
        chainId: 11155111,
    })
    useEffect(() => {
        if (contractReadFee?.data! && typeof contractReadFee.data === 'bigint') {
            setEtherPrice(formatEther(contractReadFee?.data!))
            setLatestPrice(contractReadFee?.data!)
        }
    },[contractReadFee?.data!])
    
    console.log(etherPrice)
    console.log(latestPrice)

    
    const  prepareContractWriteBuy = usePrepareContractWrite({
        address: "0x10fCd5E8F6370D6C17539bf6110f3ce12F70710f",
        abi: [
            {
              name: 'buy',
              inputs: [ {internalType: "address", name: "to", type: "address"}, {internalType: "uint256", name: "id", type: "uint256"}, {internalType: "uint256", name: "amount", type: "uint256" } ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
        ],
        functionName: "buy",
        args: [ (address!), (BigInt(product.tokenId)), (BigInt(1))],
        value: latestPrice,
        chainId: 11155111,
    })
    const  contractWriteBuy = useContractWrite(prepareContractWriteBuy.config)

    const handleBuy = async () => {
        try {
          await contractWriteBuy.writeAsync?.()
        } catch (err) {
          console.log(err)
        }
    }

    const contractReadDiscount = useContractRead({
        address: "0x10fCd5E8F6370D6C17539bf6110f3ce12F70710f",
        abi: [
            {
                name: 'discount',
                inputs: [],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        functionName: 'discount',
        watch: true,
        chainId: 11155111,
    })  
    console.log(contractReadDiscount.data)
      
    useEffect(() => {
        if (contractReadDiscount?.data! === BigInt(0)) {
            setDiscounted((latestPrice!))
        }else if (contractReadDiscount?.data! && typeof contractReadDiscount.data === 'bigint') {
            const discountOut = BigInt((1000 - Number(contractReadDiscount?.data!)) * (Number(latestPrice!)) / 1000)
            setDiscounted(discountOut)   
            setDiscountedEther(formatEther(discountOut))
        }
    },[contractReadDiscount?.data!, latestPrice])

    const  prepareContractWriteMemberBuy = usePrepareContractWrite({
        address: "0x10fCd5E8F6370D6C17539bf6110f3ce12F70710f",
        abi: [
            {
              name: 'memberBuy',
              inputs: [ {internalType: "address", name: "to", type: "address"}, {internalType: "uint256", name: "id", type: "uint256"}, {internalType: "uint256", name: "amount", type: "uint256" }, {internalType: "uint256", name: "memberid", type: "uint256"} ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
        ],
        functionName: "memberBuy",
        args: [ (address!), (BigInt(product.tokenId)), (BigInt(1)), (BigInt(0)) ],
        value: discounted,
        chainId: 11155111,
    })
    const  contractWriteMemberBuy = useContractWrite(prepareContractWriteMemberBuy.config)

    const handleMemberBuy = async () => {
        try {
          await contractWriteMemberBuy.writeAsync?.()
        } catch (err) {
          console.log(err)
        }
    }

    const handleCartAdd = async () => {
        try {
            if (cartItem.findIndex(cart => cart.product.tokenId ===product.tokenId) === -1) {
                setCartItem(prevState => [...prevState, { product, quantity: 1, price: latestPrice }])
                /*
                addToast('Carti!!!', { 
                    appearance: 'success',
                    autoDismiss: true,     // Whether the toast should automatically dismiss
                    autoDismissTimeout: 1500, // Timeout in milliseconds before the toast automatically dismisses
    
                });
                */
            } 
            else {
                setCartItem(prevState => {
                    const updatedCart = prevState.map(item => {
                        if (item.product.tokenId === product.tokenId) {
                            return {
                                ...item,
                                quantity: item.quantity + 1
                            };
                        }
                        return item;
                    });
                    return updatedCart as CartProps[];
                });
                /*
                addToast(`added another ${product.title} to Carti!!!`, { 
                    appearance: 'success',
                    autoDismiss: true,     // Whether the toast should automatically dismiss
                    autoDismissTimeout: 1500, // Timeout in milliseconds before the toast automatically dismisses
    
                });
                */
            }
          
        } catch (err) {
          console.log(err)
        }
    }
    
    return (
        <>
            <div className={styles.productItem}>
                <div className={styles.productItemWrapper}>
                    <div>
                        <img
                            src={product.media[0].gateway} 
                            alt="" 
                            className={styles.productImg} 
                        />
                    </div>
                    <div className={styles.productDetails}>
                        <div className={styles.productTitle}>
                            <span>{product.title}</span>
                        </div>
                        <div className={styles.productPrice}>
                            <p>eth:{etherPrice}</p>
                        </div>
                        <div className={styles.productButtons}>
                            <button className={styles.productBuy} disabled={!connected} onClick={handleBuy}> Buy </button>
                            <button className={styles.productCart} onClick={handleCartAdd}> Add to Cart </button> 
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}
