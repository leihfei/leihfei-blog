import process from 'node:process'
import {nprogressPlugin} from '@vuepress/plugin-nprogress'
import {docsearchPlugin} from '@vuepress/plugin-docsearch'
import {shikiPlugin} from '@vuepress/plugin-shiki'
import {defaultTheme} from '@vuepress/theme-default'


import {head, navbarZh,sidebarZh} from './configs/index.js'

const isProd = process.env.NODE_ENV === 'production'

export default {
	base: '/note',
	title: '雷三岁读书笔记',
	description: '个人读书笔记,相关学习笔记',
	head,
	theme: defaultTheme({
		// 默认主题
		logo: 'images/hero.png',
		docDir: 'docs',
		// 相关配置
		locales: {
			'/': {
				navbar: navbarZh,
				// 侧边栏
				sidebar: sidebarZh,
				// page meta
				editLinkText: '在 GitHub 上编辑此页',
				lastUpdatedText: '上次更新',
				contributorsText: '贡献者',
				// custom containers
				tip: '提示',
				warning: '注意',
				danger: '警告',
				// 404 page
				notFound: [
					'这里什么都没有',
					'我们怎么到这来了？',
					'这是一个 404 页面',
					'看起来我们进入了错误的链接',
				],
				backToHome: '返回首页',
				// a11y
				openInNewWindow: '在新窗口打开',
				toggleColorMode: '切换颜色模式',
				toggleSidebar: '切换侧边栏',
			}
		}
	}),
	plugins: [
		nprogressPlugin(),
		docsearchPlugin({
			apiKey: '<API_KEY>',
			indexName: '<INDEX_NAME>',
		}),
		// only enable shiki plugin in production mode
		isProd ? shikiPlugin({theme: 'dark-plus'}) : [],
	],
}
