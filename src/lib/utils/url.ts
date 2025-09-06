export const SiteURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const getFullURL = (url: string | null | undefined) => {
  if (!url) return null
  return `${SiteURL}${url}`
}

export const fallbackImageURL = ({
  width = 400,
  height = 400,
  text = '',
  bgColor = 'EEEEEE',
  textColor = 'black',
}: {
  width?: number
  height?: number
  text?: string
  bgColor?: string
  textColor?: string
}) => {
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}/png?text=${text}`
}
