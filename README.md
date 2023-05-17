# 260 Instruction

The project reads GitHub markdown files and creates an app specific view of their content for easy navigation.

You can view the application in action at [learn.cs260.click](https://learn.cs260.click).

# Steps for creation

The following describes the process used to create this application.

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

Using [Markdown-it](https://github.com/markdown-it/markdown-it) and [highlight.js](https://highlightjs.org/) we can render the GitHub pages. I had to import each of these packages and then add code to process the markdown into HTML and highlight the code syntax.

```js
fetch(rawUrl)
  .then((r) => r.text())
  .then((body) => {
    let renderedHtml = md.render(body);
    setHtmlDoc(renderedHtml);
  });

const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre>' + hljs.highlight(str, {language: lang, ignoreIllegals: true}).value + `</pre>`;
      } catch (__) {}
    }

    return '';
  },
});
```

## Converted to React

Added components for the application. Vite supports this directly and so I just had to start writing JSX and import React.

```jsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
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
        <Route path='/' element={<TopicList topics={topics} />} exact />
        <Route path='/page/*' element={<Page onNav={navPage} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}
```

## Converted topicList to TypeScript

Just rename the file to `tsx` and start using TypeScript.

```tsx
export default function TopicList({topics}) {
  function getDue(due: Date) {
    if (due) {
      if (Date.now() > due.getTime()) {
        <span className='due'>☑ {due.getUTCDate()}</span>;
      } else {
        <span className='due'>xx☑ {due.getUTCDate()}</span>;
      }
    }
    return '';
  }
  const o: JSX.Element[] = [];
  topics.forEach((section) => {
    const ol: JSX.Element[] = [];
    section.topics.forEach((topic) => {
      ol.push(
        <li key={topic.title}>
          <NavLink to={`/page/${topic.path}`}>{topic.title}</NavLink> {getDue(topic.due)}
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

- [PluralSight course](https://app.pluralsight.com/library/courses/tailwind-css-3-fundamentals/table-of-contents)
- Installed Tailwind CSS VSCode extension
- To get started we can just use the CDN to bring tailwind in. Modify index.html to include:
  ```js
  <script src='https://cdn.tailwindcss.com'></script>
  ```
- Added some simple classes to style things.
- Installed [tailwind](https://tailwindcss.com/docs/guides/vite) instead of using the CDN
  ```sh
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
  All this does is create a `tailwind.config.js`.
- Modify the `tailwind.config.js` to tell it where to find files we want it to process.
  ```js
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ['./src/*.{html,tsx,jsx}', './index.html'],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  ```
- Add the directives that tell tailwind where to build the css in an `index.css` file
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Reference the `index.css` from `index.html`
- When you run `npm run dev` vite will automatically compile the tailwind css and display the result.

## Font

I changed the base font for the application to Montserrat using the following

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: Montserrat, monospace;
  }
}
```

## Dark mode support

I added the ability to use the operating system setting for dark mode. At the highest level I added an application wide toggle using the media selector.

```css
@layer base {
  body {
    background-color: white;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: black;
    }
  }
}
```

Then specific elements are controlled with Tailwind classes.

```html
<div className="text-stone-950 dark:text-stone-300 dark:bg-stone-900 flex flex-col"></div>
```
