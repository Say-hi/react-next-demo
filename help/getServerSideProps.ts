
import { getDB } from "db";
import { Article, Tag, User } from "db/entity";
import { GetServerSideProps } from "next/types";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { userId = null, avatar = null, nickname = null } = req.cookies || {};
  // console.log(userId, avatar, nickname , 'page initial')
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
  const { userId = null, avatar = null, nickname = null } = req.cookies || {};
  const db = await getDB()
  const articleRep = db.getRepository(Article)
  const tagRep = db.getRepository(Tag)
  const tags = await tagRep.find() || []
  tags.unshift({
    id: 0,
    title: '全部',
    icon: '',
    follow_count: 0,
    article_count: 0,
    articles: null,
    users: null
  })
  const articles = await articleRep.find({
    relations: ['user'],
    order: {
      update_time: 'DESC'
    }
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
      articles: JSON.parse(JSON.stringify(articles)),
      tags: JSON.parse(JSON.stringify(tags))
    }
  };
};

export const articleDetailGetServerSideProps: GetServerSideProps = async ({ req, params, resolvedUrl }) => {
  const { userId = null, avatar = null, nickname = null } = req.cookies || {};
  const { id: articelId } = params as any
  const db = await getDB()
  const articleRep = db.getRepository(Article)
  const article = await articleRep.findOne({
    where: {
      id: Number(articelId)
    },
    relations: ['user', 'comments', 'comments.user', 'tags']
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


export const getUserServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { userId = null, avatar = null, nickname = null } = req.cookies || {};
  let userInfo = {}
  let requestUserId = params?.id
  if (requestUserId) {
    const db = await getDB()
    const user = await db.getRepository(User).findOne({
      where: {
        id: Number(requestUserId)
      }
    })
    if (user) {
      const articles = await db.getRepository(Article).find({
        where: {
          user: {
            id: Number(requestUserId)
          }
        },
        relations: ['user', 'tags'],
        select: ['content', 'create_time', 'id', 'tags', 'title', 'update_time', 'user', 'views']
      })
      userInfo = JSON.parse(JSON
        .stringify({
          ...user,
          articles
        }))
    }
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
      userInfo
    }
  };
};

export const getUserProfileServerSideProps: GetServerSideProps = async ({ req }) => {
  const { userId = null, avatar = null, nickname = null } = req.cookies || {};
  let userInfo
  if (userId) {
    const db = await getDB()
    const user = await db.getRepository(User).findOne({
      where: {
        id: Number(userId)
      }
    })
    userInfo = user
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
      userInfo: JSON.parse(JSON.stringify(userInfo))
    }
  };
};