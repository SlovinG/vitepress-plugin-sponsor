<script lang="ts" setup>

import {ref, nextTick, computed} from 'vue'
import { useData } from 'vitepress'
import type {SponsorOptions} from 'vitepress-plugin-sponsor'

// TODO：按实际情况修改虚拟模块名称
// @ts-expect-error
import sponsorPluginOptions from 'virtual:sponsor-options'

const { lang } = useData()
// 获取打赏组件配置
const sponsorConfig = computed<SponsorOptions>(() => ({
  ...sponsorPluginOptions,
  ...(sponsorPluginOptions?.locales?.[lang.value] ?? {})
}))

// TODO：按实际情况修改命名
/*const sponsorOptions: SponsorOptions = blogSponsorPluginOptions*/
import githubUrl from './images/github.svg?url'
import likeUrl from './images/like.svg?url'
import alipayUrl from './images/alipay.svg?url'
import wechatUrl from './images/wechat.svg?url'

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
    mainBox.value?.classList.remove('hideQR')
    mainBox.value?.classList.add('showQR')
  }
}

// 隐藏二维码
const hideQR = () => {
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
       class="pos-a tr3"
       :class="{ blur: isBlurred }"
       :style="{ backgroundImage: `url(${githubUrl})` }">
    </a>
    <!-- 打赏文案 -->
    <div class="donateText pos-a tr3"
         :class="{ blur: isBlurred }"
         :style="{ backgroundImage: `url(${likeUrl})` }"
    >
      感谢打赏
    </div>
    <!-- 打赏方式 -->
    <ul class="donateBox pos-a tr3" :class="{ blur: isBlurred }">
      <li id="AliPay"
          :style="{ backgroundImage: `url(${alipayUrl})` }"
          @click="handleDonateClick('AliPay')"></li>
      <li id="WeChat"
          :style="{ backgroundImage: `url(${wechatUrl})` }"
          @click="handleDonateClick('WeChat')"></li>
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
.sponsor-container {
  padding: 10px 0;
  margin: 0 auto;
  width: 90%;
  height: 230px;
  position: relative;
  text-align: center;

  #github {
    width: 24px;
    height: 24px;
    left: calc(50% + 135px);
    top: calc(50% - 30px);
    background: no-repeat center center;
    background-size: contain;
    opacity: 0.3;
    transform: rotatez(15deg);
  }

  .donateText {
    left: 38%;
    top: 34%;
    width: 70px;
    height: 70px;
    color: rgba(60, 60, 67, 0.78);
    font-size: 12px;
    line-height: 70px;
    background: #ffd886 no-repeat center 10px;
    background-size: 20px;
    border-radius: 35px;
    text-align: center;
    transform: rotatez(-15deg) translate(-50%, -50%);
    border: none;
    cursor: default;
  }

  .donateBox {
    float: left;
    left: 50%;
    top: 50%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    width: 299px;
    height: 28px;
    transform: translate(-50%, -50%);
    z-index: 1;
    list-style: none;
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      float: left;
      width: calc(100% / 2);
      height: 100%;
      text-align: center;
      border-left: 1px solid #ddd;
      background: no-repeat center center;
      background-size: 45px;
      transition: all .3s;
      cursor: pointer;
      overflow: hidden;
      line-height: 100px;
      filter: grayscale(1);
      opacity: 0.5;

      a {
        display: block;
        height: 100%;
        border: none;
      }

      &:hover {
        background-color: rgba(204, 217, 220, 0.3);
        filter: grayscale(0);
        opacity: 1;
      }

      &:first-child {
        border-width: 0;
      }
    }
  }

  .left-100 {
    width: 100%;
    height: 100%;
  }

  .blur {
    -webkit-filter: blur(3px);
    filter: blur(3px);
  }

  .tr3 {
    transition: all .3s;
  }

  .pos-a {
    position: absolute;
  }

  .QRBox {
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.3);
    perspective: 400px;
  }

  .fadeIn {
    display: block;
    animation: fadeIn 300ms;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .mainBox {
    cursor: pointer;
    text-align: center;
    width: 200px;
    height: 200px;
    left: calc(50% - 100px);
    top: calc(50% - 100px);
    background: #fff no-repeat center center;
    background-size: 190px;
    border-radius: 6px;
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: all 1s ease-in-out;
    transform-style: preserve-3d;
    transform-origin: center center;
    overflow: hidden;
  }

  .mainBox.showQR {
    opacity: 1;
    animation:showQR 1.5s ease-in-out 0s 1 normal forwards;
  }

  @keyframes showQR {
    from {
      transform: rotateX(90deg);
    }

    20% {
      opacity: 1;
      transform: rotateX(-30deg);
    }

    40% {
      opacity: 1;
      transform: rotateX(15deg);
    }

    60% {
      opacity: 1;
      transform: rotateX(-10deg);
    }

    80% {
      opacity: 1;
      transform: rotateX(5deg);
    }

    to {
      opacity: 1;
      transform: rotateX(0deg);
    }
  }

  .mainBox.hideQR {
    opacity: 1;
    animation:hideQR 0.5s ease-in-out 0s 1 normal forwards;
  }

  @keyframes hideQR {
    from {
    }

    20%,
    50% {
      transform: scale(1.08, 1.08);
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: rotateZ(40deg) scale(0.6, 0.6);
    }
  }
}
</style>
