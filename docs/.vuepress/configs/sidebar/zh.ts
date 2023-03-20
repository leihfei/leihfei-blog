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
			text: 'Java高级',
			collapsible: true,
			children: [
				'/java/thread/线程八大核心基础.md',
				'/java/thread/多线程高级笔记.md',
				'/java/highlevel/JVM优化.md'
			]
		},
		{
			text: '其他',
			collapsible: true,
			children: [
				'/java/other/设计模式',
			]
		}
	],
	'/middleware/': [
		{
			text: 'Redis',
			collapsible: false,
			children: [
				'/middleware/redis/Redis.md',
				'/middleware/redis/Redis面试题.md'
			]
		},
		{
			text:'Mysql',
			collapsible: false,
			children:[
				'/middleware/mysql/Mysql.md',
				'/middleware/mysql/Mybatis.md',
				'/middleware/mysql/Mysql面试题.md'
			]
		},{
			text:'spring',
			collapsible: false,
			children:[
				'/middleware/spring/spring相关.md',
				'/middleware/spring/spring-boot.md'
			]
		},
	]
}
