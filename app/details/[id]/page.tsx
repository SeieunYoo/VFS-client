"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Camera as CameraIcon } from "@/components/Icons/Camera";

import { KakaoMap } from "./_components/KaKaoMap";
import { Navigation } from "./_components/Navigation";

const DetailPage = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [editReview, setEditReview] = useState(null);

  // Fetch reviews for the product
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/reviews/${101}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:");
    }
  };

  const handleAddReview = async () => {
    try {
      await axios.post("http://localhost:3001/reviews", {
        product_id: 101,
        user_id: 1,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setNewReview({ rating: 0, comment: "" });
      alert("리뷰를 추가했습니다!");
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error("Failed to add review:");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await axios.delete(`http://localhost:3001/reviews/${reviewId}`);
      alert("리뷰를 삭제했습니다!");
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error("Failed to delete review:");
    }
  };

  return (
    <>
      <Navigation />
      <div className="pt-[72px]">
        <div className="px-4 py-3 sm:px-4 sm:py-3 flex justify-center">
          <Image
            alt="detail-page-cloth"
            height={320}
            src="/cloth-example.jpg"
            width={390}
          />
        </div>
        <h1 className="text-black text-2xl font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
          Silk Long Dress
        </h1>
        <p className="text-[#101519] text-base font-normal leading-normal pb-3 pt-1 px-4">
          $1,200
        </p>

        <h2 className="text-black text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Product Details
        </h2>
        <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
          {[
            { label: "Material", value: "100% silk" },
            { label: "Care", value: "Dry clean only" },
            { label: "Reviews", value: "4.5/5 - 120 reviews" },
          ].map((detail, index) => (
            <div
              className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d3dce4] py-5"
              key={index}
            >
              <p className="text-gray text-sm font-normal leading-normal">
                {detail.label}
              </p>
              <p className="text-black text-sm font-normal leading-normal">
                {detail.value}
              </p>
            </div>
          ))}
        </div>
        <h2 className="text-black text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Available at
        </h2>
        <div className="px-4 pb-2">
          <div>Online</div>
          <a
            className="underline"
            href="https://www.musinsa.com/products/2678989"
          >
            무신사
          </a>
        </div>
        <div className="px-4">Offline</div>
        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none]">
          <div className="flex items-stretch p-4 gap-3">
            {[
              {
                city: "명동",
                location: "자라",
                imageUrl: "/cloth-example.jpg",
              },
              {
                city: "신세계",
                location: "H&M",
                imageUrl: "/cloth-example.jpg",
              },
              {
                city: "강남",
                location: "무신사",
                imageUrl: "/cloth-example.jpg",
              },
            ].map((store, index) => (
              <div
                className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40"
                key={index}
              >
                <KakaoMap
                  latitude={37.563617}
                  location={store.location}
                  longitude={126.982673}
                />
                <div>
                  <p className="text-[#101519] text-base font-medium leading-normal">
                    {store.city}
                  </p>
                  <p className="text-[#57748e] text-sm font-normal leading-normal">
                    {store.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2>리뷰</h2>

        {/* Add Review */}
        <div>
          <h3>리뷰 쓰기</h3>
          <input
            max={5}
            min={1}
            placeholder="Rating (1-5)"
            type="number"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: Number(e.target.value) })
            }
          />
          <textarea
            placeholder="Write your review"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
          />
          <button onClick={handleAddReview}>Submit</button>
        </div>

        <h3>리뷰 목록</h3>
        <ul>
          {reviews.map((review: any) => (
            <li key={review.review_id}>
              <strong>{review.user_name}</strong> - {review.rating}/5
              <p>{review.comment}</p>
              <small>{new Date(review.created_at).toLocaleString()}</small>
              <button
                onClick={() => {
                  handleDeleteReview(review.review_id);
                }}
              >
                리뷰 삭제
              </button>
            </li>
          ))}
        </ul>
        <div>
          <Link href="/cart">
            <div className="flex py-3">
              <button className="flex w-full lg:max-w-[412px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-black text-white text-base font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">장바구니</span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DetailPage;
