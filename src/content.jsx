import React from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'; // Formats the code blocks
import 'highlight.js/styles/github.css';
import './github-markdown.css';

export default function Content({ url, rootUrl, canvasUrl }) {
  const [htmlDoc, setHtmlDoc] = React.useState(
    "<div style='height:120vh;'>Loading...</div>"
  );

  React.useEffect(() => {
    if (url) {
      const [, rootUrl] = /(.*\/)([^\/]*)$/.exec(url);

      fetch(url)
        .then((r) => r.text())
        .then((body) => {
          const reg = /\!\[(.*)\]\((.*)\)/g;
          const up = body.replaceAll(reg, `![$1](${rootUrl}$2)`);

          let renderedHtml = md.render(up);
          renderedHtml = renderedHtml.replaceAll('&lt;/br&gt;', '</br>');
          renderedHtml = renderedHtml.replaceAll('.md"', '_md"');
          renderedHtml = renderedHtml.replaceAll(
            'Canvas',
            `<a href='${canvasUrl}'>Canvas</a>`
          );

          setHtmlDoc(renderedHtml);
        });
    }
  }, [url]);

  return (
    <>
      <div className='flex align-middle justify-center'>
        <div
          id='md'
          className='markdown-body'
          dangerouslySetInnerHTML={{ __html: htmlDoc }}
        ></div>
      </div>
    </>
  );
}

const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          `</pre>`
        );
      } catch (__) {}
    }

    return '';
  },
});
