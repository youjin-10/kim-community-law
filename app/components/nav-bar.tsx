import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";
import AuthButtons from "./auth-buttons";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Logo</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/reviews"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Reviews
              </Link>
              {/* Add more menu items as needed */}
            </div>
          </div>
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
