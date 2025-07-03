import {useState} from "react";
import type { Route } from "./+types/home";
import {Connections} from "../../src/layouts/view-connections-messages";
import MessagingApp from "../../src/layouts/Messaging";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'connections' | 'messages'>('connections')
  return(
      <>
          <Connections/>
          <MessagingApp/>
      </>
  )
}

