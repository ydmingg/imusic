<script setup lang="ts">
// import { data } from './data'
import PlayControl from './components/PlayControl.vue'
import AudioMenus from './components/AudioMenus.vue'
import { ref, onMounted, useTemplateRef, computed, reactive, watch, watchEffect } from 'vue'
const currentSong = ref('')
const currentSongIndex = ref<number>(0)
const isPlay = ref(false)
const audioTag = useTemplateRef<HTMLAudioElement>('audio')
const audioList = ref()
const loading = ref(true)
const sortType = ref('飙升榜'); 
const autoSong = ref(0)
const isLoadingSong = ref(false)


const progressTime = reactive<{
    currentTime: number,
    duration: number,
    progress: number,
}>({
    currentTime: 0, // 当前播放时间
    duration: 0, // 音频总时长
    progress: 0, // 百分比进度（0-100）
})

interface Data {
    artistsname: string,
    picurl: string,
    name: string,
    url: string,
}

// 获取歌曲数据
const resize = async () => {
    if (isLoadingSong.value) return   // 🚀 如果正在加载，就直接忽略
    isLoadingSong.value = true
    try {
        const restserver = await fetch(`/api/api/rand.music?sort=${sortType.value}&format=json`)
        const result = await restserver.json()
        // console.log(result.data);

        if (result?.data?.url) {
            audioList.value = [result.data]
            currentSong.value = result.data.url
        } else { 
            console.log("当前歌曲不存在！！！！！！");
            
            return await resize()
        }

        // 获取歌曲文件
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
        isLoadingSong.value = false
    }
}

watch(autoSong, async () => { 
    if (autoSong.value>=100) { 
        console.log("自动切歌！");
        await resize();
        play();
    }
})

// 初始化加载
onMounted(async () => { 
    await resize()

    
    console.log("初始化");
    
})


let lastClick = 0;
function throttle(fn:Function, delay=1000) { 
    return (...args:any[]) => { 
        const now = Date.now();
        if (now - lastClick > delay) { 
            lastClick = now
            fn(...args)
        }
    }   
}
// 播放
const play = () => {
    if (audioTag.value) {
        audioTag.value.play()
        isPlay.value = true
        
    }
    
}

// 暂停
const stop = () => {
    if (audioTag.value) {
        audioTag.value.pause()
        isPlay.value = false
    }
}

// 播放 & 暂停
const handlePlay = () => {
    if (!isPlay.value) {
        play()
    } else {
        stop()
    }
}

// 上一曲
const handleTopSong = throttle(async () => {
    // if (audioTag.value) {
    //     currentSongIndex.value = currentSongIndex.value === 0 ? audioList.value.length - 1 : currentSongIndex.value - 1
    //     audioTag.value.src = audioList.value[currentSongIndex.value].url
    //     play()
    // }
    await resize()
    play()

})



// 下一曲
const handleNextSong = throttle(async () => {
    // if (audioTag.value) {
    //     currentSongIndex.value = currentSongIndex.value === audioList.value.length - 1 ? 0 : currentSongIndex.value + 1
    //     audioTag.value.src = audioList.value[currentSongIndex.value].url
    //     play()
    // }
    await resize()
    play()
})

// 初始化获取音频时长
function onLoadedMetadata() {
    if (audioTag.value) {
        progressTime.duration = audioTag.value.duration
    }
}

// 播放时更新进度
const onTimeUpdate = () => {
    if (audioTag.value) {
        progressTime.currentTime = audioTag.value.currentTime
        progressTime.progress = (audioTag.value.currentTime / progressTime.duration) * 100 || 0;
        autoSong.value = progressTime.progress
    }
}
// 拖动进度条
const onSeek = (e: Event) => {
    const val = (e.target as HTMLInputElement).value
    progressTime.progress = Number(val)
    play()
    if (audioTag.value) {
        audioTag.value.currentTime = (progressTime.progress / 100) * progressTime.duration
    }
}

</script>

<template>
    <div class="audio-box">
        <audio 
            :src="currentSong" 
            ref="audio" 
            @loadedmetadata="onLoadedMetadata" 
            @timeupdate="onTimeUpdate"
            @ended="handleNextSong" >
        </audio>
        <AudioMenus :loading="loading" :audioList="audioList" :currentSongIndex="currentSongIndex" />
        <PlayControl 
            :progressTime="progressTime" 
            :isPlay="isPlay" 
            @handlePlay="handlePlay" 
            @handleTopSong="handleTopSong" 
            @handleNextSong="handleTopSong"
            @onSeek="onSeek"
        />
    </div>
</template>

<style scoped>
.audio-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: auto;
    margin: 0 auto;
}


</style>