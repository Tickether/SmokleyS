import styles from '@/styles/Cart.module.css'
import { CartProps } from '@/atom/cartState';
import { useContractRead } from 'wagmi';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';


export default function CartItem ({ product, quantity, price } : CartProps) {
    console.log(product, quantity, price)

    const [etherPrice, setEtherPrice] = useState<string>('')


    const contractReadFee = useContractRead({
        address: "0xD0de778DecBd16b9036A4d3F98535B183313Da05",
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
            
        }
    },[contractReadFee?.data!])

    return (
        <>
            <div className={styles.cartItem}>
                <div className={styles.cartItemWrapper}>
                    <div className={styles.cartItem}>
                        <div className={styles.cartItemWrapper}>
                            <div className={styles.cartItemTop}>
                                <span>
                                    <img src={product.media[0].gateway} className={styles.cartItemImg} alt="" />
                                </span>
                                <span className={styles.cartItemTitle}>{product.title}</span>
                                <span className={styles.cartItemTotal}>{quantity * Number(etherPrice)}</span>
                            </div>
                            <div className={styles.carItemButtons}>
                                <button /*onClick={handleDecrement}*/>-</button>
                                <input 
                                    readOnly
                                    type='number' 
                                    value={quantity}
                                />
                                <button /*onClick={handleIncrement}*/>+</button>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </>
    )
}