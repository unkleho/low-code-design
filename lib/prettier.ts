import prettier from 'prettier';

// TODO: Use options from project's .prettierrc

const newPrettier = {
  format: (code) => {
    return prettier.format(code, {
      parser: 'babel',
      singleQuote: true,    
    });
  },
};

export default newPrettier;