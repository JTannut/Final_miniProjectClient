import Head from 'next/head'
import Layout from '../components/layout'
import { useState } from 'react'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import config from '../config/config'
import Link from 'next/link'

export default function Login({ token }) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const [tick, setTick] = useState('')

  
    const login = async (req, res) => {
        
        try {
            let result = await axios.post(`${config.URL}/login`,
                { username, password },
                { withCredentials: true })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.status + ': ' + result.data.user.username)
        }
        catch (e) {
            console.log('error: ', JSON.stringify(e.response))
            setStatus(JSON.stringify(e.response).substring(0, 80) + "...")
        }
    }

    const loginForm = () => (
        <div className={styles.formloging}>
            <div>
                
                <input className={styles.un}
                
                    type="text"
                    name="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input className={styles.un}
                type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
        </div>
    )

    const copyText = () => {
    navigator.clipboard.writeText(token)
    }

    return (
        <Layout >
            <Head>
             <title>Login</title>
            </Head><div className={styles.backg}>
                <div className={styles.main}>
                <h1 className={styles.sign} align="center">SIGN IN</h1>
                <p align="center">
                 <p><b>Token:</b> {token.substring(0, 15)}...
                 <button onClick={copyText}> Copy token </button>
                </p>
                <br/>
                {status}
                <br />
                {loginForm()}
                <p>
                <input name="tick" type="checkbox" 
                onChange={ (e) => setTick(e.target.value)}></input>
                    Increase expires 7 days
                </p>
                </p>
                <div align="center">
                <button className={styles.submit} onClick={login}>Login</button>
                <Link href="/register"><button className={styles.submit}>Register</button></Link>
                <Link href="/home"><button className={styles.submit}>HOME</button></Link>
                </div>
                 </div>
                 <Navbar />
            </div>
            
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
