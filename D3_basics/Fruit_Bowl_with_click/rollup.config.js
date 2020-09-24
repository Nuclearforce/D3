export default {
  input: 'src/scripts/index.js',
  external: ['d3'],
  output: {
    file: 'build/bundle.js',
    format: 'iife',
    sourcemap: true,
    globals: { d3: 'd3' }
  }
};