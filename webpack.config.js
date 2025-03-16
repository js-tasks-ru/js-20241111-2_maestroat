const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    main: path.resolve(__dirname, './10-routes-browser-history-api/router/app.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: 'styles/[name].css' // Указываем путь для CSS файлов
      }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './index.html'), // шаблон
      filename: 'index.html', // название выходного файла
    }),
  ],
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // изображения
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // шрифты и SVG
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      // css
      { test: /\.css$/, use: [devMode ? "style-loader" : MiniCssExtractPlugin.loader, 'css-loader'] },

    ],
  }
};
