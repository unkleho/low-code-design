import React from 'react';
import { RehypeNode, RehypeRootNode } from '../types';

const RehypeRootComponent = ({
  children = [],
}: Pick<RehypeRootNode, 'children'>) => {
  return (
    <>
      {children
        .filter((child) => child.type !== 'comment')
        .map((child, i) => {
          return (
            <RehypeComponent
              type={child.type}
              tagName={child.tagName}
              properties={child.properties}
              value={child.value}
              children={child.children}
              key={i}
            />
          );
        })}
    </>
  );
};

const RehypeComponent = ({
  type,
  tagName,
  properties,
  value,
  children = [],
}: RehypeNode) => {
  if (type === 'comment') {
    return null;
  }

  if (type === 'text') {
    return <>{value}</>;
  }

  return React.createElement(
    tagName,
    {
      ...properties,
      ...(properties?.className
        ? { className: properties.className.join(' ') }
        : {}),
    },
    ...children.map((child, i) => {
      return (
        <RehypeComponent
          type={child.type}
          tagName={child.tagName}
          properties={child.properties}
          value={child.value}
          children={child.children}
          key={i}
        />
      );
    }),
  );
};

export default RehypeRootComponent;
