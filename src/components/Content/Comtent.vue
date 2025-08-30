<script setup lang="ts">
import { ref } from 'vue'

const nListItemIndex = ref(0)
defineProps(["loading", "audioList", "currentSongIndex"])


const dataNList = [
    { title: '热歌榜', src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg', key: '1' },
    { title: '飙升榜', src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg', key: '2' },
]

const handleNListItemSelect = (index: number) => nListItemIndex.value = index;


const handleBeforeLeave = (tabName: string) => {
    switch (tabName) {
        case 'one':
            console.log('热歌榜');
            return true
        case 'not-allowed':
            // message.error('不许进来')
            console.log('飙升榜');
            
            return true
        case 'wait':
            return new Promise<boolean>((resolve) => {
                // const messageInstance = message.loading('Wait for 1s')

                setTimeout(() => {
                    // messageInstance.destroy()
                    console.log('新哥榜1s后加载');
                    
                    resolve(true)
                }, 1000)
            })
        default:
            return true
    }
}

const handleUpdateValue = (value: string) => {
    // message.info(value)
    console.log(value);
    
}


</script>

<template>
    <n-layout position="absolute" style="top: 64px; bottom: 64px; max-width: 1200px; margin:auto;">
        <n-flex size="large" justify="space-between" style="margin-top: 47px;">
            <n-tabs
                type="line"
                placement="left" 
                default-value="one"
                :bar-width="210"
                tab-class="tab-con"
                @before-leave="handleBeforeLeave"
                @update:value="handleUpdateValue"
            >
                <n-tab-pane name="one" tab="热歌榜">
                    <AudioMenus :loading="loading" :audioList="audioList" :currentSongIndex="currentSongIndex" />
                </n-tab-pane>
                <n-tab-pane name="wait" tab="新哥榜">
                    +1s
                </n-tab-pane>
                <n-tab-pane name="not-allowed" tab="飙升榜">
                    ???
                </n-tab-pane>
                <n-tab-pane name="okay" tab="其他">
                    555555555555可以
                </n-tab-pane>
            </n-tabs>

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
.tab-con{
    gap: 80px;
}
</style>