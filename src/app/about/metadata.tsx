// ./src/app/about/metadata.tsx

export default function MetaData() {
  return (
    <>
      <title>About VoiceAI - Leading Text-to-Speech Technology Provider</title>
      <meta
        name="description"
        content="Learn about VoiceAI's mission to revolutionize text-to-speech technology. Discover our story, team, and commitment to innovation."
      />
      <meta
        name="keywords"
        content="VoiceAI about, text to speech company, AI voice generation company, speech synthesis technology"
      />

      {/* Open Graph tags */}
      <meta property="og:title" content="About VoiceAI - Leading Text-to-Speech Technology Provider" />
      <meta
        property="og:description"
        content="Learn about VoiceAI's mission to revolutionize text-to-speech technology."
      />
      <meta property="og:image" content="/about-og.jpg" />
    </>
  )
}
