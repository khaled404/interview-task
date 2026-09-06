import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  message: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { message: null }

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)
  }

  componentDidUpdate(previousProps: Props) {
    if (previousProps.children !== this.props.children && this.state.message) {
      this.setState({ message: null })
    }
  }

  render() {
    if (this.state.message) {
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-semibold text-amber-900">
            This screen needs an unimplemented function
          </p>
          <p className="mt-2 font-mono text-sm text-amber-800">{this.state.message}</p>
          <p className="mt-3 text-sm text-amber-700">
            Implement it, then reload the preview.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
