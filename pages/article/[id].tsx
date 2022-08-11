import { ArtilceType } from "interface";
import { articleDetailGetServerSideProps as getServerSideProps } from "help/getServerSideProps";
import styles from "./index.module.scss";
import { Avatar, Button, Divider, Input, message } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "store";
import Link from "next/link";
import Markdown from "markdown-to-jsx";
import { formatTime } from "help/time";
import { ChangeEventHandler, useState } from "react";
import request from "service/fetch";
import { Comment } from "db/entity";

interface IProps {
  article: Omit<ArtilceType, "comments"> & {
    comments: (Omit<Comment, "update_time"> & { update_time: string })[];
  }
}

const ArtilceDetail = ({ article }: IProps) => {
  const store = useStore();
  const [inputVal, setInputVal] = useState("");
  const [ comments, setComments ] =useState(article.comments || [])
  const isLogin = Boolean(store.user?.userInfo.userId);

  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setInputVal(e.target.value);
  };
  const handleComment = () => {
    request
      .post("/api/comment/publish", {
        content: inputVal,
        articleId: article.id,
      })
      .then((res: any) => {
        if (!res.code) {
            comments.unshift({
                id: Math.random(),
                content: inputVal,
                create_time: new Date(),
                update_time: new Date().toString(),
                user: {
                    ...store?.user?.userInfo,
                    id: Number(store!.user!.userInfo.userId)
                }
            } as any)
            setComments([...comments])
          message.success("发表评论成功");
          setInputVal("");
          
        } else {
          message.destroy();
          message.error(res.msg);
        }
      });
  };

  return (
    <>
      <div className="content-layout">
        <h2 className={styles.title}>{article.title}</h2>
        <div className={styles.user}>
          <Avatar size={50} src={article?.user.avatar} />
          <div className={styles.info}>
            <div className={styles.name}>{article?.user.nickname}</div>
            <div className={styles.date}>
              <div>{formatTime(article?.update_time)}</div>
              <div>阅读 {article?.views}</div>
              {store?.user?.userInfo.userId == article?.user.id ? (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              ) : null}
            </div>
          </div>
        </div>
        <Markdown className={styles.markdown}>{article?.content}</Markdown>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <h3>评论</h3>
        <div className={styles.comment}>
          {isLogin ? (
            <div className={styles.enter}>
              <Avatar src={store.user?.userInfo.avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  onChange={handleInputChange}
                  placeholder="请发表您的想法吧~~"
                  rows={2}
                  value={inputVal}
                />
                <Button
                  type="primary"
                  disabled={!inputVal.length}
                  onClick={handleComment}
                >
                  发表评论
                </Button>
              </div>
            </div>
          ) : null}
        </div>
        <Divider />
        <div className={styles.display}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.wrapper}>
              <Avatar src={comment.user.avatar} size={30} />
              <div className={styles.info}>
                <div className={styles.name}>
                  {comment.user.nickname}
                  <div className={styles.date}>
                    {formatTime(comment.update_time)}
                  </div>
                </div>
                <div className={styles.content}>{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default observer(ArtilceDetail);

export { getServerSideProps };
