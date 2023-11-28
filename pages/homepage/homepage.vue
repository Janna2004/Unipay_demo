<template>
	<!--页面跳转动画在这里-->
	<view class="content animate__animated animate__zoomIn animate__faster">
		<!-- 搜索界面 -->
		<!-- 顶部 -->
		<view class="search-bar">
			<view class="search-bar-box">
			<view @tap="toSearch()">
				<image class="search-span" src="../../static/image/search_new.png"/>
			</view>
			<input confirm-type="search" @tap="toSearch()" @confirm="search" value=""  placeholder="Search collections users or universities" class="search-text" maxlength=90%/>
			<view @tap="toCategory()">
				<image class="search-more" src="../../static/image/more_new.png"/>
			</view>
			</view>
		</view>

		<!-- 刷新 -->
		<view class="refresh" v-if="refresh">
			<i class="iconfont iconfont-jiazaizhong3" style="color: $uni-color-logo;"></i>
			<view class="refresh-title">下拉刷新</view>
		</view>

		<!-- 首页推荐 -->
		<view class="title-text">
			Might be interested
		</view>

		<view class="interested">
			<view class="interested-box1">
				<view class="interested-box-bar">
					<image class="user-profile" src="../../static/image/sample.png"/>
					<view class="user-name">
						Leo
					</view>
					<view @tap="show_option()">
						<image class="interested-more" src="../../static/image/more2.png"/>
					</view>
				</view>
				
				<view @tap="toDetails()"><!-- 得改 -->
					<image class="interested-img" src="../../static/image/sample.png"/>
				</view>
				
				<button class="negotiate-button" click="">Negotiate</button>
				<view class="bid-text">
					current bid
				</view>
				<view class="price-text">
					30 GBP
				</view>
			</view>
			
			<view class="interested-box2">
				<view class="interested-box-bar">
					<image class="user-profile" src="../../static/image/sample.png"/>
					<view class="user-name">
						Leo
					</view>
					<view @tap="show_option()">
						<image class="interested-more" src="../../static/image/more2.png"/>
					</view>
				</view>
				
				<view @tap="toDetails()"><!-- 得改 -->
					<image class="interested-img" src="../../static/image/sample.png"/>
				</view>
				
				<button class="negotiate-button" click="">Negotiate</button>
				<view class="bid-text">
					current bid
				</view>
				<view class="price-text">
					30 GBP
				</view>
			</view>
		</view>
		
		<view class="interested">
			<view class="interested-box1">
				<view class="interested-box-bar">
					<image class="user-profile" src="../../static/image/sample.png"/>
					<view class="user-name">
						Leo
					</view>
					<view @tap="show_option()">
						<image class="interested-more" src="../../static/image/more2.png"/>
					</view>
				</view>
				
				<view @tap="">
					<image class="interested-img" src="../../static/image/sample.png"/>
				</view>
				
				<button class="negotiate-button" click="">Negotiate</button>
				<view class="bid-text">
					current bid
				</view>
				<view class="price-text">
					30 GBP
				</view>
			</view>
			
			<view class="interested-box2">
				<view class="interested-box-bar">
					<image class="user-profile" src="../../static/image/sample.png"/>
					<view class="user-name">
						Leo
					</view>
					<view @tap="show_option()">
						<image class="interested-more" src="../../static/image/more2.png"/>
					</view>
				</view>
				
				<view @tap="">
					<image class="interested-img" src="../../static/image/sample.png"/>
				</view>
				
				<button class="negotiate-button" click="">Negotiate</button>
				<view class="bid-text">
					current bid
				</view>
				<view class="price-text">
					30 GBP
				</view>
			</view>
		</view>
		
		
		
		<!-- 学校 -->
		<button class="more-button" @tap="toMoreschool()">MORE</button>
		<view class="title-text">
			Most clicked schools
		</view>

		<view class="schools">
			<view class="schools-box1">
				<view @tap="toSchooldetail"><!--需要大改该页面实现逻辑-->
					<image class="schools-img" src="../../static/image/sample.png" />
				</view>
				<view style="margin-left: 2%; color: $uni-text-color-grey;">10k+</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">University of Combridge</view>
			</view>
			<view class="schools-box2">
				<view @tap="toSchooldetail">
					<image class="schools-img" src="../../static/image/sample.png" />
				</view>
				<view style="margin-left: 2%; color: $uni-text-color-grey;">10k+</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">University of Oxford</view>
			</view>
		</view>

		<view class="schools">
			<view class="schools-box1">
				<view @tap="toSchooldetail">
					<image class="schools-img" src="../../static/image/sample.png" />
				</view>
				<view style="margin-left: 2%; color: $uni-text-color-grey;">8k+</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">Imperial College London</view>
			</view>
			<view class="schools-box2">
				<view @tap="toSchooldetail">
					<image class="schools-img" src="../../static/image/sample.png" />
				</view>
				<view style="margin-left: 2%; color: $uni-text-color-grey;">8k+</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">University College London</view>
			</view>
		</view>

	</view>
	<!-- <uni-load-more :status="bottom_status"></uni-load-more> -->
</template>

<script>
	//import datas from '../../commons/js/datas.js'

	export default {
		data() {
			return {
				pageIndex: 0,
				refresh: false,
				bottom_status: "more"
			}
		},
		components: {},
		onLoad() {
			console.log('fake_home!')
			this.getStorages()
		},
		onPullDownRefresh() {
			this.getStorages()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			console.log("reach bottom!")
			this.bottom_status = 'loading'
			setTimeout(() => {
				this.bottom_status = "noMore"
			}, 1000)
		},
		methods: {
			// 搜索
			search() {

			},

			//推送选项
			show_option() {
				uni.showActionSheet({
					itemList: ['收藏', '不感兴趣', '加入黑名单'],
					success(res) {
						console.log(res.tapIndex)
					},
					fail(res) {
						console.log(res.errMsg)
					}
				})
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
					} else {
						// uni.navigateTo({
						// 	url: '../signin/signin',
						// })
					}

					// console.log(value)
				} catch (e) {
					console.log('error')
					//TODO handle the exception
				}
			},
		toMoreschool() {
			console.log('jump')
			uni.navigateTo({
				url: '../moreschool/moreschool',
				animationType: 'zoom-out',
				animationDuration: 200
			})
		},
		
		// 跳转搜索页
		toSearch() {
			console.log('really')
			uni.navigateTo({
				url: '../search/search',
			});
		},
		
		toCategory() {
			uni.navigateTo({
				url: '../category/category',
			})
		},
		toDetails() {
			uni.navigateTo({
				url: '../detail/detail',
			})
		},
		toSchooldetail() {
			uni.navigateTo({
				url: '../moreschool/schooldetail',
				animationType: "zoom-out",
				animationDuration: 500
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
	}

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
		animation: tada;
		animation-duration: 1s;
		animation-iteration-count: infinite;
	}

	.search-more {
		width: 60rpx;
		height: 60rpx;
		margin-top: 6rpx;
		margin-right: 13rpx;
	}

	.search-text {
		width: 100%;
		margin-top: 15rpx;
		margin-left: 20rpx;
		font-size: $uni-font-size-search-text;
		color: $uni-tetx-color-search-text;
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

	/* 搜索界面 */
	// .title_text {
	// 	text-align: center;
	// 	font-size: 50rpx;
	// 	margin-bottom: 30rpx;
	// 	font-weight: 600;
	// 	margin-top: 12px;
	// }

	/* 首页推荐 */
	.title-text {
		margin-left: 5%;
		font-size: $uni-font-size-homepage-title;
		margin-bottom: 20rpx;
		font-weight: 600;
		margin-top: -10px;
	}

	.interested-box {
		width: 90%;
		margin: 0 auto;
		border: $uni-border-caliber solid $uni-border-color-interested-box;
		padding-top: 10rpx;
		border-radius: $uni-border-radius-homepage-box;
		margin-bottom: 50rpx;

		.interested-box-bar {
			margin-top: 10rpx;
			display: flex;
			justify-content: center;

			.user-profile {
				width: 150rpx;
				height: 120rpx;
				border-radius: $uni-border-radius-circle;
				margin-left: 12px;
			}

			.user-name {
				width: 80%;
				margin-left: 15px;
				margin-top: 37rpx;
				font-size: $uni-font-size-homepage-username;
			}

			.interested-more {
				margin-top: 34rpx;
				margin-right: 5px;
				width: 60rpx;
				height: 60rpx;
				flex-shrink: 0;
			}
		}
	}

	.interested-pic-box {
		width: 96%;
		height: 40vh;
		border-radius: $uni-border-radius-inputs;
		margin-top: 18rpx;

		margin-left: 2%;
		margin-bottom: 50rpx;
	}

	.bid-text {
		margin-top:10px;
		margin-left: 1%;
		color: $uni-text-color-placeholder;
		font-size:$uni-font-size-lg;
	}

	.negotiate-button {
		margin-top:10px;
		width: 150rpx;
		padding:0.5rpx;
		background-color: $uni-color-logo;
		color: $uni-bg-color;
		margin-right: 2%;
		float: right;
		font-size: $uni-font-size-base;
		display: flex;
		justify-content: center;
	}

	.price-text {
		font-weight: 700;
		flex-basis: 100%;
		margin-left: 9%;
		margin-bottom: 20rpx;
	}

	.more-button {
		width: 120rpx;
		height: 60rpx;
		font-size: $uni-font-size-base;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: $uni-bg-color;
		color: $uni-text-color-grey;
		margin-right: 6%;
		float: right;
		margin-top: -11px;
		border: none !important;
		outline: none !important
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
	.interested{
		display: flex;
		width:50%;
		margin-left: 3%;
		.interested-box1 {
			width: 90%;
			margin: 0 auto;
			border: $uni-border-caliber solid $uni-border-color-interested-box;
			padding-top: 10rpx;
			border-radius: $uni-border-radius-homepage-box;
			margin-bottom: 50rpx;
			.interested-box-bar{
				margin-top: 10rpx;
				display: flex;
				justify-content: center;
				.user-profile {
					width: 150rpx;
					height: 120rpx;
					border-radius: $uni-border-radius-circle;
					margin-left: 6px;
				}
				.user-name {
					width: 40%;
					margin-left: 15px;
					margin-top: 37rpx;
					font-size: $uni-font-size-homepage-username;
				}
				.interested-more {
					margin-top: 34rpx;
					margin-right: 5px;
					width: 60rpx;
					height: 60rpx;
					flex-shrink: 0;
				}
			}
		}
		.interested-box2 {
				width: 90%;
				margin: 0 auto;
				border: $uni-border-caliber solid $uni-border-color-interested-box;
				padding-top: 10rpx;
				border-radius: $uni-border-radius-homepage-box;
				margin-bottom: 50rpx;
				margin-left: 4%;
				.interested-box-bar{
					margin-top: 10rpx;
					display: flex;
					justify-content: center;
					.user-profile {
						width: 150rpx;
						height: 120rpx;
						border-radius: $uni-border-radius-circle;
						margin-left: 6px;
					}
					.user-name {
						width: 40%;
						margin-left: 15px;
						margin-top: 37rpx;
						font-size: $uni-font-size-homepage-username;
					}
					.interested-more {
						margin-top: 34rpx;
						margin-right: 5px;
						width: 60rpx;
						height: 60rpx;
						flex-shrink: 0;
					}
				}
		}
		.interested-img{
			margin-bottom: 10rpx;
			width:96%; 
			height:25vh; 
			border-radius: $uni-border-radius-homepage-school; 
			margin-top: 15rpx; 
			margin-left: 2%;
		}
		
	}
</style>