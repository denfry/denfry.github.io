import { CONTACTS } from '@/lib/contacts'
import { SITE_URL } from '@/lib/site'

type PersonSchemaProps = {
  type: 'Person'
}

type SoftwareSourceCodeSchemaProps = {
  type: 'SoftwareSourceCode'
  name: string
  description: string
  codeRepository: string
}

type JsonLdProps = PersonSchemaProps | SoftwareSourceCodeSchemaProps

export function JsonLd(props: JsonLdProps) {
  let schema: Record<string, unknown>

  if (props.type === 'Person') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Denfry',
      url: SITE_URL,
      jobTitle: 'Java Developer',
      sameAs: [CONTACTS.github, CONTACTS.orderTelegram],
    }
  } else {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: props.name,
      description: props.description,
      codeRepository: props.codeRepository,
    }
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: schema.org JSON-LD with own data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
