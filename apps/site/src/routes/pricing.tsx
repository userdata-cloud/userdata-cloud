import { Title } from "@solidjs/meta";

const CANONICAL = "https://userdata-cloud.netlify.app/pricing";

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Pricing",
  url: CANONICAL,
  description: "Users store for free. Businesses pay for the attestation records they issue.",
  publisher: {
    "@type": "Organization",
    name: "userdata.cloud",
    url: "https://userdata-cloud.netlify.app/"
  },
  mainEntity: {
    "@type": "Offer",
    name: "User storage",
    price: "0",
    priceCurrency: "USD",
    description: "Personal data and attestation records are stored for the person at no charge."
  }
});

export default function Pricing() {
  return (
    <>
      <Title>Pricing — userdata.cloud</Title>
      <script type="application/ld+json">{jsonLd}</script>
      <section class="band band--price-users">
        <div class="band__inner price">
          <h1>Users store for free</h1>
          <p>
            Personal data you create stays on userdata.cloud at no charge. An attestation record a business sends you
            is stored for free as well.
          </p>
        </div>
      </section>
      <section class="band band--price-business">
        <div class="band__inner price">
          <h2>Business pricing</h2>
          <p>
            A business pays for the attestation records it issues. The charge covers the signed record and delivery
            into the person's database. The person who keeps the record is not billed for storage.
          </p>
          <p>There is no rate card on this page. The price is arranged with the business that issues the records.</p>
        </div>
      </section>
    </>
  );
}
