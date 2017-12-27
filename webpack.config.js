const webpack = require('webpack');
const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');
const shellWebpackPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './docs/bundle.js'
    },
    resolve: {
        modules: ['./src'],
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
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
                to: './docs/index.html'
            }]
        ),
        // new shellWebpackPlugin({
        //     onBuildEnd: ['node ./scripts/build']
        // })
    ]
}