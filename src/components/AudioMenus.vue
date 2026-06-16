<script setup lang="ts">
defineProps(["audioList", "loading", "currentSongIndex"]);
const emit = defineEmits(["selectSong"]);

const formatIndex = (i: number) => ++i;
</script>

<template>
    <div class="audio-box-list">
        <n-skeleton v-if="loading" text :repeat="8" />
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
            <n-image width="48" height="48" :src="item.picurl" preview-disabled object-fit="cover" />
            <span class="song-index">{{ formatIndex(Number(index)) }}</span>
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
    min-width: 560px;
}

.song-item {
    display: grid;
    grid-template-columns: 48px 44px minmax(0, 1fr) 56px;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    cursor: pointer;
    text-align: left;
    background: #fff;
    border: 1px solid #edf0f2;
    border-radius: 12px;
    transition: border-color .2s, box-shadow .2s, transform .2s;
}

.song-item:hover,
.song-item.select {
    border-color: #18a058;
    box-shadow: 0 8px 24px rgba(24, 160, 88, .12);
    transform: translateY(-1px);
}

.song-index,
.song-action {
    color: #888;
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

.song-info small {
    color: #888;
}

.song-item.select .song-index,
.song-item.select .song-action,
.song-item.select strong {
    color: #18a058;
}
</style>
