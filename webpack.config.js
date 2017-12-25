const webpack = require('webpack');
const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './public/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.styl?u?s$/,
                loaders: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'resolve-url-loader' },
                    { loader: 'stylus-loader' }
                ]
            }
        ]
    },
    plugins: [
        new copyWebpackPlugin(
            [{
                from: './src/index.html',
                to: './public/index.html'
            }]
        )
    ]
}