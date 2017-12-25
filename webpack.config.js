const webpack = require('webpack');
const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './public/bundle.js'
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