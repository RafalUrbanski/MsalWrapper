const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        MsalWrapper: './src/MsalWrapper.ts'
    },
    output: {
        filename: '[name].js',
        path: buildPath,
        libraryTarget: 'umd',
        library: 'MsalWrapper',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.(scss|css|sass)$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            },
            {
                // translates CSS into CommonJS
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            },
            {
                // Runs compiled CSS through postcss for vendor prefixing
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            {
                // compiles Sass to CSS
                loader: 'sass-loader',
                options: {
                    outputStyle: 'expanded',
                    sourceMap: true,
                    sourceMapContents: true
                }
            }
            ]
        },
        {
            // Load all images as base64 encoding if they are smaller than 8192 bytes
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: '[name].[hash:20].[ext]',
                    limit: 8192
                }
            }]
        },
        {
            // Load all icons
            test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
            use: [{
                loader: 'file-loader',
            }]
        },
        {
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/
        }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: './index.html',
        //     // Inject the js bundle at the end of the body of the given template
        //     inject: 'body',
        // }),
        new CleanWebpackPlugin(buildPath)
        // new MiniCssExtractPlugin({
        //     filename: 'styles.[contenthash].css'
        // }),
        // new OptimizeCssAssetsPlugin({
        //     cssProcessor: require('cssnano'),
        //     cssProcessorOptions: {
        //         map: {
        //             inline: false,
        //         },
        //         discardComments: {
        //             removeAll: true
        //         },
        //         discardUnused: false
        //     },
        //     canPrint: true
        // })
    ]
};
