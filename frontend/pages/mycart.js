import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'
import useSWR, { mutate } from 'swr'
import Image from 'next/image'
import Link from 'next/link'
const URL = `http://localhost/api/cart`
const URL2 = `http://localhost/api/product`
const fetcher = (URL) => axios.get(URL).then(res => res.data)


const cart = ({ token }) => {
    const [admin, setAdmin] = useState({})
    const [cart, setCart] = useState('')
    const [name, setName] = useState('')
    const [cost, setCost] = useState('')


   
    const { data, error } = useSWR(URL, fetcher)
    if (!data) return <div>Loading...</div>
    console.log('Home', data);

    const printcart = (cart) => {
        console.log('cart: ', cart);
        if (cart && cart.length)
            return (cart.map((cart, index) =>
            (
            <div >
                <div>
                </div>
                <div key={index}>
                    <div className={styles.image}>
                    </div>
                <div >
                     <li disabled={index === " "}className={styles.signcost2}>
                         {(cart) ? cart.name : ''} {''}
                         {''}  ราคา {''}
                         {(cart) ? cart.cost : '-'}
                        
                         <button className={styles.submitcart} onClick={() => deletecart(cart.id)}>Delete</button> 
                          </li>

                 
                </div>
                 </div>

                 
                </div>)

            ))
        else 
        {
            (<h2>No product</h2>)
        }
    }
    const deletecart = async (id) => {

        let cart = await axios.delete(`${URL}/${id}`,{
            headers: { Authorization: `Bearer ${token}` }
        })
        //setproduct(product.data)
        mutate(URL)
    }
    return (
        <Layout>
            <div className={styles.backg}>
                <Navbar />
            <div className={styles.main} align="center" >
                
                <Link href="/"><button className={styles.submitmycart}>BACK</button></Link>
                
                <h1 className={styles.sign}>MY  CART</h1>

                <p align="center">
                    <div >
                    </div>
                    {printcart(data.list)}
                </p>
            </div>
            </div>
 
        </Layout>
    )
}

export default cart

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
