import React from "react";

import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "./style.css";

const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          `</code></pre>`
        );
      } catch (__) {}
    }

    return "";
  },
});

export default function Page({ url }) {
  const [h, setH] = React.useState("Loading...");

  const reg = /\!\[(.*)\]\((.*)\)/g;

  React.useEffect(() => {
    const rawUrl = url.replace(
      "github.com/webprogramming260/.github/blob",
      "raw.githubusercontent.com/webprogramming260/.github"
    );
    const [, rootUrl, pageUrl] = /(.*\/)([^\/]*)$/.exec(rawUrl);

    fetch(rawUrl)
      .then((r) => r.text())
      .then((body) => {
        const up = body.replaceAll(reg, `![$1](${rootUrl}$2)`);

        let ht = md.render(up) + `<a href="${url}">GitHub</a>`;

        setH(ht);
      });
  }, []);

  return (
    <div>
      <h1>Lee S Jensen</h1>
      <div
        id="md"
        className="card"
        dangerouslySetInnerHTML={{ __html: h }}
      ></div>
    </div>
  );
}
