const capabilities = [
  "Custom tattoo generation",
  "Cover-up planning",
  "Hand-drawn artist references",
  "Transfer-ready stencil preparation",
  "Artist review",
];

export default function HomePage() {
  return (
    <main>
      <h1>Tattoo Platform v2</h1>
      <p>Canonical foundation build in progress.</p>
      <ul>
        {capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>
      <p>
        Production outputs require synchronized FTA, ACR, and TRS derivatives
        from one canonical locked design.
      </p>
    </main>
  );
}
