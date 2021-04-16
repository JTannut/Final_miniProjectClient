import Link from 'next/link'
import styles from '../styles/Home.module.css'
const Navbar = () => (
    <ul className={styles.ul}>
         <Link href="/"><li className={styles.li}> Shop </li></Link> 
        <Link href="/admin"><li className={styles.li}> Sign in </li></Link> 
        <Link href="/register"><li className={styles.li}> Register </li></Link>  
        <Link href="/home"><li className={styles.li}> Behind the shop </li></Link> 
        <Link href="/logout"><li className={styles.li}> Logout </li></Link> 
    </ul>
)

export default Navbar


