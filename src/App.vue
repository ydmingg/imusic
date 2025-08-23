<script setup lang="ts">
import { ref, onMounted, useTemplateRef, reactive, watch } from 'vue'
const currentSong = ref('')
const currentSongIndex = ref<number>(0)
const isPlay = ref<Boolean>(false)
const audioTag = useTemplateRef<HTMLAudioElement>('audio')
const audioList = ref<Data[]>([])
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
    id: number,
    artist: string,
    cover: string,
    title: string,
    url: string,
}

// 获取歌曲数据
const resize = async () => {
    try {
        const data1 = await fetch('../public/data.json')
        const data = await data1.json()
        audioList.value = data

    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
    }
}

// 初始化加载
onMounted(async () => {
    await resize()
    currentSong.value = audioList.value[currentSongIndex.value].url
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
        <div class="audio-box-list">
            <div v-if="loading">loading...</div>
            <div v-else v-for="(item, index) in audioList" :key="item.id">
                <img :src="item.cover" />
                <p :class="{ select: index === currentSongIndex }">{{ item.title }}</p>
                <text>{{ item.artist }}</text>
            </div>
        </div>
        <div class="audio-box-progress">
            <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                :value="progressTime.progress"
                @input="onSeek"
            />
            <text>{{ Math.floor(progressTime.currentTime) }} / {{ Math.floor(progressTime.duration) }} 秒</text>
        </div>
        <div class="audio-box-button">
            <button @click="handleTopSong">上一曲</button>
            <button @click="handlePlay">{{ isPlay ? '暂停' : '播放' }}</button>
            <button @click="handleNextSong">下一曲</button>
            
        </div>
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

.audio-box-list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    >* {
        flex: 1;

        p {
            font-size: 16px;
            font-weight: bolder;

            &.select {
                color: #0075ff;
            }
        }

        text {
            font-size: 13px;
            color: #888;
        }
    }
}

.audio-box-progress{
    display: flex;
    input{
        flex:1;
        margin-right: 20px;
    }
    text{
        display: flex;
        width: 100px;
        color: #888;
    }
}

.audio-box-button {
    display: flex;
    justify-content: center;

    button {
        margin: 20px 4px;
    }
}
</style>