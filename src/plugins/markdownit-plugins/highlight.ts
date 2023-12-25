import hljs from 'highlight.js';

export const mdHighlight = (str: string, lang: string) => {
  if (lang === 'mermaid') {
    return `<pre class="mermaid">${str}</pre>`;
  } else if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(str, { language: lang }).value;
    } catch (__) {}
  }

  return ''; // use external default escaping
}
