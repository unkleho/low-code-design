import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { parse } from '@babel/parser';

const LivePage = () => {
  return (
    <div
      onClick={(event) => {
        console.log(event._targetInst);
      }}
    >
      <LiveProvider
        code={'<strong className="uppercase">Hello World!</strong>'}
        transformCode={(code) => {
          const test = parse(code, {
            plugins: ['jsx'],
          });
          // console.log(test);
          // return code.replace('data', '');
          return code;
        }}
      >
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
    </div>
  );
};

export default LivePage;
