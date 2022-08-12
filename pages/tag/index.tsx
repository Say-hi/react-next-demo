import { Button, message, Tabs } from "antd";
import { Tag, User } from "db/entity";
import { observer } from "mobx-react-lite";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import request from "service/fetch";
import { useStore } from "store";
import * as ANT_ICON from '@ant-design/icons'
import styles from './index.module.scss'


const TagPage: NextPage = () => {
  const store = useStore();
  const [followTags, setFollowTags] = useState<(Omit<Tag, 'users'> & {users: Tag['users'][]})[]>([]);
  const [allTags, setAllTags] = useState<(Omit<Tag, 'users'> & {users: Tag['users'][]})[]>([]);
  const { userId = 0 } = store?.user!.userInfo;

  useEffect(() => {
    getData()
  }, []);

  const getData = () => {
    request.get("/api/tag/get").then((res: any) => {
      if (!res.code) {
        const { followTags, allTags } = res.data;
        setFollowTags(followTags);
        setAllTags(allTags);
      }
    });
  }

  const handleToggleFollow = (tagId: number, follow: boolean) => () => {
    request.post('/api/tag/follow', {
      type: follow ? 'follow' : 'unFollow',
      tagId
    }).then((res: any) =>{
      message.destroy()
      if (!res.code) {
        message.success(`${follow ? '关注': '取关'}成功`)
      } else {
        message.error(res.msg)
      }
      getData()
    })
  }

  return (
    <div className="content-layout">
      <Tabs>
        <Tabs.TabPane tab='已关注标签' key='follow' className={styles.tags}>
            {
                followTags?.length ? followTags.map(tag => (
                    <div key={tag.id} className={styles.tagWrapper}>
                        <div>{ ANT_ICON[tag.icon].render() }</div>
                        <div className={styles.title}>{ tag.title }</div>
                        <div>{ tag.follow_count } 关注 { tag.article_count } 文章</div>
                        {
                          tag?.users?.find(user => Number(user.id) === Number(userId)) ? 
                          <Button type='primary' onClick={handleToggleFollow(tag.id, false)}>已关注</Button>
                          :
                          <Button type='default' onClick={handleToggleFollow(tag.id, true)}>关注</Button>
                        }
                    </div>
                )) : <div>你还没有关注的标签哦~~</div>
            }
        </Tabs.TabPane>
        <Tabs.TabPane tab='全部标签' key='all' className={styles.tags}>
            {
                allTags?.map(tag => (
                    <div key={tag.id} className={styles.tagWrapper}>
                        <div>{ ANT_ICON[tag.icon].render() }</div>
                        <div className={styles.title}>{ tag.title }</div>
                        <div>{ tag.follow_count } 关注 { tag.article_count } 文章</div>
                        {
                          tag?.users?.find(user => Number(user.id) === Number(userId)) ? 
                          <Button type='primary' onClick={handleToggleFollow(tag.id, false)}>已关注</Button>
                          :
                          <Button type='default' onClick={handleToggleFollow(tag.id, true)}>关注</Button>
                        }
                    </div>
                ))
            }
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default observer(TagPage);

export { getServerSideProps } from "help/getServerSideProps";
