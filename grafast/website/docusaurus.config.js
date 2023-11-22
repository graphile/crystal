// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const TerserPlugin = require("terser-webpack-plugin");
const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

const organizationName = "graphile";
const projectName = "crystal";
const mainBranch = "main";

const editUrl = `https://github.com/${organizationName}/${projectName}/tree/${mainBranch}/grafast/website/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Grafast",
  tagline: "Advanced planning and execution engine for GraphQL",
  url: "https://grafast.org",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName, // Usually your GitHub org/user name.
  projectName, // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          id: "default",
          path: "grafast",
          routeBasePath: "grafast",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl,
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
        },
        pages: {
          remarkPlugins: [
            require("@docusaurus/remark-plugin-npm2yarn"),
            { sync: true },
          ],
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "grafserv",
        path: "grafserv",
        routeBasePath: "grafserv",
        sidebarPath: require.resolve("./sidebars.js"),
        editUrl,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "ruru",
        path: "ruru",
        routeBasePath: "ruru",
        sidebarPath: require.resolve("./sidebars.js"),
        editUrl,
      },
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        /**
         * Required for any multi-instance plugin
         */
        id: "news",
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: "news",
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: "./news",
      },
    ],

    () => ({
      name: "webpack-customization-plugin",
      configureWebpack() {
        return {
          mergeStrategy: { "optimization.minimizer": "replace" },

          // Allow us to import `.mermaid` files
          module: {
            rules: [
              // This rule enables Ruru to work even though it's a type:module
              {
                test: /\.m?js/,
                resolve: {
                  fullySpecified: false,
                },
              },

              // This rule is for ?raw assets
              {
                resourceQuery: /raw/,
                type: "asset/source",
              },
            ],
          },

          // These are optional in Grafast, don't polyfill them
          resolve: {
            fallback: {
              crypto: false,
              util: false,
            },
          },

          // Don't minify class names
          optimization: {
            minimizer: [
              new TerserPlugin({
                terserOptions: {
                  keep_classnames: true,
                },
              }),
            ],
          },
        };
      },
    }),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: "announcementBar-2",
        content:
          '<a href="/caveats">Read the pre-release caveats!</a> Documentation is not complete; PRs welcome ♥',
        //backgroundColor: "#fafbfc",
        //textColor: "#091E42",
        isCloseable: false,
      },
      navbar: {
        title: "Home",
        logo: {
          alt: "Grafast Logo",
          src: "img/grafast-exclamation.svg",
        },
        items: [
          {
            type: "doc",
            docId: "index",
            docsPluginId: "default",
            position: "left",
            html: "Gra<em>fast</em>",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId: "grafserv",
            position: "left",
            html: "Grafserv",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId: "ruru",
            position: "left",
            label: "Ruru",
          },
          {
            href: "/playground",
            label: "Playground",
            position: "left",
          },
          {
            to: "news",
            label: "News",
            position: "right",
          },
          {
            href: "https://github.com/grafast/wg",
            label: "Working Group",
            position: "right",
          },
          {
            href: `https://github.com/graphile/crystal/tree/main/grafast/grafast/`,
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                html: '<a class="footer__link-item" href="/grafast">Gra<em>fast</em></a>',
              },
              {
                label: "Grafserv",
                to: "/grafserv/",
              },
              {
                label: "Ruru",
                to: "/ruru/",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/graphile",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/GraphileHQ",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: `https://github.com/${organizationName}/${projectName}`,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Graphile Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["http"],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "G81R3UYS9Q",

        // Public API key: it is safe to commit it
        apiKey: "9fd53308d86655a5995d171b5414d88a",
        indexName: "grafast",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",

        //... other Algolia params
      },
    }),
  trailingSlash: undefined,
  clientModules: [require.resolve("./docusaurus.client.js")],
};

module.exports = config;
