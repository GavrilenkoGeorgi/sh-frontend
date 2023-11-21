const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const SitemapPlugin = require('sitemap-webpack-plugin').default
const CopyPlugin = require('copy-webpack-plugin')

const prod = process.env.NODE_ENV === 'production'
const paths = ['/', '/login', '/game', '/help', '/register', '/stats', '/profile'] //!

const plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    title: 'Progressive Web Application'
  }),
  new Dotenv({
    systemvars: true
  }),
  (process.env.NODE_ENV === 'development') ? new BundleAnalyzerPlugin() : '',
  new MiniCssExtractPlugin(),
  new SitemapPlugin({
    base: 'https://sharlushka.netlify.app',
    paths,
    options: {
      lastmod: true,
      changefreq: 'yearly',
      priority: 0.4
    }
  }),
  new CopyPlugin({
    patterns: [
      { from: './src/public/robots.txt', to: 'robots.txt' }
    ]
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
]

const wbxPlugin = new WorkboxPlugin.GenerateSW({
  // these options encourage the ServiceWorkers to get in there fast
  // and not allow any straggling 'old' SWs to hang around
  clientsClaim: true,
  skipWaiting: true
})

if (process.env.NODE_ENV === 'production') plugins.push(wbxPlugin) // ??

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '/dist/')
  },
  optimization: {
    usedExports: 'global',
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true
      }),
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\\/]node_modules[\\\/]/,
          name (module) {
            // get the name. E.g. node_modules/pkgName/not/this/part.js
            // or node_modules/pkgName
            const pkg = module.context.match(/[\\\/]node_modules[\\\/](.*?)([\\\/]|$)/)
            let pkgName
            if (pkg !== null) { // the last one is null
              [, pkgName] = pkg // get the second item
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${pkgName.replace('@', '')}`
            } else return false
          }
        }
      }
    }
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
  plugins: [...plugins],
  devServer: {
    historyApiFallback: true
  }
}
