'use client'

import { useMemo } from 'react'
import * as runtime from 'react/jsx-runtime'

export function MDXContent({ code }: { code: string }) {
  const Component = useMemo(() => {
    const fn = new Function(code)
    return fn({ ...runtime }).default
  }, [code])

  return (
    <div className="prose-sm mx-auto max-w-none [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-medium [&_p]:mb-4 [&_p]:leading-7 [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_li]:leading-7 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm">
      <Component />
    </div>
  )
}
