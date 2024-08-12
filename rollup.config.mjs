import terser from "@rollup/plugin-terser"

export default {
  input: './src/sc-form.js',
  output: [
    {
      format: 'es',
      dir: 'dist',
    },
    {
      file: 'dist/sc-form.min.js',
      format: 'es',
      plugins: [
        terser(),
      ],
    }
  ]
}
