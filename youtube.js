(() => {
    const apiKey = window.YOUTUBE_API_KEY;
    const handle = "@JagstersRealmYT";
    const player = document.querySelector("#latest-video-player");
    const status = document.querySelector("#video-status");

    if (!apiKey || !player || !status) return;

    async function getLatestVideo() {
        try {
            const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
            channelUrl.search = new URLSearchParams({ part: "contentDetails", forHandle: handle, key: apiKey });
            const channelResponse = await fetch(channelUrl);
            if (!channelResponse.ok) throw new Error("Channel request failed");
            const channelData = await channelResponse.json();
            const uploadsPlaylist = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
            if (!uploadsPlaylist) throw new Error("Uploads playlist not found");

            const uploadsUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
            uploadsUrl.search = new URLSearchParams({ part: "snippet,contentDetails", playlistId: uploadsPlaylist, maxResults: "1", key: apiKey });
            const uploadsResponse = await fetch(uploadsUrl);
            if (!uploadsResponse.ok) throw new Error("Uploads request failed");
            const latest = (await uploadsResponse.json()).items?.[0];
            const videoId = latest?.contentDetails?.videoId;
            if (!videoId) throw new Error("No public upload found");

            player.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
            status.textContent = `Now showing: ${latest.snippet.title}`;
        } catch {
            status.textContent = "Showing the featured video. The latest upload could not be loaded right now.";
        }
    }

    getLatestVideo();
})();
