import { createHighlighter, type Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ['vitesse-light', 'vitesse-dark'],
    langs: ['json', 'javascript', 'sql']
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
