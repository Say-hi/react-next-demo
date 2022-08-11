
import { getDB } from "db";
import { Article } from "db/entity";
import { GetServerSideProps } from "next/types";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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

export const indexGetServerSideProps: GetServerSideProps = async ({ req }) => {
  const { userId, avatar, nickname } = req.cookies || {};
  const db = await getDB()
  const articleRep = db.getRepository(Article)
  const articles = await articleRep.find({
    relations: ['user']
  }) || []
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
      articles: JSON.parse(JSON.stringify(articles))
    }
  };
};

export const articleDetailGetServerSideProps: GetServerSideProps = async ({ req, params, resolvedUrl }) => {
  const { userId, avatar, nickname } = req.cookies || {};
  const { id: articelId } = params as any
  const db = await getDB()
  const articleRep = db.getRepository(Article)
  const article = await articleRep.findOne({
    where: {
      id: Number(articelId)
    },
    relations: ['user', 'comments', 'comments.user']
  })

  if (article && resolvedUrl.indexOf('article') >= 0) {
    console.log('阅读次数+1')
    article.views = article.views + 1
    await articleRep.save(article)
  }

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
      article: JSON.parse(JSON.stringify(article))
    }
  };
};
