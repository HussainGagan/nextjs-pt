"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import seedDatabase from "@/utils/seedDatabase";

const ACTIVE_ROUTE = "py-1 px-2 text-gray-300 bg-gray-700";
const INACTIVE_ROUTE =
  "py-1 px-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700";

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
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export default function NavMenu() {
  const pathname = usePathname();
  return (
    <div className="flex gap-8">
      <AuthButton />
      <Link href={"/products"}>Products</Link>
      <Link href={"/products/add"}>Add Product</Link>
      <Link href={"/categories"}>Categories</Link>
      <Link href={"/brands"}>Brands</Link>
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
