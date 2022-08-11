import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { navs } from "./config";
import Login from "components/Login";
import styles from "./index.module.scss";
import { MouseEventHandler, useState } from "react";
import { Avatar, Button, Dropdown, Menu, message } from "antd";
import { useStore } from "store";
import { HomeOutlined, LoginOutlined } from "@ant-design/icons";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import request from "service/fetch";
import { observer } from "mobx-react-lite";

const Navbar: NextPage = () => {
  const { pathname, push } = useRouter();
  const store = useStore();
  const {userId, avatar} = store!.user!.userInfo
  const [isShowLogin, setIsShowLogin] = useState(false);
  const menuItems = [
    {
      label: '个人主页',
      key: 'self',
      icon: <HomeOutlined />
    },
    {
      label: '退出系统',
      key: 'logout',
      icon: <LoginOutlined />
    }
  ]
  const handleGotoEditorPage: MouseEventHandler<HTMLElement> = (e) => {
    if (!userId) {
      message.warn('请先登录后再操作')
      setIsShowLogin(true)
      return
    }
    push('/editor/new')
  };
  const handleLogin: MouseEventHandler<HTMLElement> = (e) => {
    setIsShowLogin(true);
  };
  const handleClose = () => {
    setIsShowLogin(false);
  };
  const handleItemsClick: MenuClickEventHandler = async ({key}) => {
    if (key === 'logout') {
        const res = await request.post('/api/user/logout') as any
        if(!res?.code) {
          console.log('登出系统')
          store!.user!.setUserInfo({})
        }
    } else if (key === 'self') {
      push(`/user/${userId}`)
    }
  }
  const renderDropDownMenu = () => {
    
    return (
      <Menu onClick={handleItemsClick} items={menuItems} />
    );
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <a className={pathname === nav?.value ? styles.active : ""}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>

        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu} placement="bottom">
              <Avatar src={avatar} size={32}></Avatar>
            </Dropdown>
          </>
        ) : (
          <Button onClick={handleLogin} type="primary">
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
