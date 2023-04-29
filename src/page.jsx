import React from 'react';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './page.css';

const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
          `</code></pre>`
        );
      } catch (__) {}
    }

    return '';
  },
});

export default function Page({url, onNav}) {
  const [h, setH] = React.useState('Loading...');

  React.useEffect(() => {
    const rawUrl = url.replace(
      'github.com/webprogramming260/.github/blob',
      'raw.githubusercontent.com/webprogramming260/.github'
    );
    const [, rootUrl, pageUrl] = /(.*\/)([^\/]*)$/.exec(rawUrl);

    fetch(rawUrl)
      .then((r) => r.text())
      .then((body) => {
        const reg = /\!\[(.*)\]\((.*)\)/g;
        const up = body.replaceAll(reg, `![$1](${rootUrl}$2)`);

        let ht = md.render(up);

        setH(ht);
      });
  }, []);

  return (
    <>
      <div className='topic-nav'>
        <a onClick={() => onNav('prev')}>Prev</a>
        <a href={url}>GitHub</a>
        <a onClick={() => onNav('next')}>Next</a>
      </div>
      <div id='md' className='card' dangerouslySetInnerHTML={{__html: h}}></div>
    </>
  );
}
