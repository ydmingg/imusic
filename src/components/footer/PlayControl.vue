<script setup lang="ts">
import {
    PlayCircleOutline as PlayCircleIcon,
    PauseCircleOutline as PauseCircleIcon,
    PlaySkipBackSharp as PlaySharpIcon,
    PlaySkipForward as PlayForwardIcon,
    VolumeMediumOutline as VolumeMediumIcon,
} from '@vicons/ionicons5'
import Progress from '../progress/Progress.vue'

defineProps(["progressTime", "isPlay", "loading", "audioList", "currentSongIndex"]);
const emit = defineEmits(["onSeek", "handlePlay", "handleTopSong", "handleNextSong"]);
const onSeek = (value: number) => emit("onSeek", value)
const handlePlay = () => emit("handlePlay")
const handleTopSong = () => emit("handleTopSong")
const handleNextSong = () => emit("handleNextSong")

</script>


<template>
    <n-layout-footer position="absolute" bordered>
        <n-flex style="height: 100%;" size="large" align="center">
            <n-flex style="flex:1;" align="center">
                <n-image width="80" 
                    v-if="loading"
                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                    preview-disabled
                />  
                <n-image width="80" v-else-if="audioList[currentSongIndex]" :src="audioList[currentSongIndex].picurl" preview-disabled/>    
                <n-flex style="flex:1">
                    <n-flex style="flex:1" justify="space-between">
                        <div v-if="loading" class="">'loading...'</div>
                        <n-flex v-else-if="audioList[currentSongIndex]" align="center"><n-ellipsis style="max-width: 140px">{{ audioList[currentSongIndex].name }}</n-ellipsis> - <n-ellipsis style="max-width: 120px; color:#999">{{ audioList[currentSongIndex].artistsname }}</n-ellipsis></n-flex>
                        <text>{{ Math.floor(progressTime.currentTime) }} / {{ Math.floor(progressTime.duration) }} 秒</text>
                    </n-flex>
                    <n-slider
                        :value="progressTime.progress"
                        :min="0"
                        :max="100"
                        :step="0.1"
                        :tooltip="false"
                        @update:value="onSeek"
                    />
                </n-flex>
                
            </n-flex>
            <n-flex size="large" justify="center" align="center">
                <div @click="handleTopSong" style="cursor: pointer;">
                    <n-icon size="24"><PlaySharpIcon/></n-icon>
                </div>
                <div @click="handlePlay" style="cursor: pointer;">
                    <n-icon v-if="isPlay" size="40"><PauseCircleIcon/></n-icon>
                    <n-icon v-else size="40"><PlayCircleIcon/></n-icon>
                </div>
                <div @click="handleNextSong" style="cursor: pointer;">
                    <n-icon size="24"><PlayForwardIcon/></n-icon>
                </div>
            </n-flex>
            <n-flex justify="end" style="flex:1" >
                <n-flex size="small" align="center">
                    <n-icon size="20"><VolumeMediumIcon/></n-icon>
                    <Progress :percentage="30" :height="3" style="width: 86px;"/>
                </n-flex>

            </n-flex>
        </n-flex>
    </n-layout-footer>
    

</template>

<style scoped>
.n-layout-footer {
    user-select: none;
    height: 80px;
    padding: 0 24px;
}
</style>

