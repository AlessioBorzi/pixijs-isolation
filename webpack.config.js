const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    // Basic configuration
    entry: { app: ['./shared/index.ts', './app/main.ts',] },
    // Necessary in order to use source maps and debug directly TypeScript files
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [
            // Necessary in order to use TypeScript
            {
              test: /\.ts$/,
              use: 'ts-loader',
              exclude: [/node_modules/, '/server/'],
            },
            {
              test: /\.css$/i,
              use: [
                  {
                      loader: MiniCssExtractPlugin.loader,
                  },
                  "css-loader",
              ],
            },
        ],
    },
    resolve: {
        // Alway keep '.js' even though you don't use it.
        // https://github.com/webpack/webpack-dev-server/issues/720#issuecomment-268470989
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // This line is VERY important for VS Code debugging to attach properly
        // Tamper with it at your own risks
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },
    plugins: [
        // No need to write a index.html
        new HtmlWebpackPlugin({
            template: 'app/index.html',
        }),
        // Do not accumulate files in ./dist
        new CleanWebpackPlugin(),

        // Copy assets to serve them
        new CopyPlugin({
          patterns: [
              {
                  from: "assets/**",

                  // if there are nested subdirectories , keep the hierarchy
                  to({ context, absoluteFilename }) {
                      const assetsPath = path.resolve(__dirname, "assets");

                      if (!absoluteFilename) {
                          throw Error();
                      }

                      const endPath = absoluteFilename.slice(assetsPath.length);

                      return Promise.resolve(`assets/${endPath}`);
                  },
              },
          ],
        }),
        new MiniCssExtractPlugin(),
    ],
}
