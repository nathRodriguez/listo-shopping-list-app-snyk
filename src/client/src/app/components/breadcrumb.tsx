'use client'

import Link from 'next/link'

export default function Breadcrumb({ breadLinks }: { breadLinks: { href: string; label: string }[] }) {
  return (
    <>
      {breadLinks.map((link, index) => (
        <span key={index}>
          <Link
            href={link.href}
            className={
              index === breadLinks.length - 1
                ? 'text-gray-700 font-medium'
                : 'text-blue-500 hover:text-gray-700'
            }
          >
            {link.label}
          </Link>
          {index < breadLinks.length - 1 && (
            <span className="mx-1 text-gray-400">{'>'}</span>
          )}
        </span>
      ))}
    </>
  )
}
