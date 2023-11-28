<template>
	<view class="payment-page">
		<button @tap="handlePayment">确认支付</button>
	</view>
</template>

<script>
export default {
	methods: {
		handlePayment() {
			// 假设这里的 orderInfo 是您从服务器获取的订单信息
			console.log("a try");
			const orderInfo = {
				// 订单信息
				// 示例: provider: 'alipay', orderInfo: 'xxx'
			};
			console.log("alipay");
			uni.requestPayment({
				provider: 'alipay',
				orderInfo: orderInfo, // 真实的订单信息
				success: (res) => {
					console.log('支付成功', res);
					// 处理支付成功逻辑
				},
				fail: (err) => {
					console.error('支付失败', err);
					// 处理支付失败逻辑
				}
			});
		}
	}
}
</script>


<style>
</style>