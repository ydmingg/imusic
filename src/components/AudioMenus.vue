<script setup lang="ts">
import type { SongData } from '../api/song';

defineProps<{
    audioList: SongData[];
    loading: boolean;
    currentSongIndex: number;
}>();
const emit = defineEmits<{ selectSong: [index: number] }>();
</script>

<template>
    <div class="audio-box-list">
        <template v-if="loading">
            <div v-for="item in 10" :key="item" class="song-skeleton"></div>
        </template>
        <n-empty v-else-if="!audioList.length" description="暂无歌曲" />
        <button
            v-else
            v-for="(item, index) in audioList"
            :key="item.id ?? item.url"
            class="song-item"
            :class="{ select: index === currentSongIndex }"
            type="button"
            @click="emit('selectSong', index)"
        >
            <img class="song-cover" :src="item.picurl" :alt="item.name" />
            <span class="song-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="song-info">
                <strong>{{ item.name }}</strong>
                <small>{{ item.artistsname }}<template v-if="item.album"> · {{ item.album }}</template></small>
            </span>
            <span class="song-action">播放</span>
        </button>
    </div>
</template>

<style scoped>
.audio-box-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: calc(100vh - 260px);
    min-height: 520px;
    overflow-y: auto;
    padding-right: 8px;
}

.audio-box-list::-webkit-scrollbar,
.lyrics-lines::-webkit-scrollbar {
    width: 8px;
}

.audio-box-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, .18);
    border-radius: 999px;
}

.song-skeleton,
.song-item {
    min-height: 76px;
    border-radius: 18px;
}

.song-skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,.08), rgba(255,255,255,.17), rgba(255,255,255,.08));
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite linear;
}

.song-item {
    display: grid;
    grid-template-columns: 54px 44px minmax(0, 1fr) 56px;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    color: rgba(255, 255, 255, .72);
    cursor: pointer;
    text-align: left;
    background: rgba(255, 255, 255, .08);
    border: 1px solid rgba(255, 255, 255, .1);
    transition: border-color .2s, box-shadow .2s, transform .2s, background .2s;
}

.song-item:hover,
.song-item.select {
    color: #fff;
    background: rgba(124, 58, 237, .22);
    border-color: rgba(167, 139, 250, .72);
    box-shadow: 0 16px 40px rgba(2, 6, 23, .28);
    transform: translateY(-1px);
}

.song-cover {
    width: 54px;
    height: 54px;
    object-fit: cover;
    border-radius: 14px;
}

.song-index,
.song-action {
    color: rgba(255, 255, 255, .42);
}

.song-info {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
}

.song-info strong,
.song-info small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.song-info strong {
    font-weight: 800;
}

.song-info small {
    color: rgba(255, 255, 255, .54);
}

.song-item.select .song-index,
.song-item.select .song-action,
.song-item.select strong {
    color: #c4b5fd;
}

@keyframes shimmer {
    to {
        background-position: -200% 0;
    }
}

@media (max-width: 640px) {
    .audio-box-list {
        max-height: none;
        min-height: auto;
        padding-right: 0;
    }

    .song-item {
        grid-template-columns: 48px minmax(0, 1fr) 44px;
    }

    .song-index {
        display: none;
    }
}
</style>
