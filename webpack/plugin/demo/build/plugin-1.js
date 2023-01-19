class FeWeeklyPlugin {
    constructor(options) {
      this.options = options
    }
    apply(compiler) {
      compiler.hooks.run.tap('run', () => {
        console.log('开始编译...')
      })
  
      compiler.hooks.compile.tap('compile', () => {
        console.log('compile')
      })
  
      compiler.hooks.done.tap('compilation', () => {
        console.log('compilation')
      })
      compiler.hooks.done.tap('FeWeeklyPlugin', () => {
        console.log(this.options)
      })
      compiler.hooks.beforeCompile.tapAsync('compilation', (compilation, cb) => {
        setTimeout(() => {
          console.log('编译中...')
          cb()
        }, 1000)
      })
    }
  }
  
  module.exports = FeWeeklyPlugin