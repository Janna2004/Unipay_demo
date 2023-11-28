<template>
	<view class="content animate__animated animate__fadeIn animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id='+uid" hover-class="none" class="top-bar-left">
				<image :src="imgurl"></image>
			</navigator>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<i class="iconfont icon-searchsousuo"></i>
				</view>
				<view class="add">
					<i class="iconfont icon-jia"></i>
				</view>
			</view>
		</view>
		
		<!-- 搜索框 -->
		<view class="search-box">
			<input @focus="toSearch" type="text" value="" placeholder="从搜索好友开始..." />
		</view>
		
		<!-- 好友列表 -->
		<view class="main">
			
			<view class="refresh" v-if="refresh">
				<i class='iconfont icon-jiazaizhong3'></i>
				<view class="refresh-title">下拉刷新</view>
			</view>
			
			<view class="apply" v-if="requestData>0" @tap="goReq">
				<view class="friend-list">
					<!-- 头像 -->
					<view class="friend-list-l">
						<view class="tip">{{requestData}}</view>
						<i class="iconfont icon-profile"></i>
						<!-- <image src="../../static/images/img/avatar5.jpg" mode=""></image> -->
					</view>
					<!-- 消息 -->
					<view class="friend-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{changeTime(requestTime)}}</view>
						</view>
						<view class="news">
							您有新的好友：快加老子！！
						</view>
					</view>
				</view>
			</view>
			
			<view class="friends">
				<view class="friend-list"
									 v-for="(item, index) in friends"
									 @tap="toChatRoom(item)"
									 :key="item.id">
					<!-- 头像 -->
					<view class="friend-list-l">
						<view class="tip" v-if="item.tip>0">{{item.tip}}</view>
						<image :src="item.imgurl" mode=""></image>
					</view>
					<!-- 消息 -->
					<view class="friend-list-r">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{changeTime(item.lastTime)}}</view>
						</view>
						<view class="news">
							{{item.msg}}
						</view>
					</view>
				</view>
			</view>
		</view>
	
		<myFootBar :pageIndex="pageIndex"></myFootBar>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfun from '../../commons/js/myfun.js'
	import myFootBar from '@/components/myFootBar.vue'
	
	export default {
		data() {
			return {
				pageIndex: 0,
				friends: [],		// 好友
				groups:[],			// 群
				uid:'',
				imgurl: '',
				token: '',
				refresh: false,
				
				requestData: '', // 好友申请数
				requestTime: '', // 最后申请时间
			}
		},
		components:{myFootBar},
		onLoad() {
			this.getStorages()
			this.getFriends()
			this.friendReq()
			
			this.join(this.uid)	// socket发送-登陆注册消息
			this.receiveSocketMsg()
		},
		onPullDownRefresh() {
			this.friends=[]
			this.getStorages()
			this.getFriends()
			this.friendReq()
			setTimeout(function () {
					uni.stopPullDownRefresh();
			}, 2000);
		},
		methods: {
			// socket模块 
			// 发送-用户登陆注册消息
			join(uid){
				this.socket.emit('login',uid)
			},
			// 接收好友发来的消息-socket
			receiveSocketMsg(){
				this.socket.on('msg', (msg, fromid)=>{
					let nmsg = ''	// 当前消息
					// console.log(msg)
					if(msg.types == 0){
						nmsg = msg.msg
					}else if(msg.types == 1){
						nmsg = '[图片消息]'
					}else if(msg.types == 2){
						nmsg = '[语音消息]'
					}else if(msg.types == 3){
						nmsg = '[分享位置]'
					}
					
					for(let i=0; i<this.friends.length; i++){
						if(this.friends[i].id == fromid) {
							let e = this.friends[i]
							
							e.lastTime = new Date()
							e.msg = nmsg
							e.tip++
							// 删除原数据项
							this.friends.splice(i, 1)	// 插入数组消息
							// 插入最顶部
							this.friends.unshift(e)
						}
					}
					
				})
			},
			
			// 获取最后消息
			getLastMsg(arr, i){
				uni.request({
					url: this.serverUrl+'/index/getlastmsg',
					data:{
						uid: this.uid,	
						fid: arr[i].id,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let res = data.data.result
						// console.log(res, status)
						if(status===200){
							if(res.type === 0){
								// 文字
							}else if(res.type===1){
								res.message = '[图片消息]'
							}else if(res.type === 2){
								res.message = '[语音消息]'
							}else if(res.type === 3){
								res.message = '[分享位置]'
							}
							let e = arr[i]
							e.msg = res.message
							arr.splice(i, 1, e)	// 插入数组消息
							// console.log(res)
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			// 获取消息数
			getUnread(arr, i){
				uni.request({
					url: this.serverUrl+'/index/unreadmsg',
					data:{
						uid: this.uid,	
						fid: arr[i].id,
						// state: 1,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let res = data.data.result
						// console.log(res, status)
						if(status===200){
							
							let e = arr[i]
							e.tip = res
							arr.splice(i, 1, e)	// 插入数组消息
							// console.log(res)
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			// 获取好友列表
			getFriends(){
				uni.request({
					url: this.serverUrl+'/index/getfriend',
					data:{
						uid: this.uid,	// 传参来的id
						state: 0,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						// this.refresh = true
						let status = data.data.status
						let res = data.data.result
						if(status===200){
							if(res.result.length>0){
								for(let i=0; i<res.result.length;i++){
									res.result[i].imgurl = this.serverUrl+ res.result[i].imgurl
									if(res.result[i].markname){
										res.result[i].name = res.result[i].markname
									}
								}
								this.friends = res.result
							}
							this.friends = myfun.mySort(this.friends, 'lastTime', 0)
							for(let i=0;i<this.friends.length; i++){
								this.getLastMsg(this.friends, i)	// 获取最后一条消息
								this.getUnread(this.friends, i)		// 获取未读消息数
								
							}
							uni.stopPullDownRefresh()
							// this.getGroups()	// 群列表
							
							// console.log(this.friends)
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			// 获取群列表
			getGroups(){
				uni.request({
					url: this.serverUrl+'/index/getgroup',
					data:{
						uid: this.uid,	
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let res = data.data.result
						if(status===200){
							// 拼接群列表
							if(res.length>0){
								for(let i=0; i<res.result.length;i++){
									res.result[i].imgurl = this.serverUrl+ res.result[i].imgurl
								}
								this.friends = res.result
								
							}
							// console.log(res)
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			// 好友申请
			friendReq(){
				uni.request({
					url: this.serverUrl+'/index/getfriend',
					data:{
						uid: this.uid,	
						state: 1,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						// this.refresh = true
						let status = data.data.status
						let res = data.data.result
						if(status===200){
							// console.log(res)
							this.requestData = res.length
							
							for(let i=0; i<res.length;i++){
								if(this.requestTime<res[i].lastTime){
									this.requestTime = res[i].lastTime
								}
							}
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			changeTime(date) {
				return myfun.dataTime(date)
			},
			// 获取缓存数据
			getStorages() {
				try{
					const value = uni.getStorageSync('user')
					if(value) {
						this.uid = value.id
						this.imgurl = this.serverUrl+'/'+ value.imgurl
						this.token = value.token
					}else {
						uni.navigateTo({
							url: '../signin/signin',
						})
					}
					
					// console.log(value)
				}catch(e){
					//TODO handle the exception
				}
			},
			// 跳转到聊天界面
			toChatRoom(data){
				uni.navigateTo({
					url:'../chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type
				})
			},	
			// 跳转到申请页
			goReq(){
				uni.navigateTo({
					url:'../friendapply/friendapply'
				})
			},
			// 跳转搜索页
			toSearch() {
				uni.navigateTo({
					url:'../search/search'
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';

	.top-bar {
		background: $uni-color-primary;
		.top-bar-right {
			margin-top: 4rpx;
		}
	}
	/* 搜索框 */
	.search-box {
		width: 90%;
		height: 42rpx;
		padding-top: 104rpx;
		padding-bottom: 16rpx;
		margin: 0 auto;
		
		input {
			padding: 6rpx 0;
			text-align: center;
			border-radius: $uni-border-radius-base;
			background-color: $uni-bg-color-grey;
			box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
		}
	}
	
	/* 好友列表 */
	.main {
		width: 100%;
		padding-top: 8rpx;
		.refresh{
			text-align: center;
			padding-top: 20rpx;
			i{
				font-size: 32rpx;
				color: rgba(39,40,50,0.8);
			}
			.refresh-title{
				padding-top: 10rpx;
				font-size: $uni-font-size-base;
				color: rgba(39,40,50,0.4);
				line-height: 40rpx;
			}
		}
		.apply,
		.friends {
			
			.friend-list {
				height: 96rpx;
				padding: 16rpx  $uni-spacing-col-base;
				&:active {
					background-color: $uni-bg-color-grey;
				}
				.friend-list-l {
					position: relative;
					float: left;
					
					i {
						font-size: 33px;
						border: 1rpx solid $uni-border-color;
						display: inline-block;
						width: 96rpx;
						height: 96rpx;
						line-height: 96rpx;
						text-align: center;
						background-color: $uni-color-primary;
						color: $uni-text-color-grey;
						border-radius: $uni-border-radius-base;
					}
					image {
						width: 96rpx;
						height: 96rpx;
						border-radius: $uni-border-radius-base;
					}
					.tip {
						z-index: 10;
						position: absolute;
						top: -6rpx;
						left: 68rpx;
						padding: 0 6rpx;
						min-width: 22rpx;
						height: 36rpx;
						background: $uni-color-warning;
						border-radius: 18rpx;
						font-size: $uni-font-size-sm;
						color: $uni-text-color-inverse;
						line-height: 36rpx;
						text-align: center;
						box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
					}
				}
				.friend-list-r {
					padding-left: 120rpx;
					.top {
						height: 50rpx;
						.name {
							float: left;
							font-size: 36rpx;
							font-weight: 400;
							color: $uni-text-color;
							line-height: 50rpx;
						}
						.time {
							float: right;
							font-size: $uni-font-size-sm;
							color: $uni-text-color-disable;
							line-height: 50rpx;
						}
					}
					.news {
						font-size: $uni-font-size-base;
						color: $uni-text-color-grey;
						line-height: 40rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1; // 一行溢出则省略号
						overflow: hidden;
					}
				}
			}
		}
	}
	
</style>
