import React from 'react';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex items-center justify-center min-h-screen bg-pink-600">
        <div className="w-64"></div>
        <div className="relative block w-64">
          <div className="relative">
            <img
              src="/images/trumpet-piano.jpg"
              className="relative opacity-75"
            />
          </div>

          <div className="relative -mt-10 ml-4">
            <p className="text-xs text-white">1920</p>
            <h1 className="text-4xl font-semibold leading-tight text-white">
              Trumpet Pianist
            </h1>
            <p></p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
