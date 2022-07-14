const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath:process.env.NODE_ENV=="production"?"./":"/",
  transpileDependencies: true,
  //关闭eslint
  lintOnSave: false,
  configureWebpack: {
    
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()
        ],
      })
  
    ]
  }
})
