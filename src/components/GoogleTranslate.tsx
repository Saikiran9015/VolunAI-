import { useEffect } from 'react'

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return
      // eslint-disable-next-line new-cap
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element',
      )
    }

    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="pointer-events-auto">
      <div id="google_translate_element" />
    </div>
  )
}

