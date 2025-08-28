'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart4, Mail, MailOpen, Truck, Printer, Bolt } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import SectionHeading from './section-heading'

type IconType = React.ComponentType<LucideProps>

type Feature = {
  title: string
  description: string
  Icon: IconType
}

const FEATURES: Feature[] = [
  {
    title: 'HOW WE MARKET',
    description:
      'Create your campaigns in no time at all by shortening your marketing attempt with our extensive array of marketing templates and our years of experience on this field.',
    Icon: BarChart4,
  },
  {
    title: 'EDDM FULL SERVICE',
    description:
      'Easier and dominant advertising! With our EDDM full service rest assured that your message will land on the palm of your target audience!',
    Icon: Mail,
  },
  {
    title: 'FREE LOCAL DELIVERY',
    description: 'Our free local delivery allows you to conserve energy, save time and money!',
    Icon: Truck,
  },
  {
    title: 'DIRECT MAILING',
    description:
      'Our Direct Mailing provides simplified and cost effective marketing for you. Provide the list and trust us to do the rest!',
    Icon: MailOpen,
  },
  {
    title: 'TOP QUALITY PRINT',
    description:
      'Utilizing modern production equipment and up-to date approach with the current printing requirements, we provide an excellent quality print products.',
    Icon: Printer,
  },
  {
    title: 'FAST TURN AROUND',
    description:
      'We offer Same Day Delivery available for many locations. We value your time requirement so we provide a finger snap turnaround times.',
    Icon: Bolt,
  },
]

const IconBadge = ({ Icon }: { Icon: IconType }) => (
  <div className="inline-flex items-center justify-center rounded-full bg-white shadow-md h-20 w-20">
    <Icon className="h-10 w-10 text-[#ffc107]" strokeWidth={2.5} />
  </div>
)

const FeatureCard = ({ title, description, Icon }: Feature) => (
  <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-lg">
    <CardContent className="p-8">
      <IconBadge Icon={Icon} />
      <h3 className="mt-6 text-2xl font-semibold text-black">{title}</h3>
      <p className="mt-3 text-base leading-7 text-gray-700">{description}</p>
    </CardContent>
  </Card>
)

export default function KeyFeatures() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <SectionHeading>Key Features</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  )
}
