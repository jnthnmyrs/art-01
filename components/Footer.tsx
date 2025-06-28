"use client"

import { LinkedinIcon, TwitterIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { track } from "@vercel/analytics/react"
import Image from "next/image"

import Link from "next/link"

export function Footer() {
  return (<>
          {/* Footer */}
          <footer className=" py-16">
          <div className="container mx-auto px-6 text-center">
            <div

              className="flex items-center justify-center gap-2 text-gray-600"
              >
  
  
              <Link 
                href="https://jonathan.now" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-black transition-colors duration-200"
                onClick={() => track('footer_link_clicked', { label: 'Jonathan Myers' })}
                >
                <div

                  className="flex items-center gap-1"
                  >
                  <Image 
                    src="/sig.png" 
                    alt="Jonathan" 
                    width={20} 
                    height={20} 
                    className="opacity-70"
                    />
                </div>
              </Link>
              <Separator orientation="vertical" className="h-4" />
              <Link 
                href="http://twitter.com/jnthnmyrs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-black transition-colors duration-200"
                onClick={() => track('footer_link_clicked', { label: 'Twitter' })}
                >
                <div

                  className="flex items-center gap-1"
                  >
                  <TwitterIcon className="w-4 h-4" />
                </div>
              </Link>
              <Separator orientation="vertical" className="h-4" />
              <Link 
                href="https://www.linkedin.com/in/jonathan-andrew-myers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-black transition-colors duration-200"
                onClick={() => track('footer_link_clicked', { label: 'LinkedIn' })}
                >
                <div

                  className="flex items-center gap-1"
                  >
                  <LinkedinIcon className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </footer>
          </>
                  
  );
}
