import type { Route } from "./+types/home";
import MatchingBegin from "~/routes/matching-begin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return(
      <>
        <MatchingBegin />
      </>
  )
}