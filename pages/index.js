import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Layout } from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import db from "@/utils/db";
import Product from "@/models/Product";
import axios from "axios";
import { useContext } from "react";
import { Store } from "@/utils/Store";
import { toast } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    console.log(product);
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry, Product is out of stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    toast.success(`Product added to the cart successfully`);
  };
  return (
    <>
      <Layout title={"Home Page"}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem
              addToCartHandler={addToCartHandler}
              product={product}
              key={product.slug}
            />
          ))}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
