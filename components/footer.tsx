import styles from '@/styles/Footer.module.css'
import Image from 'next/image'
import logo from '@/public/SmokleyS.svg';
import twitter from '@/assets/footer/twitter.svg'
import discord from '@/assets/footer/discord.svg'


export default function Footer() {

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>
            <Image
              width={80}
              src={logo} 
              alt="" 
            />
          </div>
          <div className={styles.socials}>
            <Image width={25} src={twitter} alt="" />
            <Image width={25} src={discord} alt="" />
          </div>
        </div>
      </div>
    </>
  )
}
