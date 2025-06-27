import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css"
import {BrowserRouter, Routes, Route} from "react-router";
import RootLayout from "../app/root";
import Home from "~/routes/home";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<RootLayout />} >
                    <Route  index element={<Home />}/>
                    <Route path={'/messages'} element={<Connections />} />
                    {/*<Route path={'/connect'} element={<Matching />} />*/}
                    <Route path={'/profile'} element={<Profile />} loader={loader}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
