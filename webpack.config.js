const path = require('path');
const slsw = require('serverless-webpack');
var nodeExternals = require('webpack-node-externals');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  stats: {
    builtAt: true,
    cached: true,
    colors: true,
    entrypoints: true,
    depth: true
  },
  externals: [nodeExternals()],
  entry: slsw.lib.entries,
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@domain': path.resolve(__dirname, 'src/domain'),
    },
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            logInfoToStdOut: true,
            logLevel: "info"
          }
        }
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(__dirname, 'coverage/bundle-analysis.html'),
      openAnalyzer: false
    })
  ],
};
