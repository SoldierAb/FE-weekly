const path = require('path')
const FeWeeklyPlugin = require('./build/plugin-1')

module.exports = {
  entry: {
    index: path.join(__dirname, '/src/main.js'),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
  },
  plugins: [new FeWeeklyPlugin({ msg: '前端FeWeekly Plugin' })],
}