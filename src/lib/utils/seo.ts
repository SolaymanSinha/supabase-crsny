import { Metadata } from 'next'
import { Company, Page, Product, Category } from '@/payload-types'

interface SEOConfig {
  title?: string
  description?: string
  keywords?: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  siteName?: string
  locale?: string
}

interface CompanySEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string
}

/**
 * Generate comprehensive metadata for pages using company defaults and page-specific overrides
 */
export function generateSEOMetadata(config: SEOConfig, companyInfo?: Company): Metadata {
  const companySEO = companyInfo?.seo as CompanySEO | undefined
  const companyName = companyInfo?.name || 'Store'

  // Build title with company name fallback
  const title = config.title || companySEO?.metaTitle || companyName
  const fullTitle = config.title ? `${config.title} - ${companyName}` : title

  // Build description with company fallback
  const description =
    config.description ||
    companySEO?.metaDescription ||
    `Welcome to ${companyName}. Discover our products and services.`

  // Build keywords with company fallback
  const keywords = config.keywords || companySEO?.keywords || ''

  // Build canonical URL
  const url = config.url || process.env.NEXT_PUBLIC_SITE_URL || ''

  return {
    title: fullTitle,
    description,
    keywords: keywords.split(',').filter(Boolean),

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: config.siteName || companyName,
      locale: config.locale || 'en_US',
      type: config.type || 'website',
      ...(config.image && {
        images: [
          {
            url: config.image,
            alt: title,
          },
        ],
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(config.image && {
        images: [config.image],
      }),
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate SEO metadata for product pages
 */
export function generateProductSEO(product: Product, companyInfo?: Company): Metadata {
  const productSEO = product.seo
  const category =
    product.category && typeof product.category === 'object' ? product.category : null
  const categoryName = category?.name || ''

  const config: SEOConfig = {
    title: productSEO?.title || product.title,
    description:
      productSEO?.description ||
      product.shortDescription ||
      `${product.title}${categoryName ? ` - ${categoryName}` : ''} | High-quality products available now.`,
    keywords:
      productSEO?.keywords ||
      `${product.title}, ${categoryName}, products, buy online`.toLowerCase(),
    url: `/products/${product.slug}`,
    image:
      typeof product.coverImage === 'object' && product.coverImage?.url
        ? product.coverImage.url
        : undefined,
    type: 'website',
  }

  return generateSEOMetadata(config, companyInfo)
}

/**
 * Generate SEO metadata for category pages
 */
export function generateCategorySEO(category: Category, companyInfo?: Company): Metadata {
  const config: SEOConfig = {
    title: `${category.name} Products`,
    description:
      category.description ||
      `Browse our collection of ${category.name.toLowerCase()} products. Find exactly what you need with high-quality options.`,
    keywords: `${category.name}, products, category, shop, buy online`.toLowerCase(),
    url: `/products?category=${category.slug}`,
    image:
      typeof category.image === 'object' && category.image?.url ? category.image.url : undefined,
    type: 'website',
  }

  return generateSEOMetadata(config, companyInfo)
}

/**
 * Generate SEO metadata for static pages (About, Contact, FAQs)
 */
export function generatePageSEO(
  pageType: 'aboutUs' | 'contactUs' | 'faqs',
  pageData: any,
  companyInfo?: Company,
): Metadata {
  const companyName = companyInfo?.name || 'Store'

  const seoConfigs = {
    aboutUs: {
      title: pageData?.title || 'About Us',
      description:
        pageData?.subtitle ||
        `Learn more about ${companyName}. Discover our story, mission, and the team behind our success.`,
      keywords: `about us, company, team, mission, ${companyName}`.toLowerCase(),
      url: '/about',
    },
    contactUs: {
      title: pageData?.title || 'Contact Us',
      description:
        pageData?.description ||
        `Get in touch with ${companyName}. Contact our team for support, inquiries, or to learn more about our services.`,
      keywords: `contact, support, help, get in touch, ${companyName}`.toLowerCase(),
      url: '/contact',
    },
    faqs: {
      title: pageData?.title || 'Frequently Asked Questions',
      description:
        pageData?.description ||
        `Find answers to common questions about ${companyName}. Get quick solutions and helpful information.`,
      keywords: `faq, help, questions, answers, support, ${companyName}`.toLowerCase(),
      url: '/faqs',
    },
  }

  return generateSEOMetadata(seoConfigs[pageType], companyInfo)
}

/**
 * Generate SEO metadata for the products listing page
 */
export function generateProductsListingSEO(
  searchParams: { search?: string; category?: string } = {},
  companyInfo?: Company,
): Metadata {
  const companyName = companyInfo?.name || 'Store'
  let title = 'Products'
  let description = `Browse our complete collection of high-quality products at ${companyName}.`

  // Customize based on search/filter parameters
  if (searchParams.search) {
    title = `Search: ${searchParams.search}`
    description = `Search results for "${searchParams.search}" - Find the products you're looking for at ${companyName}.`
  } else if (searchParams.category) {
    title = `${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)} Products`
    description = `Browse our ${searchParams.category} category products. High-quality options available at ${companyName}.`
  }

  const config: SEOConfig = {
    title,
    description,
    keywords:
      `products, shop, buy online, ${searchParams.search || ''}, ${searchParams.category || ''}, ${companyName}`.toLowerCase(),
    url:
      '/products' +
      (Object.keys(searchParams).length > 0
        ? `?${new URLSearchParams(searchParams).toString()}`
        : ''),
    type: 'website',
  }

  return generateSEOMetadata(config, companyInfo)
}

/**
 * Generate SEO metadata for the home page
 */
export function generateHomeSEO(companyInfo?: Company): Metadata {
  const companyName = companyInfo?.name || 'Store'
  const companySEO = companyInfo?.seo as CompanySEO | undefined

  const config: SEOConfig = {
    title: companySEO?.metaTitle || `${companyName} - Welcome`,
    description:
      companySEO?.metaDescription ||
      companyInfo?.description ||
      `Welcome to ${companyName}. Discover our premium products and exceptional service.`,
    keywords:
      companySEO?.keywords ||
      `${companyName}, products, services, quality, shop online`.toLowerCase(),
    url: '/',
    type: 'website',
  }

  return generateSEOMetadata(config, companyInfo)
}
