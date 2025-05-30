import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="ko">
        <Head>
          {/* Primary Meta Tags */}
          <meta name="title" content="한글 음절 TTS 생성기 | Korean Hangul Syllable TTS Generator" />
          <meta name="description" content="모든 한글 음절(11,172개, 겹받침 포함)의 TTS 오디오를 생성하는 도구입니다. OpenAI TTS API를 활용하여 한국어 발음 학습과 연구를 위한 완전한 음성 데이터베이스를 구축합니다. Generate TTS audio for all Korean Hangul syllables (11,172 including complex final consonants) using OpenAI TTS API for Korean pronunciation learning and research." />
          <meta name="keywords" content="한글, 한국어, TTS, 음성합성, 발음, 학습, 겹받침, 언어학, 연구, Korean, Hangul, Text-to-Speech, pronunciation, learning, OpenAI, syllables, 음절, complex consonants, linguistics, research" />
          <meta name="author" content="Jeanyoon Choi, PhD Candidate, XD Lab, KAIST" />
          <meta name="robots" content="index, follow" />
          <meta name="language" content="Korean" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="한글 음절 TTS 생성기 | Korean Hangul Syllable TTS Generator" />
          <meta property="og:description" content="모든 한글 음절(11,172개, 겹받침 포함)의 TTS 오디오를 생성하는 도구입니다. OpenAI TTS API를 활용하여 한국어 발음 학습과 연구를 위한 완전한 음성 데이터베이스를 구축합니다." />
          <meta property="og:locale" content="ko_KR" />
          <meta property="og:locale:alternate" content="en_US" />
          
          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content="한글 음절 TTS 생성기 | Korean Hangul Syllable TTS Generator" />
          <meta property="twitter:description" content="모든 한글 음절(11,172개, 겹받침 포함)의 TTS 오디오를 생성하는 도구입니다. OpenAI TTS API를 활용하여 한국어 발음 학습과 연구를 위한 완전한 음성 데이터베이스를 구축합니다." />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          
          {/* Google Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet" />
          
          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "한글 음절 TTS 생성기",
                "alternateName": "Korean Hangul Syllable TTS Generator",
                "description": "모든 한글 음절(11,172개, 겹받침 포함)의 TTS 오디오를 생성하는 도구입니다. OpenAI TTS API를 활용하여 한국어 발음 학습과 연구를 위한 완전한 음성 데이터베이스를 구축합니다.",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Web Browser",
                "inLanguage": ["ko", "en"],
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "creator": {
                  "@type": "Person",
                  "name": "Jeanyoon Choi",
                  "affiliation": {
                    "@type": "Organization",
                    "name": "XD Lab, KAIST"
                  }
                }
              })
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
