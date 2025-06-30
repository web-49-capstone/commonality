import type { Route } from "./+types/groupchat";
import Groupchat from "../../src/components/Groupchat";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Group Chat" },
        { name: "description", content: "Group chat messages" },
    ];
}

export default function GroupchatRoute() {
    return <Groupchat />;
}