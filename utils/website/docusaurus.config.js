// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// TODO: change this to "graphile"?
const organizationName = "benjie";
const projectName = "crystal";
const mainBranch = "main";

const editUrl = `https://github.com/${organizationName}/${projectName}/tree/${mainBranch}/utils/website/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Graphile*",
  tagline: "... the stars we forge to build our universe",
  url: "https://star.graphile.org",
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
          path: "graphile-config",
          routeBasePath: "graphile-config",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl,
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
        id: "graphile-export",
        path: "graphile-export",
        routeBasePath: "graphile-export",
        sidebarPath: require.resolve("./sidebars.js"),
        editUrl,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "pg-introspection",
        path: "pg-introspection",
        routeBasePath: "pg-introspection",
        sidebarPath: require.resolve("./sidebars.js"),
        editUrl,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "pg-sql2",
        path: "pg-sql2",
        routeBasePath: "pg-sql2",
        sidebarPath: require.resolve("./sidebars.js"),
        editUrl,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "tamedevil",
        path: "tamedevil",
        routeBasePath: "tamedevil",
        sidebarPath: require.resolve("./sidebars.js"),
        editUrl,
      },
    ],

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
          alt: "Graphile Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "index",
            docsPluginId: "default",
            position: "left",
            label: "Graphile Config",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId: "graphile-export",
            position: "left",
            label: "Graphile Export",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId: "pg-introspection",
            position: "left",
            label: "pg-introspection",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId: "pg-sql2",
            position: "left",
            label: "pg-sql2",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId: "tamedevil",
            position: "left",
            label: "tamedevil",
          },
          {
            href: `https://github.com/${organizationName}/${projectName}`,
            label: "GitHub",
            position: "right",
          },
          {
            href: `https://graphile.org/sponsor/`,
            label: "Sponsor",
            position: "right",
          },
          {
            href: `https://graphile.org/support/`,
            label: "Support",
            position: "right",
          },
        ],
      },
      footer: {
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Graphile Config",
                to: "/graphile-config/",
              },
              {
                label: "Graphile Export",
                to: "/graphile-export/",
              },
              {
                label: "pg-introspection",
                to: "/pg-introspection/",
              },
              {
                label: "pg-sql2",
                to: "/pg-sql2/",
              },
              {
                label: "tamedevil",
                to: "/tamedevil/",
              },
            ],
          },
          {
            title: "The Graphile Suite",
            items: [
              {
                html: '<a class="footer__link-item" href="https://grafast.org">Gra<em>fast</em></a>',
              },
              {
                label: "PostGraphile",
                to: "https://postgraphile.org",
              },
              {
                label: "Graphile Build",
                to: "https://build.graphile.org",
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
                label: "Mastodon",
                href: "https://fosstodon.org/@graphile",
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
      algolia: {
        // The application ID provided by Algolia
        appId: "F4KXII8MC1",

        // Public API key: it is safe to commit it
        apiKey: "e145e9091aefbc75a585653c3a5f0baa",
        indexName: "star-graphile",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",

        //... other Algolia params
      },
    }),
  trailingSlash: false,
  clientModules: [require.resolve("./docusaurus.client.js")],
};

module.exports = config;
