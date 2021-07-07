const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssPlugin = require('mini-css-extract-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');


/** @type {import('webpack').Configuration} */
module.exports = (env = {}) => {
  const isProd = env.mode === "production";
  const isDev = !isProd;

  const setFilename = (ext) => {
    return isProd ? `[name]-[hash:8].${ext}` : `[name].${ext}`;
  };

  const getBabel = () => {
    const settings = [
      {
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-react"], //"@babel/preset-env", 
          plugins: ["@babel/plugin-proposal-class-properties"]
        }
      }
    ]

    //if(isDev) settings.push('eslint-loader')

    return settings;
  }

  const getCssLoader = loader => {
    const loaders = [
      isDev ? 'style-loader' : MiniCssPlugin.loader,
      'css-loader',
    ]

    if(loader) loaders.push(loader);

    return loaders;
  }

  const getPlugins = () => {
    const plugins = [
      new HtmlPlugin({
        template: './public/index.html',
        minify: {
          collapseWhitespace: isProd
        }
      }),
      new CleanWebpackPlugin(),
    ]

    if (isDev) {
      plugins.push(new ESLintPlugin());
      plugins.push(new ErrorOverlayPlugin())
    }

    return plugins;
  }

  return {
    mode: isProd ? "production" : "development",
    stats: "errors-warnings",
    devtool: isDev ? "cheap-module-source-map" : "",
    entry: ["@babel/polyfill", "./src/index.js"],


    output: {
      filename: setFilename("js"),
      path: path.resolve(__dirname, "dist"),
    },

    resolve: {
      alias: {
        src: path.resolve(__dirname, "src/"),
      },
    },

    plugins: getPlugins(),

    module: {
      rules: [
        {//styles
          test: /\.css$/,
          use: getCssLoader(),
        },
        {//sacc/cscc
          test: /\.s[ca]ss$/,
          use: getCssLoader('sass-loader'),
        },
        {//images
          test: /\.(jpg|png|swg|jpeg|gif|ico)$/,
          type: 'asset/resource',
        },
        {//fonts
          test: /\.(ttf|otf|eof|woff|woff2|svg)$/,
          type: 'asset/inline',
        },
        {//javascript
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: getBabel(),
        },
      ],
    },

    devServer: {
      port: 3000,
      open: true,
      hot: true,
      overlay: true,
      clientLogLevel: 'warn',
      historyApiFallback: true,
      // proxy: {  //fullstack only
      //   "/api": { target: "http://localhost:5000", secure: false },
      //   '/images': { target: 'http://localhost:5000', secure: false }
      // },
      //hotOnly: true, //optional
    }

  };
};
