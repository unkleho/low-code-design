import prettier from 'prettier';

const newPrettier = {
  format: (code) => {
    return prettier.format(code, {
      parser: 'babel',
      singleQuote: true,    
    });
  },
};

export default newPrettier;