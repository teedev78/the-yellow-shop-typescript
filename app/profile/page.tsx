"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCartFromDB } from "@/store/slices/cartSlice";
import axios from "axios";

export default function Profile() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  // console.log(session);

  const router = useRouter();

  const fetchUserCart = async () => {
    if (status === "authenticated" && session.user) {
      const { id: userId } = session.user;

      await axios
        .post(`/api/cart`, {
          userId,
        })
        .then((res) => {
          const updatedCart = res.data.userCart.cartItem;
          dispatch(updateCartFromDB({ cartItem: updatedCart }));
        })
        .catch((error) => {
          console.log("Error : " + error);
        });
    }
  };

  useEffect(() => {
    if (status === "unauthenticated" || session === null) {
      router.push("/");
    } else {
      fetchUserCart();
    }
  }, [status, router]);

  // When after loading success and have session, show profile
  return (
    status === "authenticated" &&
    session.user && (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="text-center mb-4">
            <img
              src={session.user.image}
              className="rounded-full w-20 h-20 mx-auto"
            />
          </div>
          <p>
            Welcome, <b>{session.user.name}!</b>
          </p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
}
