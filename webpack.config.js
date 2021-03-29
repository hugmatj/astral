const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve("resources/js"),
    },
  },
  output: {
    chunkFilename: "js/[name].js?id=[chunkhash]",
  },
};
