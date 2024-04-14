/* eslint-disable */
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
var WebpackNotifierPlugin = require('webpack-notifier');
const autoprefixer = require('autoprefixer')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    devServer: {
        port: 9000
    },
    entry: {
        index: './cy-env/index.tsx'
    },
    mode: 'development',
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            chunks: "all"
        }
      },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /.js$/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: miniCssExtractPlugin.loader
                    },'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: miniCssExtractPlugin.loader
                    },
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                          postcssOptions: {
                            plugins: [
                              autoprefixer
                            ]
                          }
                        }
                      },
                    "sass-loader",
                ],
            },
            {
                test: /\.(jpe?g|png|gif)$/i, 
                type: 'asset/resource'
            },
            {
                test: /\.(md)$/i, 
                type: 'asset/source'
            },
            {
                test: /\.(svg)$/i, 
                type: 'asset/inline'
            }
        ]
    },
    output: {
        filename: '[name]-[contenthash].js',
        path: path.join(__dirname, '../../build/'),
        clean: true
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './cy-env/public/index.html',
            title: 'CRA without CRA'
        }),
        new miniCssExtractPlugin(),
        new WebpackNotifierPlugin({
            title: 'Webpack',
            emoji: true
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }
}