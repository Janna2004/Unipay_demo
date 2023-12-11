<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<button class="more-list" @tap="showPaymentOptions">
			<view class="more-list-title">支付</view>
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '支付demo'
			}
		},
		onLoad() {

		},
		methods: {
			showPaymentOptions(){
				uni.showActionSheet({
					itemList: ['微信支付', '支付宝支付'],
					success: (res) => {
					  if (res.tapIndex === 0) {
						// 微信支付选项被选中
						console.log('微信支付');
						// 这里可以添加微信支付的逻辑
					  } else if (res.tapIndex === 1) {
						// 支付宝支付选项被选中
						console.log('获取订单信息...');
						var total=1;  //单位是分
						uni.request({
							url: 'http://127.0.0.1:8088/aliPaymentServer/getOrderInfo?total_pay='+total,
							success: (res) => {
								console.log("请求支付...");
								uni.requestPayment({
									provider: 'alipay',
									orderInfo: res.data, // 真实的订单信息
									success: (res) => {
										console.log('支付成功', res);
										// 跳转到新页面
										uni.navigateTo({
										  url: '../../payment/success'
										});
									},
									fail: (err) => {
										console.error('支付失败', err);
										// 处理支付失败逻辑
									}
								});
								console.log(res.data);
							},
							fail:(res)=>{
								console.log('get失败');
								console.log(res.data);
							},
						});	
					  }
					},
					fail(err) {
					  console.log('展开选项失败：', err);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
		border-radius: 50rpx;
	}
	.text-area {
		display: flex;
		justify-content: center;
	}
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.more {
		width: 100%;
		height: 400rpx;
		background: #FFFFFF;
		box-shadow: 0 -1rpx 0 0 rgba(0,0,0,0.1);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		box-sizing: border-box;
		.more-list {
			width: 139rpx;
			text-align: center;
			background-color: $uni-bg-color-grey;
			margin: 10rpx;
			padding: 15rpx;
			border-radius: 20rpx;
			box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
			
			i {
				font-size: 66rpx;
			}
			.more-list-title {
				font-size: 26rpx;
				padding-top: 7rpx;
				color: $uni-text-color-grey;
			}
		}
	}
</style>
