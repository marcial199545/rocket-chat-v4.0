const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./src/server.ts",
    target: "node",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "server.js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"]
            }
        ]
    },
    plugins: [new CleanWebpackPlugin()],
    externals: [nodeExternals()]
};
