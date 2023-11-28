<template>
	<view class="content animate__animated animate__fadeIn animate__faster">
		<!-- title -->
		<view class="title-Collections">
			Collections
		</view>
		<view class="collections">
			<view v-for="item in Collections" :key="item.id" class="collections-box">
				<view @tap="toDetails()">
					<image class="collections-img" :src="item.imageUrl" />
				</view>
				<view class="collections-name">{{ item.name }}</view>
				<view class="collections-state">
					<view class="collections-price">{{ item.price }} {{item.currencyType}}</view>
					<view class="collections-timeInterval">{{item.timeInterval}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//import axios from 'axios';

	export default {
		mounted() {
			console.log("collections!")
			this.$r({
				url: '/user/items',
				method: 'GET',
			}).then(res=>{
				if (res.data.status === 200) {
					this.Collections = res.data.data.items.map(item => {
						return {
							id: item.id,
							imageUrl: item.imgurl,
							name: item.name,
							price: item.price,
							timeInterval: item.add_time,
						}
					})
				}
			})
		},
		data() {
			return {
				Collections: [], // 用于存储商品数据
				userId: '123456' // 发布商品的用户ID，根据这个id请求数据
			};
		},
		
		methods: {
			toDetails() {
				uni.navigateTo({
					url: '../detail/detail',
					animationType: 'zoom-out',
					animationDuration: 200
				})
			}
		},
		
	
	}
	
</script>



<style lang="scss">
	// @import '../../commons/css/mycss.scss';
	/* 标题 */
	.title-Collections {
		margin-left: 5%;
		font-size: 22px;
		margin-bottom: 20rpx;
		font-weight: 600;
		margin-top: 28px;
	}

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
		width: calc(45.4%);
		/* 这里我们为两列之间预留了 10px 的间距，您可以根据需要调整 */
		margin-right: 2.3%;
		/* 两列之间的间距 */
		margin-left: 2.3%;
		box-sizing: border-box;
		/* 使宽度包括 padding 和 border */
		margin-bottom: 20px;
		/* 如果您想在行之间添加间隔 */
		border: 3rpx solid #D3D3D3;
		border-radius: 15rpx;
	}

	.collections-name {
		margin-left: 3%;
		color: #808080;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.collections-state {
		display: flex;
		justify-content: space-between;
	}

	.collections-price {
		margin-left: 3%;
		font-weight: 600;
		font-size: 17px;
		margin-bottom: 10rpx;
	}

	.collections-timeInterval {
		margin-right: 3%;
		font-size: 14px;
		margin-top: 6rpx;
	}

	/* 清除每行最后一个元素的 margin-right */
	.collections-box:nth-child(2n) {
		margin-right: 0;
	}
</style>