<template>
	<view>
		<view class="title-Details">
			<image class="back-img" src="../../static/image/upload.png" @tap="goBack" />Details
		</view>
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration" :next-margin="nextMargin">
				<swiper-item v-for="(imageSrc, index) in imageList" :key="index">
					<image class="swiper-image" :src="imageSrc"></image>
				</swiper-item>
			</swiper>
		</view>
	</view>
	<view>
		<view class="nameAndprice">
			<view class="name-info">{{goodsname}}</view>
			<view class="price-info">{{price}}&nbsp;<p style="font-weight: 600;">{{currencytype}}</p>
			</view>
		</view>
		<view class="details-info">
			<view class="location-info">
				<p class="ptitle">Location:&nbsp;</p>
				<p class="pcontent">{{location}}</p>
			</view>
			<view class="other-info">
				<view class="text-info">
					Use time:&nbsp;{{useTime}}
				</view>
				<view class="text-info">
					Trace of use:&nbsp;{{traceOfUse}}
				</view>
				<view class="text-info">
					Product state:&nbsp;{{productState}}
				</view>
				<view class="text-info">
					negotiate:&nbsp;{{negotiate}}
				</view>
			</view>
			<view class="user-info">
				<view class="user-profile">
					<image class="user-profile-img" :src="userprofile" />
					<!-- 认证图标 -->
					<image class="overlay-img" src="../../static/image/upload.png" />
				</view>
				<view class="user-info-details">
					<p class="user-name">{{username}}</p>
					<p class="user-school">{{userschool}}</p>
				</view>
			</view>
			<view class="negotiate">
				<button class="negotiate-btn" @tap="">
					<p>negotiate</p>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//轮播图图片
				imageList: [
					'../../static/image/sample.png',
					'../../static/image/sample.png',
					'../../static/image/sample.png'
				],
				//轮播图参数
				indicatorDots: true,
				autoplay: true,
				interval: 4000,
				duration: 700,
				nextMargin: "26px",

				//该商品具体内容
				goodsname: "Sofa chair",
				price: 2,
				currencytype: "GDB",
				location: "Beijing Univeuiaf wefweacfwa", //需要限定长度
				useTime: "~~~",
				traceOfUse: "~~~",
				productState: "~~~",
				negotiate: "Online/offline",

				//用户信息
				authentication: 1, //是否进行认证
				userprofile: '../../static/image/sample.png', //用户头像
				username: 'Leo', //用户名
				userschool: 'Beijing University of Posts and Telecommunications', //用户学校信息
			}
		},
		methods: {
			goBack() {
				this.$router.go(-1); // 返回上一级页面
			}
		}
	}
</script>

<style lang="scss">
	/*标题*/
	.title-Details {
		margin-left: 5%;
		font-size: 26px;
		margin-bottom: 5rpx;
		font-weight: 600;
		margin-top: 13px;
		display: flex;
		align-items: center;
	}

	.title-Details .back-img {
		width: 62rpx;
		height: 52rpx;
	}

	/*轮播图*/
	.uni-margin-wrap {
		width: 100%;
		height: 35vh;
	}

	.swiper {
		height: 100%;
		width: 97%;
		margin-left: 3%;
	}

	.swiper-item {
		display: flex;
		height: 95%;
		width: 100%;
	}

	.swiper-image {
		/* 玄学排布 */
		margin-bottom: 5rpx;
		width: 95%;
		height: 86%;
		border-radius: 16rpx;
		margin-top: 10rpx;
		margin-left: 3%;
	}

	/*商品信息*/
	/*名称和价格*/
	.nameAndprice {
		display: flex;
		justify-content: space-between;
		margin-left: 4vw;
		margin-right: 3vw;
		margin-top: 6px;

		.name-info {
			margin-left: 2%;
			font-weight: 550;
			font-size: 24px;
			margin-bottom: 10rpx;
			color: blue;
		}

		.price-info {
			margin-right: 8%;
			font-size: 21px;
			margin-top: 6rpx;
			display: flex;
		}
	}

	/*其他具体信息*/
	.details-info {
		display: flex;
		justify-content: space-between;
		margin-left: 4vw;
		margin-right: 3vw;
		flex-direction: column;

		/*地点信息*/
		.location-info {
			margin-left: 2%;
			display: flex;
			height: 41px;
			/*固定地址栏高度*/
			margin-top: 13px;
			margin-right: 4%;
			margin-bottom: 5px;

			.ptitle {
				font-weight: 600;
				font-size: 19px;
				color: blue;
			}

			.pcontent {
				font-size: 17px;
				color: blue;
				word-break: break-all;
				/*防止单词整个换行*/
			}
		}

		/*其他信息*/
		.other-info {
			margin-left: 2%;
			display: flex;
			flex-direction: column;
			margin-top: 1vh;

			.text-info {
				line-height: 25px;
				font-size: 16px;
			}
		}

		/*用户信息*/
		.user-info {
			margin-left: 2%;
			display: flex;
			margin-top: 3vh;
			align-items: center;

			/*头像*/
			.user-profile {
				position: relative;
				width: 140rpx;
				height: 135rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.user-profile-img {
					width: 115rpx;
					height: 115rpx;
					border-radius: $uni-border-radius-circle;
				}

				/*认证下标图片*/
				.overlay-img {
					position: absolute;
					width: 43rpx;
					/* 覆盖图片的宽度，调整为需要的尺寸 */
					height: 43rpx;
					/* 覆盖图片的高度，调整为需要的尺寸 */
					bottom: 0;
					/* 从底部0的位置开始 */
					right: -10%;
					/* 从右侧0的位置开始 */
				}
			}

			/*资料信息*/
			.user-info-details {
				display: flex;
				flex-direction: column;
				margin-left: 5vw;

				.user-name {
					font-weight: 600;
					font-size: 22px;
				}

				.user-school {
					font-size: 15px;
					word-break: break-all;
				}
			}
		}

		.negotiate {
			margin-top: 3vh;
			width: 95%;
			margin-left: auto;
			margin-right: auto;

			.negotiate-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 55px;
				padding: 8px 12px;
				background-color: #0000CD;
				color: white;
				border-radius: 6px;
				font-size: 18px;
			}
		}
	}
</style>