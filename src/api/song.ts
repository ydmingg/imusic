import { ref } from 'vue';

interface SongData {
    artistsname: string;
    picurl: string;
    name: string;
    url: string;
}

export const fetchSong = async (sortType: string): Promise<SongData | null> => {
    try {
        const response = await fetch(`/api/api/rand.music?sort=${sortType}&format=json`);
        const result = await response.json();

        if (result?.data?.url) {
            return result.data;
        } else {
            console.error("当前歌曲不存在！");
            return null;
        }
    } catch (error) {
        console.error("获取歌曲失败:", error);
        return null;
    }
};
