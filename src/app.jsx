import React from 'react';
import TopicList from './topicList';
import Page from './page';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {useParams} from 'react-router-dom';

export default function App() {
  console.log('App loaded');

  return (
    <BrowserRouter>
      <p>CS 260</p>
      <Routes>
        <Route path='/' element={<TopicList />} exact />
        <Route path='/page/*' element={<PageRouter />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function PageRouter() {
  const wildcard = useParams()['*'];

  function navPage(topic) {
    console.log(topic);
  }
  return <Page url={'https://github.com/webprogramming260/.github/blob/main/profile/' + wildcard} onNav={navPage} />;
}

function NotFound() {
  return <div>Not found</div>;
}
