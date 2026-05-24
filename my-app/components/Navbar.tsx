'use client'
import React, {  Suspense } from 'react'
import { EnvVarWarning } from './env-var-warning'
import Link from 'next/link'
import Image from 'next/image'
import { hasEnvVars } from '@/lib/utils'
import { AuthButton } from './auth-button'
import { ThemeSwitcher } from './theme-switcher'

const Navbar = () => {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background sticky top-0 z-50">
      <div className="w-full max-w-5xl flex justify-between items-center px-4 md:px-5 lg:px-6">

        {/* Left: Logo + Name */}
        <div className="flex items-center gap-2 font-semibold text-base md:text-lg">
          <Image
            src="/favicon.png"
            alt="ArchaeoGAN Logo"
            width={30}
            height={30}
            className="w-6 h-6 md:w-8 md:h-8"
          />
          <Link href="/" className="hover:opacity-90 transition">
            ArchaeoRestore
          </Link>
        </div>

        {/* Right: Auth + Theme (Hidden on small if env missing) */}
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <div className="flex items-center gap-2 md:gap-4">

            {/* AuthButton */}
              <AuthButton />
            {/* Theme Switch */}
            <ThemeSwitcher />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
