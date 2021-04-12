import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'
import useSWR, { mutate } from 'swr'

const URL = `http://localhost/api/students`
const fetcher = (URL) => axios.get(URL).then(res => res.data)


const Student = ({ token }) => {

    const [user, setUser] = useState({})
    const [student, setStudent] = useState('')
    const [fname, setFname] = useState('')
    const [surname, setSurname] = useState('')
    const [major, setMajor] = useState('')
    const [GPA, setGPA] = useState(0)

    // useEffect(() => {
    //     profileUser()
    // }, [])

    const { data, error } = useSWR(URL, fetcher)
    if (!data) return <div>Loading...</div>
    console.log('Home', data);

    const printStudents = (students) => {
        console.log('Students: ', students);
        if (students && students.length)
            return (students.map((student, index) =>

            (<li key={index}>
                {(student) ? student.fname : '-'} :
                {(student) ? student.surname : '-'} :
                {(student) ? student.major : '-'} :
                {(student) ? student.GPA : 0}
                <button onClick={() => getStudent(student.id)}>Get</button>
                <button disabled={token === ""} onClick={() => updateStudent(student.id)}>Update</button>
                <button disabled={token === ""}onClick={() => deleteStudent(student.id)}>Delete</button>
            </li>)

            ))
        else 
        {
            (<h2>No Student</h2>)
        }
    }
    const getStudent = async (id) => {

        let student = await axios.get(`${URL}/${id}`);
        setStudent({
            fname: student.data.fname,
            surname: student.data.surname,
            major: student.data.major,
            GPA: student.data.GPA,

        });
    }

    const addStudent = async (fname, surname, major, GPA) => {

        let students = await axios.post(URL, { fname, surname, major, GPA },{
            headers: { Authorization: `Bearer ${token}` }
        });
        //setStudents(students.data)
        mutate(URL)
        
    }

    const deleteStudent = async (id) => {

        let students = await axios.delete(`${URL}/${id}`,{
            headers: { Authorization: `Bearer ${token}` }
        })
        //setStudents(students.data)
        mutate(URL)
    }

    const updateStudent = async (id) => {

        let students = await axios.put(`${URL}/${id}`, { fname, surname, major, GPA })
        //setStudents(students.data)
        mutate(URL)
    }

    return (
        <Layout>
            <Head>
                <title>Beverage list</title>
            </Head><div className={styles.backg}>
                <div className={styles.mainhome} align="center" >
                
                <p>
                      Name : <input disabled={token === ""}type="text" onChange={(e) => setFname(e.target.value)}></input>
                    SurName : <input disabled={token === ""}type="text" onChange={(e) => setSurname(e.target.value)}></input>
                    Major : <input disabled={token === ""}type="text" onChange={(e) => setMajor(e.target.value)}></input>
                    GPA : <input disabled={token === ""} type="text" onChange={(e) => setGPA(e.target.value)}></input>
                <button disabled={token === ""} onClick={() => addStudent(fname, surname, major, GPA)}>Add</button>
                 </p>
                
                <h2>ADD Beverage </h2>
                <h1>Beverage list</h1>
                <p align="center">
                    <div className={styles.field}>
                        {student.fname} {student.surname}
                    </div>
                    
                </p>
                
                <div>
                {printStudents(data.list)}
                   
                </div>
            </div>
            <p>
                <Navbar />
            </p>
            
            </div>
            
        </Layout>
    )
}

export default Student

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
