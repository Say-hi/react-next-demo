import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { StoreProvider } from "store";

console.log('complie html')

function MyApp({
  Component,
  pageProps,
}: AppProps) {
  return (
    <StoreProvider initialValue={pageProps.initialValue}>
      {Component['layout'] === null ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </StoreProvider>
  );
}

export default MyApp;
