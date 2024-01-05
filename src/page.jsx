import React from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'; // Formats the code blocks
import 'highlight.js/styles/github.css';
import './page.css';
import './github-markdown.css';

export default function Page({ onNav }) {
  const location = useLocation();
  const wildcard = useParams()['*'];
  const gitHubRoot = 'https://github.com/webprogramming260/.github/blob/main/profile/';
  const url = gitHubRoot + wildcard;
  const gitHubUrl = url.replace('_', '.');
  const [htmlDoc, setHtmlDoc] = React.useState("<div style='height:120vh;'></div>");

  React.useEffect(() => {
    let rawUrl = gitHubUrl.replace(
      'github.com/webprogramming260/.github/blob',
      'raw.githubusercontent.com/webprogramming260/.github'
    );
    const [, rootUrl] = /(.*\/)([^\/]*)$/.exec(rawUrl);

    fetch(rawUrl)
      .then((r) => r.text())
      .then((body) => {
        const reg = /\!\[(.*)\]\((.*)\)/g;
        const up = body.replaceAll(reg, `![$1](${rootUrl}$2)`);

        let renderedHtml = md.render(up);
        renderedHtml = renderedHtml.replaceAll('&lt;/br&gt;', '</br>');
        renderedHtml = renderedHtml.replaceAll('.md"', '_md"');
        renderedHtml = renderedHtml.replaceAll(
          'Canvas',
          '<a href="https://byu.instructure.com/courses/22526/assignments">Canvas</a>'
        );

        setHtmlDoc(renderedHtml);
      });
  }, [location]);

  return (
    <>
      <PageNav onNav={onNav} url={url} gitHubUrl={gitHubUrl}></PageNav>
      <div className='flex align-middle justify-center'>
        <div id='md' className='markdown-body' dangerouslySetInnerHTML={{ __html: htmlDoc }}></div>
      </div>
      <PageNav onNav={onNav} url={url} gitHubUrl={gitHubUrl}></PageNav>
    </>
  );
}

function PageNav({ onNav, url, gitHubUrl }) {
  return (
    <div className='m-0 text-gray-200 bg-gray-800 justify-between flex px-6 py-3 text-lg'>
      <NavLink to={onNav('prev', url)}>Prev</NavLink>
      <NavLink to='/'>Topics</NavLink>
      <a href={gitHubUrl}>GitHub</a>
      <NavLink to={onNav('next', url)}>Next</NavLink>
    </div>
  );
}

const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + `</pre>`;
      } catch (__) {}
    }

    return '';
  },
});
