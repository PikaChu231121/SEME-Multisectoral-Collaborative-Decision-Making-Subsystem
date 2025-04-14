// vite.config.ts
import { resolve } from "node:path";
import { loadEnv } from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/vite@5.4.10_@types+node@22.7.4_less@4.2.0/node_modules/vite/dist/node/index.js";
import vueJsx from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.1_vite@5.4.10_@types+node@22.7.4_less@4.2.0__vue@3.5.12_typescript@5.6.3_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import mkcert from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/vite-plugin-mkcert@1.17.6_vite@5.4.10_@types+node@22.7.4_less@4.2.0_/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import vue from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.10_@types+node@22.7.4_less@4.2.0__vue@3.5.12_typescript@5.6.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import checker from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/vite-plugin-checker@0.8.0_eslint@9.13.0_jiti@2.1.2__optionator@0.9.4_stylelint@16.10.0_typesc_jyj2itufgh7cwbfpvfkud3cihm/node_modules/vite-plugin-checker/dist/esm/main.js";
import Components from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.25.7_@nuxt+kit@3.13.2_rollup@4.24.0__rollup@4._c3vpni3bzoq3fyhxzqt3odfzma/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver, ElementPlusResolver } from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.25.7_@nuxt+kit@3.13.2_rollup@4.24.0__rollup@4._c3vpni3bzoq3fyhxzqt3odfzma/node_modules/unplugin-vue-components/dist/resolvers.js";
import Unocss from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/unocss@0.63.6_postcss@8.4.47_rollup@4.24.0_typescript@5.6.3_vite@5.4.10_@types+node@22.7.4_less@4.2.0_/node_modules/unocss/dist/vite.mjs";
import { createSvgIconsPlugin } from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.10_@types+node@22.7.4_less@4.2.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import dayjs from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/dayjs.min.js";
import mockServerPlugin from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/packages/vite-plugin-msw/dist/index.js";
import TinymceResourcePlugin from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/packages/vite-plugin-tinymce-resource/dist/index.js";
import Http2Proxy from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/packages/vite-plugin-http2-proxy/dist/index.js";
import Inspector from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/vite-plugin-vue-inspector@5.2.0_vite@5.4.10_@types+node@22.7.4_less@4.2.0_/node_modules/vite-plugin-vue-inspector/dist/index.mjs";
import AutoImport from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/unplugin-auto-import@0.18.4_@nuxt+kit@3.13.2_rollup@4.24.0__@vueuse+core@11.1.0_vue@3.5.12_ty_f6fwdpxlfg5oo6zwhqki5re4p4/node_modules/unplugin-auto-import/dist/vite.js";
import { PlusProComponentsResolver } from "file:///Users/liuhongbo/Downloads/SmartCommunity-Admin/node_modules/.pnpm/@plus-pro-components+resolver@0.0.3/node_modules/@plus-pro-components/resolver/dist/index.js";

// package.json
var package_default = {
  name: "community-admin",
  version: "0.1.0",
  packageManager: "pnpm@9.4.0",
  type: "module",
  engines: {
    node: ">=18",
    pnpm: ">=9.0.2"
  },
  scripts: {
    preinstall: "npx only-allow pnpm",
    postinstall: "pnpm nx:build",
    bootstrap: "pnpm install",
    serve: "npm run dev",
    dev: "vite dev",
    build: "rimraf dist && cross-env NODE_ENV=production vite build",
    "build:watch": "rimraf dist && cross-env NODE_ENV=production vite build --watch",
    "build:pkg": 'pnpm -r --paralle --filter="./packages/*" run build',
    "nx:build": "nx run-many -t build --exclude @admin-pkg/components",
    "nx:build:watch": "nx watch --all -- nx run \\$NX_PROJECT_NAME:build",
    preview: "npm run build --watch && vite preview",
    "preview:dist": "vite preview",
    openapi: "npx tsx openapi.config.ts",
    "clean:cache": "npx rimraf node_modules/.cache/ && npx rimraf node_modules/.vite",
    "clean:lib": "npx rimraf node_modules packages/*/node_modules",
    lint: "pnpm lint:eslint && pnpm lint:prettier && pnpm lint:stylelint",
    "lint:eslint": 'eslint --cache --max-warnings 0  "{src,mocks}/**/*.{vue,ts,tsx}" --fix',
    "lint:prettier": 'prettier --write  "src/**/*.{js,json,tsx,css,less,scss,vue,html,md}"',
    "lint:stylelint": 'stylelint --cache --fix "**/*.{vue,less,postcss,css,scss}" --cache --cache-location node_modules/.cache/stylelint/',
    "lint:lint-staged": "lint-staged",
    prepare: "husky",
    release: "git push && git push origin --tags",
    "gen:changelog": "conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md",
    reinstall: "rimraf pnpm-lock.yaml && rimraf package.lock.json && pnpm clean:lib && npm run bootstrap",
    "test:gzip": "npx http-server dist --cors --gzip -c-1",
    "test:br": "npx http-server dist --cors --brotli -c-1"
  },
  dependencies: {
    "@ant-design/icons-vue": "~7.0.1",
    "@ant-design/pro-components": "^2.8.2",
    "@iconify/vue": "^4.1.2",
    "@tinymce/tinymce-vue": "^6.1.0",
    "@vueuse/core": "~11.1.0",
    "ant-design-vue": "^4.2.6",
    axios: "~1.7.7",
    "crypto-js": "^4.2.0",
    dayjs: "~1.11.13",
    echarts: "^5.5.1",
    "element-plus": "^2.8.8",
    "file-saver": "~2.0.5",
    "lodash-es": "~4.17.21",
    mitt: "~3.0.1",
    nprogress: "~1.0.0-1",
    pinia: "~2.2.4",
    "pinia-plugin-persistedstate": "^4.1.1",
    "plus-pro-components": "^0.1.18",
    "qiniu-js": "^3.4.2",
    qs: "~6.13.0",
    sortablejs: "~1.15.3",
    tinymce: "^7.4.1",
    vue: "~3.5.12",
    "vue-echarts": "^7.0.3",
    "vue-i18n": "~10.0.4",
    "vue-router": "~4.4.5",
    "vue-types": "~5.1.3",
    "vue-virtual-scroller": "2.0.0-beta.8",
    xlsx: "~0.18.5"
  },
  devDependencies: {
    "@admin-pkg/components": "workspace:*",
    "@admin-pkg/vite-plugin-http2-proxy": "workspace:*",
    "@admin-pkg/vite-plugin-msw": "workspace:*",
    "@admin-pkg/vite-plugin-tinymce-resource": "workspace:*",
    "@commitlint/cli": "~19.5.0",
    "@commitlint/config-conventional": "~19.5.0",
    "@faker-js/faker": "^9.0.3",
    "@iconify-json/ant-design": "^1.2.1",
    "@iconify-json/ep": "^1.2.0",
    "@iconify/json": "^2.2.255",
    "@plus-pro-components/resolver": "^0.0.3",
    "@types/crypto-js": "^4.2.2",
    "@types/lodash-es": "~4.17.12",
    "@types/node": "~22.7.4",
    "@types/qs": "^6.9.16",
    "@types/sortablejs": "^1.15.8",
    "@typescript-eslint/eslint-plugin": "~8.11.0",
    "@typescript-eslint/parser": "~8.11.0",
    "@umijs/openapi": "^1.13.0",
    "@vitejs/plugin-vue": "~5.1.4",
    "@vitejs/plugin-vue-jsx": "~4.0.1",
    "@vue/tsconfig": "^0.5.1",
    commitizen: "~4.3.1",
    "conventional-changelog-cli": "~4.1.0",
    "core-js": "^3.38.1",
    "cross-env": "~7.0.3",
    eslint: "~9.13.0",
    "eslint-config-prettier": "~9.1.0",
    "eslint-define-config": "~2.1.0",
    "eslint-plugin-import": "~2.31.0",
    "eslint-plugin-prettier": "~5.2.1",
    "eslint-plugin-unused-imports": "^4.1.4",
    "eslint-plugin-vue": "~9.29.1",
    husky: "~9.1.6",
    less: "~4.2.0",
    "lint-staged": "~15.2.10",
    msw: "^2.4.9",
    nx: "^20.0.5",
    postcss: "~8.4.47",
    "postcss-html": "~1.7.0",
    "postcss-less": "~6.0.0",
    prettier: "~3.3.3",
    rimraf: "~5.0.9",
    stylelint: "~16.10.0",
    "stylelint-config-property-sort-order-smacss": "^10.0.0",
    "stylelint-config-recommended": "~14.0.1",
    "stylelint-config-recommended-vue": "~1.5.0",
    "stylelint-config-standard": "~36.0.1",
    "stylelint-order": "~6.0.4",
    "stylelint-prettier": "^5.0.2",
    typescript: "~5.6.3",
    unocss: "^0.63.6",
    "unplugin-auto-import": "^0.18.4",
    "unplugin-vue-components": "~0.27.4",
    vite: "~5.4.10",
    "vite-plugin-checker": "~0.8.0",
    "vite-plugin-inspect": "^0.8.7",
    "vite-plugin-mkcert": "^1.17.6",
    "vite-plugin-svg-icons": "~2.0.1",
    "vite-plugin-vue-inspector": "^5.2.0",
    "vue-eslint-parser": "~9.4.3",
    "vue-tsc": "~2.1.6"
  },
  license: "MIT",
  target: "web",
  pnpm: {
    overrides: {},
    peerDependencyRules: {
      allowedVersions: {}
    }
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "/Users/liuhongbo/Downloads/SmartCommunity-Admin";
var CWD = process.cwd();
var __APP_INFO__ = {
  pkg: package_default,
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};
var vite_config_default = ({ command, mode }) => {
  const { VITE_BASE_URL, VITE_DROP_CONSOLE, VITE_MOCK_IN_PROD } = loadEnv(mode, CWD);
  const isDev = command === "serve";
  const isBuild = command === "build";
  return {
    base: VITE_BASE_URL,
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__vite_injected_original_dirname, "./src")
        }
      ]
    },
    plugins: [
      vue(),
      Inspector(),
      Unocss(),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      // 指定 mkcert 的下载源为 coding，从 coding.net 镜像下载证书
      mkcert({ source: "coding" }),
      // 开启 http2 代理
      Http2Proxy(),
      mockServerPlugin({ build: isBuild && VITE_MOCK_IN_PROD === "true" }),
      TinymceResourcePlugin({ baseUrl: "/tinymce-resource/" }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(CWD, "src/assets/icons")],
        // Specify symbolId format
        symbolId: "svg-icon-[dir]-[name]"
      }),
      Components({
        dts: "types/components.d.ts",
        types: [
          {
            from: "./src/components/basic/button/",
            names: ["AButton"]
          },
          {
            from: "vue-router",
            names: ["RouterLink", "RouterView"]
          }
        ],
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
            // css in js
            exclude: ["Button"]
          })
        ]
      }),
      // https://github.com/fi3ework/vite-plugin-checker
      isDev && checker({
        typescript: true,
        // vueTsc: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{.vue,ts,tsx}"'
          // for example, lint .ts & .tsx
        },
        overlay: {
          initialIsOpen: false
        }
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver(), PlusProComponentsResolver()]
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {}
          // additionalData: `
          //   @import '@/styles/variables.less';
          // `,
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: 8088,
      open: true,
      proxy: {
        "^/api": {
          target: "http://localhost:80",
          // target: 'http://127.0.0.1:7001',
          changeOrigin: true
        },
        "^/upload": {
          target: "https://nest-api.buqiyuan.site/upload",
          // target: 'http://127.0.0.1:7001/upload',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), "")
        }
      },
      // 提前转换和缓存文件以进行预热。可以在服务器启动时提高初始页面加载速度，并防止转换瀑布。
      warmup: {
        // 请注意，只应该预热频繁使用的文件，以免在启动时过载 Vite 开发服务器
        // 可以通过运行 npx vite --debug transform 并检查日志来找到频繁使用的文件
        clientFiles: ["./index.html", "./src/{components,api}/*"]
      }
    },
    optimizeDeps: {
      include: ["lodash-es", "ant-design-vue/es/locale/zh_CN", "ant-design-vue/es/locale/en_US"]
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE === "true" ? ["console.log", "debugger"] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        "top-level-await": true
      }
    },
    build: {
      minify: "esbuild",
      cssTarget: "chrome89",
      chunkSizeWarningLimit: 2e3,
      rollupOptions: {
        output: {
          // minifyInternalExports: false,
        },
        onwarn(warning, rollupWarn) {
          if (warning.code === "CYCLIC_CROSS_CHUNK_REEXPORT" && warning.exporter?.includes("src/api/")) {
            return;
          }
          rollupWarn(warning);
        }
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2xpdWhvbmdiby9Eb3dubG9hZHMvU21hcnRDb21tdW5pdHktQWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9saXVob25nYm8vRG93bmxvYWRzL1NtYXJ0Q29tbXVuaXR5LUFkbWluL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9saXVob25nYm8vRG93bmxvYWRzL1NtYXJ0Q29tbXVuaXR5LUFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnO1xuaW1wb3J0IG1rY2VydCBmcm9tICd2aXRlLXBsdWdpbi1ta2NlcnQnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcbmltcG9ydCB7IEFudERlc2lnblZ1ZVJlc29sdmVyLCBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcbmltcG9ydCBVbm9jc3MgZnJvbSAndW5vY3NzL3ZpdGUnO1xuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnO1xuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJztcbmltcG9ydCBtb2NrU2VydmVyUGx1Z2luIGZyb20gJ0BhZG1pbi1wa2cvdml0ZS1wbHVnaW4tbXN3L3ZpdGUnO1xuaW1wb3J0IFRpbnltY2VSZXNvdXJjZVBsdWdpbiBmcm9tICdAYWRtaW4tcGtnL3ZpdGUtcGx1Z2luLXRpbnltY2UtcmVzb3VyY2UnO1xuaW1wb3J0IEh0dHAyUHJveHkgZnJvbSAnQGFkbWluLXBrZy92aXRlLXBsdWdpbi1odHRwMi1wcm94eSc7XG5pbXBvcnQgSW5zcGVjdG9yIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1pbnNwZWN0b3InO1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSc7XG5pbXBvcnQgeyBQbHVzUHJvQ29tcG9uZW50c1Jlc29sdmVyIH0gZnJvbSAnQHBsdXMtcHJvLWNvbXBvbmVudHMvcmVzb2x2ZXInO1xuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgdHlwZSB7IFVzZXJDb25maWcsIENvbmZpZ0VudiB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCBDV0QgPSBwcm9jZXNzLmN3ZCgpO1xuXG4vLyBcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0Zcbi8vIGNvbnN0IEJBU0VfRU5WX0NPTkZJRyA9IGxvYWRFbnYoJycsIENXRCk7XG4vLyBjb25zdCBERVZfRU5WX0NPTkZJRyA9IGxvYWRFbnYoJ2RldmVsb3BtZW50JywgQ1dEKTtcbi8vIGNvbnN0IFBST0RfRU5WX0NPTkZJRyA9IGxvYWRFbnYoJ3Byb2R1Y3Rpb24nLCBDV0QpO1xuXG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XG4gIHBrZyxcbiAgbGFzdEJ1aWxkVGltZTogZGF5anMoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSxcbn07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCAoeyBjb21tYW5kLCBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuICAvLyBcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgY29uc3QgeyBWSVRFX0JBU0VfVVJMLCBWSVRFX0RST1BfQ09OU09MRSwgVklURV9NT0NLX0lOX1BST0QgfSA9IGxvYWRFbnYobW9kZSwgQ1dEKTtcblxuICBjb25zdCBpc0RldiA9IGNvbW1hbmQgPT09ICdzZXJ2ZSc7XG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnO1xuXG4gIHJldHVybiB7XG4gICAgYmFzZTogVklURV9CQVNFX1VSTCxcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fQVBQX0lORk9fXzogSlNPTi5zdHJpbmdpZnkoX19BUFBfSU5GT19fKSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAnQCcsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICAgIEluc3BlY3RvcigpLFxuICAgICAgVW5vY3NzKCksXG4gICAgICB2dWVKc3goe1xuICAgICAgICAvLyBvcHRpb25zIGFyZSBwYXNzZWQgb24gdG8gQHZ1ZS9iYWJlbC1wbHVnaW4tanN4XG4gICAgICB9KSxcbiAgICAgIC8vIFx1NjMwN1x1NUI5QSBta2NlcnQgXHU3Njg0XHU0RTBCXHU4RjdEXHU2RTkwXHU0RTNBIGNvZGluZ1x1RkYwQ1x1NEVDRSBjb2RpbmcubmV0IFx1OTU1Q1x1NTBDRlx1NEUwQlx1OEY3RFx1OEJDMVx1NEU2NlxuICAgICAgbWtjZXJ0KHsgc291cmNlOiAnY29kaW5nJyB9KSxcbiAgICAgIC8vIFx1NUYwMFx1NTQyRiBodHRwMiBcdTRFRTNcdTc0MDZcbiAgICAgIEh0dHAyUHJveHkoKSxcbiAgICAgIG1vY2tTZXJ2ZXJQbHVnaW4oeyBidWlsZDogaXNCdWlsZCAmJiBWSVRFX01PQ0tfSU5fUFJPRCA9PT0gJ3RydWUnIH0pLFxuICAgICAgVGlueW1jZVJlc291cmNlUGx1Z2luKHsgYmFzZVVybDogJy90aW55bWNlLXJlc291cmNlLycgfSksXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIC8vIFNwZWNpZnkgdGhlIGljb24gZm9sZGVyIHRvIGJlIGNhY2hlZFxuICAgICAgICBpY29uRGlyczogW3Jlc29sdmUoQ1dELCAnc3JjL2Fzc2V0cy9pY29ucycpXSxcbiAgICAgICAgLy8gU3BlY2lmeSBzeW1ib2xJZCBmb3JtYXRcbiAgICAgICAgc3ltYm9sSWQ6ICdzdmctaWNvbi1bZGlyXS1bbmFtZV0nLFxuICAgICAgfSksXG4gICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgZHRzOiAndHlwZXMvY29tcG9uZW50cy5kLnRzJyxcbiAgICAgICAgdHlwZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmcm9tOiAnLi9zcmMvY29tcG9uZW50cy9iYXNpYy9idXR0b24vJyxcbiAgICAgICAgICAgIG5hbWVzOiBbJ0FCdXR0b24nXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZyb206ICd2dWUtcm91dGVyJyxcbiAgICAgICAgICAgIG5hbWVzOiBbJ1JvdXRlckxpbmsnLCAnUm91dGVyVmlldyddLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAgIEFudERlc2lnblZ1ZVJlc29sdmVyKHtcbiAgICAgICAgICAgIGltcG9ydFN0eWxlOiBmYWxzZSwgLy8gY3NzIGluIGpzXG4gICAgICAgICAgICBleGNsdWRlOiBbJ0J1dHRvbiddLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmkzZXdvcmsvdml0ZS1wbHVnaW4tY2hlY2tlclxuICAgICAgaXNEZXYgJiZcbiAgICAgICAgY2hlY2tlcih7XG4gICAgICAgICAgdHlwZXNjcmlwdDogdHJ1ZSxcbiAgICAgICAgICAvLyB2dWVUc2M6IHRydWUsXG4gICAgICAgICAgZXNsaW50OiB7XG4gICAgICAgICAgICB1c2VGbGF0Q29uZmlnOiB0cnVlLFxuICAgICAgICAgICAgbGludENvbW1hbmQ6ICdlc2xpbnQgXCIuL3NyYy8qKi8qLnsudnVlLHRzLHRzeH1cIicsIC8vIGZvciBleGFtcGxlLCBsaW50IC50cyAmIC50c3hcbiAgICAgICAgICB9LFxuICAgICAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgICAgIGluaXRpYWxJc09wZW46IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgICB9KSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCksIFBsdXNQcm9Db21wb25lbnRzUmVzb2x2ZXIoKV0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgbW9kaWZ5VmFyczoge30sXG4gICAgICAgICAgLy8gYWRkaXRpb25hbERhdGE6IGBcbiAgICAgICAgICAvLyAgIEBpbXBvcnQgJ0Avc3R5bGVzL3ZhcmlhYmxlcy5sZXNzJztcbiAgICAgICAgICAvLyBgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJzAuMC4wLjAnLFxuICAgICAgcG9ydDogODA4OCxcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICBwcm94eToge1xuICAgICAgICAnXi9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MCcsXG4gICAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTo3MDAxJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgICdeL3VwbG9hZCc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL25lc3QtYXBpLmJ1cWl5dWFuLnNpdGUvdXBsb2FkJyxcbiAgICAgICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjcwMDEvdXBsb2FkJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeL3VwbG9hZGApLCAnJyksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gXHU2M0QwXHU1MjREXHU4RjZDXHU2MzYyXHU1NDhDXHU3RjEzXHU1QjU4XHU2NTg3XHU0RUY2XHU0RUU1XHU4RkRCXHU4ODRDXHU5ODg0XHU3MEVEXHUzMDAyXHU1M0VGXHU0RUU1XHU1NzI4XHU2NzBEXHU1MkExXHU1NjY4XHU1NDJGXHU1MkE4XHU2NUY2XHU2M0QwXHU5QUQ4XHU1MjFEXHU1OUNCXHU5ODc1XHU5NzYyXHU1MkEwXHU4RjdEXHU5MDFGXHU1RUE2XHVGRjBDXHU1RTc2XHU5NjMyXHU2QjYyXHU4RjZDXHU2MzYyXHU3MDExXHU1RTAzXHUzMDAyXG4gICAgICB3YXJtdXA6IHtcbiAgICAgICAgLy8gXHU4QkY3XHU2Q0U4XHU2MTBGXHVGRjBDXHU1M0VBXHU1RTk0XHU4QkU1XHU5ODg0XHU3MEVEXHU5ODkxXHU3RTQxXHU0RjdGXHU3NTI4XHU3Njg0XHU2NTg3XHU0RUY2XHVGRjBDXHU0RUU1XHU1MTREXHU1NzI4XHU1NDJGXHU1MkE4XHU2NUY2XHU4RkM3XHU4RjdEIFZpdGUgXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XG4gICAgICAgIC8vIFx1NTNFRlx1NEVFNVx1OTAxQVx1OEZDN1x1OEZEMFx1ODg0QyBucHggdml0ZSAtLWRlYnVnIHRyYW5zZm9ybSBcdTVFNzZcdTY4QzBcdTY3RTVcdTY1RTVcdTVGRDdcdTY3NjVcdTYyN0VcdTUyMzBcdTk4OTFcdTdFNDFcdTRGN0ZcdTc1MjhcdTc2ODRcdTY1ODdcdTRFRjZcbiAgICAgICAgY2xpZW50RmlsZXM6IFsnLi9pbmRleC5odG1sJywgJy4vc3JjL3tjb21wb25lbnRzLGFwaX0vKiddLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogWydsb2Rhc2gtZXMnLCAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJywgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS9lbl9VUyddLFxuICAgIH0sXG4gICAgZXNidWlsZDoge1xuICAgICAgcHVyZTogVklURV9EUk9QX0NPTlNPTEUgPT09ICd0cnVlJyA/IFsnY29uc29sZS5sb2cnLCAnZGVidWdnZXInXSA6IFtdLFxuICAgICAgc3VwcG9ydGVkOiB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS9wdWxsLzg2NjVcbiAgICAgICAgJ3RvcC1sZXZlbC1hd2FpdCc6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIG1pbmlmeTogJ2VzYnVpbGQnLFxuICAgICAgY3NzVGFyZ2V0OiAnY2hyb21lODknLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAvLyBtaW5pZnlJbnRlcm5hbEV4cG9ydHM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBvbndhcm4od2FybmluZywgcm9sbHVwV2Fybikge1xuICAgICAgICAgIC8vIGlnbm9yZSBjaXJjdWxhciBkZXBlbmRlbmN5IHdhcm5pbmdcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB3YXJuaW5nLmNvZGUgPT09ICdDWUNMSUNfQ1JPU1NfQ0hVTktfUkVFWFBPUlQnICYmXG4gICAgICAgICAgICB3YXJuaW5nLmV4cG9ydGVyPy5pbmNsdWRlcygnc3JjL2FwaS8nKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICByb2xsdXBXYXJuKHdhcm5pbmcpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufTtcbiIsICJ7XG4gIFwibmFtZVwiOiBcImNvbW11bml0eS1hZG1pblwiLFxuICBcInZlcnNpb25cIjogXCIwLjEuMFwiLFxuICBcInBhY2thZ2VNYW5hZ2VyXCI6IFwicG5wbUA5LjQuMFwiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCI+PTE4XCIsXG4gICAgXCJwbnBtXCI6IFwiPj05LjAuMlwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJwcmVpbnN0YWxsXCI6IFwibnB4IG9ubHktYWxsb3cgcG5wbVwiLFxuICAgIFwicG9zdGluc3RhbGxcIjogXCJwbnBtIG54OmJ1aWxkXCIsXG4gICAgXCJib290c3RyYXBcIjogXCJwbnBtIGluc3RhbGxcIixcbiAgICBcInNlcnZlXCI6IFwibnBtIHJ1biBkZXZcIixcbiAgICBcImRldlwiOiBcInZpdGUgZGV2XCIsXG4gICAgXCJidWlsZFwiOiBcInJpbXJhZiBkaXN0ICYmIGNyb3NzLWVudiBOT0RFX0VOVj1wcm9kdWN0aW9uIHZpdGUgYnVpbGRcIixcbiAgICBcImJ1aWxkOndhdGNoXCI6IFwicmltcmFmIGRpc3QgJiYgY3Jvc3MtZW52IE5PREVfRU5WPXByb2R1Y3Rpb24gdml0ZSBidWlsZCAtLXdhdGNoXCIsXG4gICAgXCJidWlsZDpwa2dcIjogXCJwbnBtIC1yIC0tcGFyYWxsZSAtLWZpbHRlcj1cXFwiLi9wYWNrYWdlcy8qXFxcIiBydW4gYnVpbGRcIixcbiAgICBcIm54OmJ1aWxkXCI6IFwibnggcnVuLW1hbnkgLXQgYnVpbGQgLS1leGNsdWRlIEBhZG1pbi1wa2cvY29tcG9uZW50c1wiLFxuICAgIFwibng6YnVpbGQ6d2F0Y2hcIjogXCJueCB3YXRjaCAtLWFsbCAtLSBueCBydW4gXFxcXCROWF9QUk9KRUNUX05BTUU6YnVpbGRcIixcbiAgICBcInByZXZpZXdcIjogXCJucG0gcnVuIGJ1aWxkIC0td2F0Y2ggJiYgdml0ZSBwcmV2aWV3XCIsXG4gICAgXCJwcmV2aWV3OmRpc3RcIjogXCJ2aXRlIHByZXZpZXdcIixcbiAgICBcIm9wZW5hcGlcIjogXCJucHggdHN4IG9wZW5hcGkuY29uZmlnLnRzXCIsXG4gICAgXCJjbGVhbjpjYWNoZVwiOiBcIm5weCByaW1yYWYgbm9kZV9tb2R1bGVzLy5jYWNoZS8gJiYgbnB4IHJpbXJhZiBub2RlX21vZHVsZXMvLnZpdGVcIixcbiAgICBcImNsZWFuOmxpYlwiOiBcIm5weCByaW1yYWYgbm9kZV9tb2R1bGVzIHBhY2thZ2VzLyovbm9kZV9tb2R1bGVzXCIsXG4gICAgXCJsaW50XCI6IFwicG5wbSBsaW50OmVzbGludCAmJiBwbnBtIGxpbnQ6cHJldHRpZXIgJiYgcG5wbSBsaW50OnN0eWxlbGludFwiLFxuICAgIFwibGludDplc2xpbnRcIjogXCJlc2xpbnQgLS1jYWNoZSAtLW1heC13YXJuaW5ncyAwICBcXFwie3NyYyxtb2Nrc30vKiovKi57dnVlLHRzLHRzeH1cXFwiIC0tZml4XCIsXG4gICAgXCJsaW50OnByZXR0aWVyXCI6IFwicHJldHRpZXIgLS13cml0ZSAgXFxcInNyYy8qKi8qLntqcyxqc29uLHRzeCxjc3MsbGVzcyxzY3NzLHZ1ZSxodG1sLG1kfVxcXCJcIixcbiAgICBcImxpbnQ6c3R5bGVsaW50XCI6IFwic3R5bGVsaW50IC0tY2FjaGUgLS1maXggXFxcIioqLyoue3Z1ZSxsZXNzLHBvc3Rjc3MsY3NzLHNjc3N9XFxcIiAtLWNhY2hlIC0tY2FjaGUtbG9jYXRpb24gbm9kZV9tb2R1bGVzLy5jYWNoZS9zdHlsZWxpbnQvXCIsXG4gICAgXCJsaW50OmxpbnQtc3RhZ2VkXCI6IFwibGludC1zdGFnZWRcIixcbiAgICBcInByZXBhcmVcIjogXCJodXNreVwiLFxuICAgIFwicmVsZWFzZVwiOiBcImdpdCBwdXNoICYmIGdpdCBwdXNoIG9yaWdpbiAtLXRhZ3NcIixcbiAgICBcImdlbjpjaGFuZ2Vsb2dcIjogXCJjb252ZW50aW9uYWwtY2hhbmdlbG9nIC1wIGFuZ3VsYXIgLWkgQ0hBTkdFTE9HLm1kIC1zICYmIGdpdCBhZGQgQ0hBTkdFTE9HLm1kXCIsXG4gICAgXCJyZWluc3RhbGxcIjogXCJyaW1yYWYgcG5wbS1sb2NrLnlhbWwgJiYgcmltcmFmIHBhY2thZ2UubG9jay5qc29uICYmIHBucG0gY2xlYW46bGliICYmIG5wbSBydW4gYm9vdHN0cmFwXCIsXG4gICAgXCJ0ZXN0Omd6aXBcIjogXCJucHggaHR0cC1zZXJ2ZXIgZGlzdCAtLWNvcnMgLS1nemlwIC1jLTFcIixcbiAgICBcInRlc3Q6YnJcIjogXCJucHggaHR0cC1zZXJ2ZXIgZGlzdCAtLWNvcnMgLS1icm90bGkgLWMtMVwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBhbnQtZGVzaWduL2ljb25zLXZ1ZVwiOiBcIn43LjAuMVwiLFxuICAgIFwiQGFudC1kZXNpZ24vcHJvLWNvbXBvbmVudHNcIjogXCJeMi44LjJcIixcbiAgICBcIkBpY29uaWZ5L3Z1ZVwiOiBcIl40LjEuMlwiLFxuICAgIFwiQHRpbnltY2UvdGlueW1jZS12dWVcIjogXCJeNi4xLjBcIixcbiAgICBcIkB2dWV1c2UvY29yZVwiOiBcIn4xMS4xLjBcIixcbiAgICBcImFudC1kZXNpZ24tdnVlXCI6IFwiXjQuMi42XCIsXG4gICAgXCJheGlvc1wiOiBcIn4xLjcuN1wiLFxuICAgIFwiY3J5cHRvLWpzXCI6IFwiXjQuMi4wXCIsXG4gICAgXCJkYXlqc1wiOiBcIn4xLjExLjEzXCIsXG4gICAgXCJlY2hhcnRzXCI6IFwiXjUuNS4xXCIsXG4gICAgXCJlbGVtZW50LXBsdXNcIjogXCJeMi44LjhcIixcbiAgICBcImZpbGUtc2F2ZXJcIjogXCJ+Mi4wLjVcIixcbiAgICBcImxvZGFzaC1lc1wiOiBcIn40LjE3LjIxXCIsXG4gICAgXCJtaXR0XCI6IFwifjMuMC4xXCIsXG4gICAgXCJucHJvZ3Jlc3NcIjogXCJ+MS4wLjAtMVwiLFxuICAgIFwicGluaWFcIjogXCJ+Mi4yLjRcIixcbiAgICBcInBpbmlhLXBsdWdpbi1wZXJzaXN0ZWRzdGF0ZVwiOiBcIl40LjEuMVwiLFxuICAgIFwicGx1cy1wcm8tY29tcG9uZW50c1wiOiBcIl4wLjEuMThcIixcbiAgICBcInFpbml1LWpzXCI6IFwiXjMuNC4yXCIsXG4gICAgXCJxc1wiOiBcIn42LjEzLjBcIixcbiAgICBcInNvcnRhYmxlanNcIjogXCJ+MS4xNS4zXCIsXG4gICAgXCJ0aW55bWNlXCI6IFwiXjcuNC4xXCIsXG4gICAgXCJ2dWVcIjogXCJ+My41LjEyXCIsXG4gICAgXCJ2dWUtZWNoYXJ0c1wiOiBcIl43LjAuM1wiLFxuICAgIFwidnVlLWkxOG5cIjogXCJ+MTAuMC40XCIsXG4gICAgXCJ2dWUtcm91dGVyXCI6IFwifjQuNC41XCIsXG4gICAgXCJ2dWUtdHlwZXNcIjogXCJ+NS4xLjNcIixcbiAgICBcInZ1ZS12aXJ0dWFsLXNjcm9sbGVyXCI6IFwiMi4wLjAtYmV0YS44XCIsXG4gICAgXCJ4bHN4XCI6IFwifjAuMTguNVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBhZG1pbi1wa2cvY29tcG9uZW50c1wiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAYWRtaW4tcGtnL3ZpdGUtcGx1Z2luLWh0dHAyLXByb3h5XCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkBhZG1pbi1wa2cvdml0ZS1wbHVnaW4tbXN3XCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkBhZG1pbi1wa2cvdml0ZS1wbHVnaW4tdGlueW1jZS1yZXNvdXJjZVwiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAY29tbWl0bGludC9jbGlcIjogXCJ+MTkuNS4wXCIsXG4gICAgXCJAY29tbWl0bGludC9jb25maWctY29udmVudGlvbmFsXCI6IFwifjE5LjUuMFwiLFxuICAgIFwiQGZha2VyLWpzL2Zha2VyXCI6IFwiXjkuMC4zXCIsXG4gICAgXCJAaWNvbmlmeS1qc29uL2FudC1kZXNpZ25cIjogXCJeMS4yLjFcIixcbiAgICBcIkBpY29uaWZ5LWpzb24vZXBcIjogXCJeMS4yLjBcIixcbiAgICBcIkBpY29uaWZ5L2pzb25cIjogXCJeMi4yLjI1NVwiLFxuICAgIFwiQHBsdXMtcHJvLWNvbXBvbmVudHMvcmVzb2x2ZXJcIjogXCJeMC4wLjNcIixcbiAgICBcIkB0eXBlcy9jcnlwdG8tanNcIjogXCJeNC4yLjJcIixcbiAgICBcIkB0eXBlcy9sb2Rhc2gtZXNcIjogXCJ+NC4xNy4xMlwiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJ+MjIuNy40XCIsXG4gICAgXCJAdHlwZXMvcXNcIjogXCJeNi45LjE2XCIsXG4gICAgXCJAdHlwZXMvc29ydGFibGVqc1wiOiBcIl4xLjE1LjhcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwifjguMTEuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIn44LjExLjBcIixcbiAgICBcIkB1bWlqcy9vcGVuYXBpXCI6IFwiXjEuMTMuMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwifjUuMS40XCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI6IFwifjQuMC4xXCIsXG4gICAgXCJAdnVlL3RzY29uZmlnXCI6IFwiXjAuNS4xXCIsXG4gICAgXCJjb21taXRpemVuXCI6IFwifjQuMy4xXCIsXG4gICAgXCJjb252ZW50aW9uYWwtY2hhbmdlbG9nLWNsaVwiOiBcIn40LjEuMFwiLFxuICAgIFwiY29yZS1qc1wiOiBcIl4zLjM4LjFcIixcbiAgICBcImNyb3NzLWVudlwiOiBcIn43LjAuM1wiLFxuICAgIFwiZXNsaW50XCI6IFwifjkuMTMuMFwiLFxuICAgIFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIn45LjEuMFwiLFxuICAgIFwiZXNsaW50LWRlZmluZS1jb25maWdcIjogXCJ+Mi4xLjBcIixcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwifjIuMzEuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1wcmV0dGllclwiOiBcIn41LjIuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi11bnVzZWQtaW1wb3J0c1wiOiBcIl40LjEuNFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi12dWVcIjogXCJ+OS4yOS4xXCIsXG4gICAgXCJodXNreVwiOiBcIn45LjEuNlwiLFxuICAgIFwibGVzc1wiOiBcIn40LjIuMFwiLFxuICAgIFwibGludC1zdGFnZWRcIjogXCJ+MTUuMi4xMFwiLFxuICAgIFwibXN3XCI6IFwiXjIuNC45XCIsXG4gICAgXCJueFwiOiBcIl4yMC4wLjVcIixcbiAgICBcInBvc3Rjc3NcIjogXCJ+OC40LjQ3XCIsXG4gICAgXCJwb3N0Y3NzLWh0bWxcIjogXCJ+MS43LjBcIixcbiAgICBcInBvc3Rjc3MtbGVzc1wiOiBcIn42LjAuMFwiLFxuICAgIFwicHJldHRpZXJcIjogXCJ+My4zLjNcIixcbiAgICBcInJpbXJhZlwiOiBcIn41LjAuOVwiLFxuICAgIFwic3R5bGVsaW50XCI6IFwifjE2LjEwLjBcIixcbiAgICBcInN0eWxlbGludC1jb25maWctcHJvcGVydHktc29ydC1vcmRlci1zbWFjc3NcIjogXCJeMTAuMC4wXCIsXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXJlY29tbWVuZGVkXCI6IFwifjE0LjAuMVwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC12dWVcIjogXCJ+MS41LjBcIixcbiAgICBcInN0eWxlbGludC1jb25maWctc3RhbmRhcmRcIjogXCJ+MzYuMC4xXCIsXG4gICAgXCJzdHlsZWxpbnQtb3JkZXJcIjogXCJ+Ni4wLjRcIixcbiAgICBcInN0eWxlbGludC1wcmV0dGllclwiOiBcIl41LjAuMlwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIn41LjYuM1wiLFxuICAgIFwidW5vY3NzXCI6IFwiXjAuNjMuNlwiLFxuICAgIFwidW5wbHVnaW4tYXV0by1pbXBvcnRcIjogXCJeMC4xOC40XCIsXG4gICAgXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50c1wiOiBcIn4wLjI3LjRcIixcbiAgICBcInZpdGVcIjogXCJ+NS40LjEwXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1jaGVja2VyXCI6IFwifjAuOC4wXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1pbnNwZWN0XCI6IFwiXjAuOC43XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1ta2NlcnRcIjogXCJeMS4xNy42XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjogXCJ+Mi4wLjFcIixcbiAgICBcInZpdGUtcGx1Z2luLXZ1ZS1pbnNwZWN0b3JcIjogXCJeNS4yLjBcIixcbiAgICBcInZ1ZS1lc2xpbnQtcGFyc2VyXCI6IFwifjkuNC4zXCIsXG4gICAgXCJ2dWUtdHNjXCI6IFwifjIuMS42XCJcbiAgfSxcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwidGFyZ2V0XCI6IFwid2ViXCIsXG4gIFwicG5wbVwiOiB7XG4gICAgXCJvdmVycmlkZXNcIjoge30sXG4gICAgXCJwZWVyRGVwZW5kZW5jeVJ1bGVzXCI6IHtcbiAgICAgIFwiYWxsb3dlZFZlcnNpb25zXCI6IHt9XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStULFNBQVMsZUFBZTtBQUN2VixTQUFTLGVBQWU7QUFDeEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sWUFBWTtBQUNuQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsc0JBQXNCLDJCQUEyQjtBQUMxRCxPQUFPLFlBQVk7QUFDbkIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sc0JBQXNCO0FBQzdCLE9BQU8sMkJBQTJCO0FBQ2xDLE9BQU8sZ0JBQWdCO0FBQ3ZC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UUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNuQyxDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLEdBQUcsMEJBQTBCLENBQUM7QUFBQSxNQUNoRSxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osbUJBQW1CO0FBQUEsVUFDbkIsWUFBWSxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJZjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsVUFDUCxRQUFRO0FBQUE7QUFBQSxVQUVSLGNBQWM7QUFBQSxRQUNoQjtBQUFBLFFBQ0EsWUFBWTtBQUFBLFVBQ1YsUUFBUTtBQUFBO0FBQUEsVUFFUixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsSUFBSSxPQUFPLFVBQVUsR0FBRyxFQUFFO0FBQUEsUUFDNUQ7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLFFBQVE7QUFBQTtBQUFBO0FBQUEsUUFHTixhQUFhLENBQUMsZ0JBQWdCLDBCQUEwQjtBQUFBLE1BQzFEO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLGFBQWEsa0NBQWtDLGdDQUFnQztBQUFBLElBQzNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNLHNCQUFzQixTQUFTLENBQUMsZUFBZSxVQUFVLElBQUksQ0FBQztBQUFBLE1BQ3BFLFdBQVc7QUFBQTtBQUFBLFFBRVQsbUJBQW1CO0FBQUEsTUFDckI7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCx1QkFBdUI7QUFBQSxNQUN2QixlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUE7QUFBQSxRQUVSO0FBQUEsUUFDQSxPQUFPLFNBQVMsWUFBWTtBQUUxQixjQUNFLFFBQVEsU0FBUyxpQ0FDakIsUUFBUSxVQUFVLFNBQVMsVUFBVSxHQUNyQztBQUNBO0FBQUEsVUFDRjtBQUNBLHFCQUFXLE9BQU87QUFBQSxRQUNwQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
