import { AlertCircle, RefreshCw, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

// Grey placeholder cards shown while a list is loading
export function CardSkeletons({ count = 4, className = 'grid sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6' }) {
  return (
    <div className={className} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl ring-1 ring-slate-200/80 bg-white p-6 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-slate-200/80" />
          <div className="mt-5 h-4 w-3/4 rounded bg-slate-200/80" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
          <div className="mt-6 h-3 w-1/2 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

// Inline "couldn't load" message with a retry button
export function ErrorState({ error, onRetry, title = "We couldn't load this right now", className = '' }) {
  return (
    <div className={`rounded-3xl ring-1 ring-slate-200/80 bg-white p-8 text-center ${className}`} role="alert">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500">{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  )
}

// Full-page "not found" used when an ID in the URL doesn't exist
export function NotFoundState({ title = 'Not found', message, backTo = '/', backLabel = 'Back to home' }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-5">
        <SearchX size={28} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
      <Link
        to={backTo}
        className="mt-6 inline-flex items-center px-6 py-2.5 rounded-full text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors"
      >
        {backLabel}
      </Link>
    </div>
  )
}

export function PageSpinner() {
  return (
    <div className="py-24 flex items-center justify-center" role="status" aria-label="Loading">
      <span className="w-10 h-10 rounded-full border-[3px] border-emerald-100 border-t-brand-600 animate-spin" />
    </div>
  )
}
