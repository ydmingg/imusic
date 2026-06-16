<script setup lang="ts">
import Header from './components/header/Header.vue';
import PlayControl from './components/footer/PlayControl.vue';
import Content from './components/Content/Comtent.vue';
import { onMounted, ref, useTemplateRef } from 'vue';
import { usePlayer } from './utils/player';
import { fetchSongs } from './api/song';

const audioTag = useTemplateRef<HTMLAudioElement>('audio');
const sortType = ref('热歌榜');
const loading = ref(true);
const errorMessage = ref('');

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
    setPlaylist,
    playSongAt,
} = usePlayer();

const loadPlaylist = async (type = sortType.value) => {
    loading.value = true;
    errorMessage.value = '';
    sortType.value = type;

    try {
        const songs = await fetchSongs(type);
        setPlaylist(songs, 0);
    } catch (error) {
        errorMessage.value = '歌曲清单加载失败，请稍后重试。';
        console.error(error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    void loadPlaylist();
});

const onTimeUpdate = () => {
    updateProgress(audioTag.value);
};

const onSeek = (progress: number) => {
    seek(audioTag.value, progress);
};

const onTogglePlay = () => {
    togglePlay(audioTag.value);
};

const onPrevSong = () => {
    void prevSong(audioTag.value);
};

const onNextSong = () => {
    void nextSong(audioTag.value);
};

const onPlaylistChange = (type: string) => {
    void loadPlaylist(type);
};

const onSongSelect = (index: number) => {
    void playSongAt(audioTag.value, index, true);
};
</script>

<template>
    <n-layout position="absolute">
        <audio
            :src="currentSong"
            ref="audio"
            @loadedmetadata="onTimeUpdate"
            @timeupdate="onTimeUpdate"
            @ended="onNextSong"
        ></audio>
        <Header />
        <Content
            :loading="loading"
            :audioList="audioList"
            :currentSongIndex="currentSongIndex"
            :activePlaylist="sortType"
            :errorMessage="errorMessage"
            @changePlaylist="onPlaylistChange"
            @selectSong="onSongSelect"
        />
        <PlayControl
            :progressTime="progressTime"
            :isPlay="isPlay"
            :loading="loading"
            :audioList="audioList"
            :currentSongIndex="currentSongIndex"
            @handlePlay="onTogglePlay"
            @handleTopSong="onPrevSong"
            @handleNextSong="onNextSong"
            @onSeek="onSeek"
        />
    </n-layout>
</template>
