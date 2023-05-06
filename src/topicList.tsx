import React from 'react';
import { NavLink } from 'react-router-dom';
import './topicList.css';

export default function TopicList({ topics }) {
  function getDue(dueDate: Date) {
    if (dueDate) {
      const now = new Date();
      const due = now.getTime() < dueDate.getTime();
      return <span className={due ? 'due' : 'past-due'}>({`${dueDate.getMonth() + 1}/${dueDate.getDate()}`})</span>;
    }
    return '';
  }
  const o: JSX.Element[] = [];
  topics.forEach((section) => {
    const ol: JSX.Element[] = [];
    section.topics.forEach((topic) => {
      ol.push(
        <li key={topic.title}>
          <NavLink className="px-4" to={`/page/${topic.path}`}>{topic.title}</NavLink> {getDue(topic.due)}
        </li>
      );
    });

    if (ol.length > 0) {
      o.push(
        <div key={section.title} className="container p-4 bg-gray-100 mx-auto">
          <h2>{section.title}</h2>
          <ul>{ol}</ul>
        </div>
      );
    }
  });

  return <div className="bg-gray-200">{o}</div>;
}
