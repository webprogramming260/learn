# 260 Instruction

The project reads GitHub markdown files and creates an app specific view of their content for easy navigation.

## vite-vanilla

Created the basic project using vite-vanilla

```sh
npm init @vite/latest vite-vanilla
# Choose vanilla and JavaScript
cd vite-vanilla && npm install
npm run dev
```

## Features

- Bundles and starts so fast.
- Hot replacement.
- CSS replaced inline.
- You can use JSX and TS without any modifications.
- Native ESModule support.

## Under the covers

Vite uses ESBuild to do all the bundling. ESBuild is built with Go and boosts speeds of 30X webpack.

## Implemented Markdown rendering

Using [Markdown-it](https://github.com/markdown-it/markdown-it) and [highlight.js](https://highlightjs.org/) we can render the GitHub pages.

## Converted to React

Added components for the application. Vite supports this directly and so I just had to start writing JSX and import React.

```jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
export default function App() {
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
        <Route path="/" element={<TopicList topics={topics} />} exact />
        <Route path="/page/*" element={<Page onNav={navPage} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
```

## Converted topicList to TypeScript

Just rename the file to `tsx` and start using TypeScript.

```tsx
export default function TopicList({ topics }) {
  function getDue(due: Date) {
    if (due) {
      if (Date.now() > due.getTime()) {
        <span className="due">☑ {due.getUTCDate()}</span>;
      } else {
        <span className="due">xx☑ {due.getUTCDate()}</span>;
      }
    }
    return "";
  }
  const o: JSX.Element[] = [];
  topics.forEach((section) => {
    const ol: JSX.Element[] = [];
    section.topics.forEach((topic) => {
      ol.push(
        <li key={topic.title}>
          <NavLink to={`/page/${topic.path}`}>{topic.title}</NavLink>{" "}
          {getDue(topic.due)}
        </li>
      );
    });

    if (ol.length > 0) {
      o.push(
        <div key={section.title}>
          <h3>{section.title}</h3>
          <ul>{ol}</ul>
        </div>
      );
    }
  });

  return <div>{o}</div>;
}
```

## Converting to Tailwind

- Installled Tailwind CSS VSCode extension
- To get started we can just use the CDN to bring tailwind in.
  ```js
  <script src="https://cdn.tailwindcss.com"></script>
  ```
