/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: './src/example/App.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve('./src/example', 'index.html')
    })
  ]
};