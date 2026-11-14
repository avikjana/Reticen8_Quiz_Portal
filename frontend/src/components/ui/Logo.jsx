import { Link } from 'react-router-dom'
import logoUrl from '../../assets/reticen8-logo.png'

/**
 * The Reticen8 logo lockup (wordmark | Academy), linking to the home page.
 *  - tone: 'dark' label for light backgrounds, 'light' label for dark backgrounds
 *  - size: 'md' (header) | 'sm' (footer, cards)
 *  - label: text shown beside the wordmark after a divider (pass null to hide it)
 *  - asLink: false renders a plain block (e.g. inside a card heading)
 */
export default function Logo({ tone = 'dark', size = 'md', label = 'Academy', asLink = true, className = '' }) {
  const sm = size === 'sm'
  const light = tone === 'light'
  const content = (
    <>
      {/* Intrinsic size 256x55 — width/height set to avoid layout shift */}
      <img
        src={logoUrl}
        alt="Reticen8"
        width={256}
        height={55}
        className={`${sm ? 'h-6' : 'h-7 sm:h-8'} w-auto select-none`}
        draggable={false}
      />
      {label && (
        <>
          <span aria-hidden="true" className={`${sm ? 'h-5' : 'h-6 sm:h-7'} w-px ${light ? 'bg-slate-600' : 'bg-slate-300'}`} />
          <span
            className={`font-display font-semibold tracking-tight leading-none whitespace-nowrap ${
              sm ? 'text-sm' : 'text-[15px] sm:text-base'
            } ${light ? 'text-slate-200' : 'text-slate-700'}`}
          >
            {label}
          </span>
        </>
      )}
    </>
  )

  const classes = `inline-flex items-center ${sm ? 'gap-2.5' : 'gap-3'} flex-shrink-0 ${className}`

  return asLink ? (
    <Link
      to="/"
      aria-label="Reticen8 Academy home"
      className={`${classes} transition-opacity hover:opacity-85`}
    >
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  )
}
