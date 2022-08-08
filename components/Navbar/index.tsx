import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { navs } from "./config";
import Login from "components/Login";
import styles from "./index.module.scss";
import { MouseEventHandler, useState } from "react";
import { Button } from "antd";

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleGotoEditorPage: MouseEventHandler<HTMLElement> = (e) => {};
  const handleLogin: MouseEventHandler<HTMLElement> = (e) => {
    setIsShowLogin(true);
  };
  const handleClose = () => {
    setIsShowLogin(false);
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
        <Button onClick={handleLogin} type="primary">
          登录
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default Navbar;
