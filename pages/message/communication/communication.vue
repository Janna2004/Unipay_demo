<template>
	<view class="contents animate__animated animate__fadeInRightBig animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<view @click="backOnePage" class="top-bar-left">
				<i class="iconfont icon-xiazai6"></i>
			</view>
			<view class="top-bar-center">
				<view class="title">{{fname}}</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
				<view class="group-img" v-if="type===1">
					<image :src="fimgurl"></image>
				</view>
			</view>
		</view>
		
		<!-- main -->
		<scroll-view class="chat" 
								 :scroll-with-animation="scrollAnimation" 
								 scroll-y="true" 
								 :scroll-into-view="scrollToView"
								 @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<!-- 加载中 -->
				<view :animation="animationData1"
							class="loading"
							:class="{displaynone:isloading}">
					<i class="iconfont icon-jiazaizhong8"></i>
				</view>
				
				<view class="chat-ls" 
						  v-for="(item, index) in msgs" 
							:key='index'
							:id="'msg'+item.id">
					
					<view v-if="item.time !== ''" class="chat-time">{{changeTime(item.time)}}</view>
					
					<!-- 好友消息 -->
					<view class="msg-m msg-left" v-if="item.fromId !== uid">
						<navigator :url="'../../../static/logo.png'">
							<image class="user-img" :src="item.imgurl" mode=""></image>
						</navigator>
						<!-- 图像消息 -->
						<view v-if="item.types == 1" class="message">
							<image @tap="previewImg(item.message)" class="msg-img" :src="item.message" mode="widthFix"></image>
						</view>
						<!-- 文字消息 -->
						<view v-if="item.types == 0" class="message animate__animated animate__fadeIn animate__faster">
							<view  class="msg-text">{{item.message}}</view>
						</view>

						<!-- 音频消息 -->
						<view v-if="item.types==2" class="message">
							<view @tap="playVoice(item.message.voice)" class="msg-text voice" :style="{width:item.message.time*3.5+'px'}">
								<i class="iconfont icon-yuyin1" :class="{'isActive':isPlay}"></i>
								<span>{{item.message.time}}″</span>
							</view>
						</view>
						<!-- 位置消息 -->
						<view v-if="item.types==3" class="message">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-addr">{{item.message.address}}</view>
								<map class="map" 
										 :markers="covers(item.message)"
										 :latitude="item.message.latitude" 
										 :longitude="item.message.longitude"></map>
							</view>
						</view>
					</view>
					
					<!-- 本人消息 -->
					<view class="msg-m msg-right" v-if="item.fromId === uid">
						<navigator :url="'../userhome/userhome?id='+uid">
							<image class="user-img" :src="item.imgurl" mode=""></image>
						</navigator>
						
						<!-- 图片消息 -->
						
						<view v-if="item.types == 1" class="message animate__animated animate__fadeIn animate__faster">
							<image @tap="previewImg(item.message)" class="msg-img" :src="item.message" mode="widthFix"></image>
						</view>
						
						<view v-if="item.types == 0" class="message">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<!-- 音频消息 -->
						<view v-if="item.types==2" class="message">
							<view  @tap="playVoice(item.message.voice)" class="msg-text voice" :style="{width:item.message.time*3.5+'px'}">
								<i class="iconfont icon-yuyin1" :class="{'isActive':isPlay}"></i>
								<span>{{item.message.time}}″</span>
							</view>
						</view>
						<!-- 位置消息 -->
						<view v-if="item.types==3" class="message">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-addr">{{item.message.address}}</view>
								<map class="map" 
										 :markers="covers(item.message)"
										 :latitude="item.message.latitude" 
										 :longitude="item.message.longitude"></map>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<submit @inputs='inputs' @heights="heights"></submit>
	</view>
</template>

<script>
	import submit from './submit.vue'
	import datas from '../../../commons/js/datas.js'
	import myfun from '../../../commons/js/myfun.js'
	
	export default {
		data() {
			return {
				msgs: [
					{
						id: 'a',
						fromId:'a',
						types: 0,
						imgurl: '../../../static/logo.png',
						tip: 13,
						name: '西西',
						email: '1123@qq.com',
						time: new Date(),
						message: '我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息'
					},{
						id: 'a',
						fromId:'a',
						types: 0,
						imgurl: '../../../static/logo.png',
						tip: 12,
						name: '西西',
						email: '1123@qq.com',
						time: new Date(),
						message: '我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息'
					},
					{
						id: '',
						fromId:'a',
						types: 0,
						imgurl: '../../../static/logo.png',
						tip: 9,
						name: '哥哥',
						email: '1123@qq.com',
						time: new Date()-1000*60*24,
						message: '我是消息我5'
					},
					{
						id: 'a',
						fromId:'a',
						types: 2,
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
						fromId:'a',
						types: 2,
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
						fromId:'a',
						types: 2,
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
						fromId:'a',
						types: 2,
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
						fromId:'a',
						types: 2,
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
						fromId:'a',
						types: 3,
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
					},
				],//所有的消息队列

				
				oldTime: 0,
				scrollToView: '',
				inputh: '60',
				isPlay: false,
				animationData1: {},
				animation: {},
				
				loading: '',
				isloading: true,
				scrollAnimation: true,
				beginLoading: true,
				
				uid: '',	// 缓存数据
				uimgurl: '',//用户头像
				token: '',
				uname: '',
				
				fid: '',	// 路由参数
				fname: '',
				type: '',	// 1:群、2：好友
				fimgurl: '',
				
				pageSize: 10, // 每页消息数
				nowPage: 0,
			};
		},
		components:{
			submit
		},
		onLoad(e) {
			this.fid = e.id
			this.fname = e.name
			this.type = e.type	// 私聊/群聊
			this.fimgurl = e.img

			// this.nextPage()
		
		},
		methods:{
			// 获取缓存数据
			getStorages() {
				
			},
			// 获取聊天数据
			getMsg () {
				

			},
			
			// 下拉刷新
			nextPage () {
				if(this.nowPage>0 && this.beginLoading){
					this.loading = false	// loading图标显示
					this.beginLoading = false // 禁止重复加载
					
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'ease',
					})
			
					this.animation = animation
					this.animationData1 = animation.export()
					let i=1
					this.loading=setInterval(function() {
						animation.rotate(i*20).step()
						this.animationData1 = animation.export()
						i++
						// 下拉加载
						this.getMsg(this.nowPage)
						
						
					}.bind(this), 60)
				}
				
			},
			// 地图位置标点
			covers(e){
				return [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/pos.png'
				}]
				
			},
			// 点击地图
			openLocation(e) {
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name: e.name,
					address:e.address,
					success: function () {
						console.log('success');
					}
				});
			},
			// 处理时间
			changeTime(date){
				return myfun.dataTime1(date)
			},
			// 预览图片
			previewImg(e){
				
			},
			// 接收输入框内容
			inputs(e) {
				this.receiveMsg(e, this.uid, this.uimgurl, 0)
				
				this.ToBottom()
			}	,
			// 接收输入框消息
			receiveMsg(e, id, img, tip) {
				// tip:0自己发送， 1 好友发的
				
	
				if(e.types === 1) {	// 发送-图片消息
					this.msgImgArr.push(e.msg)
					// 提交图片
					let url = myfun.fileName(new Date())	// 当天的文件夹名
					
				if(e.types === 2) {	// 发送-音频消息
					
				}
				}
				// console.log(e)
				this.scrollAnimation = true
				// 时间间隔处理
				let nowTime = new Date()
				let t=myfun.spacTime(this.oldTime, nowTime)
				if(t) {
					this.oldTime = t
				}
				
				nowTime = t
				if(e.types == 3){
					e.msg = JSON.parse(e.msg)
				}
				let newMsg = {
							fromId: id,
							types: e.types,
							imgurl: img,
							id: this.msgs.length,
							time: nowTime,
							message: e.msg
				}
				this.msgs.push(newMsg)

			}	,
			// 聊天数据发送到后端-socket
			sendSocket(e){

			},
			// 接收好友发来的消息-socket
			
			// 播放音频
			playVoice(e){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = e
				innerAudioContext.onPlay(() => {
				  // this.isPlay = true
				});
			
			},
			// 接收输入框高度，防止阻挡
			heights(e) {
				this.inputh = e
				this.ToBottom()
			},
			// 消息自动定位到（最后一条）
			ToBottom () {
				this.scrollAnimation = true
				this.scrollToView=''
				this.$nextTick(function(){
					this.scrollToView = 'msg' + this.msgs[this.msgs.length-1].id
				})
			},
			// 返回上一页
			backOnePage() {
				uni.navigateBack({
					delta:1
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '../../../commons/css/mycss.scss';
	
	// page {
	// 	height: 100%;
	// 	background: rgba(244,244,244,1);
	// }
	.contents {
		height: 100vh;
		background: rgba(244,244,244,1);
	}
	/* 顶部 */
	.top-bar {
		background: $uni-color-logo;
		.top-bar-left {
			width: 88rpx;
			height: 100%;
			float: left;
			// padding-left: 10rpx;
			// background-color: #ff2;
			.text {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			i {
				display: inline-block;
				margin-top: 30rpx;
			}
		
		}
		.top-bar-right {
			float: right;
			padding-right: 8rpx;
			margin-top: 4rpx;
			box-shadow: none;
			
			image {
				width: 68rpx;
				height: 68rpx;
				margin-top: 9rpx;
				border-radius: 16rpx;
				
			}
			
		}
	}
	
	/* chat-room */
	.chat {
		height: 100%;
		
		.loading {
			margin: 20rpx 0;
			text-align: center;
			i {
				font-size: 50rpx;
			}
		}
		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			// padding-bottom: 120rpx;
			
			display: flex;
			flex-direction: column;
		}
		.chat-ls {
			
			.chat-time {
				font-size: $uni-font-size-sm;
				line-height: 34rpx;
				color: rgba(39,40,50,0.3);
				padding: 20rpx 0;
				text-align: center;
			}
			// 公用
			.msg-m {
				display: flex;
				padding: 20rpx 0;
				.user-img {
					flex: none;
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
					
				}
				.message {
					// flex: auto;
					max-width: 480rpx;

				}
				.msg-text {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx;
				}
				.msg-img {
					max-width: 400rpx;
					border-radius: $uni-border-radius-base;
				}
				.voice {
					
					min-width: 120rpx;
					max-width: 350rpx;
					height: 44rpx;
					text-align: center;
					span {
						float: right;
					}
					i{
						float: left;
						padding-right: 13rpx;
						font-size: 35rpx;
						font-weight: 600;
					}
				}
				.msg-map {
					background: #fff;
					width: 462rpx;
					height: 284rpx;
					overflow: hidden;
					.map-name {
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
					}
					.map-addr {
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						padding: 0 24rpx;
						
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1; // 一行溢出则省略号
						overflow: hidden;
					}
					.map {
						padding-top: 8rpx;
						width: 462rpx;
						height: 190rpx;
					}
				}
				
			}
			// 收-发
			.msg-left {
				flex-direction: row;
				.msg-text {
					margin-left: 18rpx;
					background-color: #FFFFFF;
					border-radius: 0 20rpx 20rpx 20rpx;
				}
				.msg-img {
					margin-left: 18rpx;
				}
				.msg-map {
					margin-left: 18rpx;
					border-radius: 0 20rpx 20rpx 20rpx;
				}
			}
			.msg-right {
				flex-direction: row-reverse;
				.msg-text {
					margin-right: 18rpx;
					background-color:$uni-color-logo;
					border-radius: 20rpx 0 20rpx 20rpx;
				}
				.msg-img {
					margin-right: 18rpx;
				}
				.msg-map {
					margin-right: 18rpx;
					border-radius: 20rpx 0 20rpx 20rpx;
				}
			}
		}
		
	}

	// 工具类
	.isActive {
		color: $uni-text-color-grey;
	}
	.displaynone {
		display: none;
	}
</style>
