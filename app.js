import { API_URL, UPDATE_INTERVAL, HISTORY_LENGTH } from './config.js';

const historyContainer = document.querySelector('.history-container');
const template = document.getElementById('song-template');

const fetchHistory = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        processHistory(data.song_history.slice(0, HISTORY_LENGTH));
    } catch (error) {
        console.error('Error fetching radio data:', error);
    }
};

const processHistory = (songs) => {
    historyContainer.innerHTML = '';
    
    songs.forEach((song, index) => {
        const clone = template.content.cloneNode(true);
        const { artist, title, art } = song.song;
        
        clone.querySelector('.song-number').textContent = index + 1;
        clone.querySelector('.album-art').src = art;
        clone.querySelector('.song-title').textContent = title;
        clone.querySelector('.song-artist').textContent = artist;
        
        const playedAt = new Date(song.played_at * 1000);
        const duration = song.duration;
        const progress = (Date.now() - playedAt) / (duration * 1000) * 100;
        const totalMinutes = Math.round((Date.now() - playedAt) / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeString = hours > 0 ? `hace ${hours}h ${minutes}m` : `hace ${minutes}m`;

        clone.querySelector('.time-progress').style.width = 
            `${Math.min(progress, 100)}%`;
        clone.querySelector('.time-since').textContent = timeString;
        
        historyContainer.appendChild(clone);
    });
};

// Initial load
fetchHistory();
setInterval(fetchHistory, UPDATE_INTERVAL);