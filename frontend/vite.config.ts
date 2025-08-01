import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import flowbiteReact from "flowbite-react/plugin/vite";
import devtoolsJson from 'vite-plugin-devtools-json';
import { reactRouterDevTools } from "react-router-devtools"

export default defineConfig({
  plugins: [tailwindcss(), devtoolsJson(), reactRouterDevTools(), reactRouter(), tsconfigPaths(), flowbiteReact()],
});