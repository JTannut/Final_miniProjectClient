import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import useSWR, { mutate } from 'swr'
import Image from 'next/image'
import Link from 'next/link'
const URL = `http://localhost/api/product`
const fetcher = (URL) => axios.get(URL).then(res => res.data)
const product = ({ token }) => {

    const [admin, setAdmin] = useState({})
    const [product, setProduct] = useState('')
    const [name, setName] = useState('')
    const [cost, setCost] = useState('')

   
    const { data, error } = useSWR(URL, fetcher)
    if (!data) return <div>Loading...</div>
    console.log('Home', data);

    const printproduct = (product) => {
        console.log('product: ', product);
        if (product && product.length)
            return (product.map((product, index) =>
            
            (
            <div className={styles.list}>
                <div key={index}>
                    <div className={styles.image}>
                        
                        <Image 
                className={styles.image}
                        src="/1.png"
                        alt=""
                        width={200}
                         height={200}
                         />
                    </div>
                <div className={styles.signcost}>
                     <div>{(product) ? product.name : ''} {''}
                          ราคา {''}
                         {(product) ? product.cost : '-'} </div>
                </div>
               <p>{''}</p>
                 </div>
                 <button className={styles.submit} onClick={() => getproduct(product.id)}>Get</button>
                <button className={styles.submit} disabled={token === ""}  onClick={() => updateproduct(product.id)}>Update</button>
                <button className={styles.submit} disabled={token === ""}onClick={() => deleteproduct(product.id)}>Delete</button>
                </div>)

            ))
        else 
        {
            (<h2>No product</h2>)
        }
    }
    const getproduct = async (id) => {
        
        let product = await axios.get(`${URL}/${id}`);
        
        setProduct({
            
            name: product.data.name,
            cost: product.data.cost,

        });
    }

    const addproduct = async (name, cost) => {

        let product = await axios.post(URL, { name, cost },{
            headers: { Authorization: `Bearer ${token}` }
        });
        //setproduct(product.data)
        mutate(URL)
        
    }
    const deleteproduct = async (id) => {

        let product = await axios.delete(`${URL}/${id}`,{
            headers: { Authorization: `Bearer ${token}` }
        })
        //setproduct(product.data)
        mutate(URL)
    }

    const updateproduct = async (id) => {

        let product = await axios.put(`${URL}/${id}`, { name, cost})
        //setproduct(product.data)
        mutate(URL)
    }

    return (
        <Layout>
            <Head>
                <title>เครื่องดื่ม</title>
            </Head><div className={styles.backghome}>
                <Navbar />
                <div className={styles.mainhome} align="center" >
                <p>{''}</p>
                <Link href="/"><button className={styles.submitadmin}>BACK</button></Link>
                <div className={styles.formlogin}>
                     <div>
                     <h1 className={styles.signhome}> ADD Beverage</h1>
                    ชื่อสินค้า : <input disabled={token === ""}type="text" onChange={(e) => setName(e.target.value)}></input>
                    ราคา : <input disabled={token === ""}type="text" onChange={(e) => setCost(e.target.value)}></input>
                <button className={styles.submit} disabled={token === ""} onClick={() => addproduct(name, cost)}>Add</button>
                
                    </div>
                 </div>
                
                <h1 className={styles.sign}>เครื่องดื่ม</h1>
                <p align="center">
                    <div >
                        
                        {product.name} {product.cost}
                    </div>
                    
                </p>
                
                <div >
                {printproduct(data.list)}
                   
                </div>
            </div>
      
            
            </div>
            
        </Layout>
    )
}

export default product

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
