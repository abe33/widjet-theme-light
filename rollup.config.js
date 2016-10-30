import path from 'path'

import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import includePaths from 'rollup-plugin-includepaths'

export default {
  entry: 'demo/index.es6',
  dest: 'dist/index.es6',
  plugins: [
    includePaths({
      paths: [path.join(process.cwd(), 'src')],
      extensions: ['.js', '.json', '.es6']
    }),
    nodeResolve({jsnext: true, main: true}),
    commonjs()
  ],
  format: 'iife'
}
