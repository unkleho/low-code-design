import React from 'react';
import DemoCard from '../components/DemoCard';
import Wrapper from '../components/Wrapper';
export default function HomePage() {
  return (
    <Wrapper>
      <div className="flex items-center justify-center min-h-screen bg-pink-600 text-black">
        <div className="w-64"></div>
        <div className="flex">
          {[
            {
              title: 'Trumpet Pianist',
              description:
                'A very talented man playing trumpet and piano a the same time.',
              year: 1920,
              imageUrl: '/images/trumpet-piano.jpg',
            },
            {
              title: 'Dancing Couple',
              description: 'A happy couple enjoying a dance',
              year: 1940,
              imageUrl: '/images/dancing-raaf.jpg',
            },
          ].map(({ title, description, year, imageUrl }) => {
            return (
              <DemoCard
                key={imageUrl}
                title={title}
                description={description}
                year={year}
                imageUrl={imageUrl}
              />
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}
