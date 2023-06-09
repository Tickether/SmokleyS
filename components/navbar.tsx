import styles from '@/styles/Navbar.module.css'
import Image from 'next/image'
import logo from '@/public/SmokleyS.svg';
import Link from 'next/link';
import { Web3Button } from '@web3modal/react';
import { cartState } from '@/atom/cartState';
import { useRecoilState } from 'recoil';

export default function Navbar() {

  const [cartItemn] = useRecoilState(cartState)

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
          <Link href='/memberships'>
            <span>Memberships</span>
          </Link>
          <Link href='/transactions'>
            <span>Transactions</span>
          </Link>
          <Link href='/orders'>
            <span>Orders</span>
          </Link>
          <Link href='/cart'>
            <span>Cart({cartItemn.length})</span>
          </Link>
        </div>
        <div className={styles.connect}>
          <Web3Button icon="hide" label="Connect" balance="hide" />
        </div>
      </div>
    </div>
    </>
  )
}


