import type { NextPage } from "next";

interface PropsType {
  isShow: boolean;
  onClose(): void;
}

const Login: NextPage<PropsType> = ({ isShow = false, onClose }) => {
    return isShow ? <div>123123</div> : null;
};

export default Login;
