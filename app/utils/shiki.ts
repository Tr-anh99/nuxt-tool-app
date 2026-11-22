import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let highlighterPromise: Promise<HighlighterCore> | null = null

// Fine-grained bundle + JS regex engine: no WASM, only the needed themes/langs
function getHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [
      import('shiki/themes/vitesse-light.mjs'),
      import('shiki/themes/vitesse-dark.mjs')
    ],
    langs: [
      import('shiki/langs/json.mjs'),
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/sql.mjs')
    ],
    engine: createJavaScriptRegexEngine()
  })

  return highlighterPromise
}

export async function highlightCode(code: string, lang = 'json') {
  const highlighter = await getHighlighter()

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark'
    }
  })
}
