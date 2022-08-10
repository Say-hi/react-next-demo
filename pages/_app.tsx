import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { StoreProvider } from "store";

function MyApp({
  initialValue,
  Component,
  pageProps,
}: AppProps & {
  initialValue: any;
}) {
  return (
    <StoreProvider initialValue={initialValue}>
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

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, avatar, nickname } = ctx.req?.cookies || {};
  console.log(userId, avatar, nickname , 'initial')
  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          avatar,
          nickname,
        },
      },
    },
  };
};

export default MyApp;
