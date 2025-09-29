import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { music } from '../redux/slices/musicPlayerSlice';

export default function useLyrics(lineRefs, containerRef) {
  const [currentLineIndex, setCurrentLineIndex] = useState(null);
  const song = useSelector((state) => state.musicPlayer.currentMusic);
  const shouldAutoTrackLyrics = useSelector((state) => state.musicPlayer.autoLyricsTracker);

  useEffect(() => {
    setCurrentLineIndex(null);
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [song.id, containerRef]);

  useEffect(() => {
    if (!song?.lyrics || song?.lyrics.length === 0) return;

    let animationFrameId;

    const updateCurrentLineIndex = () => {
      const currentTime = music.currentTime;
      const index = song.lyrics.findIndex((line, i) => {
        const nextLine = song.lyrics[i + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
      });

      if (index !== -1 && index !== currentLineIndex) {
        setCurrentLineIndex(index);
      }
      animationFrameId = requestAnimationFrame(updateCurrentLineIndex);
    };

    animationFrameId = requestAnimationFrame(updateCurrentLineIndex);

    return () => cancelAnimationFrame(animationFrameId);
  }, [song?.lyrics, currentLineIndex]);

  useEffect(() => {
    if (shouldAutoTrackLyrics) {
      const line = lineRefs.current?.[currentLineIndex];
      const container = containerRef.current;
      if (!line || !container) return;

      // line position related to container
      const linePosition = line.offsetTop - container.offsetTop;
      const containerHeigth = container.clientHeight;
      const lineHeight = line.offsetHeight;

      container.scrollTo({
        top: linePosition - containerHeigth / 2 + lineHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [currentLineIndex, shouldAutoTrackLyrics, containerRef, lineRefs]);

  return { currentLineIndex };
}
