import React from 'react';
import TopicList from './topicList';
import Page from './page';
import { BrowserRouter, Route, Routes, NavLink, Navigate } from 'react-router-dom';
import ScrollToTop from './scrollToTop';

const defaultCourse = {
  gitHubRoot: 'https://github.com/webprogramming260/.github/blob/main/profile/',
  sections: [],
};

export default function App() {
  const [course, setCourse] = React.useState(defaultCourse);
  const [gitHubUrl, setGitHubUrl] = React.useState('');

  React.useEffect(() => {
    (async () => {
      setCourse(await loadCourse());
    })();
  }, []);

  function pathChange(url, gitHubUrl) {
    setGitHubUrl(gitHubUrl);
  }

  return (
    <BrowserRouter>
      <div className='h-screen text-stone-950 dark:text-stone-300 dark:bg-stone-900 flex flex-col'>
        <header className='flex flex-col'>
          <div className='h-12 border-b-4 border-stone-900 dark:border-stone-400 flex flex-row align-middle justify-between'>
            <h1 className='font-bold min-h-fit p-4 text-stone-800 dark:text-stone-300'>CS 260 - Web Programming</h1>
            <NavLink to='/page/schedule/schedule_md' className='min-h-fit p-4 text-blue-400 hover:underline'>
              Schedule
            </NavLink>
          </div>
          <PageNav course={course} gitHubUrl={gitHubUrl}></PageNav>
        </header>
        <main className='h-auto overflow-scroll'>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<TopicList course={course} onPathChange={pathChange} />} exact />
            <Route path='/page/*' element={<Page course={course} onPathChange={pathChange} />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function PageNav({ course, gitHubUrl }) {
  function getPage(direction) {
    if (course.sections.length > 0) {
      const currentPage = window.location.pathname;
      if (currentPage === '/') {
        if (direction === 'next') {
          return course.sections[0].topics[0].path;
        }
        const lastSection = course.sections[course.sections.length - 1];
        const lastTopic = lastSection.topics[lastSection.topics.length - 1];
        return lastTopic.path;
      }

      let prev;
      let next = false;
      for (const section of course.sections) {
        for (const topic of section.topics) {
          if (next) {
            return topic.path;
          }

          if (currentPage === topic.path) {
            if (direction === 'next') {
              next = true;
            } else if (prev) {
              return prev.path;
            }
          } else if (direction === 'prev') {
            prev = topic;
          }
        }
      }
    }
    return '/';
  }

  return (
    <div className='m-0 text-gray-200 bg-gray-800 justify-between flex px-6 py-3 text-lg'>
      <NavLink to={getPage('prev')}>Prev</NavLink>
      <NavLink to='/'>Topics</NavLink>
      <a href={gitHubUrl}>GitHub</a>
      <NavLink to={getPage('next')}>Next</NavLink>
    </div>
  );
}

async function loadCourse() {
  const modulesUrl = 'https://github.com/webprogramming260/.github/blob/main/profile/instructionTopics.md';

  const rawUrl = modulesUrl.replace(
    'github.com/webprogramming260/.github/blob',
    'raw.githubusercontent.com/webprogramming260/.github'
  );

  const r = await fetch(rawUrl);
  const body = await r.text();
  const blockRegEx = /^## (.*)$[^##]*/gm;
  const lineRegEx = /- (.*)\[(.*)]\(([^ ]*)\)( _\(\w* (.*)\)_)?$/gm;
  const sections = [];
  for (let blockMatch of body.matchAll(blockRegEx)) {
    const topics = [];
    for (let lineMatch of blockMatch[0].matchAll(lineRegEx)) {
      const path = lineMatch[3].replaceAll('.', '_');
      topics.push({
        assignment: !!lineMatch[1],
        title: lineMatch[2],
        path: `/page/${path}`,
        due: parseDate(lineMatch[5]),
      });
    }

    if (topics.length > 0) {
      sections.push({ title: blockMatch[1], topics: topics });
    }
  }
  return { ...defaultCourse, sections: sections };
}

function parseDate(textDate) {
  if (textDate) {
    const parts = textDate.split('/');
    if (parts.length === 2) {
      let date = new Date();
      date.setMonth(parts[0] - 1);
      date.setDate(parts[1]);
      return date;
    }
  }
  return null;
}
