import { useState } from 'react';
import './VideoEmbed.css';

/**
 * VideoEmbed Block Component
 * Allows embedding videos from YouTube, Vimeo, or direct links
 *
 * Props:
 * - videoUrl: URL of the video (YouTube, Vimeo, or direct link)
 * - title: Optional title for the video
 * - autoplay: Boolean for autoplay (default: false)
 * - editable: Boolean to show edit interface (default: false)
 */
function VideoEmbed({ videoUrl = '', title = '', autoplay = false, editable = false }) {
  const [url, setUrl] = useState(videoUrl);
  const [videoTitle, setVideoTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  // Convert YouTube/Vimeo URLs to embed format
  const getEmbedUrl = (inputUrl) => {
    if (!inputUrl) return '';

    // YouTube
    if (inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be')) {
      const videoId = inputUrl.includes('youtu.be')
        ? inputUrl.split('youtu.be/')[1]?.split('?')[0]
        : new URLSearchParams(new URL(inputUrl).search).get('v');
      return `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;
    }

    // Vimeo
    if (inputUrl.includes('vimeo.com')) {
      const videoId = inputUrl.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}${autoplay ? '?autoplay=1' : ''}`;
    }

    // Direct video link
    return inputUrl;
  };

  const embedUrl = getEmbedUrl(url);
  const isDirect = !url.includes('youtube') && !url.includes('vimeo');

  const handleSave = () => {
    setIsEditing(false);
  };

  if (editable && isEditing) {
    return (
      <div className="video-embed-block editing">
        <div className="video-embed-editor">
          <h3>Video Embed Settings</h3>
          <div className="form-group">
            <label>Video URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube, Vimeo, or direct video URL"
              className="video-url-input"
            />
          </div>
          <div className="form-group">
            <label>Title (Optional)</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter video title"
              className="video-title-input"
            />
          </div>
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-embed-block">
      {videoTitle && <h3 className="video-title">{videoTitle}</h3>}
      <div className="video-container">
        {embedUrl && !isDirect && (
          <iframe
            src={embedUrl}
            title={videoTitle || 'Video Player'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-iframe"
          />
        )}
        {embedUrl && isDirect && (
          <video controls autoPlay={autoplay} className="video-player">
            <source src={embedUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {!embedUrl && (
          <div className="video-placeholder">
            <p>No video URL provided</p>
          </div>
        )}
      </div>
      {editable && (
        <button onClick={() => setIsEditing(true)} className="btn-edit">
          Edit Video
        </button>
      )}
    </div>
  );
}

export default VideoEmbed;
