// Structured data (JSON-LD) for Google Search rich results
// Uses @graph to emit multiple schema types in one tag for richer Knowledge Panel,
// local pack, FAQ rich results, and breadcrumb trail.
export default function SchoolJsonLd() {
  const BASE = 'https://hamizak.com.ng'

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // ── 1. School + EducationalOrganization ──────────────────────────────
      {
        '@type': ['School', 'EducationalOrganization'],
        '@id': `${BASE}/#school`,
        name: 'Hamizak Montessori Academy',
        alternateName: ['HMA', 'Hamizak Montessori'],
        url: BASE,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE}/images/hma-logo.jpg`,
          width: 200,
          height: 200,
        },
        image: [
          `${BASE}/images/school-building-main.jpg`,
          `${BASE}/images/school-building-colorful.jpg`,
        ],
        description:
          'Hamizak Montessori Academy (HMA) is a leading private Montessori school in Sabon Lugbe, Airport Road, Abuja. We offer Creche, Toddler Community, Nursery, Primary and Secondary education guided by Discipline, Integrity & Excellence.',
        foundingDate: '2010',
        numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 50 },
        telephone: '+2348032253811',
        email: 'Hamizakmontessoriabuja@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sabon Lugbe, Airport Road',
          addressLocality: 'Abuja',
          addressRegion: 'FCT',
          postalCode: '900108',
          addressCountry: 'NG',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 8.9997,
          longitude: 7.3886,
        },
        areaServed: [
          { '@type': 'City', name: 'Abuja' },
          { '@type': 'AdministrativeArea', name: 'FCT' },
          { '@type': 'Neighborhood', name: 'Sabon Lugbe' },
          { '@type': 'Neighborhood', name: 'Airport Road' },
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '07:30',
            closes: '16:00',
          },
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+2348032253811',
            contactType: 'admissions',
            areaServed: 'NG',
            availableLanguage: ['English', 'Hausa'],
          },
          {
            '@type': 'ContactPoint',
            email: 'Hamizakmontessoriabuja@gmail.com',
            contactType: 'customer support',
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
        educationalCredentialAwarded: 'Primary School Leaving Certificate, BECE',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'School Programs',
          itemListElement: [
            { '@type': 'Offer', name: 'Creche & Toddler Community (18 months – 3 years)' },
            { '@type': 'Offer', name: "Children's House / Nursery (3 – 6 years)" },
            { '@type': 'Offer', name: 'Elementary / Primary School (6 – 12 years)' },
          ],
        },
      },

      // ── 2. Website entity ────────────────────────────────────────────────
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: 'Hamizak Montessori Academy',
        publisher: { '@id': `${BASE}/#school` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/?s={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },

      // ── 3. BreadcrumbList for homepage ───────────────────────────────────
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE}/about` },
          { '@type': 'ListItem', position: 3, name: 'Programs', item: `${BASE}/programs` },
          { '@type': 'ListItem', position: 4, name: 'Admission', item: `${BASE}/admission` },
          { '@type': 'ListItem', position: 5, name: 'Gallery', item: `${BASE}/gallery` },
          { '@type': 'ListItem', position: 6, name: 'Contact', item: `${BASE}/contact` },
        ],
      },

      // ── 4. FAQ rich result ───────────────────────────────────────────────
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What age does enrolment start at Hamizak Montessori Academy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Enrolment starts from 18 months in our Toddler Community programme. We also accept children from age 3 in our Nursery (Children\'s House) up to age 12 in our Elementary / Primary School.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is Hamizak Montessori Academy located?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We are located in Sabon Lugbe, Airport Road, Abuja, FCT, Nigeria. Call us on 08032253811 to get directions or schedule a campus tour.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I apply for admission to Hamizak Montessori Academy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can apply online at hamizak.com.ng/admission. Our multi-step form takes less than 5 minutes and our admissions team will contact you within 2–3 business days.',
            },
          },
          {
            '@type': 'Question',
            name: 'What curriculum does Hamizak Montessori Academy follow?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We follow the authentic Montessori curriculum developed by Dr Maria Montessori, combined with the Nigerian national curriculum. Our Montessori-trained guides support each child\'s individual pace of learning.',
            },
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
