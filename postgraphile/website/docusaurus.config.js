// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// TODO: change this to "graphile"?
const organizationName = "benjie";
// TODO: change this to "graphql" or similar?
const projectName = "postgraphile-private";
// TODO: change this to "main"
const mainBranch = "planning";

const editUrl = `https://github.com/${organizationName}/${projectName}/tree/${mainBranch}/postgraphile/website/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "PostGraphile",
  tagline:
    "Craft your ideal GraphQL API backed primarily by your PostgreSQL database in very little time",
  url: "https://postgraphile.org",
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
          path: "postgraphile",
          routeBasePath: "postgraphile",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl,
          versions: {
            "4.12.0": {
              path: "current",
            },
          },
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
    // Allow us to import `.mermaid` files
    () => ({
      configureWebpack() {
        return {
          module: {
            rules: [
              {
                resourceQuery: /raw/,
                type: "asset/source",
              },
            ],
          },
        };
      },
    }),
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
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: "announcementBar-2",
        content:
          "This documentation is a work in progress, please forgive gaps, and feel free to send pull requests!",
        //backgroundColor: "#fafbfc",
        //textColor: "#091E42",
        isCloseable: false,
      },
      navbar: {
        title: "Home",
        logo: {
          alt: "PostGraphile Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "index",
            docsPluginId: "default",
            position: "left",
            label: "PostGraphile",
          },
          {
            to: "news",
            label: "News",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            position: "right",
            // dropdownItemsAfter: [{ to: "/versions", label: "All versions" }],
            dropdownActiveClassDisabled: true,
          },
          {
            href: `https://github.com/${organizationName}/${projectName}`,
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
                label: "PostGraphile",
                to: "https://grafast.org",
              },
              {
                label: "Grafast",
                to: "https://grafast.org",
              },
              {
                label: "Graphile Build",
                to: "https://build.graphile.org",
              },
              {
                label: "Ruru",
                to: "https://grafast.org/ruru/",
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
      },
    }),

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
};

module.exports = config;
