// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// TODO: change this to "graphile"?
const organizationName = "benjie";
const projectName = "crystal";
const mainBranch = "main";

const editUrl = `https://github.com/${organizationName}/${projectName}/tree/${mainBranch}/graphile-build/website/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Graphile Build",
  tagline: "Automate the boring parts of building GraphQL APIs",
  url: "https://build.graphile.org",
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
          path: "graphile-build",
          routeBasePath: "graphile-build",
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
        id: "graphile-build-pg",
        path: "graphile-build-pg",
        routeBasePath: "graphile-build-pg",
        sidebarPath: require.resolve("./sidebars.js"),
        editUrl,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "graphile-utils",
        path: "graphile-utils",
        routeBasePath: "graphile-utils",
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
            label: "Graphile Build",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId: "graphile-build-pg",
            position: "left",
            label: "Graphile Build PG",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId: "graphile-utils",
            position: "left",
            label: "Graphile Utils",
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
                label: "Graphile Build",
                to: "/graphile-build/",
              },
              {
                label: "Graphile Build",
                to: "/graphile-build-pg/",
              },
              {
                label: "Graphile Utils",
                to: "/graphile-utils/",
              },
              {
                label: "Grafast",
                to: "https://grafast.org",
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
};

module.exports = config;
