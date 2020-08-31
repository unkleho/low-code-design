import React from 'react';

import Wrapper from '../components/Wrapper';
import Example from '../components/Example';

export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Example />
        <h1 className="">Demo</h1>
        <p className="">Text</p>
      </div>
    </Wrapper>
  );
}
