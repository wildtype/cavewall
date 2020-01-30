const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    './src/js/index.js',
    './src/stylesheets/index.scss'
  ],

  output: {
    path: path.resolve(__dirname, './assets'),
    filename: 'js/app.js'
  },

  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/index.css'
    })
  ]
};
