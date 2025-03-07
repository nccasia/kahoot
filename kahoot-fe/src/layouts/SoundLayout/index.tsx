import { AppContext } from "@/providers/ContextProvider/AppProvider";
import AppActions from "@/stores/appStore/appAction";
import { useContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

const SoundLayout = () => {
  const audioBgRef = useRef<HTMLAudioElement>(null);
  const audioCorrectRef = useRef<HTMLAudioElement>(null);
  const audioErrorRef = useRef<HTMLAudioElement>(null);

  const { appState, appDispatch } = useContext(AppContext);
  const [isPlayBgSound, setIsPlayBgSound] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsPlayBgSound(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!audioBgRef.current) return;
    if (!isPlayBgSound) return;
    const playAudio = async () => {
      try {
        if (audioBgRef.current) audioBgRef.current.volume = 0.15;
        await audioBgRef.current?.play();
      } catch (err) {
        console.error("Autoplay failed:", err);
      }
    };
    console.log("isPlayBgSound", isPlayBgSound);
    playAudio();
  }, [isPlayBgSound]);

  useEffect(() => {
    if (!audioCorrectRef.current) return;
    const playAudio = async () => {
      try {
        if (appState.isPlayCorrectSound) {
          await audioCorrectRef.current?.play();

          setTimeout(() => {
            audioCorrectRef.current?.pause();
            if (audioCorrectRef.current) audioCorrectRef.current.currentTime = 0;
            appDispatch(AppActions.changeIsPlayCorrectSound(false));
          }, 2000);
        }
      } catch (err) {
        console.error("Autoplay failed:", err);
      }
    };
    playAudio();
  }, [appDispatch, appState.isPlayCorrectSound]);

  useEffect(() => {
    if (!audioErrorRef.current) return;
    const playAudio = async () => {
      try {
        if (appState.isPlayErrorSound) {
          await audioErrorRef.current?.play();

          setTimeout(() => {
            audioErrorRef.current?.pause();
            if (audioErrorRef.current) audioErrorRef.current.currentTime = 0;
            appDispatch(AppActions.changeIsPlayErrorSound(false));
          }, 2000);
        }
      } catch (err) {
        console.error("Autoplay failed:", err);
      }
    };
    playAudio();
  }, [appDispatch, appState.isPlayErrorSound]);

  return (
    <>
      <Outlet />
      <audio ref={audioBgRef} loop>
        <source src='/audios/bg-sound-4.webm' type='audio/mp3' />
      </audio>
      <audio ref={audioCorrectRef}>
        <source src='/audios/correct-sound.wav' type='audio/mp3' />
      </audio>
      <audio ref={audioErrorRef}>
        <source src='/audios/error-sound.wav' type='audio/mp3' />
      </audio>
    </>
  );
};
export default SoundLayout;
