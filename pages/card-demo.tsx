import React from 'react';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative block">
          <div className="relative">
            <img src="/images/trumpet-piano.jpg" className="relative" />
          </div>

          <div className="">
            <p className="">1920</p>
            <h1 className="">Trumpet</h1>
            <p className="bg-red-400"></p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
