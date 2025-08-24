<script setup lang="ts">
// import { data } from './data'
import PlayControl from './components/PlayControl.vue'
import AudioMenus from './components/AudioMenus.vue'
import { ref, onMounted, useTemplateRef, reactive } from 'vue'
const currentSong = ref('')
const currentSongIndex = ref<number>(0)
const isPlay = ref<Boolean>(false)
const audioTag = useTemplateRef<HTMLAudioElement>('audio')
const audioList = ref<any[]>([])
const loading = ref<Boolean>(true)
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
    id: number ,
    artist: string,
    cover: string,
    title: string,
    url: string,
}

// 获取歌曲数据
const resize = async () => {
    try {
        const urlldata = `method=baidu.ting.diy.gedanInfo&platform=darwin&version=11.2.1&listid=309539&from=qianqianmini`
        const urll = `/baiduapi/v1/restserver/ting?${urlldata}`
        
        const data1 = await fetch(urll)
        const data2 = await data1.json()
        // audioList.value = data
        console.log(data2);
        audioList.value = data2.playlist.tracks
        // 获取歌曲文件


    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
    }
}

async function funson(id: number) { 
    
    const sonUrl = `/weapi/weapi/search/get`
    const sonD = await fetch(sonUrl)
    // const sonData = await sonD.json()
    console.log(sonD);
    
    
}

// 初始化加载
onMounted(async () => {
    await resize()
    // 初始化第一首歌曲
    // await funson(audioList.value[0].id)
    // currentSong.value = audioList.value[currentSongIndex.value].url
})

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
const handleTopSong = () => {
    if (audioTag.value) {
        currentSongIndex.value = currentSongIndex.value === 0 ? audioList.value.length - 1 : currentSongIndex.value - 1
        audioTag.value.src = audioList.value[currentSongIndex.value].url
        play()
    }
}

// 下一曲
const handleNextSong = () => {
    if (audioTag.value) {
        currentSongIndex.value = currentSongIndex.value === audioList.value.length - 1 ? 0 : currentSongIndex.value + 1
        audioTag.value.src = audioList.value[currentSongIndex.value].url
        play()
    }
}

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
            @timeupdate="onTimeUpdate">
        </audio>
        <AudioMenus :loading="loading" :audioList="audioList" :currentSongIndex="currentSongIndex" />
        <PlayControl 
            :progressTime="progressTime" 
            :isPlay="isPlay" 
            @handlePlay="handlePlay" 
            @handleTopSong="handleTopSong" 
            @handleNextSong="handleNextSong"
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