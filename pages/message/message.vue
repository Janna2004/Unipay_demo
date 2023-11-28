<template>
	
	<view class="chat-body">
	<!--搜索框-->
	<view class="search-bar">
		<view class="search-bar-box">
		<view @tap="toSearch()">
			<image class="search-span" src="../../static/image/search_new.png"/>
		</view>
		<input confirm-type="search" @tap="toSearch()" @confirm="search" value=""  placeholder="Search here" class="search-text" maxlength=90%/>
		</view>
	</view>
	
		<!-- 群列表 -->
		<view class="chat-list">
			<!-- 我的聊天列表 -->
			<view class="chat-list-item" @click="toCommiuncation()">
				<!-- 群头像、基础信息 -->
				<view class="chat-object-info">
					<image src="http://q2.qlogo.cn/headimg_dl?dst_uin=21171326&spec=100" mode=""></image>
					
					<view class="chat-object-bease-info">
						<p>Faith Paul</p>
						<text>I love your tables Paul and i'll bid....</text>
					</view>
				</view>
				<!-- 聊天时间 -->
				<view class="chat-info-time">
					18:06
				</view>
				
			</view>
			<!-- 我的聊天列表 -->
			<view class="chat-list-item">
				<!-- 群头像、基础信息 -->
				<view class="chat-object-info">
					<image src="http://q2.qlogo.cn/headimg_dl?dst_uin=2369668922&spec=100" mode=""></image>
					<view class="chat-object-bease-info">
						<p>Mary Jane</p>
						<text>When will i get the word from you</text>
					</view>
				</view>
				<!-- 聊天时间 -->
				<view class="chat-info-time">
					1:06
				</view>
			</view>
			
			<!-- 我的聊天列表 -->
			<view class="chat-list-item">
				<!-- 群头像、基础信息 -->
				<view class="chat-object-info">
					<image src="http://q2.qlogo.cn/headimg_dl?dst_uin=12540701&spec=100" mode=""></image>
					<view class="chat-object-bease-info">
						<p>Lucas Jobs</p>
						<text>Nice work,but i'll need it delivered from</text>
					</view>
				</view>
				<!-- 聊天时间 -->
				<view class="chat-info-time">
					8:05
				</view>
			</view>
			
			<view class="chat-list-item">
				<!-- 群头像、基础信息 -->
				<view class="chat-object-info">
					<image src="http://q2.qlogo.cn/headimg_dl?dst_uin=21171326&spec=100" mode=""></image>
					<view class="chat-object-bease-info">
						<p>Stan Lee</p>
						<text>I don't' know for now</text>
					</view>
				</view>
				<!-- 聊天时间 -->
				<view class="chat-info-time">
					1:00
				</view>
			</view>
			
			<view class="chat-list-item">
				<!-- 群头像、基础信息 -->
				<view class="chat-object-info">
					<image src="http://q2.qlogo.cn/headimg_dl?dst_uin=2369668922&spec=100" mode=""></image>
					<view class="chat-object-bease-info">
						<p>Lucy P.</p>
						<text>You can talk about it</text>
					</view>
				</view>
				<!-- 聊天时间 -->
				<view class="chat-info-time">
					13:06
				</view>
			</view>
			
			<view class="chat-list-item">
				<!-- 群头像、基础信息 -->
				<view class="chat-object-info">
					<image src="http://q2.qlogo.cn/headimg_dl?dst_uin=12540701&spec=100" mode=""></image>
					<view class="chat-object-bease-info">
						<p>Rooky</p>
						<text>I love your lamps Paul and i'll bid</text>
					</view>
				</view>
				<!-- 聊天时间 -->
				<view class="chat-info-time">
					8:05
				</view>
			</view>
			
		</view>
	</view>
</template>
<script>
	export default {
		components: {
		},
		data() {
			return {
				title: 'Hello',
			}
		},
		onLoad() {
			console.log(this.$store.getters.GET_TOKEN);
		},
		//onShow() {
		//	uni.hideTabBar({
		//		animation: false
		//	})
		//},
		methods: {
			search(){
				
			},
			set_username() {
				this.$store.commit('SET_TOKEN', "HH");
				console.log(this.$store.state.token);
			},
			toCommiuncation() {
				uni.navigateTo({
					url: "./communication/communication"
				})
			},
			toSearch() {
				
			},
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
	.search-bar{
		width: 100%;
		height: 100rpx;
		margin-top: 2%;
		margin-bottom: 6px;
		.search-bar-box{
			display: flex;
			margin: 0 auto;
			width: 84%;
			height: 70rpx;
			border:5rpx solid $uni-border-color-search-bar-box;
			border-radius: 20rpx;
			margin-right: 10%;
		}
		.search-span{
			width: 60rpx;
			height: 50rpx;
			margin-top: 10rpx;
			margin-left: 15rpx;
			animation: tada;
			animation-duration: 1s;
			animation-iteration-count: infinite;
		}
		.search-text{
			width: 100%;
			margin-top: 15rpx;
			margin-left: 20rpx;
			font-size: 27rpx;
			color: $uni-text-color-grey;
		}
	}
	.title-text {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 30px;
		
	}
	.chat-body {
		width: 100%;
		padding: 0px 0px 8px 0px;
		box-sizing: border-box;
	}

	.chat-header {
		position: relative;
		width: 100%;
	}

	.chat-header,
	.chat-body .chat-list {
		width: 100%;
		padding: 0rem 2.0rem 0rem 0.8rem;
		box-sizing: border-box;
	}

	.chat-header {
		padding: 0;
	}

	.chat-body .chat-list .chat-list-item {
		display: flex;
		justify-content: space-between;
		padding: 6px 0 12px 5px;
		box-sizing: border-box;
		position: relative;
		/* 动画 */
		/* animation: name duration timing-function delay iteration-count direction fill-mode; */
		animation: chatItem 1s;

	}

	.chat-body .chat-list .chat-list-item:not(:last-child) {
		/* box-shadow: 0px 0.3px 0px rgba(0, 0, 0, .1); */
	}

	.chat-body .chat-list .chat-list-item .chat-object-info {
		height: 100%;
		display: flex;
		
	}

	.chat-body .chat-list .chat-list-item .chat-object-info>image {
		display: inline-block;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		margin-right: 10px;
	}

	.chat-body .chat-list .chat-list-item .chat-object-info .chat-object-bease-info {
		font-size: 0.5797rem;
	}

	.chat-body .chat-list .chat-list-item .chat-object-info .chat-object-bease-info>p {
		
		font-size: 1.0rem;
		font-weight: bold;
		padding:0.4rem 0rem 0rem 0rem
	}

	.chat-body .chat-list .chat-list-item .chat-object-info .chat-object-bease-info>text {
		display: block;
		width: 12.5463rem;
		font-size: 0.7rem;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		white-space: nowrap;
		color: $uni-text-color-grey;
	}

	.chat-body .chat-list .chat-list-item .chat-info-time {
		font-size: 0.5797rem;
		line-height: 2.8985rem;
		text-align: center;
		color: $uni-text-color-grey;
	}

	/* 动画-帧动画 */
	@keyframes searchAnimationOut {
		from {
			width: 16rem;
		}

		to {
			width: 10rem;
		}
	}

	/* 动画-帧动画 */
	@keyframes searchAnimationIn {
		from {
			width: 10rem;
		}

		to {
			width: 16rem;
		}
	}

	/* 动画-帧动画 */
	@keyframes chatItem {
		from {
			top: 100px;
		}

		to {
			top: 0px;
		}
	}
</style>
