import React from 'react';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600">
        <div className="relative  block w-64">
          <div className="relative">
            <img
              src="/images/beach-scenes-hood.jpg"
              className="w-64 opacity-50"
            />
          </div>

          <div className="relative -mt-10">
            <p className="text-xs text-gray-300 ml-4 font-light">1920</p>
            <h1 className="font-semibold text-4xl text-white leading-tight mb-4 ml-4">
              A day at the beach
            </h1>
            <p className="mb-4 text-sm text-gray-500 ml-16">
              Two true blue Aussies surfing it up on a you beaut sunny day.
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
