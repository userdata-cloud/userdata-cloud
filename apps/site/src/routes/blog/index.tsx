import { Title } from "@solidjs/meta";

import WritingTabs from "~/components/WritingTabs";

export default function BlogIndex() {
  return (
    <section class="article">
      <Title>Blog — userdata.cloud</Title>
      <h1 class="sr-only">Blog</h1>
      <WritingTabs current="blog" />
      <p>Informal updates and discussions within the industry.</p>
    </section>
  );
}
