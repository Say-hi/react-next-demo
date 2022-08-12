import type { InferGetServerSidePropsType, NextPage } from "next";
import { indexGetServerSideProps } from "help/getServerSideProps";
import ListItem from "components/ListItem";
import { ArtilceType } from "interface";
import { Divider, message, Tabs } from "antd";
import { Tag } from "db/entity";
import request from "service/fetch";
import { useState } from "react";

const Home: NextPage<
  InferGetServerSidePropsType<typeof indexGetServerSideProps>
> = ({ articles: ssrArticles, tags }) => {
  const [articles, setArticles] = useState<Array<ArtilceType>>(ssrArticles)
  const handleTabChange = (tagId: string) => {
    getArticleByTag(tagId)
  }

  const getArticleByTag = (tagId: string) => {
    request.post('/api/article/get', {
      tagId
    }).then((res: any) => {
      if (!res.code) {
        setArticles(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }

  return (
    <div
      className="content-layout"
    >
      <Tabs centered onChange={handleTabChange} type='card'>
        {
          tags?.map((tag: Tag) => (
            <Tabs.TabPane tab={tag.title} key={tag.id}></Tabs.TabPane>
          ))
        }
      </Tabs>
      {articles.length ? articles?.map((article: ArtilceType, index: number) => (
        <div key={article.id}>
          <ListItem article={article} />
          {index < articles.length - 1 ? <Divider /> : null}
        </div>
      )): '暂无相关文章，快去发布文章吧~~'}
    </div>
  );
};

export default Home;

export const getServerSideProps = indexGetServerSideProps;
