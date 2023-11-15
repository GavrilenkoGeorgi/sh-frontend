const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const Dotenv = require('dotenv-webpack')

const prod = process.env.NODE_ENV === 'production'
module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '/dist/')
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json']
        },
        use: 'ts-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  },
  devtool: prod ? undefined : 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Progressive Web Application'
    }),
    new Dotenv(),
    new MiniCssExtractPlugin(),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling 'old' SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 5000000
    }),
    new WebpackPwaManifest({
      name: 'Sh dice game',
      publicPath: '/',
      fingerprints: true,
      id: '/',
      display: 'standalone',
      short_name: 'Sh',
      filename: 'manifest.json',
      description: 'Dice game',
      theme_color: '#7B1FA2',
      background_color: '#7B1FA2',
      crossorigin: 'use-credentials', // can be null, use-credentials or anonymous
      icons: [
        {
          src: path.resolve('src/assets/icons/android-chrome-192x192.png'),
          size: '192x192' // you can also use the specifications pattern
        },
        {
          src: path.resolve('src/assets/icons/android-chrome-512x512.png'),
          size: '512x512'
        }
      ]
    })
  ],
  devServer: {
    historyApiFallback: true
  }
}
