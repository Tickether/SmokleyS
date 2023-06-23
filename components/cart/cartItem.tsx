import styles from '@/styles/Cart.module.css'
import { CartProps, cartState } from '@/atom/cartState';
import { useContractRead } from 'wagmi';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { useRecoilState } from 'recoil';


export default function CartItem ({ product, quantity, price } : CartProps) {
    console.log(product, quantity, price)

    const [etherPrice, setEtherPrice] = useState<string>('')

    const [buyAmount, setBuyAmount] = useState<number>(quantity)

    const [cartItem, setCartItem] = useRecoilState(cartState)


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
            
        }
    },[contractReadFee?.data!])

    const handleDecrement = () => {
        if (buyAmount <= 0 ) return;
        setBuyAmount(buyAmount - 1);
        //handleQuantityChange(product.tokenId, buyAmount - 1);
    };
    
      const handleIncrement = () => {
        if (buyAmount >= 10 ) return;
        setBuyAmount(buyAmount + 1);
        //handleQuantityChange(product.tokenId, buyAmount - 1);
    };

    

    useEffect(()=>{
        const handleQuantityChange = () => {
            try {
                setCartItem(prevState => {
                    const updatedCart = prevState.map(item => {
                        if (item.product.tokenId === product.tokenId) {
                            return {
                                ...item,
                                quantity: buyAmount
                            };
                        }
                        return item;
                    });
                    return updatedCart as CartProps[];
                });
            } catch (error) {
                console.log(error)
            }
        }
        handleQuantityChange()
    },[buyAmount])

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
                                <span className={styles.cartItemTotal}>{buyAmount * Number(etherPrice)}</span>
                            </div>
                            <div className={styles.carItemButtons}>
                                <button onClick={handleDecrement}>-</button>
                                <input 
                                    readOnly
                                    type='number' 
                                    value={buyAmount}
                                />
                                <button onClick={handleIncrement}>+</button>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </>
    )
}