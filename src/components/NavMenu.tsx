"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import seedDatabase from "@/utils/seeding/seedDatabase";

function AuthButton() {
  const { data: session } = useSession();

  // console.log(session);

  if (session) {
    return (
      <>
        User: {session?.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <Link href={"/login"}>Sign in</Link>
      {/* <button onClick={() => signIn()}>Sign in</button> */}
    </>
  );
}

export default function NavMenu() {
  return (
    <div className="flex gap-8">
      <AuthButton />
      <Link href={"/products"}>Products</Link>
      <Link href={"/products/add"}>Add Product</Link>
      <Link href={"/categories"}>Categories</Link>
      <Link href={"/brands"}>Brands</Link>
      <Link href={"/register"}>Register</Link>
      {/* <button
        className="ml-auto"
        onClick={async () => {
          await seedDatabase();
        }}
      >
        Seed Database
      </button> */}
    </div>
  );
}
