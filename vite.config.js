import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
    plugins: [glsl(), tailwindcss()],
});