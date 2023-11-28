<template>
	<!-- title和back区 -->
	<view class="top">
		<!-- 顶部标题 -->
		<view class="title-school">
			<view style="width: 100%;
			height:100%;			
			display: flex;
			align-items: flex-start;
			justify-content: center;">
				<view style="margin-top: -4px;">School</view>
			</view>
		</view>
		<!-- 返回键 -->
		<view class="back-section">
			<uni-icons class="back-icon" type="back" size=33 @tap="goBack"></uni-icons>
			<view class="back-text">
				&nbsp;Back
			</view>
		</view>
	</view>
	<!--搜索框-->
	<view :class="['search-bar', { 'fixed-title': fixed }]">
		<view class="search-bar-box">
			<view @tap="toSearch()">
				<image class="search-span" src="../../static/image/search_new.png" />
			</view>
			<input confirm-type="search" @tap="toSearch()" @confirm="search" value=""
				placeholder="Search schools or locations" class="search-text" maxlength=90% />
		</view>
	</view>
	<!-- 占空view,根据上方被悬挂的块高度自动调整 -->
	<view :style="{ height: searchSpace + 'px'}" v-if="fixed"></view>
	<!-- 头像及信息框 -->
	<view class="school-info">
		<!-- 学校头像 -->
		<view class="school-profile">
			<image class="school-profile-img" :src="schoolprofile" />
		</view>
		<!-- 名字，地点，距离 -->
		<view class="school-info-details">
			<p class="school-name">{{schoolname}}</p>
			<p class="school-location">{{schoollocation}}</p>
			<view class="school-distance">
				<image class="loc-img" src="../../static/image/location.png" />
				<view>{{distance}}km away from you</view>
			</view>
		</view>
		<!-- 更多-->
		<view class="more-threepoints">
			<image class="more-img" src="../../static/image/more2.png" @tap="show_option()" />
		</view>
	</view>
	<!-- 推荐商品 -->
	<view class="recommendGoods">
		<view class="collections">
			<view v-for="item in GoodLists" :key="item.id" class="collections-box">
				<view @tap="toDetails()">
					<image class="collections-img" :src="item.imageUrl" />
				</view>
				<view class="collections-name">{{ item.name }}</view>
				<view class="collections-state">
					<view class="collections-price">{{ item.price }} GBP</view>
					<view class="collections-timeInterval">{{item.timeInterval}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				topSpace: 0, //top区高度
				searchSpace: 0, //search区高度
				fixed: false, // 是否滑动时固定元素
				search: "",
				// 学校信息
				schoolprofile: "../../static/image/sample.png",
				schoolname: "Univedsa sdaddasdadaddfsdfsdfdsadd sdmbridge",
				schoollocation: "CambrCdasdasdasdasdB2 1TN, UK",
				distance: 1,
				schoolid: 1, //学校id，用于请求商品信息
				//推荐的商品信息
				GoodLists: [{
						goodid: 1,
						imageUrl: "../../static/image/sample.png",
						name: "feafcafa",
						price: 55,
						timeInterval: "sdadas", //时间间隔
					},
					{
						goodid: 2,
						imageUrl: "../../static/image/sample.png",
						name: "kuyafa",
						price: 5435,
						timeInterval: "sggerg",
					},
					{
						goodid: 3,
						imageUrl: "../../static/image/sample.png",
						name: "feafcafa",
						price: 1235,
						timeInterval: "223",
					},
					{
						goodid: 4,
						imageUrl: "../../static/image/sample.png",
						name: "hhhh",
						price: 222,
						timeInterval: "猪",
					},
					{
						goodid: 1,
						imageUrl: "../../static/image/sample.png",
						name: "feafcafa",
						price: 55,
						timeInterval: "sdadas", //时间间隔
					},
				]
			}
		},

		mounted() {
			window.addEventListener('scroll', this.handleScroll);//监听滑动屏幕事件
			window.addEventListener('resize', this.getHeight); //测试用，在改变屏幕大小时改变获取的topspace高度
		},
		//在组件销毁之前，移除之前添加的滚动事件监听器。
		beforeDestroy() {
			window.removeEventListener('scroll', this.handleScroll);
			window.addEventListener('resize', this.getHeight);
		},

		methods: {
			//处理滑动页面逻辑
			handleScroll() {
				const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				this.getHeight();
				this.fixed = scrollTop > this.topSpace; // 假定当滚动超过topSpace时固定搜索栏
				console.log("fixed:", this.fixed,
					"scrollTop:",scrollTop,
					"topSpace:", this.topSpace,
					"searchSpace:", this.searchSpace);
			},
			//获得顶部top盒子高度
			getHeight() {
				// 创建选择器查询对象
				const query = uni.createSelectorQuery().in(this);

				// 查询.top元素的高度
				query.select('.top').boundingClientRect(data => {
					// data包含了目标元素的信息，其中height是高度属性
					const height_all = data.height;
					// 将高度设置为另一个CSS类的高度
					this.topSpace = height_all;
					//console.log('top Height:', height_all);
				}).exec();

				// 查询.search元素的高度
				query.select('.search-bar').boundingClientRect(data => {
					const searchHeight = data.height;
					this.searchSpace = searchHeight;
					//console.log('Search Height:', searchHeight);
				}).exec();
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
			//返回上一级页面
			goBack() {
				this.$router.go(-1);
			},
			// 跳转搜索页
			toSearch() {
				console.log('really')
				uni.navigateTo({
					url: '../search/search',
					animationType: 'zoom-out',
					animationDuration: 200
				});
			},
			toDetails() {
				uni.navigateTo({
					url: '../goodsdetail/goodsdetail',
					animationType: 'zoom-out',
					animationDuration: 200
				})
			}
		},
	}
</script>

<style lang="scss">
	/* 标题 */

	.top {
		display: flex;
		flex-direction: column;
		align-items: left;

		.title-school {
			padding-left: auto;
			padding-right: auto;
			font-size: $uni-font-size-slogan;
			font-weight: 600;
			padding-top: 7px;
			padding-bottom: 6px;
			margin-bottom: 2px;
		}

		.back-section {
			display: flex;
			align-items: center;
			margin-top: -10px;

			.back-icon {
				margin-left: 4%;
				background-color: #DCDCDC;
				border-radius: 50%;
			}

			.back-text {
				font-size: 18px;
				font-weight: 600;
			}
		}
	}

	.fixed-title {
		position: fixed;
		width: 100%;
		left: auto;
		right: auto;
		top: 0;
		background: white;
		/*背景只会填充padding而不会填充margin*/
		z-index: 1000;
	}

	.search-bar {
		width: 100%;
		height: 100rpx;
		padding-top: 7px;
		padding-bottom: 3px;

		.search-bar-box {
			display: flex;
			align-items: center;
			margin-left: auto;
			margin-right: auto;
			width: 90%;
			height: 84rpx;
			border: 4rpx solid #c0c0c0;
			border-radius: 20rpx;
		}

		.search-span {
			width: 60rpx;
			height: 55rpx;
			margin-top: 10rpx;
			margin-left: 15rpx;
		}

		.search-text {
			width: 100%;
			margin-left: 20rpx;
			font-size: 30rpx;
			color: #7f7f81;
		}
	}

	/*用户信息*/
	/*头像，detail，more横向并列*/
	.school-info {
		margin-left: 2.5%;
		display: flex;
		margin-top: 7px;
		align-items: flex-start;

		/*头像*/
		.school-profile {
			position: relative;
			width: 140rpx;
			height: 135rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.school-profile-img {
				width: 118rpx;
				height: 118rpx;
				border-radius: 50%;
			}
		}

		/*资料信息*/
		.school-info-details {
			margin-top: 20px;
			width: 65%;
			display: flex;
			flex-direction: column;
			margin-left: 3vw;

			.school-name {
				font-weight: 600;
				font-size: 17px;
				word-break: break-all;
				margin-bottom: 4px;
			}

			.school-location {
				font-size: 14px;
				word-break: break-all;
				color: #7f7f81;
				margin-bottom: 1px;
			}

			.school-distance {
				display: flex;
				align-items: flex-end;
				font-size: 14px;
				margin-left: -3px;

				.loc-img {
					width: 50rpx;
					height: 50rpx;
				}
			}
		}

		/*三个点的more*/
		.more-threepoints {
			flex-grow: 1;
			display: flex;
			justify-content: center;

			.more-img {
				margin-top: 45rpx;
				width: 50rpx;
				height: 50rpx;
			}
		}
	}

	/*推荐的商品*/
	.recommendGoods {
		margin-top: 25px;

		/*抄的collections的，类名没改*/
		.collections {
			display: flex;
			/* 设置为 flex container */
			flex-wrap: wrap;
			/* 允许内容换行 */
			flex-grow: 1;
			flex-basis: 0;
			align-items: center;
			margin-left: 2vw;
			margin-right: 2vw;
		}

		.collections-img {
			margin-bottom: 5rpx;
			width: 94%;
			max-height: 22vh;
			border-radius: 15rpx;
			margin-top: 10rpx;
			margin-left: 3%;
		}

		.collections-box {
			width: calc(46.5%);
			margin-right: 1.3%;
			/* 两列之间的间距 */
			margin-left: 2%;
			box-sizing: border-box;
			/* 使宽度包括 padding 和 border */
			margin-bottom: 12px;
			/* 如果您想在行之间添加间隔 */
			border: 3rpx solid #D3D3D3;
			border-radius: 15rpx;
		}

		.collections-name {
			margin-left: 3%;
			color: #808080;
			word-wrap: break-word;
			overflow-wrap: break-word;
			font-size: 15px;
			/*商品名大小*/
		}

		.collections-state {
			display: flex;
			justify-content: space-between;
		}

		.collections-price {
			margin-left: 3%;
			font-weight: 600;
			font-size: 16px;
			/*价格字符大小*/
			margin-bottom: 10rpx;
		}

		.collections-timeInterval {
			margin-right: 3%;
			font-size: 13px;
			/*间隔字符大小*/
			margin-top: 6rpx;
		}

		/* 清除每行最后一个元素的 margin-right */
		.collections-box:nth-child(2n) {
			margin-right: 0;
		}
	}
</style>