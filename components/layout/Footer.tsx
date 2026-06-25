import { CONTACTS } from '@/lib/contacts'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {year} Denfry</span>
        <div className="flex gap-4">
          <a
            href={CONTACTS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={CONTACTS.orderTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Telegram
          </a>
        </div>
      </div>
    </footer>
  )
}
