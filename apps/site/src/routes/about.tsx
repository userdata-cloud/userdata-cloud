import { Title } from "@solidjs/meta";

export default function About() {
  return (
    <section class="article">
      <Title>About — userdata.cloud</Title>
      <h1>About</h1>
      <p>
        userdata.cloud keeps personal data you create, and records a company signs. The web is the default. A
        copy can start offline and sync with the online one later.
      </p>
      <p>
        userdata.cloud, also called PRV, was conceptualized and started by{" "}
        <a href="https://github.com/AMDphreak">Ryan Johnson</a> (AMDphreak) and{" "}
        <a href="https://github.com/lpoole1992">Lauren Poole</a>.
      </p>
      <figure class="founder">
        <img src="/lauren-poole.jpg" width="768" height="768" alt="Lauren Poole" />
        <figcaption>
          <a href="https://github.com/lpoole1992">Lauren Poole</a>
          <span>
            Photo from her <a href="https://www.modelmayhem.com/2703333">Model Mayhem</a> profile.
          </span>
        </figcaption>
      </figure>
      <p class="credit">
        <a href="https://www.vecteezy.com/free-vector/pixelated-logo">Pixelated Logo Vectors by Vecteezy</a>
      </p>
    </section>
  );
}
