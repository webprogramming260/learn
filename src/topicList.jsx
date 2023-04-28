//https://github.com/webprogramming260/.github/blob/main/profile/instructionTopics.md

import React from "react";

import Page from "./page";

export default function TopicList() {
  function navPage(topic) {
    console.log(topic);
  }
  return (
    <Page
      url="https://github.com/webprogramming260/.github/blob/main/profile/html/media/media.md"
      onNav={navPage}
    />
  );
}
