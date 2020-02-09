const webpack = require('webpack');
const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');
const shellWebpackPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'docs')
    },
    resolve: {
        modules: ['./src'],
        extensions: ['.ts', '.js']
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loaders: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'resolve-url-loader' },
                    { loader: 'sass-loader' }
                ]
            }
        ]
    },
    plugins: [
        new copyWebpackPlugin(
            [
                {
                    from: './src/assets',
                    to: '.',
                }
            ]
        ),
        new shellWebpackPlugin({
            onBuildEnd: ['ts-node ./scripts/build', 'ts-node ./scripts/build-tags']
        }),
    ],
    optimization: {
        minimize: true,
        namedModules: false,
    }
}