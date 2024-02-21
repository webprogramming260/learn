import React from 'react';
import Content from './content.jsx';
import { useParams, useLocation } from 'react-router-dom';

import './page.css';

export default function Page({ course, onPathChange }) {
  const location = useLocation();
  const wildcard = useParams()['*'];
  const [contentUrl, setContentUrl] = React.useState('');

  React.useEffect(() => {
    if (course.repo) {
      const url = `https://github.com/${course.repo}/blob/main/${course.contentPath}/${wildcard}`;
      const gitHubUrl = url.replaceAll('_', '.');
      onPathChange?.(url, gitHubUrl);

      let rawUrl = `https://raw.githubusercontent.com/${course.repo}/main/${course.contentPath}/${wildcard}`;
      rawUrl = rawUrl.replaceAll('_', '.');
      setContentUrl(rawUrl);
    }
  }, [location, course]);

  return <Content url={contentUrl} canvasUrl={course.canvasUrl} />;
}
