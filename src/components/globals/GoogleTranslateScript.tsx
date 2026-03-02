"use client";

import Script from "next/script";

export default function GoogleTranslateScript() {
  return (
    <>
      <Script
        src="/assets/script/translation.js"
        strategy="beforeInteractive"
      />
      {process.env.NEXT_PUBLIC_GOOGLE_TRANSLATION_CONFIG && (
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
