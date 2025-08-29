import { ref } from 'vue';
import { fetchSong } from '../api/song';

interface ProgressTime {
    currentTime: number;
    duration: number;
    progress: number;
}

export const usePlayer = () => {
    const currentSong = ref('');
    const currentSongIndex = ref(0);
    const isPlay = ref(false);
    const audioList = ref<Array<{ url: string }>>([]);
    const progressTime = ref<ProgressTime>({
        currentTime: 0,
        duration: 0,
        progress: 0,
    });

    // 播放
    const play = async (audioElement: HTMLAudioElement | null) => {
        if (audioElement) {
            audioElement.play();
            isPlay.value = true;
            // console.log(currentSong.value);
            
            // if (progressTime.value.duration === 0) { 
            //     const song = await fetchSong(sortType);
            //     if (song) {
            //         currentSong.value = song.url;
            //         audioList.value = [song];
            //         if (audioElement) {
            //             stop(audioElement);
            //             audioElement.src = song.url;
            //             audioElement.load();
            //             audioElement.addEventListener('canplaythrough', () => {
            //                 play(audioElement);
            //             }, { once: true });
            //         }
            //     }
            // }
        }
    };

    // 暂停
    const stop = (audioElement: HTMLAudioElement | null) => {
        if (audioElement) {
            audioElement.pause();
            isPlay.value = false;
        }
    };

    // 切换播放状态
    const togglePlay = (audioElement: HTMLAudioElement | null) => {
        if (!isPlay.value) {
            play(audioElement);
        } else {
            stop(audioElement);
        }
    };

    // 上一首
    const prevSong = async (audioElement: HTMLAudioElement | null, sortType: string) => {
        const song = await fetchSong(sortType);
        if (song) {
            currentSong.value = song.url;
            audioList.value = [song];
            if (audioElement) {
                stop(audioElement);
                audioElement.src = song.url;
                audioElement.load();
                audioElement.addEventListener('canplaythrough', () => {
                    play(audioElement);
                }, { once: true });
            }
        }
    };

    // 下一首
    const nextSong = async (audioElement: HTMLAudioElement | null, sortType: string) => {
        const song = await fetchSong(sortType);
        // song && console.log(progressTime.value.duration);
        if (song && progressTime.value.duration === 0) { 
            console.log("当前歌曲不存在！");
            
        }
        // if (progressTime.value.duration === 0) { 
        //     console.log("当前歌曲不存在！");
            
        //     // nextSong(audioElement, sortType);    
        // }
        if (song) {
            currentSong.value = song.url;
            audioList.value = [song];
            if (audioElement) {
                stop(audioElement);
                audioElement.src = song.url;
                audioElement.load();
                audioElement.addEventListener('canplaythrough', () => {
                    play(audioElement);
                }, { once: true });
            }
        }
    };

    // 更新进度
    const updateProgress = (audioElement: HTMLAudioElement | null) => {
        if (audioElement) {
            progressTime.value.currentTime = audioElement.currentTime;
            progressTime.value.duration = isNaN(audioElement.duration) ? 0 : audioElement.duration;
            progressTime.value.progress = (audioElement.currentTime / progressTime.value.duration) * 100 || 0;
        }
    };

    // 拖动进度条
    const seek = (audioElement: HTMLAudioElement | null, progress: number) => {
        if (audioElement) {
            audioElement.currentTime = (progress / 100) * progressTime.value.duration;
            play(audioElement);
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
        prevSong,
        nextSong,
        updateProgress,
        seek,
    };
};
