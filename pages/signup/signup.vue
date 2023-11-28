<template>
	<view class="contents animate__animated animate__fadeIn animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<view @click="backOnePage" class="top-bar-left">
				<i class="iconfont icon-xiazai6"></i>
			</view>
		</view>
		<!-- logo -->
		<view class="logo">
			<view class="moni-img-logo">
				<view style="display: inline-block;" class="animate__animated animate__bounceInDown">Uniswap</view>
				<!-- <i class="iconfont icon-kakao-talk-fill logo"></i> -->
			</view>
		</view>
		<!-- 表单 -->
		<view class="main">
			<view class="title">注册中心</view>
			<view class="inputs">
				<view class="inputgroup">
					<view class="inputs-div">
						<input @blur="setUsername" class="user" type="text" value="" placeholder="用户名"
							placeholder-style="color: #aaa; font-weight:400;" />
						<!-- 						<view v-if="isUserRepeat" class="employ">手机号码已注册</view>
						<i v-if="isUserRepeat" class="iconfont icon-profile ok"></i> -->
					</view>
				</view>
				<view class="spacer"></view>
				<view class="inputgroup">
					<view class="inputs-div">
						<input @blur="checkType" class="email" type="text" value="" placeholder="邮箱/手机号码"
							placeholder-style="color: #aaa; font-weight:400;" />
						<!-- <view v-if="!isMailValid" class="invalid">无效邮箱</view> -->
						<view v-if="info&&isMailRepeat" class="invalid">重复邮箱</view>
						<view v-if="info&&isPhoneRepeat" class="employ">手机号码已注册</view>
						<!-- <i v-if="isMailRepeat" class="iconfont icon-atsign ok"></i> -->
					</view>
				</view>
				<view class="spacer"></view>
				<view class="inputs-div">
					<input @input="checkPwd" class="psw" :type="type" maxlength="140" stepautocomplete="off" value=""
						placeholder="密码" placeholder-style="color: #aaa; font-weight: 400;" />
					<view v-if="!ispwdValid" class="employ">请输入至少6位密码</view>
					<!-- <i @click="looks" v-if="!look" class="iconfont icon-yanjing ok"
						style="color: #808080; font-size: 24px; line-height: 24px; margin-top: -15px;margin-right: 7px;"></i>
					<i @click="looks" v-if="look" class="iconfont icon-yanjing ok"
						style="color: rgba(255, 228, 49, 1); font-size: 24px; line-height: 24px; margin-top: -15px;margin-right: 7px;"></i> -->
					<view class="eye-img-container">
					        <image @click="looks" v-if="!look" class="eye-img" src="../../static/image/eye_close.png" />
					        <image @click="looks" v-if="look" class="eye-img eye-open" src="../../static/image/eye_open.png" />
					</view>
				</view>

			</view>
		</view>
		<view @tap="signUp" :class="{submit:isOk, submit1: !isOk}">点击注册</view>
		<!-- 底部logo -->
		<view class="bot-logo">
			<!-- <i class="iconfont icon-tengxun"></i> -->
			<span> Uniswap Dev Version</span>
		</view>
	</view>
</template>

<script>
	import {
		isMail,
		isPwdValid
	} from "../../utils/checks.js"
	export default {
		data() {
			return {
				type: 'password',
				info: '',
				infoType: 'phone',
				isPhoneRepeat: true, // 用户是否占用
				isMailRepeat: true, // 邮箱是否可用
				// isMailValid: false, // 邮箱是否无效（文字）
				look: false, // 是否显示密码
				ispwdValid: true,
				email: '',
				// isok: false, // 注册信息是否完整
				username: '',
				psw: '',
				// init: true

			}
		},
		computed: {
			// 判断按钮变色
			isOk() {
				console.log(!this.isPhoneRepeat, !this.isMailRepeat, this.ispwdValid)
				if (this.psw && this.info && this.username && !this.isPhoneRepeat && !this.isMailRepeat && this
					.ispwdValid)
					return true
				return false
			}
		},
		onLoad(e) {},
		methods: {
			// 密码是否显示
			looks() {
				if (this.look) {
					this.type = 'password'
					this.look = !this.look
				} else {
					this.type = 'text'
					this.look = !this.look
				}
			},
			// 设置用户名
			setUsername(e) {
				this.username = e.detail.value
			},
			//检测类型
			checkType(e) {

				this.info = e.detail.value
				if (isMail(this.info)) {
					this.infoType = "mail"
					this.isPhoneRepeat = false
					var that = this
					this.$r({
						url: "/user/mail_exist",
						method: 'POST',
						data: {
							"email": this.info
						}
					}).then(res => {
						if (res.data.status === 404) {
							this.isMailRepeat = false
						} else {
							this.isMailRepeat = true
						}
					})
				} else {
					this.infoType = "phone"
					this.isMailRepeat = false
					var that = this
					this.$r({
						url: "/user/phone_exist",
						method: 'POST',
						data: {
							phonenumber: this.info,
						}
					}).then(res => {
						if (res.data.status === 404) {
							this.isPhoneRepeat = false
						} else {
							this.isPhoneRepeat = true
						}
					})

				}


			},
			checkPwd(e) {
				this.psw = e.detail.value
				this.ispwdValid = isPwdValid(this.psw)
			},
			// 注册提交
			signUp() {
				if (this.isOk) {
					var that = this
					uni.showLoading({
						title: "正在注册",
						mask: true,
					})
					this.$r({
						url: '/user/signup',
						method: 'POST',
						data: {
							data: {
								userinfo: that.info,
								pwd: that.psw,
								username: that.username
							},
							type: that.infoType,
						}
					}).then(res => {
						console.log(res)
						uni.hideLoading()
						if (res.data.status === 200) {
							uni.reLaunch({
								url: `/pages/signin/signin?username=${that.info}&pwd=${that.psw}`
							});
						} else {
							uni.showToast({
								title: res.data.status + ':注册失败，请联系开发者',
								icon: 'none',
								duration: 2000
							});
						}
					})
				}
			},
			// 返回上一页
		backOnePage() {
			uni.navigateBack({
				delta: 1,
				animationType: 'zoom-in',
				animationDuration: 200
			})
		},
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';

	/* 顶部 */
	.top-bar {
		box-shadow: none;
		border-bottom: none;

		.top-bar-left {
			width: 88rpx;
			height: 100%;
			float: left;

			.text {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
			}

			i {
				display: inline-block;
				margin-top: 25rpx;
			}

		}

		.top-bar-right {
			float: right;
			padding-right: 8rpx;
			margin-top: 4rpx;

			.text {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
			}

		}
	}

	/* logo */
	.logo .moni-img-logo {
		padding-top: 256rpx;
		width: 194rpx;
		height: 92rpx;
		font-size: $uni-font-size-logo;
		margin: 0 auto;
		text-align: center;
		color: $uni-color-logo;

		// i {
		// 	color: $uni-color-primary;
		// 	font-size: 100rpx;
		// }
	}

	/* 主体 */
	.main {
		padding: 54rpx $uni-spacing-row-lg 120rpx;

		.title {
			text-align: left;
			font-size: $uni-font-size-slogan;
			color: $uni-text-color;
			line-height: 56rpx;
			font-weight: bold;
		}

		.slogan {
			text-align: center;
			color: $uni-text-color-grey;
			line-height: 56rpx;

			span {
				font-size: $uni-font-size-slogan;
				color: $uni-color-primary;
			}
		}

		.inputs {
			padding-top: 35rpx;

			input {
				padding-top: 40rpx;
				height: 40rpx;
				font-size: $uni-font-size-lg;
				fonf-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1rpx solid $uni-border-color;
				border: $uni-border-input-caliber solid $uni-color-primary;
				border-radius: $uni-border-radius-inputs;
				padding: 20px;
				display: flex;
				flex-direction: column;
				align-items: center;
			}

		}

		.inputgroup {
			width: 100%;
			margin-bottom: 10px;
		}

		.inputs-div {
			position: relative;
		}
		
		.eye-img-container {
		    position: relative;
		}
		
		.eye-img {
		    width: 62rpx;
		    height: 52rpx;
		    position: absolute;
		    right: 0;
		    top: 50%; 
		    transform: translateY(-50%);
			margin-top: -30px;
			margin-right: 5px;
		}
		
		.eye-open {
			width: 50rpx;
			height: 40rpx;
			position: absolute;
			right: 0;
			top: 50%; 
			transform: translateY(-50%);
			margin-top: -31px;
			margin-right: 8px;
		}
		
		.employ,
		.invalid {
			position: absolute;
			top: 40rpx;
			right: 0;
			font-size: $uni-font-size-base;
			fonf-weight: 500;
			color: $uni-color-error;
			line-height: 88rpx;
			margin-top: 31px;
			margin-right: 7px;
		}

		.ok {
			position: absolute;
			right: 0;
			top: 70rpx;
			width: 42rpx;
			height: 32rpx;
			color: $uni-color-success;
		}
		.spacer {
		  height: 11px; 
		}

	}

	.submit {
		margin: 0 auto;
		width: 85%;
		height: 96rpx;
		background: $uni-bg-color-button;
		box-shadow: 0px 5rpx 32rpx -36rpx $uni-bg-color-submit-box-shadow;
		border-radius: $uni-border-radius-base;
		font-size: $uni-font-size-submit;
		font-weight: 500;
		color: $uni-bg-color;
		line-height: 96rpx;
		text-align: center;
		box-shadow: 8rpx 10rpx 25rpx -5rpx $uni-bg-color-mask;
	}

	.submit1 {
		margin: 0 auto;
		width: 85%;
		height: 96rpx;
		background: $uni-bg-color-submit1;
		box-shadow: 0px 5rpx 32rpx -36rpx $uni-bg-color-submit-box-shadow;
		border-radius: $uni-border-radius-base;
		font-size: $uni-font-size-submit;
		font-weight: 500;
		color: $uni-bg-color;
		line-height: 96rpx;
		text-align: center;
		box-shadow: 8rpx 10rpx 25rpx -5rpx $uni-bg-color-mask;
	}

	/* 底部logo */
	.bot-logo {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		position: fixed;
		bottom: 15rpx;
		right: 0;
		color: $uni-text-color-grey;
		font-size: $uni-font-size-bot-logo;

		// i {
		// 	display: inline-block;
		// 	font-size: 1.1rem;
		// 	margin-right: 1rpx;
		// 	margin-top: -3rpx;
		// }
	}
</style>