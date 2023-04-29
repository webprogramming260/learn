import React from 'react';
import {NavLink} from 'react-router-dom';

import Page from './page';

export default function TopicList({topics}) {
  const o = [];
  topics.forEach((ii) => {
    const ol = [];
    ii.items.forEach((li) => {
      ol.push(
        <li key={li.title}>
          <NavLink to={`page/${li.path}`}>{li.title}</NavLink>
        </li>
      );
    });
    o.push(
      <div key={ii.title}>
        <h3>{ii.title}</h3>
        <ul>{ol}</ul>
      </div>
    );
  });

  return <div>{o}</div>;
}
