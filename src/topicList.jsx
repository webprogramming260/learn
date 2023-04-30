import React from 'react';
import {NavLink} from 'react-router-dom';

export default function TopicList({topics}) {
  const o = [];
  topics.forEach((section) => {
    const ol = [];
    section.topics.forEach((topic) => {
      ol.push(
        <li key={topic.title}>
          <NavLink to={`/x/${topic.path}`}>{topic.title}</NavLink>
        </li>
      );
    });
    o.push(
      <div key={section.title}>
        <h3>{section.title}</h3>
        <ul>{ol}</ul>
      </div>
    );
  });

  return <div>{o}</div>;
}
