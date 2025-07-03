import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("profile", "routes/create-profile.tsx"),
    route("connect", "routes/matching-profiles.tsx"),
] satisfies RouteConfig;
