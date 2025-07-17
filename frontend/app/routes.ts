import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    route("login-signup", "routes/login-signup.tsx"),
    route("create-profile", "routes/create-profile.tsx"),

    layout("layouts/navigation.tsx", [
        index("routes/home.tsx"),
        route("connect", "routes/matching-profiles.tsx")
    ]),

] satisfies RouteConfig;