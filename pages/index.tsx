import React from 'react';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex flex-row items-center justify-center min-h-screen">
        <div className="w-64"></div>

        <div className="w-64">
          <img src="/images/trumpet-piano.jpg" className="w-64" />

          <h1 className="leading-tight">Trumpet</h1>
        </div>
      </div>
    </Wrapper>
  );
}
