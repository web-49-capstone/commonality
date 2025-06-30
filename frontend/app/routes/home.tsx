import type { Route } from "./+types/home";
import {Connections} from "../../src/layouts/view-connections-messages";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return(
      <>
        <Connections />
      </>
  )

}

