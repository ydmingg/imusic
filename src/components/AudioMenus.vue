<script setup lang="ts">
defineProps(["audioList", "loading", "currentSongIndex"])

const id = Math.random()

</script>

<template>
    <div class="audio-box-list">
            <div v-if="loading">loading...</div>
            <div v-else v-for="(item, index) in audioList" :key="id">
                <img :src="item.al.picUrl" width="40" height="40" />
                <p :class="{ select: index === currentSongIndex }">{{ item.al.name }}</p>
                <text>{{ item.al.id }}</text>
            </div>
        </div>
</template>

<style scoped>
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
</style>