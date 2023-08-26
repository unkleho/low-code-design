import React from 'react';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex flex-row items-center justify-center min-h-screen bg-pink-600">
        <div className="w-64">
          <p>Hello</p>
        </div>

        <div className="w-64">
          <img src="/images/trumpet-piano.jpg" className="w-60" />

          <h1 className="text-6xl font-semibold leading-none text-white mt-6 uppercase">
            Trumpet and Piano Man
          </h1>
          <p></p>
        </div>
      </div>
    </Wrapper>
  );
}
