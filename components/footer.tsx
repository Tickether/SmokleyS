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
              src={logo} 
              alt="" 
            />
          </div>
          <div className={styles.socials}>
            <Image src={twitter} alt="" />
            <Image src={discord} alt="" />
          </div>
          <div className={styles.company}>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Legal</span>
          </div>
        </div>
      </div>
    </>
  )
}
