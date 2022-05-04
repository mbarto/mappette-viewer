import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import copy from "rollup-plugin-copy"
import postcssNesting from "postcss-nesting"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                print: resolve(__dirname, "print.html"),
            },
        },
    },
    css: {
        postcss: {
            plugins: [postcssNesting()],
        },
    },
    plugins: [
        preact(),
        copy({
            targets: [
                {
                    src: "node_modules/cesium/Build/Cesium/*",
                    dest: "dist/node_modules/cesium/Build/Cesium",
                },
            ],
            hook: "writeBundle",
        }),
    ],
})
