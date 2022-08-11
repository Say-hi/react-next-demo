import type { InferGetServerSidePropsType, NextPage } from "next";
import { indexGetServerSideProps } from "help/getServerSideProps";
import ListItem from "components/ListItem";
import { ArtilceType } from "interface";
import { Divider } from "antd";

const Home: NextPage<
  InferGetServerSidePropsType<typeof indexGetServerSideProps>
> = ({ articles }) => {
  return (
    <div
      className="content-layout"
    >
      {articles?.map((article: ArtilceType, index: number) => (
        <div key={article.id}>
          <ListItem article={article} />
          {index < articles.length - 1 ? <Divider /> : null}
        </div>
      ))}
    </div>
  );
};

export default Home;

export const getServerSideProps = indexGetServerSideProps;
