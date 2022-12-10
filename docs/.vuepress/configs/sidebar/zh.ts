import type {SidebarConfig} from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
	'/algorithm/': [
		{
			text: '算法基础',
			collapsible: true,
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
			collapsible: false,
			children: [
				'/algorithm/interview/面试题'
			]
		}
	],
	'/java/': [
		{
			text: 'Java基础',
			collapsible: true,
			children: [
				'/java/base/HashMap.md',
				'/java/base/ArrayList.md'
			]
		},
		{
			text: '多线程',
			collapsible: true,
			children: [
				'/java/thread/线程八大核心基础.md',
				'/java/thread/多线程高级笔记.md'
			]
		}, {
			text: '其他',
			collapsible: true,
			children: [
				'/java/other/设计模式',
			]
		}
	],
	'/middleware/': [
		{}
	]
}
