const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/bootstrap/app.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true, 
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'resources/templates/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "resources/assets", to: "assets" },
            ],
        }),
    ],
};