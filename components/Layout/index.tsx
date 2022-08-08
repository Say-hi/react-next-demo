import { NextPage } from "next";
import { PropsWithChildren } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

const Layout: NextPage<PropsWithChildren> = ({ children }) => (<div>
    <Navbar />
    <main>{ children }</main>
    <Footer />
</div>)

export default Layout