// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

const organizationName = "graphile";
const projectName = "crystal";
const mainBranch = "main";

const editUrl = `https://github.com/${organizationName}/${projectName}/tree/${mainBranch}/postgraphile/website/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "PostGraphile",
  tagline: "Extensible high-performance automatic GraphQL API for PostgresSQL",
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
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
        },
        pages: {
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
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
      name: "webpack-customization-plugin",
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
    // PostCSS configuration
    () => {
      return {
        name: "configure-postcss-plugin",
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require("postcss-nested"));
          return postcssOptions;
        },
      };
    },
  ],

  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Sarabun",
      type: "text/css",
    },
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
        title: "PostGraphile",
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
            label: "Documentation",
          },
          {
            to: "news",
            label: "News",
            position: "right",
          },
          {
            to: "sponsor",
            label: "Sponsor",
            position: "right",
          },
          {
            to: "pricing",
            label: "Go Pro",
            position: "right",
          },
          {
            type: "docsVersionDropdown",
            position: "left",
            // dropdownItemsAfter: [{ to: "/versions", label: "All versions" }],
            dropdownActiveClassDisabled: true,
          },
          {
            href: "https://www.graphile.org/support/",
            label: "Support",
            position: "right",
          },
          {
            href: `https://github.com/${organizationName}/${projectName}`,
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        logo: {
          alt: "PostGraphile Logo",
          src: "img/logo.svg",
          width: 64,
          height: 64,
        },
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "PostGraphile",
                to: "https://postgraphile.org",
              },
              {
                html: '<a class="footer__link-item" href="/grafast">Gra<em>fast</em></a>',
              },
              {
                label: "Graphile Build",
                to: "https://build.graphile.org",
              },
              {
                label: "Graphile*",
                to: "https://star.graphile.org",
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
              {
                label: "Mastodon",
                href: "https://fosstodon.org/@graphile",
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
              {
                label: "Sponsor",
                href: `https://graphile.org/sponsor/`,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Graphile Ltd. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["json5"],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "T47OLMXAXW",

        // Public API key: it is safe to commit it
        apiKey: "b2f16c59e6591fc0996cfdaa8f1fb5ec",
        indexName: "postgraphile",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",

        //... other Algolia params
      },
    }),

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
  trailingSlash: undefined,
  clientModules: [require.resolve("./docusaurus.client.js")],
};

module.exports = config;
