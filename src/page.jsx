import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'; // Formats the code blocks
import 'highlight.js/styles/github.css';
import './page.css';
import './github-markdown.css';

export default function Page({ course, onPathChange }) {
  const location = useLocation();
  const wildcard = useParams()['*'];
  const [htmlDoc, setHtmlDoc] = React.useState("<div style='height:120vh;'></div>");

  React.useEffect(() => {
    const url = course.gitHubRoot + wildcard;
    const gitHubUrl = url.replace('_', '.');
    onPathChange?.(url, gitHubUrl);
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
      <div className='flex align-middle justify-center'>
        <div id='md' className='markdown-body' dangerouslySetInnerHTML={{ __html: htmlDoc }}></div>
      </div>
    </>
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
