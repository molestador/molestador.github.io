const path = require('path');

module.exports = {
    entry: {
        main: './main.js',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
        ],
    },
};
