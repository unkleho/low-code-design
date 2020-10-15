import React from 'react';
import Wrapper from '../components/Wrapper'; // import Example from '../components/Example';

import { Instrument, Song, Track } from 'reactronica';
export default function HomePage() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [counter, setCounter] = React.useState(0);

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="block">
          <img
            src="/images/beach-scenes-hood.jpg"
            className="font-bold text-4xl text-gray-700 w-64"
          />

          <div className="">
            <h1 className="font-bold text-4xl text-gray-700">
              This is a title
            </h1>
            <p className="mb-4 text-sm text-gray-700">Description</p>
          </div>
        </div>

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
    </Wrapper>
  );
}
