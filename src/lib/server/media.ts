import { env } from '$env/dynamic/private';

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

interface MediaImage {
    url: string;
    alt: string;
    credit: string;
    downloadLink?: string; // Trigger attribution
}

interface MediaVideo {
    videoId: string;
    title: string;
}

export async function getUnsplashImage(query: string): Promise<MediaImage | null> {
    const key = env.UNSPLASH_ACCESS_KEY;
    if (!key) {
        console.warn('Missing UNSPLASH_ACCESS_KEY');
        return null;
    }

    try {
        const res = await fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
            headers: {
                Authorization: `Client-ID ${key}`
            }
        });

        if (!res.ok) {
            console.error('Unsplash API error:', res.status, await res.text());
            return null;
        }

        const data = await res.json();
        const photo = data.results?.[0];

        if (!photo) return null;

        return {
            url: photo.urls.regular,
            alt: photo.alt_description || query,
            credit: `Photo by [${photo.user.name}](${photo.user.links.html}?utm_source=make-it-pop&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=make-it-pop&utm_medium=referral)`,
            downloadLink: photo.links.download_location
        };

    } catch (e) {
        console.error('Unsplash fetch failed:', e);
        return null;
    }
}

export async function getYouTubeVideo(query: string): Promise<MediaVideo | null> {
    const key = env.YOUTUBE_API_KEY;
    if (!key) {
        console.warn('Missing YOUTUBE_API_KEY');
        return null; // Silent fail, just ignore video
    }

    try {
        const res = await fetch(`${YOUTUBE_API_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${key}`);

        if (!res.ok) {
            console.error('YouTube API error:', res.status, await res.text());
            return null;
        }

        const data = await res.json();
        const item = data.items?.[0];

        if (!item) return null;

        return {
            videoId: item.id.videoId,
            title: item.snippet.title
        };

    } catch (e) {
        console.error('YouTube fetch failed:', e);
        return null;
    }
}
