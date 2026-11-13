import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";

const CANONICAL = "https://userdata-cloud.netlify.app/news/userdata-cloud-opens-its-public-organization";

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: "Userdata Cloud opens its public organization",
  datePublished: "2026-11-12",
  dateModified: "2026-11-12",
  author: { "@type": "Organization", name: "userdata.cloud", url: "https://userdata-cloud.netlify.app/" },
  publisher: {
    "@type": "Organization",
    name: "userdata.cloud",
    url: "https://userdata-cloud.netlify.app/"
  },
  mainEntityOfPage: CANONICAL,
  description:
    "The GitHub organization userdata-cloud is public, with a vault app, a product site, and a docs hub for records that outlive the issuer."
});

export default function NewsItem() {
  return (
    <article class="article">
      <Title>Userdata Cloud opens its public organization</Title>
      <script type="application/ld+json">{jsonLd}</script>
      <p>
        <A href="/news">News</A>
      </p>
      <time dateTime="2026-11-12">12 November 2026</time>
      <h1>Userdata Cloud opens its public organization</h1>
      <p>
        Personal records that disappear when a company shuts down or is sold now have a public organization.
        userdata-cloud on GitHub holds the protocol work and the first vault app.
      </p>
      <p>The organization name on GitHub is userdata-cloud. The product site is this Netlify site.</p>
      <p>
        The vault that had been developed as personal-records-vault moves into the organization under the repository
        name userdata-cloud. Reader docs live at{" "}
        <a href="https://docs.userdata.cloud/home/">docs.userdata.cloud</a>.
      </p>
    </article>
  );
}
