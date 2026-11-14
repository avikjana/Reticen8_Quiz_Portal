import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

// Catches render-time errors anywhere below it so one broken component shows a
// friendly message instead of a blank white page. Class component because React
// error boundaries have no hooks equivalent.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Hook a real error-reporting service in here when deploying.
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  handleReload = () => {
    // Clearing state lets a transient error recover without a full reload.
    this.setState({ error: null })
    if (typeof window !== 'undefined') window.location.assign('/')
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="min-h-dvh flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl ring-1 ring-slate-200/80 shadow-[var(--shadow-lift)] p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
            <AlertTriangle size={28} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-500">
            An unexpected error occurred while displaying this page. You can return to the home page and try again.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-6 inline-flex items-center px-6 py-2.5 rounded-full text-xs font-bold text-white bg-action-600 hover:bg-action-700 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }
}
