import path from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const packagesFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const sourcemap = process.env.SOURCE_MAP
const target = process.env.TARGET

// 根据 target 找到要打包的目录
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, target)

const resolve = p => path.resolve(packageDir, p)
const name = path.basename(packageDir)
// 找到要打包的模块的 package.json 文件的内容
const pkg = require(resolve('package.json'))

const outputConfig = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es'
  },
  'cjs': {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  'global': {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife'
  }
}

const packageConfigs = packagesFormats || pkg.buildOptions.formats

// 生成配置信息
function createConfig(format, output) {
  output.sourcemap = sourcemap
  output.exports = 'named'
  // 指明哪些外部模块不需要打包
  let external = []
  if (format === 'global') {
    output.name = pkg.buildOptions.name
  } else {
    external = [...Object.keys(pkg.dependencies)]
  }
  // 返回的结果就是 rollup 的配置
  return {
    input: resolve('src/index.ts'),
    output,
    external,
    plugins: [
      json(),
      ts(),
      commonjs(),
      nodeResolve()
    ]
  }
}

export default packageConfigs.map(format => createConfig(format, outputConfig[format]))
