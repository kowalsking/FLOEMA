const webpack = require('webpack')
const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const IS_DEVELOPLMENT = process.env.NODE_ENV === 'dev'
const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirStyles = path.join(__dirname, 'styles')


module.exports = {
  entry: [
    path.join(dirApp, 'index.js')
  ]
}