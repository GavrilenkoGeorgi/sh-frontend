import { isPushSupported, urlBase64ToUint8Array } from './pushNotifications'

describe('urlBase64ToUint8Array', () => {
  it('decodes standard base64 with padding', () => {
    // "hello"
    expect(Array.from(urlBase64ToUint8Array('aGVsbG8='))).toEqual([
      104, 101, 108, 108, 111
    ])
  })

  it('restores missing padding and the url-safe alphabet', () => {
    // bytes [251, 255, 190] encode to "+/++" in base64 and "-_--" in base64url
    expect(Array.from(urlBase64ToUint8Array('-_--'))).toEqual([251, 255, 190])
    // "hello" without the trailing "="
    expect(Array.from(urlBase64ToUint8Array('aGVsbG8'))).toEqual([
      104, 101, 108, 108, 111
    ])
  })
})

describe('isPushSupported', () => {
  const originalNavigator = globalThis.navigator

  const stubBrowser = (windowStub: object, navigatorStub: object): void => {
    Object.defineProperty(globalThis, 'window', {
      value: windowStub,
      configurable: true
    })
    Object.defineProperty(globalThis, 'navigator', {
      value: navigatorStub,
      configurable: true
    })
  }

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'window')
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true
    })
  })

  it('is true when service worker, PushManager and Notification exist', () => {
    stubBrowser({ PushManager: {}, Notification: {} }, { serviceWorker: {} })
    expect(isPushSupported()).toBe(true)
  })

  it('is false when PushManager is missing', () => {
    stubBrowser({ Notification: {} }, { serviceWorker: {} })
    expect(isPushSupported()).toBe(false)
  })
})
