const webpack = require('webpack');
const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');
const exec = require('child_process').exec;

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
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'resolve-url-loader' },
                    { loader: 'sass-loader' }
                ]
            }
        ]
    },
    plugins: [
        new copyWebpackPlugin({
            patterns: [
                {
                    from: './src/assets',
                    to: '.',
                }
            ]
        }),
        {
            apply: (compiler) => {
              compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                exec('ts-node ./scripts/build', (err, stdout, stderr) => {
                  if (stdout) process.stdout.write(stdout);
                  if (stderr) process.stderr.write(stderr);
                });
                exec('ts-node ./scripts/build-tags', (err, stdout, stderr) => {
                    if (stdout) process.stdout.write(stdout);
                    if (stderr) process.stderr.write(stderr);
                  });
              });
            }
          }
        
    ],
    optimization: {
        minimize: true,
    }
}