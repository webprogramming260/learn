import React from 'react';
import TopicList from './topicList';
import Page from './page';
import {Route, Routes, useNavigate} from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  function navPage(direction, topicUrl) {
    let prev;
    let next = false;
    for (const section of topics) {
      for (const topic of section.topics) {
        if (next) {
          console.log('Found topic ', topic);
          navigate(`/page/${topic.path}`);
          return;
        }

        if (topicUrl.endsWith(topic.path)) {
          if (direction === 'next') {
            next = true;
          } else if (prev) {
            console.log('Found topic ', prev);
            //            navigate(`/page/${topic.path}`);
            navigate('/xxxx');
            return;
          }
        } else if (direction === 'prev') {
          prev = topic;
        }
      }
    }

    console.log('nav to topics');
    redirect(`/`);
  }

  const [topics, setTopics] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      setTopics(await loadTopics());
    })();
  }, []);

  return (
    <>
      <p>CS 260</p>
      <Routes>
        <Route path='/' element={<TopicList topics={topics} />} exact />
        <Route path='/page/*' element={<Page onNav={navPage} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
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
  const sections = [];
  for (let blockMatch of body.matchAll(blockReg)) {
    const topics = [];
    sections.push({title: blockMatch[1], topics: topics});
    for (let lineMatch of blockMatch[0].matchAll(lineReg)) {
      topics.push({assignment: !!lineMatch[1], title: lineMatch[2], path: lineMatch[3]});
    }
  }
  return sections;
}
