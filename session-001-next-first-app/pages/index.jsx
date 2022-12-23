import Link from "next/link";
import { useRouter } from "next/router";


function Home() {
const router = useRouter()
  const handleClick = () =>{
    console.log('Placing your order')
    router.replace('/product') // with replace we can Replace the current history
  }
  return (
    <div>
      <h1>Home Page</h1>
      <Link href='/blog'> 
       <h2>Blog</h2> 
      </Link>
      <Link href='/product'> 
       <h2>Products</h2> 
      </Link>
      <button onClick={handleClick}>
        Place Order
      </button>
    </div>
  );
}
export default Home;
