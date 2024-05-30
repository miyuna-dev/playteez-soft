let player;
let playPauseIcon = document.getElementById('playPauseIcon');
let shuffleBtn = document.getElementById('shuffleBtn');
let loopBtn = document.getElementById('loopBtn');
let currentTimeElement = document.getElementById('current-time');
let totalTimeElement = document.getElementById('total-time');
let currentIndex = 0;
let isShuffleOn = false;
let loopMode = 'none'; // 'none', 'all', 'one'

const videos = [
    { id: 'Wk4Os95Jx5M', start: 3 }, // narpy - cherry blossoms
    { id: 'cX_cEXDIrvk', start: 0 }, // lee - i need a girl
    { id: '7z4mcZnQaoQ', start: 0 }, // lee - moon
    { id: 'XAo7aEb6ZAk', start: 0 }, // ikigai - kudasai when i see you
    { id: 'DFVuYoDVS_g', start: 0 }, // lee - dreaming
    { id: 'nXKDQflDgTo', start: 0 }  // dontcry x glimlip - jiro dreams
];

let playlist = [...videos]; // Copy the videos array

function loadYouTubeIframeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('player', {
        height: '150',
        width: '300',
        videoId: playlist[currentIndex].id,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'start': playlist[currentIndex].start,
            'cc_load_policy': 0,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    setInterval(updateProgressBar, 1000);

    document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
    document.getElementById('prevBtn').addEventListener('click', prevVideo);
    document.getElementById('nextBtn').addEventListener('click', nextVideo);
    document.getElementById('shuffleBtn').addEventListener('click', toggleShuffle);
    document.getElementById('loopBtn').addEventListener('click', toggleLoop);

    updateLoopModeDisplay();
    updateShuffleModeDisplay();
    playVideoAtIndex(currentIndex);
}

function togglePlayPause() {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    } else {
        player.playVideo();
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    }
}

function toggleShuffle() {
    isShuffleOn = !isShuffleOn;
    updateShuffleModeDisplay();
    if (isShuffleOn) {
        shufflePlaylist();
    } else {
        playlist = [...videos]; // Reset to the original playlist order
        currentIndex = 0; // Reset currentIndex to 0 when shuffle is turned off
    }
    console.log('Shuffle mode:', isShuffleOn, 'Playlist:', playlist); // Debugging
}

function updateShuffleModeDisplay() {
    shuffleBtn.classList.toggle('active', isShuffleOn);
    document.getElementById('shuffleIndicator').style.display = isShuffleOn ? 'inline' : 'none';
}

function toggleLoop() {
    switch (loopMode) {
        case 'none':
            loopMode = 'all';
            break;
        case 'all':
            loopMode = 'one';
            break;
        case 'one':
            loopMode = 'none';
            break;
    }
    updateLoopModeDisplay();
}

function updateLoopModeDisplay() {
    loopBtn.classList.toggle('loop-all', loopMode === 'all');
    loopBtn.classList.toggle('loop-one', loopMode === 'one');
    loopIndicator.className = ''; // Clear any existing classes

    if (loopMode === 'all') {
        loopIndicator.classList.add('fas', 'fa-arrows-rotate');
        loopIndicator.innerHTML = ''; // Clear any innerHTML
    } else if (loopMode === 'one') {
        loopIndicator.classList.add('fas', 'fa-1');
        loopIndicator.innerHTML = '';
    } else {
        loopIndicator.style.display = 'none';
    }

    loopIndicator.style.display = loopMode !== 'none' ? 'inline' : 'none';
}

function shufflePlaylist() {
    let currentVideo = playlist[currentIndex];
    playlist = videos.slice();
    for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
    }
    currentIndex = playlist.indexOf(currentVideo); // Keep the current video at the same index
    console.log('Shuffled Playlist:', playlist); // Debugging
}

function updateProgressBar() {
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    const progress = (currentTime / duration) * 100;
    document.getElementById('progress-bar-fill').style.width = progress + '%';

    document.getElementById('current-time').textContent = formatTime(currentTime);
    document.getElementById('total-time').textContent = formatTime(duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsPart = Math.floor(seconds % 60);
    return `${minutes}:${secondsPart < 10 ? '0' : ''}${secondsPart}`;
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        handleVideoEnd();
    }
}

function handleVideoEnd() {
    switch (loopMode) {
        case 'none':
            nextVideo();
            break;
        case 'all':
            nextVideo();
            break;
        case 'one':
            playVideoAtIndex(currentIndex);
            break;
    }
}

function nextVideo() {
    currentIndex++;
    if (currentIndex >= playlist.length) {
        currentIndex = 0;
    }
    playVideoAtIndex(currentIndex);
}

function prevVideo() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = playlist.length - 1;
    }
    playVideoAtIndex(currentIndex);
}

function playVideoAtIndex(index) {
    player.loadVideoById(playlist[index].id, playlist[index].start);
    console.log('Playing video at index:', index, 'Video ID:', playlist[index].id); // Debugging
}

loadYouTubeIframeAPI();
