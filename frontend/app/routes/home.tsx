import type { Route } from "./+types/home";
import {Navigation} from "../../src/layouts/navigation";
import {Footer} from "../../src/layouts/footer";
import {Outlet} from "react-router";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return(
      <>
        <h1 className = "min-h-100">Testing, testing... This text from app/routes/home.tsx</h1>
      </>
  )
}
