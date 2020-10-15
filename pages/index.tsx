import React from 'react';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="relative">
            <img src="/images/beach-scenes-hood.jpg" className="w-64" />
          </div>

          <div className="">
            <h1 className="font-bold text-4xl text-gray-700">
              This is a title
            </h1>
            <p className="mb-4 text-sm text-gray-700">Description</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
