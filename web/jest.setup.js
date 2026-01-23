// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
}))

// Mock Howler.js
jest.mock('howler', () => ({
  Howl: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    seek: jest.fn(() => 0),
    volume: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    duration: jest.fn(() => 100),
  })),
}))

// Mock WaveSurfer
jest.mock('wavesurfer.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    load: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    seekTo: jest.fn(),
    destroy: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  })),
}))

// Polyfill for Request/Response (needed for API route tests)
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this.headers = new Headers(init.headers || {})
      this.body = init.body
    }
  }
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Headers(init.headers)
    }
    json() {
      return Promise.resolve(JSON.parse(this.body))
    }
    text() {
      return Promise.resolve(this.body)
    }
  }
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = {}
      if (init instanceof Headers) {
        init.forEach((value, key) => {
          this._headers[key] = value
        })
      } else if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this._headers[key] = value
        })
      }
    }
    get(name) {
      return this._headers[name.toLowerCase()] || null
    }
    set(name, value) {
      this._headers[name.toLowerCase()] = value
    }
    has(name) {
      return name.toLowerCase() in this._headers
    }
    forEach(callback) {
      Object.entries(this._headers).forEach(([key, value]) => {
        callback(value, key)
      })
    }
  }
}

// Suppress console errors in tests (optional - remove if you want to see them)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
