import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import copy from "rollup-plugin-copy"

// https://vitejs.dev/config/
export default defineConfig({
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
