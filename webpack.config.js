const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const Dotenv = require('dotenv-webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const SitemapPlugin = require('sitemap-webpack-plugin').default
const CopyPlugin = require('copy-webpack-plugin')

const { version } = require('./package.json')

const paths = [
  '/',
  '/login',
  '/game',
  '/help',
  '/register',
  '/stats',
  '/profile'
]

module.exports = (_env, argv) => {
  const prod =
    argv.mode === 'production' || process.env.NODE_ENV === 'production'

  const plugins = [
    new webpack.DefinePlugin({
      __APP_VERSION__: JSON.stringify(version)
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Progressive Web Application'
    }),

    new Dotenv({
      systemvars: true
    }),

    !prod && new BundleAnalyzerPlugin(),

    prod &&
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[contenthash].css'
      }),

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
        { from: './src/public/robots.txt', to: 'robots.txt' },
        { from: './src/public/img', to: 'img' },
        { from: './src/public/.well-known', to: '.well-known' }
      ]
    }),

    new WebpackPwaManifest({
      name: 'Sh dice game',
      short_name: 'Sharlushka',
      description: 'Dice game with stats.',
      publicPath: '/',
      filename: 'manifest.json',

      start_url: '/',
      scope: '/',
      display: 'standalone',
      id: '/?homescreen=1',

      theme_color: '#7B1FA2',
      background_color: '#7B1FA2',

      categories: ['games'],
      lang: 'en',
      dir: 'ltr',
      prefer_related_applications: false,

      fingerprints: true,
      crossorigin: 'use-credentials',

      icons: [
        {
          src: path.resolve('src/assets/icons/android-chrome-192x192.png'),
          size: '192x192'
        },
        {
          src: path.resolve('src/assets/icons/android-chrome-512x512.png'),
          size: '512x512'
        }
      ]
    }),

    prod &&
      new WorkboxPlugin.InjectManifest({
        swSrc: './src/service-worker.ts',
        swDest: 'service-worker.js'
      })
  ].filter(Boolean)

  return {
    mode: prod ? 'production' : 'development',

    entry: './src/index.tsx',

    output: {
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },

    devtool: prod ? false : 'source-map',

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },

    optimization: {
      usedExports: true,

      minimizer: [
        new CssMinimizerPlugin({ parallel: true }),
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
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const pkg = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )

              if (!pkg) return false

              const pkgName = pkg[1].replace('@', '')
              return `npm.${pkgName}`
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
          use: 'ts-loader'
        },

        // CSS Modules
        {
          test: /\.module\.(sa|sc|c)ss$/,
          exclude: /node_modules/,
          use: [
            prod ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[local]--[hash:base64:5]'
                }
              }
            },
            'sass-loader'
          ]
        },

        // Global styles
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /\.module\.(sa|sc|c)ss$/,
          use: [
            prod ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },

        {
          test: /\.svg$/,
          use: ['@svgr/webpack']
        }
      ]
    },

    plugins,

    devServer: {
      historyApiFallback: true
    }
  }
}
