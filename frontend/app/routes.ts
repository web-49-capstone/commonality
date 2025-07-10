import {type RouteConfig, route, index} from "@react-router/dev/routes";

// export default [
//   index("routes/home.tsx"),
//   route("/create-profile", "routes/create-profile.tsx" ,
//   route("/login-signup",  "routes/login-signup.tsx" ),
//   route("/matching-begin",  "routes/matching-begin.tsx" ),
//   // route("/matching-profiles",  "routes/matching-profiles.tsx" ),
//   // route("/messages",  "routes/messages.tsx" ),
//   // route("/my-profile", "routes/my-profile.tsx" ),
//   // route("/user-profile-page",  "routes/user-profile-page.tsx" )
// ] satisfies RouteConfig;
export default [
    index("routes/home.tsx"),
    route("/login-signup","routes/login-signup.tsx"),
    route("/my-profile","routes/my-profile.tsx"),
] satisfies RouteConfig;