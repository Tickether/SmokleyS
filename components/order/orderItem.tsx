import styles from '@/styles/Orders.module.css'
import { useAccount, useContractRead } from 'wagmi';
import { useEffect, useRef, useState } from 'react'
import { isEqual } from 'lodash'
import { Product } from '@/models/models'

interface ProductProps {
  product: Product
  Order: (order : any) => void;
}


export default function OrderItem ({ product, Order} : ProductProps) {

    const {address, isConnected} = useAccount()

    console.log(product)

    const [balance, setBalance] = useState<number>()
    const [claimed, setClaimed] = useState<number>()
    const [claimAmount, setClaimAmount] = useState(0);
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [order, setOrder] = useState<any>();
    const [connected, setConnected] = useState<boolean>(false)


    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        }
    },[isConnected])

  console.log(order)

  const contractReadBalance = useContractRead({
    address: "0x23477F5DbeBFeec97eEC4C39c408FA0e6868b239",
    abi: [
        {
          name: 'balanceOf',
          inputs: [{internalType: "address", name: "account", type: "address"}, { internalType: "uint256", name: "id", type: "uint256" }],
          outputs: [{ internalType: "int256", name: "", type: "int256" }],
          stateMutability: 'view',
          type: 'function',
        },
    ],
    functionName: 'balanceOf',
    args: [ (address!), BigInt(product.tokenId) ],
    watch: true,
    chainId: 11155111,
})

console.log(contractReadBalance.data)

useEffect(() => {
  if (contractReadBalance?.data! && typeof contractReadBalance.data === 'bigint') {    
      setBalance(Number(contractReadBalance?.data!))
  }
},[contractReadBalance?.data!])


const contractReadClaimed = useContractRead({
    address: "0x23477F5DbeBFeec97eEC4C39c408FA0e6868b239",
    abi: [
        {
          name: 'claimed',
          inputs: [{ internalType: "uint256", name: "", type: "uint256" }, {internalType: "address", name: "", type: "address"}],
          outputs: [{ internalType: "int256", name: "", type: "int256" }],
          stateMutability: 'view',
          type: 'function',
        },
    ],
    functionName: 'claimed',
    args: [BigInt(product.tokenId), (address!)],
    watch: true,
    chainId: 11155111,
})

console.log(contractReadClaimed.data)

useEffect(() => {
  if (contractReadClaimed?.data! === BigInt(0)) {
    setClaimed(Number(contractReadClaimed?.data!))
  }else if (contractReadClaimed?.data! && typeof contractReadClaimed.data === 'bigint') {
    setClaimed(Number(contractReadClaimed?.data!))
  }
},[contractReadClaimed?.data!])


useEffect(() => {
  const orderInfo ={ 
    name: product.title,
    token: product.tokenId,
    claim: claimAmount,
    remain: balance!- claimed!,
  }
setOrder(orderInfo)
},[ balance, claimed, product, claimAmount])

const prevOrderRef = useRef(order);

useEffect(() => {
  if (order && !isEqual(order, prevOrderRef.current)) {
      Order(order)
      prevOrderRef.current = order;
  }
  ; // Notify the parent component about the updated order
}, [order, Order]);

console.log(balance)
console.log(claimed)

  const handleDecrement = () => {
    if (claimAmount <= 0 ) return;
    setClaimAmount(claimAmount - 1);
  };

  const handleIncrement = () => {
    if (claimAmount >= balance! ) return;
    setClaimAmount(claimAmount + 1);
  };


  return (
    <>
        <div className={styles.orderItem}>
            <div className={styles.orderItemWrapper}>
            <div className={styles.claimItemTop}>
              <span>
                  <img src={product.media[0].gateway} className={styles.claimItemImg} alt="" />
              </span>
              <span className={styles.claimItemTitle}>{product.title}</span>
              <span className={styles.claimItemQuantity}>{balance!} Owned</span>
              <span>-</span>
              <span className={styles.claimItemTotal}>{claimed!} Shipped</span>  
            </div>
            <div className={styles.claimItemButtons}>
                <button onClick={handleDecrement}>-</button>
                <input 
                    readOnly
                    type='number' 
                    value={claimAmount}
                />
                <button onClick={handleIncrement}>+</button>
                <button 
                    disabled={!connected || balance === claimed || claimAmount === 0}
                    
                    onClick={() => setOpenModal(true)}
                    // onClick={handleClaim}
                >
                    Ship
                </button>
            </div>
            {/**
            {openModal && <ShipOutOne setOpen ={setOpenModal} order ={order} />}
            */}
            </div>
        </div>
    </>
  )
}