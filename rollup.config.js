import typescript from 'rollup-plugin-typescript';

export default {
	input: 'src/app.ts',
	output: {
		file: 'dist/app.js', // output a single application bundle
		format: 'iife'
	},
	sourcemap: true,
	plugins: [
		typescript()
	],
	context: 'window'
}