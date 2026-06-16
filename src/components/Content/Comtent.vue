<script setup lang="ts">
import AudioMenus from '../AudioMenus.vue';

const playlists = ['热歌榜', '飙升榜', '新歌榜', '经典榜'];

defineProps(["loading", "audioList", "currentSongIndex", "activePlaylist", "errorMessage"]);
const emit = defineEmits(["changePlaylist", "selectSong"]);

const handleUpdateValue = (value: string) => {
    emit('changePlaylist', value);
};
</script>

<template>
    <n-layout position="absolute" style="top: 64px; bottom: 80px; max-width: 1200px; margin:auto;">
        <n-flex size="large" justify="space-between" class="content-wrap">
            <n-tabs
                type="line"
                placement="left"
                :value="activePlaylist"
                :bar-width="210"
                tab-class="tab-con"
                @update:value="handleUpdateValue"
            >
                <n-tab-pane v-for="playlist in playlists" :key="playlist" :name="playlist" :tab="playlist">
                    <n-alert v-if="errorMessage" type="warning" :show-icon="false" style="margin-bottom: 16px;">
                        {{ errorMessage }}
                    </n-alert>
                    <AudioMenus
                        :loading="loading"
                        :audioList="audioList"
                        :currentSongIndex="currentSongIndex"
                        @selectSong="emit('selectSong', $event)"
                    />
                </n-tab-pane>
            </n-tabs>
        </n-flex>
    </n-layout>
</template>

<style scoped>
.content-wrap {
    margin-top: 32px;
    padding: 0 24px;
}

.tab-con {
    gap: 80px;
}
</style>
