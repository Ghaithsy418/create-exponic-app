export const npmTemplate = (name) => {
  return {
    name,
    version: '1.0.0',
    type: 'module',
    main: 'dist/app.js',
    scripts: {
      build: 'tsc',
      start: 'node dist/server.ts',
      dev: 'nodemon --exec "node --loader ts-node/esm" src/server.ts',
    },
  };
};
