import React from "react";
import TopicList from "./topicList";
import Page from "./page";
import { Route, Routes } from "react-router-dom";
//import './app.css';

export default function App() {
  function navPage(direction, topicUrl) {
    let prev;
    let next = false;
    for (const section of topics) {
      for (const topic of section.topics) {
        if (next) {
          return `/page/${topic.path}`;
        }

        if (topicUrl.endsWith(topic.path)) {
          if (direction === "next") {
            next = true;
          } else if (prev) {
            return `/page/${prev.path}`;
          }
        } else if (direction === "prev") {
          prev = topic;
        }
      }
    }

    return `/`;
  }

  const [topics, setTopics] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      setTopics(await loadTopics());
    })();
  }, []);

  return (
    <>
      <nav>
        <h1>CS 260 - Web Programming</h1>
      </nav>
      <Routes>
        <Route path="/" element={<TopicList topics={topics} />} exact />
        <Route path="/page/*" element={<Page onNav={navPage} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function NotFound() {
  return <div>Not found</div>;
}

async function loadTopics() {
  const url =
    "https://github.com/webprogramming260/.github/blob/main/profile/instructionTopics.md";

  const rawUrl = url.replace(
    "github.com/webprogramming260/.github/blob",
    "raw.githubusercontent.com/webprogramming260/.github"
  );

  const r = await fetch(rawUrl);
  const body = await r.text();
  const blockRegEx = /^## (.*)$[^##]*/gm;
  const lineRegEx = /- (.*)\[(.*)]\(([^ ]*)\)( _\(\w* (.*)\)_)?$/gm;
  const sections = [];
  for (let blockMatch of body.matchAll(blockRegEx)) {
    const topics = [];
    sections.push({ title: blockMatch[1], topics: topics });
    for (let lineMatch of blockMatch[0].matchAll(lineRegEx)) {
      const path = lineMatch[3].replaceAll(".", "_");
      topics.push({
        assignment: !!lineMatch[1],
        title: lineMatch[2],
        path: path,
        due: parseDate(lineMatch[5]),
      });
    }
  }
  return sections;
}

function parseDate(textDate) {
  if (textDate) {
    const parts = textDate.split("/");
    if (parts.length === 2) {
      let date = new Date();
      date.setMonth(parts[0] - 1);
      date.setDate(parts[1]);
      return date;
    }
  }
  return null;
}
