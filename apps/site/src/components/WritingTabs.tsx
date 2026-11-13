import { A } from "@solidjs/router";

export default function WritingTabs(props: { current: "news" | "blog" }) {
  return (
    <nav class="title-tabs" aria-label="News and blog">
      <A
        href="/news"
        class="title-tabs__tab"
        classList={{ "is-current": props.current === "news" }}
        aria-current={props.current === "news" ? "page" : undefined}
      >
        News
      </A>
      <A
        href="/blog"
        class="title-tabs__tab"
        classList={{ "is-current": props.current === "blog" }}
        aria-current={props.current === "blog" ? "page" : undefined}
      >
        Blog
      </A>
    </nav>
  );
}
