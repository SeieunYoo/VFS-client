"use client";
import Image from "next/image";

interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  name?: string;
}

import axios from "axios";
import { useEffect, useState } from "react";

import { Navigation } from "../fitting/_components/Navigation";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:3001/cart", {
        withCredentials: true,
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  useEffect(() => {
    fetchCart(); // Replace with dynamic user ID
  }, []);

  const addToCart = async (
    userId: number,
    productId: number,
    quantity: number
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/cart/add",
        {
          user_id: userId,
          product_id: productId,
          quantity: quantity,
        },
        {
          withCredentials: true, // 쿠키 기반 인증 사용 시 필요
        }
      );
      alert(`${productId}를 장바구니에 추가하였습니다!`);
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (
    userId: number,
    productId: number,
    quantity: number
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/cart/remove",
        {
          user_id: userId,
          product_id: productId,
          quantity: quantity,
        },
        {
          withCredentials: true, // 쿠키 기반 인증 사용 시 필요
        }
      );
      alert(`${productId}를 장바구니에서 삭제했습니다!`);
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const orderFromCart = async (userId: number) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/order/checkout", // Express 서버의 엔드포인트
        {
          user_id: userId,
        },
        {
          withCredentials: true, // 쿠키 기반 인증 사용 시 필요
        }
      );
      alert(`주문을 완료했습니다!`);
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const fetchOrders = async (userId: number) => {
    try {
      const response = await axios.get("http://localhost:3001/orders", {
        params: { user_id: userId },
      });
      setOrders(response.data);
      fetchOrders(1);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(1); // Replace 1 with the actual user_id
  }, []);
  return (
    <>
      <div>
        <Navigation />
        <div className="h-[70px]" />
        <div className="text-[25px] text-bold">장바구니 목록</div>
        <ul>
          {cartItems.map((item) => (
            <li key={item.product_id}>
              {item.name} - 수량: {item.quantity}, 가격: ${item.price}
            </li>
          ))}
        </ul>
        총:{" "}
        {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}원
        <Image
          alt="detail-page-cloth"
          height={320}
          src="/cloth-example.jpg"
          width={390}
        />
        <button
          className="flex w-full lg:max-w-[412px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-black text-white text-base font-bold leading-normal tracking-[0.015em]"
          onClick={() => addToCart(1, 101, 1)}
        >
          <span className="truncate">장바구니 추가</span>
        </button>
        <button
          className="flex w-full lg:max-w-[412px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-black text-white text-base font-bold leading-normal tracking-[0.015em]"
          onClick={() => removeFromCart(1, 101, 1)}
        >
          <span className="truncate">장바구니 삭제</span>
        </button>
        <button
          className="flex w-full lg:max-w-[412px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-black text-white text-base font-bold leading-normal tracking-[0.015em]"
          onClick={() => orderFromCart(1)}
        >
          <span className="truncate">주문하기</span>
        </button>
      </div>

      <div className="text-[25px] text-bold">주문 목록</div>
      <ul>
        {orders.map((order: any) => (
          <div key={order.order_id}>
            <h2>Order ID: {order.order_id}</h2>
            <p>Total Price: ${order.total_price}</p>
            <p>Order Date: {new Date(order.order_date).toLocaleString()}</p>
            <ul>
              {order.details.map((item) => (
                <li key={item.product_id}>
                  {item.product_name} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </>
  );
};

export default CartPage;
