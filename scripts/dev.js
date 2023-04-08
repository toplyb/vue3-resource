const minimist = require('minimist')
const execa = require('execa')

// 获取到 package.json 文件中的 serve 后面的参数，即 { _: [ 'reactivity' ], f: 'global', s: true }
const args = minimist(process.argv.slice(2))
const target = args._.length ? args._[0] : 'reactivity'
const formats = args.f || 'global'
const sourcemap = args.s || false

// 开启一个子进程
execa('rollup', [
  '-wc',
  '--environment',
  [
    `TARGET:${target}`,
    `FORMATS:${formats}`,
    sourcemap ? 'SOURCE_MAP:true' : ''
  ].filter(Boolean).join(',')
], {
  // 这个子进程的输出是在我们当前的命令行中输出的
  stdio: 'inherit'
})
