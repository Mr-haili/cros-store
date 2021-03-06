const webpack = require('webpack');
const path = require('path');
var TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */
// TODO 我们需要编译出一个?
module.exports = {
	entry: {
		'main': path.resolve(__dirname, "lib/main"),
		'test/client': path.resolve(__dirname, "test/src/test-client"),
		'test/server': path.resolve(__dirname, "test/src/test-server")
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'easy-local-store'
	},
	resolve: {
		extensions: ['.js', '.ts', '.json'],
		plugins: [
      new TsConfigPathsPlugin()
    ]
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			options: {
				presets: ['env']
			}
		}, {
			test: /\.tsx?$/,
			use: [
				// { // 暂时注释掉就可以鸟
				// loader:'babel-loader',
				// options: {
				// 	presets: ['env']
				// }
			// },
			{
				loader: 'ts-loader'
			}],
			exclude: /node_modules/
		}]
	},
	// devServer: {
  //   contentBase: path.resolve(__dirname, 'dev'),
  //   publicPath: '/',
  //   historyApiFallback: true,
  //   proxy: {
  //     // 请求到 '/device' 下 的请求都会被代理到 target： http://debug.xxx.com 中
  //     '/device/*': { 
  //       target: 'http://debug.xxx.com',
  //       secure: false, // 接受 运行在 https 上的服务
  //       changeOrigin: true
  //     }
  //   }
  // }
	plugins: [new UglifyJSPlugin()],
	optimization: {
		minimize: true
	}
};
