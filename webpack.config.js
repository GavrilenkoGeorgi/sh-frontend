const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const SitemapPlugin = require('sitemap-webpack-plugin').default
const CopyPlugin = require('copy-webpack-plugin')

const prod = process.env.NODE_ENV === 'production'
const paths = [
  '/',
  '/login',
  '/game',
  '/help',
  '/register',
  '/stats',
  '/profile'
] //!

const plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    title: 'Progressive Web Application'
  }),
  new Dotenv({
    systemvars: true
  }),
  process.env.NODE_ENV === 'development' ? new BundleAnalyzerPlugin() : '',
  new MiniCssExtractPlugin(),
  new SitemapPlugin({
    base: 'https://sharlushka.net',
    paths,
    options: {
      lastmod: true,
      changefreq: 'yearly',
      priority: 0.4
    }
  }),
  new CopyPlugin({
    patterns: [
      { from: './src/public/robots.txt', to: 'robots.txt' },
      { from: './src/public/img', to: 'img' },
      { from: './src/public/.well-known', to: '.well-known' }
    ]
  }),
  new WebpackPwaManifest({
    name: 'Sh dice game',
    publicPath: '/',
    fingerprints: true,
    launch_handler: {
      client_mode: 'navigate-existing'
    },
    start_url: '/',
    id: '/?homescreen=1',
    scope: 'https://sharlushka.net',
    display: 'standalone',
    short_name: 'Sharlushka',
    filename: 'manifest.json',
    description: 'Dice game with stats.',
    categories: ['games'],
    dir: 'ltr',
    lang: 'en',
    prefer_related_applications: false,
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
          name(module) {
            // get the name. E.g. node_modules/pkgName/not/this/part.js
            // or node_modules/pkgName
            const pkg = module.context.match(
              /[\\\/]node_modules[\\\/](.*?)([\\\/]|$)/
            )
            let pkgName
            if (pkg !== null) {
              // the last one is null
              ;[, pkgName] = pkg // get the second item
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
      // 1️⃣ CSS-Module rule: only files ending in .module.scss/.module.css
      {
        test: /\.module\.(sa|sc|c)ss$/, // <-- notice the “.module.” in the pattern
        exclude: /node_modules/, // ignore node_modules (if you never publish CSS modules to npm)
        use: [
          'style-loader', // 1. Injects <style> tags at runtime
          {
            loader: 'css-loader', // 2. Interprets @import and url() & enables "modules"
            options: {
              modules: {
                // How the generated class names should look
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'sass-loader', // 3. Compiles Sass → CSS
            options: {
              // “modern” is fine, or remove if you don't need a special API
              implementation: require('sass')
            }
          }
        ]
      },

      // 2️⃣ Global CSS/Sass rule: everything else (.scss/.css) except .module
      {
        test: /\.(sa|sc|c)ss$/, // match .scss/.sass/.css
        exclude: [
          /\.module\.(sa|sc|c)ss$/, // exclude any “.module.scss” or “.module.css”
          /node_modules/ // <-- newly added exclusion
        ],
        use: [
          'style-loader',
          'css-loader', // No `modules: true` here
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass')
            }
          }
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
