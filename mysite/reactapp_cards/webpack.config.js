const path = require("path");
module.exports = {
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, "../cards/static/cards/js"),
        filename: "main.js",
    },
    module: { rules: [
        { test: /\.(tsx|ts|js|jsx)$/,
        exclude: /node_modules/,
        use: {loader: "babel-loader"}},
        { test: /\.css$/,
        use: ['style-loader', {loader:'css-loader',options:{url:false}}, 'postcss-loader'],
        },
        {
            test: /\.jpg$/,
            type: 'asset/resource',
        },
    ]},
    optimization: {minimize: true},
    stats:{errorDetails: true}
};