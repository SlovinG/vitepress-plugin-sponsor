import type { PluginOption } from 'vite'
import { stringify } from 'javascript-stringify'
import type { SponsorOptions } from './type'
import { getDirname } from './util'

// TODO：导入的组件名，请按实际情况修改
const componentName = 'BlogSponsor'

const componentFile = `${componentName}.vue`
const aliasComponentFile = `${getDirname()}/components/${componentFile}`

// TODO：虚拟模块名字，按实际情况修改
const virtualModuleId = 'virtual:sponsor-options'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

// TODO：要插入的位置，按实际情况修改
// https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
const slotName = 'doc-after'

export function SponsorPlugin(options?: SponsorOptions): any {
    const componentOptions: SponsorOptions = {
        /**
         * 打赏模块样式
         */
        type: 'simple',
        aliPayQR: '',
        weChatQR: '',
        ...options
    }
    const pluginOps: PluginOption = {
        // TODO：插件名，按实际情况修改
        name: 'vitepress-plugin-sponsor',
        enforce: 'pre',
        config: () => {
            return {
                resolve: {
                    alias: {
                        [`./${componentFile}`]: aliasComponentFile
                    }
                }
            }
        },
        transform(code, id) {
            // 使用 官方 Layout.vue 直接插入组件
            if (id.endsWith('vitepress/dist/client/theme-default/Layout.vue')) {
                // 插入自定义组件
                const slotPosition = `<slot name="${slotName}" />`
                let transformResult = code.replace(slotPosition, `<${componentName} />${slotPosition}`)

                // 导入自定义组件
                const setupPosition = '<script setup lang="ts">'
                transformResult = transformResult.replace(setupPosition, `${setupPosition}\nimport ${componentName} from './${componentName}.vue'`)
                return transformResult
            }
        },
        resolveId(id: string) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        load(this, id) {
            if (id === resolvedVirtualModuleId) {
                // TODO：传入需要的配置
                return `export default ${stringify(componentOptions)}`
            }
        },
    }
    return pluginOps
}

export * from './type'
