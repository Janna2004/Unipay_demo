<template>
	<!--页面跳转动画在这里-->
	<view class="content animate__animated animate__slideInDown animate__faster">
		<!-- 顶部 -->
		<view class="search-bar">
			<view class="search-bar-box">
				<image class="search-span" src="../../static/image/search.png" />
				<input confirm-type="search" @confirm="search" value="" placeholder="Search collections or users"
					class="search-text" maxlength=90% focus />
				<!-- <image class="search-more" src="../../static/image/more.png"/> -->
			</view>
		</view>

		<!-- 刷新 -->
		<view class="refresh" v-if="refresh">
			<i class='iconfont icon-jiazaizhong3'></i>
			<view class="refresh-title">下拉刷新</view>
		</view>

		<!-- 分类 -->
		<!--此处将关键词添加跳动动画-->
		<scroll-view :scroll-x="true" class="keywords" style="white-space: nowrap;margin: 0 auto;width: 90%;">
			<button style="display: inline-block;">
				全部
			</button>
			<button style="display: inline-block;">
				地区1
			</button>
			<button style="display: inline-block;">
				地区2
			</button>
			<button style="display: inline-block;">
				地区3
			</button>
		</scroll-view>

		<scroll-view :scroll-x="true" class="keywords" style="white-space: nowrap;margin: 0 auto;width: 90%;">
			<button style="display: inline-block;">
				全部
			</button>
			<button class="item1" style="display: inline-block;">
				物品类型1
			</button>
			<button class="item2" style="display: inline-block;">
				物品类型2
			</button>
			<button class="item3" style="display: inline-block;">
				物品类型3
			</button>
		</scroll-view>

		<scroll-view :scroll-x="true" class="keywords" style="white-space: nowrap;margin: 0 auto;width: 90%;margin-bottom: 20rpx;">
			<button class="date0" style="display: inline-block;">
				全部
			</button>
			<button class="date1" style="display: inline-block;">
				一个月内
			</button>
			<button class="date2" style="display: inline-block;">
				一周内
			</button>
			<button class="date3" style="display: inline-block;">
				三天内
			</button>
			<button class="date4" style="display: inline-block;">
				一天内
			</button>
		</scroll-view>

		<!-- 搜索商品，css样式暂时用school样式 -->
		<view class="schools">
			<view class="schools-box1">
				<view @tap="">
					<image class="schools-img" src="../../static/image/sample.png" />
				</view>
				<view style="margin-left: 2%; color: $uni-text-color-grey;">10 CNY</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">商品1</view>
			</view>
			<view class="schools-box2">
				<view @tap="">
					<image class="schools-img" src="../../static/image/sample.png" />
				</view>
				<view style="margin-left: 2%; color: $uni-text-color-grey;">20 CNY</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">商品2</view>
			</view>
		</view>

	</view>
</template>

<script>
	//import datas from '../../commons/js/datas.js'

	export default {
		data() {
			return {
				pageIndex: 0,
				refresh: false,
			}
		},
		components: {},
		onLoad() {
			console.log('category!')
		},
		onBackPress() {
			console.log("return!")
		},
		methods: {
			// 搜索
			search() {

			},

			// 获取缓存数据
			getStorages() {
				try {
					const value = uni.getStorageSync('usr')
					if (value) {
						this.uid = value.id
						console.log(value.id)
						this.imgurl = this.serverUrl + '/' + value.imgurl
						this.token = value.token
					} else {}

					// console.log(value)
				} catch (e) {
					console.log('error')
					//TODO handle the exception
				}
			},

			// 跳转搜索页
			toHome() {
				uni.switchTab({
					url:'../homepage/homepage'
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';

	.search-bar {
		width: 100%;
		height: 100rpx;
		margin-top: 2%;
		margin-bottom: 50rpx;

		.search-bar-box {
			display: flex;
			margin: 0 auto;
			width: 90%;
			height: 70rpx;
			border: $uni-border-caliber solid $uni-border-color-search-bar-box;
			border-radius: $uni-border-radius-homepage-box;
		}

		.search-span {
			width: 60rpx;
			height: 50rpx;
			margin-top: 10rpx;
			margin-left: 15rpx;
		}

		.search-more {
			width: 60rpx;
			height: 60rpx;
			margin-top: 6rpx;
			margin-right: 20rpx;
		}

		.search-text {
			width: 100%;
			margin-top: 15rpx;
			margin-left: 20rpx;
			font-size: $uni-font-size-search-text;
			color: $uni-tetx-color-search-text;
		}
	}

	.refresh {
		text-align: center;
		padding-top: 20rpx;
	
		i {
			font-size: $uni-font-size-refresh-icon;
			color: $uni-color-refresh-icon;
		}
	
		.refresh-title {
			padding-top: 10rpx;
			font-size: $uni-font-size-base;
			color: $uni-color-refresh-title;
			line-height: 40rpx;
		}
	}
	
	/*设置关键词跳动动画*/
	.keywords {
		animation: pulse;
		animation-duration: 2.5s;
		animation-iteration-count: infinite;
	}
	
	/* 首页学校 */
	.schools {
		display: flex;
		margin-left: 5%;
		margin-bottom: 40rpx;
		width: 90%;

		.schools-box1 {
			width: 50%;
			border: $uni-border-caliber solid $uni-border-color-interested-box;
			border-radius: $uni-border-radius-homepage-school;
		}

		.schools-box2 {
			width: 50%;
			margin-left: 5%;
			border: $uni-border-caliber solid $uni-border-color-interested-box;
			border-radius: $uni-border-radius-homepage-school;
		}

		.schools-img {
			margin-bottom: 10rpx;
			width: 96%;
			height: 25vh;
			border-radius: $uni-border-radius-homepage-school;
			margin-top: 15rpx;
			margin-left: 2%;
		}
	}
</style>