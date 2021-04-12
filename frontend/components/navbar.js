import Link from 'next/link'

const Navbar = () => (
    <div align="center">
        <Link href="/"><a> Sign in </a></Link> |
        <Link href="/register"><a> Register </a></Link>  |
        <Link href="/home"><a> Home </a></Link> |
        <Link href="/logout"><a> Logout </a></Link> 
    </div>
)

export default Navbar