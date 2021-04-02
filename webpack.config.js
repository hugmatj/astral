const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.postcss$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve('resources/js'),
    },
  },
  output: {
    chunkFilename: 'js/[name].js?id=[chunkhash]',
  },
}
