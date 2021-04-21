import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'
import React from 'react'
import useSWR, { mutate } from 'swr'
import Image from 'next/image'


import Link from 'next/link'
const URL = `http://localhost/api/cart`
const URL2 = `http://localhost/api/product`
const fetcher = (URL) => axios.get(URL).then(res => res.data)


const cart = ({ token }) => {
   

   
    const { data, error } = useSWR(URL, fetcher)
    if (!data) return <div>Loading...</div>
    console.log('Home', data);

    
    return (
        <Layout>
            <div className={styles.backg}>
                <Navbar />
            <div className={styles.main} align="center" >
                
                <Link href="/"><button className={styles.submitmycart}>BACK</button></Link>
                
               

                <p align="center">
                    <h1 className={styles.sign}>SUCCESS !</h1>
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
