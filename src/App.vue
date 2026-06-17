<script setup lang="ts">
import Header from './components/header/Header.vue';
import PlayControl from './components/footer/PlayControl.vue';
import Content from './components/Content/Comtent.vue';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { usePlayer } from './utils/player';
import { fetchSongs } from './api/song';

const audioTag = useTemplateRef<HTMLAudioElement>('audio');
const sortType = ref('热歌榜');
const loading = ref(true);
const errorMessage = ref('');
const volume = ref(70);

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

const currentSongData = computed(() => audioList.value[currentSongIndex.value]);

const loadPlaylist = async (type = sortType.value) => {
    loading.value = true;
    errorMessage.value = '';
    sortType.value = type;

    try {
        const songs = await fetchSongs(type, 100);
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

watch(volume, (value) => {
    if (audioTag.value) {
        audioTag.value.volume = value / 100;
    }
}, { immediate: true });

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

const onRefreshPlaylist = () => {
    void loadPlaylist(sortType.value);
};

const onSongSelect = (index: number) => {
    void playSongAt(audioTag.value, index, true);
};

const onVolumeChange = (value: number) => {
    volume.value = value;
};
</script>

<template>
    <n-config-provider :theme-overrides="{ common: { primaryColor: '#7c3aed', primaryColorHover: '#a78bfa' } }">
        <main class="app-shell">
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
                :currentSong="currentSongData"
                @changePlaylist="onPlaylistChange"
                @refreshPlaylist="onRefreshPlaylist"
                @selectSong="onSongSelect"
            />
            <PlayControl
                :progressTime="progressTime"
                :isPlay="isPlay"
                :loading="loading"
                :audioList="audioList"
                :currentSongIndex="currentSongIndex"
                :volume="volume"
                @handlePlay="onTogglePlay"
                @handleTopSong="onPrevSong"
                @handleNextSong="onNextSong"
                @onSeek="onSeek"
                @onVolumeChange="onVolumeChange"
            />
        </main>
    </n-config-provider>
</template>
