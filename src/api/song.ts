export interface SongData {
    id: number;
    artistsname: string;
    picurl: string;
    name: string;
    url: string;
    album?: string;
}

interface ITunesTrack {
    trackId?: number;
    artistName?: string;
    trackName?: string;
    collectionName?: string;
    artworkUrl100?: string;
    previewUrl?: string;
}

const SORT_KEYWORDS: Record<string, string> = {
    热歌榜: 'top hits',
    飙升榜: 'new pop',
    新歌榜: 'new music',
    经典榜: 'classic hits',
};

const FALLBACK_SONGS: SongData[] = [
    {
        id: 1,
        name: 'SoundHelix Song 1',
        artistsname: 'SoundHelix',
        album: 'Demo Tracks',
        picurl: 'https://dummyimage.com/300x300/18a058/ffffff.png&text=IMusic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
        id: 2,
        name: 'SoundHelix Song 2',
        artistsname: 'SoundHelix',
        album: 'Demo Tracks',
        picurl: 'https://dummyimage.com/300x300/2080f0/ffffff.png&text=IMusic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
        id: 3,
        name: 'SoundHelix Song 3',
        artistsname: 'SoundHelix',
        album: 'Demo Tracks',
        picurl: 'https://dummyimage.com/300x300/f0a020/ffffff.png&text=IMusic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
];

const normalizeTrack = (track: ITunesTrack, index: number): SongData | null => {
    if (!track.previewUrl || !track.trackName || !track.artistName) {
        return null;
    }

    return {
        id: track.trackId ?? Date.now() + index,
        artistsname: track.artistName,
        picurl: (track.artworkUrl100 ?? '').replace('100x100bb', '300x300bb'),
        name: track.trackName,
        url: track.previewUrl,
        album: track.collectionName,
    };
};

export const fetchSongs = async (sortType: string, limit = 20): Promise<SongData[]> => {
    const term = SORT_KEYWORDS[sortType] ?? sortType;
    const params = new URLSearchParams({
        term,
        media: 'music',
        entity: 'song',
        limit: String(limit),
        country: 'US',
    });

    try {
        const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`iTunes API 响应异常：${response.status}`);
        }

        const result = await response.json() as { results?: ITunesTrack[] };
        const songs = (result.results ?? [])
            .map(normalizeTrack)
            .filter((song): song is SongData => Boolean(song));
        // console.log(songs);
        
        return songs.length > 0 ? songs : FALLBACK_SONGS;
    } catch (error) {
        console.error('获取歌曲清单失败，使用备用歌曲：', error);
        return FALLBACK_SONGS;
    }
};

export const fetchSong = async (sortType: string): Promise<SongData | null> => {
    const songs = await fetchSongs(sortType, 1);
    return songs[0] ?? null;
};
