// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
const organizationName = "graphile";
const projectName = "crystal";
const mainBranch = "main";

const editUrl = `https://github.com/${organizationName}/${projectName}/tree/${mainBranch}/postgraphile/website/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "PostGraphile",
  tagline: "Extensible high-performance automatic GraphQL API for PostgreSQL",
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
          showLastUpdateTime: true,
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          editCurrentVersion: true,
          lastVersion: "5",
          //includeCurrentVersion: false,
          onlyIncludeVersions: ["current", "5", "4"],
          versions: {
            current: {
              noIndex: true,
              path: "next/",
              badge: false,
              label: "🚧 Preview",
              banner: "unreleased",
            },
            // latest: { noIndex: true, path: "", label: "Current", banner: "none" },
            5: {
              path: "5/",
              badge: false,
              label: "v5.x",
              banner: "none",
            },
            4: {
              path: "4/",
              badge: true,
              label: "v4.x",
              banner: "none" /* later: unmaintained */,
            },
          },
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
            to: "support",
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
                html: '<a class="footer__link-item" href="https://grafast.org">Gra<em>fast</em></a>',
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
        additionalLanguages: [
          "bash",
          "diff",
          "docker",
          "ignore",
          "ini",
          "json5",
          "plsql",
          "sql",
        ],
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
    mdx1Compat: {
      comments: true,
      admonitions: true,
    },
  },
  themes: ["@docusaurus/theme-mermaid"],
  trailingSlash: undefined,
  clientModules: [require.resolve("./docusaurus.client.js")],
};

module.exports = config;
