
import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import Navbar from '../components/navbar'
import axios from 'axios'
import config from '../config/config'
import Link from 'next/link'
export default function Register({ token }) {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')

    const profileUser = async () => {
        console.log('token: ', token)
        const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        console.log('user: ', users.data)
    }

    const register = async (req, res) => {
        try {
            let result = await axios.post(`${config.URL}/register`,
                { username, email, password })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.data.message)
        }
        catch (e) {
            console.log(e)
        }

    }

    const registerForm = () => (
        <div className={styles.formlogin}>
            <div>
                Username:
            </div>
            <div>
                <input className={styles.un}
                type="text"
                    name="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                Email:
            </div>
            <div>
                <input className={styles.un}
                type="email"
                    name="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                Password:
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


    return (
        <Layout>
            <Head>
                <title>Register</title>
            </Head><div className={styles.backg}>
                <Navbar />
                 <div className={styles.mainregis}>
                <h1 className={styles.sign} align="center">Register</h1>
                <div align="center" ><b>Token:</b> {token.substring(0, 15)}...
                <button align="center"
                        onClick={() => { navigator.clipboard.writeText(token) }}>
                        Copy token
                </button>
                </div>
                <br />
                    <p align="center">
                          {status}
                        </p> 
                <br /><br />
                <div className={styles.content} align="center">
                    {registerForm()}
                </div>

                <div align="center" >
                    <button className={styles.submit} onClick={register}>Register</button>
                    
                    <Link href="/admin"><button className={styles.submit}>Back to Login</button></Link>
                </div>
                
            </div>
            
            </div>
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
