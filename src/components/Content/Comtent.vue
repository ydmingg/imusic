<script setup lang="ts">
import { ref } from 'vue'

const nListItemIndex = ref(0) 
defineProps(["loading", "audioList", "currentSongIndex"])


const dataNList = [
    { title: '热歌榜', src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg', key: '1' },
    { title: '飙升榜', src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg', key: '2' },
]

const handleNListItemSelect = (index: number) => nListItemIndex.value = index;


</script>

<template>
    <n-layout position="absolute" style="top: 64px; bottom: 64px; max-width: 1200px; margin:auto;">
        <n-flex size="large" justify="space-between" style="margin-top: 47px;">
            <n-list class="n-list-aside" style="width: 18.85%;" hoverable clickable show-divider>
                <n-list-item 
                    v-for="(item, index) in dataNList" 
                    :key="item.key"
                    @click="handleNListItemSelect(index)"
                    :class="['n-list-aside-item', { 'active': index === nListItemIndex }]"
                >
                    <n-flex align="center">
                        <n-image width="60" :src="item.src" preview-disabled></n-image>
                        <div>
                            <div style="font-weight: 500;">{{item.title}}</div>
                            <div style="color: #999;">今日更新</div>
                        </div>
                    </n-flex>
                </n-list-item>

            </n-list>
            <div style="width: 76.14%;">
                <AudioMenus :loading="loading" :audioList="audioList" :currentSongIndex="currentSongIndex" />


                
            </div>
        </n-flex>
    </n-layout>
</template>

<style scoped>
.n-list-aside {
    min-width: 210px;
    box-shadow: 0 0 20px 0 rgba(65, 67, 70, .05);
    .n-list-aside-item.active {
        background: #efefef;
    }
}
</style>