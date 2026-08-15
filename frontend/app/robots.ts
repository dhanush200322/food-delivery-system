import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/orders/'],
    },
    sitemap: 'https://food-delivery-system-m9nm.onrender.com/sitemap.xml',
  }
}
