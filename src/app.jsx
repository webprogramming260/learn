import React from 'react';
import TopicList from './topicList';
import Page from './page';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

export default function App() {
  function navPage(topic) {
    console.log(topic);
  }

  const [i, setI] = React.useState([]);

  React.useEffect(() => {
    async function asyncLoadTopics() {
      const topics = await loadTopics();
      setI(topics);
    }
    asyncLoadTopics();
  }, []);

  return (
    <BrowserRouter>
      <p>CS 260</p>
      <Routes>
        <Route path='/' element={<TopicList topics={i} />} exact />
        <Route path='/page/*' element={<Page onNav={navPage} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return <div>Not found</div>;
}

async function loadTopics() {
  const url = 'https://github.com/webprogramming260/.github/blob/main/profile/instructionTopics.md';

  const rawUrl = url.replace(
    'github.com/webprogramming260/.github/blob',
    'raw.githubusercontent.com/webprogramming260/.github'
  );

  const r = await fetch(rawUrl);
  const body = await r.text();
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
  return instruction;
}
