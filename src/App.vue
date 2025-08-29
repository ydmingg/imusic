<script setup lang="ts">
import Header from './components/header/Header.vue';
import PlayControl from './components/footer/PlayControl.vue';
import AudioMenus from './components/AudioMenus.vue';
import Content from './components/Content/Comtent.vue';
import { ref, onMounted, useTemplateRef, watch } from 'vue';
import { usePlayer } from './utils/player';
import { fetchSong } from './api/song';

const audioTag = useTemplateRef<HTMLAudioElement>('audio');
const sortType = ref('飙升榜');
const loading = ref(true);
const autoSong = ref(0);

const {
    currentSong,
    currentSongIndex,
    isPlay,
    audioList,
    progressTime,
    togglePlay,
    prevSong,
    nextSong,
    updateProgress,
    seek,
} = usePlayer();


// 初始化加载
onMounted(async () => {
    const song = await fetchSong(sortType.value);
    if (song) {
        currentSong.value = song.url;
        audioList.value = [song];
        loading.value = false;
    }
});

watch(autoSong, async () => {
    if (autoSong.value >= 100) {
        console.log("自动切歌！");
        const song = await fetchSong(sortType.value);
        if (song) {
            currentSong.value = song.url;
            audioList.value = [song];
            if (audioTag.value) {
                audioTag.value.play();
            }
        }
    }
});

// 播放时更新进度
const onTimeUpdate = () => {
    updateProgress(audioTag.value);
    autoSong.value = progressTime.value.progress;
};

// 拖动进度条
const onSeek = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    seek(audioTag.value, Number(val));
};

// 检测当前是否在播放，如果当前没有播放，则自动播放下一首
const isAudioURL = () => { 
    if (!isPlay.value && progressTime.value.duration === 0) { 
        nextSong(audioTag.value, sortType.value)
    }
};

// 播放/暂停、上一首、下一首
const onTogglePlay = () => { 
    isAudioURL();
    // 切换歌曲
    togglePlay(audioTag.value)
};
const onPrevSong = () => {
    isAudioURL();
    prevSong(audioTag.value, sortType.value);
}
const onNextSong = () => { 
    nextSong(audioTag.value, sortType.value);
}

</script>

<template>
    <n-layout position="absolute">
        <Header />
        <Content>
            <n-flex style="margin-top: 47px;">
                <n-layout>
                    <!-- 信息 -->
                </n-layout>
                <n-layout >
                    <div class="audio-box">
                        <audio 
                            :src="currentSong" 
                            ref="audio" 
                            @loadedmetadata="onTimeUpdate" 
                            @timeupdate="onTimeUpdate"
                             >
                             <!-- @ended="nextSong" @loadedmetadata="onLoadedMetadata"  -->
                        </audio>
                        <AudioMenus :loading="loading" :audioList="audioList" :currentSongIndex="currentSongIndex" />
                        
                    </div>
                </n-layout>
            </n-flex>
        </Content>
        <PlayControl 
            :progressTime="progressTime" 
            :isPlay="isPlay" 
            :loading="loading" 
            :audioList="audioList"
            @handlePlay="onTogglePlay" 
            @handleTopSong="onPrevSong" 
            @handleNextSong="onNextSong"
            @onSeek="onSeek"
        />
    </n-layout>
</template>

<style scoped>
/* .audio-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: auto;
    margin: 0 auto;
} */

/* .n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
} */

/* .n-layout-content {
  background: rgba(128, 128, 128, 0.4);
} */
</style>

