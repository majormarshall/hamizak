// Structured data (JSON-LD) for Google Search rich results
// This tells Google: name, address, phone, type of business, etc.
export default function SchoolJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: 'Hamizak Montessori Academy',
    alternateName: 'HMA',
    url: 'https://hamizak.com.ng',
    logo: 'https://hamizak.com.ng/images/hma-logo.jpg',
    image: 'https://hamizak.com.ng/images/school-building-main.jpg',
    description:
      'Hamizak Montessori Academy is a private Montessori school in Sabon Lugbe, Airport Road, Abuja offering Creche, Nursery, Primary and Secondary education guided by Discipline, Integrity & Excellence.',
    telephone: '+2348032253811',
    email: 'Hamizakmontessoriabuja@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sabon Lugbe, Airport Road',
      addressLocality: 'Abuja',
      addressRegion: 'FCT',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 8.9997,
      longitude: 7.3886,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:30',
        closes: '16:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/hamizakmontessori',
      'https://www.instagram.com/hamizakmontessori',
    ],
    hasMap: 'https://maps.google.com/?q=Sabon+Lugbe+Airport+Road+Abuja+Nigeria',
    priceRange: '₦₦',
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Cash, Bank Transfer',
    educationalCredentialAwarded: 'Primary School Leaving Certificate',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
