'use client'

import React from 'react'
import { MapPin, Phone, Smartphone, Tablet, Mail } from 'lucide-react'
import { Company, WebContent } from '@/payload-types'

export default function Footer({
  footerContent,
  companyInfo,
}: {
  footerContent: WebContent['footerContent']
  companyInfo: Company
}) {
  if (!footerContent || !companyInfo) return

  const { aboutDescription, freeProofsDescription, businessHoursDescription, copyright } =
    footerContent
  const {
    contactInfo: {
      address,
      primaryPhone,
      secondaryPhone,
      mobilePhone,
      primaryEmail,
      secondaryEmail,
    },
  } = companyInfo
  return (
    <footer className="w-full bg-[#211D5A] text-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">ABOUT OUR COMPANY</h3>
            <div className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: aboutDescription?.replace(/\n/g, '<br />') || '',
                }}
              />
            </div>
          </div>

          {/* Free Proofs */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">FREE PROOFS</h3>
            <div className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: freeProofsDescription?.replace(/\n/g, '<br />') || '',
                }}
              />
            </div>
          </div>

          {/* Main Office */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">MAIN OFFICE</h3>
            <ul className="mt-4 space-y-3 text-white/70 text-sm md:text-base">
              {companyInfo?.contactInfo?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-white/50 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
              {primaryPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-white/50" />
                  <a href={`tel:${primaryPhone.replace(/\s/g, '')}`} className="hover:text-white">
                    {primaryPhone}
                  </a>
                </li>
              )}
              {secondaryPhone && (
                <li className="flex items-center gap-3">
                  <Tablet className="h-5 w-5 text-white/50" />
                  <a href={`tel:${secondaryPhone.replace(/\s/g, '')}`} className="hover:text-white">
                    {secondaryPhone}
                  </a>
                </li>
              )}
              {mobilePhone && (
                <li className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-white/50" />
                  <a href={`tel:${mobilePhone.replace(/\s/g, '')}`} className="hover:text-white">
                    {mobilePhone}
                  </a>
                </li>
              )}
              {primaryEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-white/50" />
                  <a href={`mailto:${primaryEmail}`} className="hover:text-white">
                    {primaryEmail}
                  </a>
                </li>
              )}
              {secondaryEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-white/50" />
                  <a href={`mailto:${secondaryEmail}`} className="hover:text-white">
                    {secondaryEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">BUSINESS HOURS</h3>
            <div
              className="mt-4 text-sm md:text-base text-white/70 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: businessHoursDescription?.replace(/\n/g, '<br />') || '',
              }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm md:text-base text-white/50">{copyright} {""}
					<span
						className={"text-logoColor cursor-pointer hover:border-b-2 hover:border-logoColor hover:transition-colors hover:duration-1000"}>
						<a
							href="https://www.linkedin.com/in/shah-solayman-sinha-44246b231/"
							target="_blank">
							Shah Solayman Sinha
						</a>
					</span></p>
        </div>
      </div>
    </footer>
  )
}
