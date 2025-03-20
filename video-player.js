class VideoPlayer {
  constructor(videoId) {
    this.video = document.getElementById(videoId);
    this.wrapper = this.video?.closest('.video-wrapper');
    this.playPauseBtn = this.wrapper?.querySelector('.play-pause');
    this.muteBtn = this.wrapper?.querySelector('.mute');
    this.progressBar = this.wrapper?.querySelector('.progress-bar');
    this.progress = this.wrapper?.querySelector('.progress');
    
    this._volumeTimeout = null;
    this._isLoading = true;
    
    if (!this.video || !this.wrapper) {
      console.warn(`VideoPlayer: Required elements not found for ${videoId}`);
      return;
    }

    this.wrapper.classList.add('loading');
    this.initializePlayer();
  }

  initializePlayer() {
    this.video.addEventListener('loadeddata', () => {
      this.wrapper.classList.remove('loading');
      this.video.volume = 0.5;
    });

    this.video.addEventListener('error', (e) => {
      const error = e.target.error;
      console.error('Video Error:', error?.message || 'Unknown error');
      this.handleError(error);
    });
    this.playPauseBtn?.addEventListener('click', () => this.togglePlay());
    
    this.wrapper.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      }
    });

    this.video.addEventListener('timeupdate', () => this.updateProgress());
    this.progressBar?.addEventListener('click', (e) => this.seek(e));

    this.video.addEventListener('play', () => {
      this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      this.wrapper.setAttribute('aria-label', 'Video is playing');
    });
    
    this.video.addEventListener('pause', () => {
      this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      this.wrapper.setAttribute('aria-label', 'Video is paused');
    });

    this.muteBtn?.addEventListener('click', () => this.toggleMute());
    this.wrapper.addEventListener('wheel', (e) => {
      if (e.target.closest('.mute')) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.adjustVolume(delta);
      }
    }, { passive: false });

    this.muteBtn.setAttribute('title', 'Click to mute/unmute\nScroll to adjust volume');
  }

  adjustVolume(delta) {
    const newVolume = Math.max(0, Math.min(1, this.video.volume + delta));
    this.video.volume = newVolume;
    
    if (this._volumeTimeout) {
      clearTimeout(this._volumeTimeout);
    }
    
    requestAnimationFrame(() => {
      this.updateVolumeIcon();
      this.showVolumeIndicator(Math.round(newVolume * 100));
    });
  }

  updateVolumeIcon() {
    const vol = this.video.volume;
    let icon = 'volume-up';
    
    if (this.video.muted || vol === 0) {
      icon = 'volume-mute';
    } else if (vol < 0.3) {
      icon = 'volume-off';
    } else if (vol < 0.7) {
      icon = 'volume-down';
    }
    
    this.muteBtn.innerHTML = `<i class="fas fa-${icon}"></i>`;
  }

  showVolumeIndicator(volume) {
    let indicator = this.wrapper.querySelector('.volume-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'volume-indicator';
      this.wrapper.appendChild(indicator);
    }

    indicator.textContent = `${volume}%`;
    indicator.style.opacity = '1';
    
    clearTimeout(this.volumeTimeout);
    this.volumeTimeout = setTimeout(() => {
      indicator.style.opacity = '0';
    }, 1500);
  }

  destroy() {
    if (this._volumeTimeout) {
      clearTimeout(this._volumeTimeout);
    }
    this.video?.removeEventListener('error', this.handleError);
    // Add other event listener cleanup
  }

  handleError(error) {
    this.wrapper.classList.remove('loading');
    this.wrapper.classList.add('error');
    console.error('Video playback error:', error);
  }

}

document.addEventListener('DOMContentLoaded', () => {
  try {
    new VideoPlayer('mainVideo');
    new VideoPlayer('background-video');
  } catch (error) {
    console.error('Error initializing video players:', error);
  }
});
