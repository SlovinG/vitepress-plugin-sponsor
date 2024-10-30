<script lang="ts" setup>

import {ref, nextTick, computed} from 'vue'
import type {SponsorOptions} from 'vitepress-plugin-sponsor'

// TODO：按实际情况修改虚拟模块名称
// @ts-expect-error
import sponsorPluginOptions from 'virtual:sponsor-options'

// 获取打赏组件配置
const sponsorConfig = computed<SponsorOptions>(() => ({...sponsorPluginOptions, ...sponsorPluginOptions?.locales?.[localeIndex.value]}))


// TODO：按实际情况修改命名
/*const sponsorOptions: SponsorOptions = blogSponsorPluginOptions*/

// 响应式状态
const isQRVisible = ref(false) // 控制 QRBox 显示
const isBlurred = ref(false) // 控制模糊效果
const currentQR = ref('') // 当前 QR 码图片路径

// 获取元素的引用
const QRBox = ref<HTMLElement | null>(null)
const mainBox = ref<HTMLElement | null>(null)

// 显示二维码
const showQR = async (QR: string) => {
  if (QR) {
    currentQR.value = QR
    isBlurred.value = true
    isQRVisible.value = true
    await nextTick()
    mainBox.value?.classList.add('showQR')
  }
}

// 隐藏二维码
const hideQR = () => {
  document.body.classList.remove('blur')
  mainBox.value?.classList.remove('showQR')
  mainBox.value?.classList.add('hideQR')

  setTimeout(() => {
    QRBox.value?.classList.remove('fadeIn')
    mainBox.value?.classList.remove('hideQR')
    isQRVisible.value = false
    isBlurred.value = false
  }, 600)
}

// 处理打赏选项的点击事件
const handleDonateClick = (option: string) => {
  let qr = ''
  if (option === 'AliPay') {
    qr = sponsorConfig.value?.aliPayQR
  } else if (option === 'WeChat') {
    qr = sponsorConfig.value?.weChatQR
  }
  if (qr) {
    showQR(qr)
  }
}

</script>

<template>
  <div v-if="sponsorConfig" class="sponsor-container">
    <!-- Github 链接 -->
    <a id="github"
       href="https://github.com/SlovinG"
       target="_blank"
       class="pos-a tr3" :class="{ blur: isBlurred }"></a>
    <!-- 打赏文案 -->
    <div class="donateText pos-a tr3" :class="{ blur: isBlurred }">感谢打赏</div>
    <!-- 打赏方式 -->
    <ul class="donateBox pos-a tr3" :class="{ blur: isBlurred }">
      <li id="AliPay" @click="handleDonateClick('AliPay')"/>
      <li id="WeChat" @click="handleDonateClick('WeChat')"/>
    </ul>
    <!-- 二维码显示区域 -->
    <transition name="fade">
      <div v-if="isQRVisible" ref="QRBox" class="QRBox pos-a left-100">
        <div
            ref="mainBox"
            class="mainBox pos-a"
            :style="{ backgroundImage: `url(${currentQR})` }"
            @click="hideQR"
        ></div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
@import url(style.scss);
</style>
