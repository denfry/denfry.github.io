import { Component, type ErrorInfo, type ReactNode } from 'react'
import { CanvasFallback } from './CanvasFallback'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * SceneErrorBoundary — catches any error thrown by the R3F scene
 * (including WebGL context failures) and renders the static CanvasFallback.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true }
  }

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to observability tooling in the future; silent for now.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[SceneErrorBoundary] WebGL/R3F error caught:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return <CanvasFallback />
    }
    return this.props.children
  }
}
