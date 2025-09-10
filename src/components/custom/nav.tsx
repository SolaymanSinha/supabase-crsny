'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Search, HelpCircle, Users, Phone, Menu } from 'lucide-react'
import { CartIcon } from './cart-icon'
import Image from 'next/image'
import Link from 'next/link'
import { fallbackImageURL, getFullURL } from '@/lib/utils/url'
import { Category, Company } from '@/payload-types'

interface NavProps {
  companyInfo: Company
  categories: Category[]
}

export default function Nav({ companyInfo, categories = [] }: NavProps) {
  const {
    logo,
    name,
    contactInfo: { primaryPhone },
  } = companyInfo
  return (
    <div className="relative w-full bg-white shadow-md">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo (Mobile/Tablet) + Desktop Navigation Links */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            {/* Logo - Mobile/Tablet only */}
            <div className="flex lg:hidden items-center space-x-2">
              {typeof logo === 'object' && (
                <Link href={'/'}>
                  <Image
                    src={getFullURL(logo?.url) || fallbackImageURL({ width: 32, height: 32 })}
                    alt={name || 'Name'}
                    width={100}
                    height={80}
                    className="w-28 h-16 object-contain rounded"
                  />
                </Link>
              )}
              {/* <span className="text-lg lg:text-xl font-semibold text-black"> */}
              {/*   {companyInfo?.name || 'Name'} */}
              {/* </span> */}
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link
                href="/about"
                className="flex items-center space-x-2 text-black hover:text-yellow-500 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">About Us</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-2 text-black hover:text-yellow-500 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Contact Us</span>
              </Link>
              <Link
                href="/faqs"
                className="flex items-center space-x-2 text-black hover:text-yellow-500 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">FAQs</span>
              </Link>
            </div>
          </div>

          {/* Right - Cart, Login, Sign Up */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Cart */}
            <CartIcon />

            {/* Login - Hidden on mobile */}
            {/* <Button variant="ghost" className="hidden md:block">
              Login
            </Button> */}

            {/* Sign Up */}
            {/* <Button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm lg:text-base">
              Sign up
            </Button> */}

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-white">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-xl font-semibold text-gray-900">Menu</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                  {/* Search Section */}
                  <div className="py-4 border-b border-gray-100">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const search = formData.get('search') as string
                        window.location.href = `/products${search ? `?search=${encodeURIComponent(search)}` : ''}`
                      }}
                      className="relative"
                    >
                      <Input
                        name="search"
                        placeholder="Search products..."
                        className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                      </Button>
                    </form>
                  </div>

                  {/* Main Navigation */}
                  <div className="flex-1 py-4 space-y-6">
                    {/* Quick Links */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
                      <div className="space-y-2">
                        <Link
                          href="/about"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Users className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium text-gray-900">About Us</span>
                        </Link>
                        <Link
                          href="/contact"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Phone className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium text-gray-900">Contact Us</span>
                        </Link>
                        <Link
                          href="/faqs"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <HelpCircle className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium text-gray-900">FAQs</span>
                        </Link>
                      </div>
                    </div>

                    {/* Support Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Support 24/7</p>
                          <p className="text-sm text-gray-600">{primaryPhone || '347 289 3281'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 8).map((category) => (
                          <Link
                            key={category.id}
                            href={`/products?category=${category.slug}`}
                            className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {category.name}
                            </span>
                          </Link>
                        ))}

                        {/* Fallback categories if no categories are available */}
                        {categories.length === 0 && (
                          <>
                            <a
                              href="#"
                              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900">Home</span>
                            </a>
                            <a
                              href="#"
                              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900">Business</span>
                            </a>
                            <a
                              href="#"
                              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900">Marketing</span>
                            </a>
                            <a
                              href="#"
                              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900">Stickers</span>
                            </a>
                            <a
                              href="#"
                              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900">Banners</span>
                            </a>
                            <a
                              href="#"
                              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900">Packaging</span>
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="border-t pt-4 space-y-3">
                    {/* <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <LogIn className="w-4 h-4 mr-3" />
                      Login
                    </Button>
                    <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                      Sign Up
                    </Button> */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Middle Section - Black Background */}
      <div className="bg-black py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Logo - Desktop only */}
            <div className="hidden lg:flex items-center space-x-2">
              {typeof logo === 'object' && (
                <Link href={'/'}>
                  <Image
                    src={getFullURL(logo?.url) || fallbackImageURL({ width: 32, height: 32 })}
                    alt={name || 'Company Logo'}
                    width={180}
                    height={80}
                    className="w-42 h-16 bg-white object-contain rounded"
                  />
                </Link>
              )}
              {/* <span className="text-xl font-semibold text-white">{name || 'Logo'}</span> */}
            </div>

            {/* Center - Search */}
            <div className="w-full lg:flex-1 lg:max-w-2xl lg:mx-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const search = formData.get('search') as string
                  window.location.href = `/products${search ? `?search=${encodeURIComponent(search)}` : ''}`
                }}
                className="relative"
              >
                <Input
                  name="search"
                  placeholder="Search product here"
                  className="pr-12 rounded-r-none bg-white"
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-l-none rounded-r-md"
                  size="icon"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </form>
            </div>

            {/* Right - Support Agent - Desktop only */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <div className="text-white">
                <div className="text-sm font-medium">Support 24/7</div>
                <div className="text-lg font-semibold">
                  {companyInfo?.contactInfo?.primaryPhone || '347 289 3281'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          {/* Left - Categories Dropdown */}
          <div className="w-full lg:w-auto">
            <Select>
              <SelectTrigger className="w-full lg:w-[200px] bg-gray-100 hover:bg-gray-200">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}

                {/* Fallback categories if no categories are available */}
                {categories.length === 0 && (
                  <>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="stickers">Stickers</SelectItem>
                    <SelectItem value="banners">Banners</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                    <SelectItem value="business-cards">Business Cards</SelectItem>
                    <SelectItem value="brochures">Brochures</SelectItem>
                    <SelectItem value="flyers">Flyers</SelectItem>
                    <SelectItem value="posters">Posters</SelectItem>
                    <SelectItem value="labels">Labels</SelectItem>
                    <SelectItem value="signs">Signs</SelectItem>
                    <SelectItem value="decals">Decals</SelectItem>
                    <SelectItem value="t-shirts">T-Shirts</SelectItem>
                    <SelectItem value="mugs">Mugs</SelectItem>
                    <SelectItem value="pens">Pens</SelectItem>
                    <SelectItem value="notebooks">Notebooks</SelectItem>
                    <SelectItem value="calendars">Calendars</SelectItem>
                    <SelectItem value="invitations">Invitations</SelectItem>
                    <SelectItem value="certificates">Certificates</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="text-black hover:text-gray-600 font-medium"
              >
                {category.name}
              </Link>
            ))}

            {/* Fallback categories if no categories are available */}
            {categories.length === 0 && (
              <>
                <a href="#" className="text-black hover:text-gray-600 font-medium">
                  Home
                </a>
                <a href="#" className="text-black hover:text-gray-600 font-medium">
                  Business
                </a>
                <a href="#" className="text-black hover:text-gray-600 font-medium">
                  Marketing
                </a>
                <a href="#" className="text-black hover:text-gray-600 font-medium">
                  Stickers
                </a>
                <a href="#" className="text-black hover:text-gray-600 font-medium">
                  Banners
                </a>
                <a href="#" className="text-black hover:text-gray-600 font-medium">
                  Packaging
                </a>
              </>
            )}
          </div>

          {/* Right - Empty for balance */}
          <div className="hidden lg:block w-32"></div>
        </div>
      </div>
    </div>
  )
}
