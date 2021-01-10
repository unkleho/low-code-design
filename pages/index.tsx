import React from 'react';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex flex-row items-center justify-center min-h-screen bg-pink-600">
        <div className="w-64"></div>

        <div className="w-64">
          <img src="/images/trumpet-piano.jpg" className="w-56" />

          <h1 className="text-2xl font-extrabold leading-tight text-white mt-4">
            Trumpet and Piano Man
          </h1>
        </div>
      </div>
    </Wrapper>
  );
}
