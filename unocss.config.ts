// 添加配置文件 unocss.config.ts 
import presetWeapp from 'unocss-preset-weapp' 
import { defineConfig } from 'unocss'
import { transformerAttributify, transformerClass } from 'unocss-preset-weapp/transformer' 

export default defineConfig({
  presets: [ 
    presetWeapp(), // 工具预设 
  ], 
transformers: [
    transformerAttributify(), // 支持属性化模式 
    transformerClass(), // 转换转义类名，支持class写法 
  ],
  shortcuts: [ 
    { center: 'flex items-center justify-center' },
    { around: 'flex items-center justify-around' },
    { between: 'flex items-center justify-between' }, 
] 
}) 