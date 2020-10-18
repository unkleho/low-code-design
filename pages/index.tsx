import React from 'react';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600">
        <div className="relative block w-64">
          <div className="relative">
            <img src="/images/trumpet-piano.jpg" className="w-64 opacity-50" />
          </div>

          <div className="relative -mt-10">
            <p className="text-xs text-gray-300 ml-4 font-light">1920</p>
            <h1 className="font-semibold text-4xl text-yellow-300 leading-tight mb-4 ml-4">
              Trumpet Pianist
            </h1>
            <p className="mb-4 text-sm text-gray-300 ml-12 leading-snug">
              A man playing trumpet and piano at the same time. Looks like he is
              having a good time.
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
