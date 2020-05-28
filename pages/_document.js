// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="theme-color" content="#343a40"></meta>
          <title>memword</title>
          {/* 구글로그인 */}
          <meta name="google-signin-scope" content="profile email" />
          <meta
            name="google-signin-client_id"
            content="262093891154-hf96vasi6kntg3fd0ppie509knmhsagi.apps.googleusercontent.com"
          />
          {/* <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script> */}
          <script
            src="https://apis.google.com/js/client:plusone.js"
            type="text/javascript"
          ></script>

          {/* 공통 css */}
          <link rel="stylesheet" href="/static/css/style.css"></link>

          {/* Fontello 아이콘 */}
          <link
            rel="stylesheet"
            href="/static/fontello/css/fontello.css"
          ></link>

          <style>{``}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
