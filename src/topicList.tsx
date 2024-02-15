import React from 'react';
import { NavLink } from 'react-router-dom';
import './topicList.css';

export default function TopicList({ course, onPathChange }) {
  onPathChange?.('/', course.gitHubRoot);
  const topicSections: JSX.Element[] = [];
  course.sections.forEach((section) => {
    const topicSection = <TopicSection key={section.title} section={section} />;
    topicSections.push(topicSection);
  });

  return <div>{topicSections}</div>;
}

function TopicSection({ section }) {
  const [showTopic, setShowTopic] = React.useState(topicExists(section.title));

  const ol: JSX.Element[] = [];

  section.topics.forEach((topic) => {
    ol.push(<Topic key={topic.title} topic={topic} />);
  });

  function toggleTopic() {
    storeTopicState(section.title, !showTopic);
    setShowTopic(!showTopic);
  }

  if (ol.length > 0) {
    const animate = showTopic ? '' : 'hover:underline hover:animate-pulse';
    return (
      <div key={section.title} className='container m-5 p-4 bg-stone-200 rounded-xl dark:bg-stone-800 mx-auto'>
        <h2
          className={animate + ' cursor-pointer font-bold text-2xl p-3 text-stone-900 dark:text-teal-100'}
          onClick={toggleTopic}
        >
          {section.title}
        </h2>
        {showTopic && (
          <div className='block'>
            <ul>{ol}</ul>
          </div>
        )}
      </div>
    );
  }

  return <div></div>;
}

function Topic({ topic }) {
  function getDue(dueDate: Date) {
    if (dueDate) {
      const now = new Date();
      const due = now.getTime() < dueDate.getTime();
      return <span className={due ? 'due' : 'past-due'}>({`${dueDate.getMonth() + 1}/${dueDate.getDate()}`})</span>;
    }
    return '';
  }

  return (
    <li key={topic.title}>
      <NavLink className='px-4 hover:animate-pulse ' to={topic.path}>
        {topic.title}
      </NavLink>{' '}
      {getDue(topic.due)}
    </li>
  );
}

function topicExists(title: string): boolean {
  let topicFound = false;
  const { openTopics: value }: Storage = window.localStorage;
  if (value) {
    const openTopics = JSON.parse(value);
    topicFound = openTopics.includes(title);
  }
  return topicFound;
}

function storeTopicState(title: string, showTopic: boolean) {
  let topics: string[] = [];
  const { openTopics: value }: Storage = window.localStorage;
  if (value) {
    topics = JSON.parse(value);
  }

  if (showTopic) {
    if (!topics.includes(title)) {
      topics.push(title);
    }
  } else {
    if (topics.includes(title)) {
      topics.splice(topics.indexOf(title), 1);
    }
  }
  window.localStorage.setItem('openTopics', JSON.stringify(topics));
}
