<script setup lang="ts">
import {
    PlayCircleOutline as PlayCircleIcon,
    PauseCircleOutline as PauseCircleIcon,
    PlaySkipBackSharp as PlaySharpIcon,
    PlaySkipForward as PlayForwardIcon,
    VolumeMediumOutline as VolumeMediumIcon,
} from '@vicons/ionicons5'
import type { SongData } from '../../api/song';

defineProps<{
    progressTime: { currentTime: number; duration: number; progress: number };
    isPlay: boolean;
    loading: boolean;
    audioList: SongData[];
    currentSongIndex: number;
    volume: number;
}>();
const emit = defineEmits<{
    onSeek: [value: number];
    onVolumeChange: [value: number];
    handlePlay: [];
    handleTopSong: [];
    handleNextSong: [];
}>();
const onSeek = (value: number) => emit("onSeek", value)
const onVolumeChange = (value: number) => emit("onVolumeChange", value)
const handlePlay = () => emit("handlePlay")
const handleTopSong = () => emit("handleTopSong")
const handleNextSong = () => emit("handleNextSong")
</script>

<template>
    <footer class="play-footer glass-card">
        <div class="track-mini">
            <img
                v-if="!loading && audioList[currentSongIndex]"
                class="mini-cover"
                :src="audioList[currentSongIndex].picurl"
                :alt="audioList[currentSongIndex].name"
            />
            <div v-else class="mini-cover placeholder"></div>
            <div class="mini-meta">
                <div v-if="loading">loading...</div>
                <template v-else-if="audioList[currentSongIndex]">
                    <strong>{{ audioList[currentSongIndex].name }}</strong>
                    <small>{{ audioList[currentSongIndex].artistsname }}</small>
                </template>
                <span>{{ Math.floor(progressTime.currentTime) }} / {{ Math.floor(progressTime.duration) }} 秒</span>
            </div>
        </div>

        <div class="player-center">
            <div class="player-buttons">
                <button @click="handleTopSong" type="button" aria-label="上一首">
                    <n-icon size="24"><PlaySharpIcon/></n-icon>
                </button>
                <button class="play-button" @click="handlePlay" type="button" aria-label="播放暂停">
                    <n-icon v-if="isPlay" size="40"><PauseCircleIcon/></n-icon>
                    <n-icon v-else size="40"><PlayCircleIcon/></n-icon>
                </button>
                <button @click="handleNextSong" type="button" aria-label="下一首">
                    <n-icon size="24"><PlayForwardIcon/></n-icon>
                </button>
            </div>
            <n-slider
                class="progress-slider"
                :value="progressTime.progress"
                :min="0"
                :max="100"
                :step="0.1"
                :tooltip="false"
                @update:value="onSeek"
            />
        </div>

        <div class="volume-control">
            <n-icon size="20"><VolumeMediumIcon/></n-icon>
            <n-slider
                class="volume-slider"
                :value="volume"
                :min="0"
                :max="100"
                :step="1"
                :tooltip="false"
                @update:value="onVolumeChange"
            />
            <span>{{ volume }}%</span>
        </div>
    </footer>
</template>

<style scoped>
.play-footer {
    position: fixed;
    right: 24px;
    bottom: 18px;
    left: 24px;
    z-index: 5;
    display: grid;
    grid-template-columns: minmax(220px, 1fr) minmax(280px, 1.2fr) minmax(180px, 1fr);
    gap: 18px;
    align-items: center;
    min-height: 88px;
    padding: 14px 18px;
}

.track-mini,
.volume-control,
.player-center,
.player-buttons {
    display: flex;
    align-items: center;
}

.track-mini {
    min-width: 0;
    gap: 12px;
}

.mini-cover {
    width: 58px;
    height: 58px;
    object-fit: cover;
    border-radius: 18px;
}

.placeholder {
    background: linear-gradient(135deg, #312e81, #0f172a);
}

.mini-meta {
    display: flex;
    min-width: 0;
    flex-direction: column;
    color: rgba(255, 255, 255, .58);
}

.mini-meta strong,
.mini-meta small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mini-meta strong {
    color: #fff;
    font-weight: 800;
}

.player-center {
    flex-direction: column;
    gap: 8px;
}

.player-buttons {
    gap: 14px;
    justify-content: center;
}

.player-buttons button {
    display: grid;
    width: 42px;
    height: 42px;
    color: #fff;
    cursor: pointer;
    place-items: center;
    background: rgba(255, 255, 255, .1);
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 999px;
}

.player-buttons .play-button {
    width: 54px;
    height: 54px;
    background: linear-gradient(135deg, #7c3aed, #0ea5e9);
}

.progress-slider {
    width: 100%;
}

.volume-control {
    justify-content: flex-end;
    gap: 10px;
    color: rgba(255, 255, 255, .72);
}

.volume-slider {
    width: 128px;
}

@media (max-width: 860px) {
    .play-footer {
        right: 12px;
        bottom: 10px;
        left: 12px;
        grid-template-columns: 1fr;
    }

    .volume-control {
        justify-content: center;
    }
}
</style>
