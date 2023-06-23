import styles from '@/styles/Navbar.module.css'
import Image from 'next/image'
import logo from '@/public/SmokleyS.svg';
import Link from 'next/link';
import { Web3Button } from '@web3modal/react';
import { cartState } from '@/atom/cartState';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { Alchemy, Network } from 'alchemy-sdk';
import { Product } from '@/models/models';

export default function Navbar() {

  const [cartItemn] = useRecoilState(cartState)

  const [expanded, setExpanded] = useState<boolean>(false);

  const [ownedMembership, setOwnedMembership] = useState<any[]>([])
  const [memberToken, setMemberToken] = useState<number>(0)

  const { isConnected, address } = useAccount()
  const [connected, setConnected] = useState<boolean>(false)

  const [userOf, setUserOf] = useState<string>('0x0000000000000000000000000000000000000000')
  
  
  useEffect(() => {
    const fetchData = async () => {
      const settings = {
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
          network: Network.ETH_SEPOLIA,
      };

      const alchemy = new Alchemy(settings);

      try {
          const nfts = await alchemy.nft.getNftsForOwner(address!, { contractAddresses: ['0xe0EA5e8Bf175E517A6079716864524BE4a11CaBF'] });
          console.log(nfts.ownedNfts[0])
          setOwnedMembership(nfts.ownedNfts);
      } catch (error) {
          console.error('Failed to fetch owned NFTs:', error);
      }
    };
    if (isConnected && typeof isConnected === 'boolean') {
      fetchData()  
      setConnected((true))
    } 
    
    if (!isConnected && typeof isConnected === 'boolean') {
        setConnected((false))
        
    }
},[isConnected])

useEffect(() => {
  if ( ownedMembership.length === 1 ) {
      const memberKey : Product = ownedMembership[0]
      setMemberToken((memberKey.tokenId))
  }
},[ownedMembership])

useEffect(() => {
  const setLocal = async () =>{
    if (userOf === address && connected) {
      localStorage.setItem('MemberActive', true.toString())
    } else {
      localStorage.setItem('MemberActive', false.toString())
    }
  }
  setLocal()
  
}, [userOf, connected]);
console.log(userOf)
console.log(address)


const contractReadUser = useContractRead({
  address: "0xe0EA5e8Bf175E517A6079716864524BE4a11CaBF",
  abi: [
      {
          name: 'userOf',
          inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: 'view',
          type: 'function',
      },    
  ],
  functionName: 'userOf',
  args: [BigInt(memberToken)],
  chainId: 11155111,
  watch: true,
})
useEffect(() => {
  if (contractReadUser?.data! && typeof contractReadUser.data === 'string' ) {
      setUserOf((contractReadUser?.data!))
  }
},[contractReadUser?.data!])

  const toggleMenu = () => {
    setExpanded(true);
  };
  const untoggleMenu = () => {
    setExpanded(false);
  };

  return (
    <>
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <Link href='/'>
            <Image 
              src={logo} 
              alt="" 
            />
          </Link>
        </div>
        <div className={styles.menu}>
          <div className={`${styles.menuToggle} ${expanded ? styles.expanded : ''}`} onClick={toggleMenu}>
            Menu
          </div>
          <div className={`${styles.menuItems} ${expanded ? styles.expanded : ''}`}>
            <Link href='/memberships'>
              <span>Members</span>
            </Link>
            <Link href='/transactions'>
              <span>Transactions</span>
            </Link>
            <Link href='/orders'>
              <span>Orders</span>
            </Link>
            <Link href='/cart'>
              <span>Cart~({cartItemn.length})</span>
            </Link>
            <span className={styles.menuClose} onClick={untoggleMenu}> XXX </span>
          </div>
        </div>
        <div className={styles.connect}>
          <Web3Button icon="hide" label="Connect" balance="hide" />
        </div>
      </div>
    </div>
    </>
  )
}


