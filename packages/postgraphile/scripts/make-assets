#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const PnpWebpackPlugin = require("pnp-webpack-plugin");

const ASSETS_SOURCE_DIR = `${__dirname}/../assets/`;
const ASSETS_DEST_DIR = `${__dirname}/../src/assets/`;

async function main() {
  console.log("... Making sponsors.json");
  const sponsorsMd = fs.readFileSync(`${__dirname}/../SPONSORS.md`, "utf8");
  const lines = sponsorsMd.split("\n");
  const tiers = [];
  let tier;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      tier = [];
      tiers.push(tier);
    } else if (line.startsWith("* ") || line.startsWith("- ")) {
      tier.push(line.substr(2).replace(/\s?\(.*$/, ""));
    }
  }
  tiers.reverse();
  const sponsors = [];
  let repeats = 0;
  for (let tier = 0; tier < tiers.length; tier++) {
    repeats += tier + 1;
    for (const sponsor of tiers[tier]) {
      // Higher tiers are more likely to appear
      for (let i = 0; i < repeats; i++) {
        sponsors.push(sponsor);
      }
    }
  }
  sponsors.sort();
  fs.writeFileSync(
    `${__dirname}/../sponsors.json`,
    JSON.stringify(sponsors, null, 2),
  );

  console.log("... Building GraphiQL");

  // Step 1: compile GraphiQL
  await new Promise((resolve, reject) => {
    // Webpack up everything
    webpack(
      {
        /* yarn pnp; remove when we've upgraded to Webpack 5 */
        resolve: {
          plugins: [PnpWebpackPlugin],
        },
        resolveLoader: {
          plugins: [PnpWebpackPlugin.moduleLoader(module)],
        },
        /* end: yarn pnp */

        mode: "production",
        target: "web",
        entry: `${__dirname}/../../postgraphiql/src/index.js`,
        node: {
          dgram: "empty",
          fs: "empty",
          net: "empty",
          tls: "empty",
          child_process: "empty",
        },
        output: {
          path: ASSETS_SOURCE_DIR,
          filename: "graphiql.js",
        },
        module: {
          rules: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
                  plugins: [
                    "@babel/plugin-proposal-class-properties",
                    "@babel/plugin-transform-runtime",
                  ],
                },
              },
            },
            {
              test: /\.css$/,
              use: [{ loader: "style-loader" }, { loader: "css-loader" }],
            },
          ],
        },
        plugins: [
          new webpack.DefinePlugin({
            // Hack required due to https://unpkg.com/graphql@0.13.2/jsutils/instanceOf.js
            process: "false",
            "process.env": {
              NODE_ENV: '"production"',
            },
          }),
          // Prevent webpack from attempting to import flow stuff (dynamic requires in GraphiQL)
          new webpack.ContextReplacementPlugin(
            /graphql-language-service-interface[\\/]dist$/,
            /^\.\/.*\.js$/,
          ),
          new HtmlWebpackPlugin({
            filename: "graphiql.html",
            template: `${__dirname}/../../postgraphiql/public/index.html`,
            inlineSource: ".(js|css)$", // embed all javascript and css inline
            inject: "body",
          }),
          new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
        ],
      },
      (err, stats) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        if (stats.hasErrors()) {
          console.log(stats.toString("minimal"));
          process.exit(2);
        }
        // We only want the HTML file
        fs.unlinkSync(`${ASSETS_SOURCE_DIR}/graphiql.js`);
        console.log(stats.toString("minimal"));
        resolve();
      },
    );
  });

  const shouldBeBinary = filename => !filename.match(/\.html$/);

  console.log("... Compiling the assets");
  // Step 2: compile the assets
  const files = fs.readdirSync(ASSETS_SOURCE_DIR);
  files
    .filter(f => f[0] !== ".")
    .map(filename => {
      const fileContent = fs.readFileSync(`${ASSETS_SOURCE_DIR}/${filename}`);
      let output;
      if (shouldBeBinary(filename)) {
        output = `Buffer.from(\n  '${fileContent.toString(
          "base64",
        )}',\n  'base64'\n)`;
      } else {
        output = `${JSON.stringify(fileContent.toString("utf8"))}`;
      }
      fs.writeFileSync(
        `${ASSETS_DEST_DIR}/${filename}.ts`,
        `export default process.env.POSTGRAPHILE_OMIT_ASSETS === '1'\n  ? null\n  : ${output};\n`,
      );
    });
}

main().then(
  () => {},
  err => {
    console.error("An error occurred");
    console.error(err);
    process.exit(3);
  },
);
