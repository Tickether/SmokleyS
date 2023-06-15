import styles from '@/styles/Navbar.module.css'
import Image from 'next/image'
import logo from '@/public/SmokleyS.svg';
import Link from 'next/link';
import { Web3Button } from '@web3modal/react';
import { cartState } from '@/atom/cartState';
import { useRecoilState } from 'recoil';
import { useState } from 'react';

export default function Navbar() {

  const [cartItemn] = useRecoilState(cartState)

  const [expanded, setExpanded] = useState<boolean>(false);

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


