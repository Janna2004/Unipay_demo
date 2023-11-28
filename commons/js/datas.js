/* 
	模拟首页用户列表数据
 */

export default {
	Friends :function() {
		return [
			{
				id: 1,
				imgurl: 'avatar1.jpg',
				tip: 2,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息'
			},
			{
				id: 2,
				imgurl: 'avatar2.jpg',
				tip: 2,
				name: '哈哈',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我是我是消息我是消息我是消是消息'
			},
			{
				id: 3,
				imgurl: 'avatar3.jpg',
				tip: 222,
				name: '张三',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我是消息我是消息我是消息'
			},
			{
				id: 4,
				imgurl: 'avatar4.jpg',
				tip: 0,
				name: '李四',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我是消息我是消息我是消息息我是消息'
			},
			{
				id: 5,
				imgurl: 'avatar5.jpg',
				tip: 0,
				name: '二号',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我是消消息我是消息我是消息我是消息'
			},
			{
				id: 6,
				imgurl: 'avatar6.jpg',
				tip: 0,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我'
			},
			{
				id: 7,
				imgurl: 'avatar6.jpg',
				tip: 0,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我'
			},
			{
				id: 8,
				imgurl: 'avatar6.jpg',
				tip: 0,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我'
			},
			{
				id: 9,
				imgurl: 'avatar6.jpg',
				tip: 0,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我'
			},
			{
				id: 10,
				imgurl: 'avatar6.jpg',
				tip: 0,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我'
			},
			{
				id: 11,
				imgurl: 'avatar6.jpg',
				tip: 0,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date(),
				news: '我是消息我'
			},
			
		]
	},
	// 好友关系
	isFriend: function() {
		return [
			{
				userid: 1,	// 本人id
				friend: 1		// 好友id
			},
			{
				userid: 1,
				friend: 5
			},
			{
				userid: 1,
				friend: 6
			},
			{
				userid: 1,
				friend: 8
			},
			{
				userid: 1,
				friend: 5
			},
			
		]
	}
	// 模拟消息数据
	// a-1  b-0
	,Message :function() {
		return [
			{
				id: 'a',
				type: 2,
				imgurl: 'avatar5.jpg',
				tip: 21,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: {
					voice: 'a',
					time:10
				}
			},{
				id: 'a',
				type: 2,
				imgurl: 'avatar5.jpg',
				tip: 20,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: {
					voice: 'a',
					time:10
				}
			},{
				id: 'a',
				type: 2,
				imgurl: 'avatar5.jpg',
				tip: 19,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: {
					voice: 'a',
					time:10
				}
			},{
				id: 'a',
				type: 2,
				imgurl: 'avatar5.jpg',
				tip: 18,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: {
					voice: 'a',
					time:10
				}
			},
			{
				id: 'b',
				type: 2,
				imgurl: 'avatar2.jpg',
				tip: 17,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: {
					voice: 'a',
					time:20
				}
			},
			{
				id: 'b',
				type: 3,
				imgurl: 'avatar3.jpg',
				tip: 16,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: {
					name:'锡广场',
					address: '西街',
					latitude: '39.901951',
					longitude: '116.406403'
				}
			},{
				id: 'a',
				type: 3,
				imgurl: 'avatar1.jpg',
				tip: 15,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: {
					name:'广场',
					address: '西街大概多少过武术规土委阁微观讽德诵功大',
					latitude: '39.901951',
					longitude: '116.406403'
				}
			},
			{
				id: 'a',
				type: 1,
				imgurl: 'avatar1.jpg',
				tip: 14,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: '我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息'
			},{
				id: 'a',
				type: 1,
				imgurl: 'avatar1.jpg',
				tip: 13,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: '我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息'
			},{
				id: 'a',
				type: 1,
				imgurl: 'avatar1.jpg',
				tip: 12,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: '我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息'
			},{
				id: 'a',
				type: 1,
				imgurl: 'avatar1.jpg',
				tip: 11,
				name: '西西',
				email: '1123@qq.com',
				time: new Date(),
				message: '我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息'
			},
			{
				id: 'a',
				type: 1,
				imgurl: 'avatar2.jpg',
				tip: 1,
				name: '哈哈',
				email: '1123@qq.com',
				time: new Date()-1000*16,
				message: '我是消息我是我是消息我是消息我是消是消息'
			},
			{
				id: 'a',
				type: 1,
				imgurl: 'avatar3.jpg',
				tip: 2,
				name: '张三',
				email: '1123@qq.com',
				time: new Date()-1000*60,
				message: '我是消息我是消息我是消息我是消息'
			},
			{
				id: 'b',
				type: 0,
				imgurl: 'avatar4.jpg',
				tip: 3,
				name: '李四',
				email: '1123@qq.com',
				time: new Date()-1000*60*60,
				message: '我是消息我是消息我是消息我是消息息我是消息'
			},
			{
				id: 'a',
				type: 1,
				imgurl: 'avatar5.jpg',
				tip: 4,
				name: '二号',
				email: '1123@qq.com',
				time: new Date()-1000*60*60*24,
				message: '我是消息我是消消息我是消息我是消息我是消息'
			},
			{
				id: 'b',
				type: 0,
				imgurl: 'avatar6.jpg',
				tip: 5,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date()-1000*60*24,
				message: '我是消息我1'
			},
			{
				id: 'b',
				type: 0,
				imgurl: 'avatar6.jpg',
				tip: 6,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date()-1000*60*60*24,
				message: '我是消息我2'
			},
			{
				id: 'b',
				type: 0,
				imgurl: 'avatar6.jpg',
				tip: 7,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date()-1000*60*60*24,
				message: '我是消息我3'
			},
			{
				id: 'b',
				type: 1,
				imgurl: 'avatar6.jpg',
				tip: 8,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date()-1000*60*60*24,
				message: '我是消息我4'
			},
			{
				id: 'b',
				type: 0,
				imgurl: 'avatar6.jpg',
				tip: 9,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date()-1000*60*24,
				message: '我是消息我5'
			},
			{
				id: 'a',
				type: 1,
				imgurl: 'avatar6.jpg',
				tip: 10,
				name: '哥哥',
				email: '1123@qq.com',
				time: new Date()-1000*60*60*24,
				message: '我是消息我6'
			},
			
		]
	},
}