import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";

export default function NewsIndex() {
  return (
    <section class="article">
      <Title>News — userdata.cloud</Title>
      <h1>News</h1>
      <p>Dated notes about the organization. Essays stay off this list.</p>
      <ul class="news-list">
        <li>
          <A href="/news/userdata-cloud-opens-its-public-organization">
            Userdata Cloud opens its public organization
          </A>
          <time dateTime="2026-11-12">12 November 2026</time>
        </li>
      </ul>
    </section>
  );
}
