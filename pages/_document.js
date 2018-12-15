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
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="theme-color" content="#343a40"></meta>

                    {/* 공통 css */}
                    <link rel="stylesheet" href="/static/css/style.css"></link>

                    {/* Fontello 아이콘 */}
                    <link rel="stylesheet" href="/static/fontello/css/fontello.css"></link>


                    <style>{`

                    `}</style>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}