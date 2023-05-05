import React from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './page.css';

export default function Page({ onNav }) {
  const location = useLocation();
  const wildcard = useParams()['*'];
  const url = 'https://github.com/webprogramming260/.github/blob/main/profile/' + wildcard;
  //  const [h, setH] = React.useState('Loading...');
  const [h, setH] = React.useState(url);

  React.useEffect(() => {
    let rawUrl = url.replace(
      'github.com/webprogramming260/.github/blob',
      'raw.githubusercontent.com/webprogramming260/.github'
    );
    rawUrl = rawUrl.replace('_', '.');
    const [, rootUrl] = /(.*\/)([^\/]*)$/.exec(rawUrl);

    fetch(rawUrl)
      .then((r) => r.text())
      .then((body) => {
        const reg = /\!\[(.*)\]\((.*)\)/g;
        const up = body.replaceAll(reg, `![$1](${rootUrl}$2)`);

        let ht = md.render(up);

        setH(ht);
      });
  }, [location]);

  return (
    <>
      <div className='topic-nav'>
        <NavLink to={onNav('prev', url)}>Prev</NavLink>
        <NavLink to='/'>Topics</NavLink>
        <a href={url}>GitHub</a>
        <NavLink to={onNav('next', url)}>Next</NavLink>
      </div>
      <div id='md' className='card' dangerouslySetInnerHTML={{ __html: h }}></div>
    </>
  );
}

const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs">' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + `</pre>`;
      } catch (__) {}
    }

    return '';
  },
});
