<script setup lang="ts">
defineProps(["progressTime", "isPlay"]);
const emit = defineEmits(["onSeek", "handlePlay", "handleTopSong", "handleNextSong"]);
const onSeek = (e: Event) => {
    emit("onSeek", e);
}
const handlePlay = (e: Event) => {
    emit("handlePlay", e);
}
const handleTopSong = (e: Event) => {
    emit("handleTopSong", e);
}
const handleNextSong = (e: Event) => {
    emit("handleNextSong", e);
}

</script>


<template>
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
    

</template>

<style scoped>
.audio-box-progress {
    display: flex;

    input {
        flex: 1;
        margin-right: 20px;
    }

    text {
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

