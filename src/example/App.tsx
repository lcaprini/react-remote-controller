import React, { useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { init, setKeyMap } from '../RemoteControllerService';
import { useRemoteController } from '../useRemoteController';

init({
  debug: true
});

export const AppKeyMap = {
  play: [65, 415],
  pause: [66, 19],
  ok: [13]
};

setKeyMap(AppKeyMap);

const App = (): JSX.Element => {
  const player = useRef<HTMLVideoElement>(null);
  const [listenerOnPause, setListenerOnPause] = useState(false);
  const { pause, resume } = useRemoteController<typeof AppKeyMap>({
    listenTo: {
      play: () => {
        player.current?.play();
      },
      pause: () => {
        player.current?.pause();
      },
      ok: () => {
        startStopListener();
      }
    }
  });

  const startStopListener = useCallback(
    () => {
      if (listenerOnPause) {
        resume();
      }
      else {
        pause();
      }
      setListenerOnPause(!listenerOnPause);
    },
    [listenerOnPause, pause, resume],
  );

  return (
    <div>
      <video autoPlay controls preload="metadata" width={500} ref={player}>
        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4"/>
          Video not supported.
      </video>
      <br/>
      <br/>
      Press `Play` or `Pause` buttons on your TV remote controller to play or pause the video.
      <br/>
      If you&apos;re testing on desktop browser press `A` to play or `B` to pause.
      <br/>
      <br/>
      Press `Enter` or click the button below to stop or resume remote controller listener
      <br/>
      <button onClick={startStopListener}> {listenerOnPause ? 'Resume' : 'Stop'} listener</button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);