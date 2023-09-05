import React from 'react';
import CodesignLiveAppWrapper from '../components/CodesignLiveAppWrapper';

import { Instrument, Song, Track } from 'reactronica';
export default function HomePage() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [counter, setCounter] = React.useState(0);

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <CodesignLiveAppWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <button onClick={handlePlayClick}>Play</button>

        {counter}

        <Song isPlaying={isPlaying}>
          <Track
            steps={['D3', null, 'G3', null, 'A3', 'E3']}
            onStepPlay={() => {
              setCounter((counter) => counter + 1);
            }}
          >
            <Instrument type="synth" />
          </Track>
        </Song>
      </div>
    </CodesignLiveAppWrapper>
  );
}
