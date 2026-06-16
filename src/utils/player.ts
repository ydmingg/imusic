import { nextTick, ref } from 'vue';
import type { SongData } from '../api/song';

interface ProgressTime {
    currentTime: number;
    duration: number;
    progress: number;
}

export const usePlayer = () => {
    const currentSong = ref('');
    const currentSongIndex = ref(0);
    const isPlay = ref(false);
    const audioList = ref<SongData[]>([]);
    const progressTime = ref<ProgressTime>({
        currentTime: 0,
        duration: 0,
        progress: 0,
    });

    const resetProgress = () => {
        progressTime.value = {
            currentTime: 0,
            duration: 0,
            progress: 0,
        };
    };

    const syncCurrentSong = () => {
        currentSong.value = audioList.value[currentSongIndex.value]?.url ?? '';
        resetProgress();
    };

    const play = async (audioElement: HTMLAudioElement | null) => {
        if (!audioElement || !currentSong.value) {
            return;
        }

        try {
            await audioElement.play();
            isPlay.value = true;
        } catch (error) {
            isPlay.value = false;
            console.error('播放失败：', error);
        }
    };

    const stop = (audioElement: HTMLAudioElement | null) => {
        if (audioElement) {
            audioElement.pause();
        }
        isPlay.value = false;
    };

    const togglePlay = (audioElement: HTMLAudioElement | null) => {
        if (!isPlay.value) {
            void play(audioElement);
        } else {
            stop(audioElement);
        }
    };

    const setPlaylist = (songs: SongData[], startIndex = 0) => {
        audioList.value = songs;
        currentSongIndex.value = Math.min(Math.max(startIndex, 0), Math.max(songs.length - 1, 0));
        syncCurrentSong();
    };

    const playSongAt = async (audioElement: HTMLAudioElement | null, index: number, shouldPlay = true) => {
        if (!audioList.value.length) {
            return;
        }

        currentSongIndex.value = (index + audioList.value.length) % audioList.value.length;
        syncCurrentSong();

        await nextTick();
        audioElement?.load();

        if (shouldPlay) {
            await play(audioElement);
        }
    };

    const prevSong = (audioElement: HTMLAudioElement | null) => {
        return playSongAt(audioElement, currentSongIndex.value - 1, true);
    };

    const nextSong = (audioElement: HTMLAudioElement | null) => {
        return playSongAt(audioElement, currentSongIndex.value + 1, true);
    };

    const updateProgress = (audioElement: HTMLAudioElement | null) => {
        if (audioElement) {
            progressTime.value.currentTime = audioElement.currentTime;
            progressTime.value.duration = Number.isFinite(audioElement.duration) ? audioElement.duration : 0;
            progressTime.value.progress = progressTime.value.duration
                ? (audioElement.currentTime / progressTime.value.duration) * 100
                : 0;
        }
    };

    const seek = (audioElement: HTMLAudioElement | null, progress: number) => {
        if (audioElement && progressTime.value.duration) {
            audioElement.currentTime = (progress / 100) * progressTime.value.duration;
            void play(audioElement);
        }
    };

    return {
        currentSong,
        currentSongIndex,
        isPlay,
        audioList,
        progressTime,
        play,
        stop,
        togglePlay,
        setPlaylist,
        playSongAt,
        prevSong,
        nextSong,
        updateProgress,
        seek,
    };
};
