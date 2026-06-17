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
    primaryGenreName?: string;
}

interface PlaylistConfig {
    term: string;
    country: string;
    lang?: string;
}

const PLAYLIST_CONFIG: Record<string, PlaylistConfig> = {
    热歌榜: { term: 'top hits', country: 'US' },
    飙升榜: { term: 'new pop', country: 'US' },
    新歌榜: { term: 'new music', country: 'US' },
    经典榜: { term: 'classic hits', country: 'US' },
    华语榜: { term: '华语 流行 国语', country: 'CN', lang: 'zh_cn' },
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

const containsChinese = (value = '') => /[\u4e00-\u9fa5]/.test(value);

const normalizeTrack = (track: ITunesTrack, index: number): SongData | null => {
    if (!track.previewUrl || !track.trackName || !track.artistName) {
        return null;
    }

    return {
        id: track.trackId ?? Date.now() + index,
        artistsname: track.artistName,
        picurl: (track.artworkUrl100 ?? '').replace('100x100bb', '600x600bb'),
        name: track.trackName,
        url: track.previewUrl,
        album: track.collectionName,
    };
};

export const fetchSongs = async (sortType: string, limit = 100): Promise<SongData[]> => {
    const config = PLAYLIST_CONFIG[sortType] ?? { term: sortType, country: 'US' };
    const params = new URLSearchParams({
        term: config.term,
        media: 'music',
        entity: 'song',
        limit: String(limit),
        country: config.country,
    });

    if (config.lang) {
        params.set('lang', config.lang);
    }

    try {
        const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`iTunes API 响应异常：${response.status}`);
        }

        const result = await response.json() as { results?: ITunesTrack[] };
        const normalizedSongs = (result.results ?? [])
            .filter((track) => sortType !== '华语榜' || containsChinese(`${track.trackName}${track.artistName}${track.collectionName}`))
            .map(normalizeTrack)
            .filter((song): song is SongData => Boolean(song));

        return normalizedSongs.length > 0 ? normalizedSongs : FALLBACK_SONGS;
    } catch (error) {
        console.error('获取歌曲清单失败，使用备用歌曲：', error);
        return FALLBACK_SONGS;
    }
};

export const fetchSong = async (sortType: string): Promise<SongData | null> => {
    const songs = await fetchSongs(sortType, 1);
    return songs[0] ?? null;
};
