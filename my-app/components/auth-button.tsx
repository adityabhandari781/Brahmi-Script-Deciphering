'use client'
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { useAuth } from "./providers/AuthContext";

export function AuthButton() {
  const {user, loading} = useAuth() 
  if(loading){
    return <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
  }
  return user ? (
    <div className="flex items-center gap-4">
      <LogoutButton />
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
