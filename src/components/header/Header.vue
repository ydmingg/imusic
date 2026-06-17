<script setup lang="ts">
// import type { MenuOption } from 'naive-ui'
// import type { Component } from 'vue'
// import { ref, h } from "vue";

// import {
//   BookOutline as BookIcon,
//   PersonOutline as PersonIcon,
//   WineOutline as WineIcon
// } from '@vicons/ionicons5'
// import { NIcon } from 'naive-ui'
// const activeKey = ref<string | null>(null)
// const menuOptions: MenuOption[] = [
//     {
//         label: () => {
//             h('a', {
//                 href: 'https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F',
//                 target: '_blank',
//                 rel: 'noopenner noreferrer'
//             },
//                 '且听风吟'
//             )
//         }
//     },
//     {
//         label: '1973年的弹珠玩具',
//         key: 'pinball-1973',
//         children: [
//             {
//                 label: '鼠',
//                 key: 'rat'
//             }
//         ]
//     },

// ]

// 动态获取图片地址
const getImageUrl = (name: string) => {
    return new URL(`/src/assets/${name}`, import.meta.url).href
}

// 跳转github
const handleGithub = () => {
    window.open('https://github.com/ydmingg')
}

</script>

<template>
    <header class="app-header glass-card">
        <n-flex style="height: 100%;" align="center">
            <n-flex style="flex:1">
                <n-image width="32" height="32" :src="getImageUrl('naivelogo-BdDVTUmz.svg')" preview-disabled/>
                <span class="brand-name">IMusic</span>
            </n-flex>
            <n-flex justify="center"></n-flex>
            <!-- <n-grid-item span="0 400:1 600:2 800:3">
                <n-menu
                v-model:value="activeKey"
                mode="horizontal"
                :options="menuOptions"
                responsive
            /> -->
            <!-- </n-grid-item> -->
            
            <n-flex justify="end" style="flex:1">
                <!-- <n-button size="small" quaternary>English</n-button>
                <n-button size="small" quaternary>浅色</n-button> -->
                <n-button size="small" round quaternary @click="handleGithub" color="white">Github</n-button>
                <!-- <n-text size="small" cursor="pointer">登录&注册</n-text> -->
            </n-flex>
        </n-flex>
        
            
            
    </header>
</template>

<style scoped>
.app-header {
    position: sticky;
    top: 16px;
    z-index: 10;
    width: min(1180px, calc(100vw - 32px));
    height: 64px;
    margin: 0 auto 0;
    padding: 0 22px;
}

.brand-name {
    color: #fff;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: .04em;
}
</style>
