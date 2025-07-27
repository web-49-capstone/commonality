import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
    route("create-profile", "routes/create-profile.tsx"),
    route("apis/post-user-interests", "routes/interest-component-route.tsx"),
    route("apis/delete-user-interests", "routes/delete-interest-route.tsx"),

    layout("layouts/navigation.tsx", [
        index("routes/home.tsx"),
        route("connect", "routes/matching-profiles.tsx"),
        route("profile", "routes/my-profile.tsx"),
        route("user", "routes/user-profile-page.tsx"),
        // route("messages", "routes/view-connections-messages.tsx"),
        layout("layouts/messaging.tsx", [
            route("chat/:partnerId?", "routes/main-chat.tsx"),
        ]),
        // route("chat", "routes/messaging.tsx")
    ]),

] satisfies RouteConfig;