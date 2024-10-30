# vitepress-plugin-sponsor

美观的 vitepress 打赏插件，修改自 [donate-page](https://github.com/Kaiyuan/donate-page)

主要作用是在文章底部添加打赏模块：

![alt text](image.png)
## 使用
安装依赖 `pnpm/npm/yarn`
```sh
pnpm add vitepress-plugin-sponsor
```

引入插件在 `.vitepress/config.ts` 配置文件中

```ts
import { defineConfig } from 'vitepress'
import { templatePlugin } from 'vitepress-plugin-sponsor'

export default defineConfig({
  vite: {
     plugins:[
        // 打赏插件
        SponsorPlugin({
            /**
             * 打赏模块样式
             */
            type: 'simple',
            aliPayQR: 'your_image_link',
            weChatQR: 'your_image_link'
        })
     ]
  }
})
```

## 完整配置
```ts
export interface SponsorOptions {
    /**
     * 打赏模块样式
     */
    type: 'simple',
    aliPayQR: '',
    weChatQR: '',
}
```
