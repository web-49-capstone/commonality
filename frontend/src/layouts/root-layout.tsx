import { Navigation } from "./navigation";
import {Outlet} from "react-router";
import {Footer} from "./footer";

export default function RootLayout() {
    return (
        <>
            <Navigation></Navigation>
            <Outlet />
            <Footer></Footer>
        </>
    )
}