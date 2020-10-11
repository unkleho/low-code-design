import React from 'react';
import Wrapper from '../components/Wrapper';
import Example from '../components/Example';
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
        <button className="" onClick={handlePlayClick}>
          Play
        </button>
        <div className="block">
          <img src="/images/beach-scenes-hood.jpg" className="relative w-64" />

          <Example />

          {['first', 'second'].map((d) => {
            return <p className="relative">{d}</p>;
          })}

          <div className="">
            <h1 className="text-4xl text-green-300 font-semibold mb-4 bg-red-100 pl-2 w-12">
              This is a title<div className=""></div>
            </h1>
            <p className="mb-4">Description text {counter}</p>
          </div>
          <div className="">
            <h1 className="font-bold">This is another title</h1>
            <p className="bg-gray-200">Description text</p>
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
