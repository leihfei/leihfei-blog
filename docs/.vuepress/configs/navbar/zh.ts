import type {NavbarConfig} from '@vuepress/theme-default'

export const navbarZh: NavbarConfig = [
	{
		text: '首页',
		link: '/',
	},
	{
		text: '算法',
		children: [
			{
				text: '算法基础',
				children: [
					'/algorithm/basic/算法和数据结构入门',
					'/algorithm/basic/递归与分治',
					'/algorithm/basic/快速排序',
					'/algorithm/basic/堆栈',
					'/algorithm/basic/链表',
					'/algorithm/basic/队列',
					'/algorithm/basic/图',
					'/algorithm/basic/贪心算法',
					'/algorithm/basic/位运算',
					'/algorithm/basic/动态规划',
				]
			},
			{
				text: 'interview',
				children: [
					'/algorithm/interview/面试题'
				]
			}
		]
	},
	{
		text: 'Java',
		children: [
			{
				text: 'Java基础',
				children: [
					'/java/base/HashMap',
					'/java/base/ArrayList'
				]
			},
			{
				text: '多线程',
				children: [
					'/java/thread/线程八大核心基础',
					'/java/thread/多线程高级笔记',
				]
			},
			{
				text: '其他',
				children: [
					'/java/other/设计模式'
				]
			}
		]
	},
	{
		text: '中间件',
		children: [
			'/middleware/redis/Redis',
			'/middleware/mysql/Mysql',
		]
	},
]
