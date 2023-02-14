const path = require('path');

const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname, 'app');
const dirShared = path.join(__dirname, 'shared');
// const dirImages = path.resolve(__dirname, 'images');
const dirStyles = path.join(__dirname, 'styles');
const dirNode = 'node_modules';

module.exports = {
    mode: 'development',
    entry: [
        path.join(dirApp, 'index.js'),
        path.join(dirStyles, 'index.scss'),
      ],
    
    resolve: {
      modules: [dirApp, dirShared, dirStyles, dirNode],

      // modules: [path.resolve(__dirname, 'app'), 'node_modules'],
      // modules: [
      //   path.resolve(__dirname, 'app'),
      //   // dirShared,
      //   // dirStyles,
      //   // dirImages,
      //   dirNode,

      // ],
    },
    output: {
      // path: path.resolve(__dirname, './dist'),
      filename: 'main.js',
      clean: true,
    },

    plugins: [
      new webpack.DefinePlugin({
        IS_DEVELOPMENT,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './shared',
            to: ''
          }
        ]
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin(),
     ],
     module: {
         rules: [
             // You need this, if you are using `import file from "file.ext"`, for `new URL(...)` syntax you don't need it
             {
               test: /\.(jpe?g|png|gif|svg)$/i,
               type: 'asset',
             },
             {
                 test: /\.js$/,
                 use: {
                  loader: 'babel-loader'
                 }
             }, 
             {
              test: /\.scss$/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    publicPath: '',
                  }
                },
                {
                  loader: 'css-loader',
                },
                {
                  loader: 'postcss-loader', // includes prefixer automatically css to your code
                },
                {
                  loader: 'sass-loader',
                },
              ],
            },
            {
              test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp|jpg)$/,
              loader: 'file-loader',
              options: {
                name (file) {
                  // can put hash instead name or [name].[hash.[ext]]
                  return '[name].[ext]'; 
                }
              
              }
            },
            // {
            //   test: /\.(glsl|frag|vert)$/i,
            //   use: 'raw-loader',
            // },
            {
              test: /\.(glsl|vs|fs|vert|frag)$/,
              exclude: /node_modules/,
              use: [
                'raw-loader',
                'glslify-loader'
              ]
            }
            
         ],
     },

    
     optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.squooshMinify,
            options: {
              encodeOptions: {
                mozjpeg: {
                  // That setting might be close to lossless, but it’s not guaranteed
                  // https://github.com/GoogleChromeLabs/squoosh/issues/85
                  quality: 70,
                },
                webp: {
                  lossless: 1,
                },
                avif: {
                  // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
                  cqLevel: 0,
                },
              },
            },
          },
        }),
      ],
    },
    
};