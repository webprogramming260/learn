import React from 'react';
import {NavLink} from 'react-router-dom';

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

  const o = [];
  i.forEach((ii) => {
    const ol = [];
    ii.items.forEach((li) => {
      ol.push(
        <li key={li.title}>
          <NavLink to={`page/${li.path}`}>{li.title}</NavLink>
        </li>
      );
    });
    o.push(
      <div key={ii.title}>
        <h3>{ii.title}</h3>
        <ul>{ol}</ul>
      </div>
    );
  });

  return <div>{o}</div>;
}
