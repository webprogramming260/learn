import React from "react";
import TopicList from "./topicList";
import Page from "./page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./scrollToTop";

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
    <BrowserRouter>
      <ScrollToTop />
      <div className="text-stone-950 dark:text-stone-300 dark:bg-stone-900 flex flex-col">
        <h1 className="font-bold text-2xl p-4 text-stone-800 dark:text-stone-300 border-b-4 border-stone-900 dark:border-stone-400 flex flex-row align-middle justify-start">
          <svg
            className="fill-yellow-200 dark:fill-cyan-900 h-8 mx-3 inline"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
            ></path>
          </svg>
          CS 260 - Web Programming
        </h1>
        <Routes>
          <Route path="/" element={<TopicList topics={topics} />} exact />
          <Route path="/page/*" element={<Page onNav={navPage} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
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
