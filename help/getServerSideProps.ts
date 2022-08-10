import { GetServerSideProps } from "next/types";

export const getServerSideProps: GetServerSideProps = async ({ req }) =>  {
    const { userId, avatar, nickname } = req.cookies || {};
    // console.log(userId, avatar, nickname , 'initial')
    return {
      props: {
        initialValue: {
          user: {
            userInfo: {
              userId,
              avatar,
              nickname,
            },
          },
        },
      }
    };
  };