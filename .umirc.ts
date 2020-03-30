import path, { resolve } from 'path'
import { defineConfig } from 'umi'
import OfflinePlugin from 'offline-plugin'
import WebpackPwaManifest from 'webpack-pwa-manifest'
import AntDesignThemePlugin from 'antd-theme-webpack-plugin'
import THEME from './src/themes/theme.config'

export default defineConfig({
	antd: {},
	cssnano: {},
	theme: THEME,
	base: '/testool/',
	favicon: 'favicon.ico',
	publicPath: '/testool/',
	dva: { immer: true, hmr: true },
	alias: { R: resolve(__dirname, './') },
	lessLoader: { javascriptEnabled: true },
	links: [ { rel: 'manifest', href: 'manifest.json' } ],
	dynamicImport: { loading: '@/components/Loader/index' },
	locale: { baseNavigator: false, default: 'en-US', antd: true },
	extraBabelPlugins: [
		[
			'import',
			{
				libraryName: 'lodash',
				libraryDirectory: '',
				camel2DashComponentName: false
			}
		]
	],
	chainWebpack (memo) {
		memo.resolve.alias.set(
			'moment$',
			path.resolve(__dirname, 'node_modules/moment/moment.js')
		)
		memo.plugin('antd-theme').use(AntDesignThemePlugin, [ webpack_plugin_antd_theme ])
		memo.plugin('offline-plugin').use(OfflinePlugin, [ webpack_plugin_offline ])
		memo.plugin('webpack-pwa-manifest').use(WebpackPwaManifest, [ webpack_plugin_pwa ])
	}
})

const webpack_plugin_offline: any = {
	safeToUseOptionalCaches: true,
	ServiceWorker: { events: true },
	AppCache: { events: true }
}

const webpack_plugin_pwa: any = {
	name: 'Testool',
	short_name: 'Testool',
	fingerprints: false,
	description: 'A artifact for the test/interview/exam.',
	background_color: '#ffffff',
	theme_color: '#f44336',
	crossorigin: 'use-credentials',
	icons: [
		{
			src: path.resolve(__dirname, 'public/logo.png'),
			sizes: [ 96, 128, 192, 256, 384, 512 ]
		},
		{
			src: path.resolve(__dirname, 'public/logo_white.png'),
			size: '512x512'
		}
	]
}

const webpack_plugin_antd_theme: any = {
	antDir: path.join(__dirname, './node_modules/antd'),
	stylesDir: path.join(__dirname, './src/themes'),
	varFile: path.join(__dirname, './src/themes/skins/default.less'),
	mainLessFile: path.join(__dirname, './src/global.less'),
	themeVariables: [ '@primary-color' ],
	indexFileName: 'index.html',
	generateOnce: false,
	lessUrl: 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js',
	publicPath: '',
	customColorRegexArray: []
}