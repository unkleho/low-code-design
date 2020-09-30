import React from 'react';
import Wrapper from '../components/Wrapper';
import Example from '../components/Example';
export default function HomePage() {
  return <Wrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="block">
          <Example />

          {['first', 'second'].map(d => {
          return <p className="relative">{d}</p>;
        })}

          <div className="">
            <h1 className="text-6xl text-gray-500 font-semibold mb-4 bg-gray-400 pl-2">This is a title<div></div></h1>
            <p className="mb-4">Description text</p>
          </div>
          <div className="">
            <h1 className="font-bold">This is another title</h1>
            <p className="bg-gray-200">Description text</p>
          </div>
        </div>
      </div>
    </Wrapper>;
}