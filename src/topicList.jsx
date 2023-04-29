import React from 'react';

import Page from './page';

export default function TopicList() {
  const url = 'https://github.com/webprogramming260/.github/blob/main/profile/instructionTopics.md';

  const [i, setI] = React.useState([]);

  React.useEffect(() => {
    const rawUrl = url.replace(
      'github.com/webprogramming260/.github/blob',
      'raw.githubusercontent.com/webprogramming260/.github'
    );
    const [, rootUrl, pageUrl] = /(.*\/)([^\/]*)$/.exec(rawUrl);

    fetch(rawUrl)
      .then((r) => r.text())
      .then((body) => {
        const blockReg = /^## (.*)$[^##]*/gm;
        const lineReg = /- (.*)\[(.*)]\((.*)\)$/gm;
        const instruction = [];
        for (let blockMatch of body.matchAll(blockReg)) {
          const items = [];
          instruction.push({title: blockMatch[1], items: items});
          for (let lineMatch of blockMatch[0].matchAll(lineReg)) {
            items.push({assignment: !!lineMatch[1], title: lineMatch[2], path: lineMatch[3]});
          }
        }
        setI(instruction);
      });
  }, []);

  function navPage(topic) {
    console.log(topic);
  }

  console.log(i);

  const o = [];
  i.forEach((ii) => {
    o.push(<h3>{ii.title}</h3>);

    const ol = [];
    ii.items.forEach((li) => {
      ol.push(<li>{li.title}</li>);
    });
    o.push(<ul>{ol}</ul>);
  });

  return (
    <div>{o}</div>
    //    <Page url='https://github.com/webprogramming260/.github/blob/main/profile/html/media/media.md' onNav={navPage} />
  );
}
