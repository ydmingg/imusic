<script setup lang="ts">
import AudioMenus from '../AudioMenus.vue';
import type { SongData } from '../../api/song';

const playlists = ['热歌榜', '飙升榜', '新歌榜', '经典榜', '华语榜'];

defineProps<{
    loading: boolean;
    audioList: SongData[];
    currentSongIndex: number;
    activePlaylist: string;
    errorMessage: string;
    currentSong?: SongData;
}>();

const emit = defineEmits<{
    changePlaylist: [value: string];
    refreshPlaylist: [];
    selectSong: [index: number];
}>();
</script>

<template>
    <section class="content-panel glass-card">
        <div class="playlist-toolbar">
            <div class="playlist-tabs" role="tablist" aria-label="榜单导航">
                <button
                    v-for="playlist in playlists"
                    :key="playlist"
                    class="playlist-tab"
                    :class="{ active: playlist === activePlaylist }"
                    type="button"
                    @click="emit('changePlaylist', playlist)"
                >
                    {{ playlist }}
                </button>
            </div>
            <n-button round secondary type="primary" :loading="loading" @click="emit('refreshPlaylist')">
                刷新歌单
            </n-button>
        </div>

        <n-alert v-if="errorMessage" type="warning" :show-icon="false" class="playlist-alert">
            {{ errorMessage }}
        </n-alert>

        <div class="music-layout">
            <AudioMenus
                class="track-list"
                :loading="loading"
                :audioList="audioList"
                :currentSongIndex="currentSongIndex"
                @selectSong="emit('selectSong', $event)"
            />

            <aside class="now-playing glass-card inner-card">
                <div class="cover-wrap">
                    <img
                        v-if="currentSong"
                        :src="currentSong.picurl"
                        :alt="currentSong.name"
                        class="cover-image"
                    />
                    <div v-else class="cover-placeholder">IMusic</div>
                </div>
                <div class="song-meta">
                    <p class="eyebrow">Now Playing</p>
                    <h2>{{ currentSong?.name ?? '等待播放' }}</h2>
                    <p>{{ currentSong?.artistsname ?? '选择一首歌开始' }}</p>
                    <small v-if="currentSong?.album">{{ currentSong.album }}</small>
                </div>
                <div class="lyrics-card">
                    <p class="eyebrow">歌词</p>
                    <div class="lyrics-lines">
                        <p>{{ currentSong?.name ?? 'IMusic' }}</p>
                        <p>让旋律落在深色玻璃的光影里</p>
                        <p>跟随节拍，切换你喜欢的榜单</p>
                        <p>当前公共 API 暂不提供完整歌词</p>
                        <p>这里会随歌曲展示播放氛围文案</p>
                    </div>
                </div>
            </aside>
        </div>
    </section>
</template>

<style scoped>
.content-panel {
    position: relative;
    z-index: 1;
    width: min(1180px, calc(100vw - 32px));
    margin: 22px auto 110px;
    padding: 20px;
}

.playlist-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
}

.playlist-tabs {
    display: flex;
    flex: 1;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
}

.playlist-tab {
    min-width: 88px;
    padding: 10px 18px;
    color: rgba(255, 255, 255, .76);
    cursor: pointer;
    background: rgba(255, 255, 255, .08);
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 999px;
    transition: all .2s ease;
}

.playlist-tab:hover,
.playlist-tab.active {
    color: #fff;
    background: linear-gradient(135deg, rgba(124, 58, 237, .95), rgba(14, 165, 233, .82));
    box-shadow: 0 14px 36px rgba(124, 58, 237, .28);
    transform: translateY(-1px);
}

.playlist-alert {
    margin-bottom: 16px;
}

.music-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, .8fr);
    gap: 20px;
}

.track-list {
    min-height: 520px;
}

.now-playing {
    position: sticky;
    top: 88px;
    align-self: start;
    padding: 20px;
}

.inner-card {
    background: rgba(255, 255, 255, .08);
}

.cover-wrap {
    overflow: hidden;
    aspect-ratio: 1;
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 28px;
    box-shadow: 0 24px 70px rgba(0, 0, 0, .34);
}

.cover-image,
.cover-placeholder {
    width: 100%;
    height: 100%;
}

.cover-image {
    display: block;
    object-fit: cover;
}

.cover-placeholder {
    display: grid;
    place-items: center;
    color: rgba(255, 255, 255, .72);
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #312e81, #0f172a);
}

.song-meta {
    margin: 18px 0;
    color: #fff;
}

.song-meta h2 {
    margin: 4px 0;
    font-size: 28px;
    font-weight: 800;
    line-height: 1.2;
}

.song-meta p,
.song-meta small,
.lyrics-lines {
    color: rgba(255, 255, 255, .68);
}

.eyebrow {
    color: #a78bfa !important;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .16em;
    text-transform: uppercase;
}

.lyrics-card {
    padding: 18px;
    background: rgba(15, 23, 42, .42);
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 22px;
}

.lyrics-lines {
    max-height: 210px;
    overflow-y: auto;
    margin-top: 10px;
    line-height: 2;
}

@media (max-width: 860px) {
    .content-panel {
        margin-top: 14px;
        padding: 14px;
    }

    .playlist-toolbar,
    .music-layout {
        grid-template-columns: 1fr;
    }

    .playlist-toolbar {
        align-items: stretch;
        flex-direction: column;
    }

    .music-layout {
        display: flex;
        flex-direction: column-reverse;
    }

    .now-playing {
        position: static;
    }
}
</style>
