import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route("connect", "routes/matching-profiles.tsx"),
    // route("messages",  "routes/messages.tsx"),
    // route("profile",  "routes/profile.tsx"),
] satisfies RouteConfig;
