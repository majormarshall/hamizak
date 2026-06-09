import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/auth/', '/login/'],
    },
    sitemap: 'https://hamizak.com.ng/sitemap.xml',
  }
}
