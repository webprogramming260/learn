//import { setupCounter } from './counter.js'

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css';
import './style.css'

const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               `</code></pre>`;
      } catch (__) {}
    }

    return '';
  }
});


const rootURL = 'https://raw.githubusercontent.com/webprogramming260/.github/main/profile/css/debuggingCss/'


const r = await fetch(rootURL + 'debuggingCss.md')
const body = await r.text()

const reg = /\!\[(.*)\]\((.*)\)/g

 const up = body.replaceAll(reg, '![$1]('+rootURL+'$2)')

let h = md.render(up)

h = h + `<a href="https://github.com/webprogramming260/.github/blob/main/profile/css/debuggingCss/debuggingCss.md">GitHub</a>`



document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    <div id="md" class="card">
      
    </div>
  </div>
`

document.querySelector("#md").innerHTML = h;


// setupCounter(document.querySelector('#counter'))
