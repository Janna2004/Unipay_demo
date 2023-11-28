<template>
	<view class="contents animate__animated animate__fadeIn animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<view class="top-bar-right">
				<view @tap="toSignup" class="search">
					<view class="text">
						注册
					</view>
				</view>
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
			<view class="slogan">
				<span>登陆</span>
			</view>
			<view class="inputs">
				<view class="inputgroup">
					<input @focus="iserr=false" v-model="username" class="username" type="text" placeholder="手机号/邮箱"
						placeholder-style="color: #aaa; font-weight:400;" />
				</view>
				<view class="inputs-div">
					<form>
						<input @focus="iserr=false" v-model="password" class="psw" :type="type" placeholder="密码"
							placeholder-style="color: #aaa; font-weight:400;" />
					</form>
					<!-- <i @click="looks" v-if="!look" class="iconfont icon-yanjing ok" style="color: #808080; font-size: 24px; line-height: 24px; margin-top: -15px;margin-right: 7px;"></i>
            <i @click="looks" v-if="look" class="iconfont icon-yanjingnew ok"
              style="color: rgba(255, 228, 49, 1); font-size: 24px; line-height: 24px; margin-top: -15px;margin-right: 7px;"></i> -->
					<view class="eye-img-container">
						<image @tap="looks" v-if="!look" class="eye-img" src="../../static/image/eye_close.png" />
						<image @tap="looks" v-if="look" class="eye-img eye-open"
							src="../../static/image/eye_open.png" />
					</view>
				</view>
			</view>
			<view v-if="iserr" class="tips">账号或密码错误！</view>
		</view>
		<view class="submit" @tap="pwdlogin" hover-class='button-hover'>登陆</view>
		<!-- 底部logo -->
		<view class="bot-logo">
			<!-- <i class="iconfont icon-tengxun"></i> -->
			<view @tap="wxLogin">微信</view>
			<span>Uniswap Dev Version</span>
		</view>
	</view>

</template>

<script>
	import {
		isMail,
		isPwdValid
	} from "/utils/checks.js"
	export default {
		data() {
			return {
				type: 'password',
				username: '',
				password: '',
				iserr: false,
				look: false, // 是否显示密码
				debug: true,
			}
		},
		computed: {
			logintype() {
				return isMail(this.username) ? "email" : "phone"
			}
		},
		onLoad(e) {
			const token = uni.getStorageSync("token")
			if (token) {
				this.$r({
					url: '/user/info',
					method: 'GET',
				}).then(res => {
					if (res.data.status === 200) {
						uni.setStorage({
							key: 'userdata',
							data: res.data.data
						})
						this.toHome()
					} else {
						uni.removeStorage({
							key: 'token'
						})
					}
				})
			}
			if (e.username) {
				this.username = e.username
				uni.showToast({
					title: '注册成功！请登录',
					icon: 'none',
					duration: 1500
				});
			}

		},
		methods: {
			// 登录
			pwdlogin() {
				if (this.debug) {
					console.log("Debug on!")
					this.toHome()
					uni.setStorageSync(
						'token',
						'111111111'
					)
					uni.setStorageSync(
						'userdata', {
							username: 'leo',
							avatar: '../../static/image/mine.png',
							school: 'Beijing University of Posts and Telecommunications',
							email: "whl@whl.com",
							gender: "male",
							phone: "1111111111",
							followers_count: 12,
							following_count: '',
						}
					)
					return
				}
				const f_username = this.username
				const type = this.logintype
				console.log(f_username)
				console.log(this.logintype)
				this.$r({
					url: '/user/login',
					method: 'POST',
					data: {
						type: this.logintype,
						data: {
							userinfo: this.username,
							pwd: this.password,
						}
					}
				}).then(res => {
					if (res.data.status === 200) {
						this.toHome()
						uni.setStorage({
							key: "token",
							data: res.data.token,
							success: function() {
								console.log('success store user' + f_username);
								console.log(res.data.data.username)
							}
						})
						uni.setStorage({
							key: "username",
							data: res.data.username,
							success: function() {
								console.log('success store user' + f_username);
							}
						})
					} else {
						this.iserr = true
						this.password = ""
					}
				})
			},
			wxLogin() {
				console.log("wx login!")
				uni.login({
					provider: 'weixin',
					onlyAuthorize: true,
					success: (event) => {
						console.log("success wx oathu")
						const {
							code
						} = event
						this.$r({
							url: '/user/login',
							method: 'POST',
							data: {
								type: "weixin",
								data: {
									userinfo: code,
								}
							}
						}).then(res => {
							if (res.data.status === 200) {
								this.toHome()
								uni.setStorage({
									key: "uid",
									data: res.data.uid,
									success: function() {
										console.log('success store user');
										console.log(res.data.data.username)
									}
								})
								uni.setStorage({
									key: "username",
									data: res.data.username,
									success: function() {
										console.log('success store user');
									}
								})
							} else {
								uni.showToast({
									title: '微信登录失败！',
									icon: 'none',
									duration: 1500
								})
							}
						})
					},
					fail: (err) => {
						console.log(err)
						uni.showToast({
							title: '微信登录失败！',
							icon: 'none',
							duration: 1500
						})
					}
				})
			},
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
			
			// 跳转注册页面
			toSignup() {
				uni.navigateTo({
					url: '../signup/signup',
					animationType: 'zoom-out',
					animationDuration: 200
				})
			},
			// 跳转主页
			toHome() {
				uni.switchTab({
					url: '../homepage/homepage',
					animationType: 'zoom-out',
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

		.top-bar-right {
			box-shadow: none;
			padding-right: 8rpx;

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

		.slogan {
			text-align: left;
			color: $uni-text-color-grey;
			line-height: 56rpx;

			span {
				font-size: $uni-font-size-slogan;
				color: $uni-text-color;
				font-weight: bold;
			}
		}

		.inputs {
			padding-top: 48rpx;

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

		.tips {
			font-size: $uni-font-size-lg;
			color: $uni-color-error;
			line-height: 56rpx;
			float: right;
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
			color: $uni-color-warning;
			line-height: 88rpx;
		}

		.ok {
			position: absolute;
			right: 0;
			top: 70rpx;
			width: 42rpx;
			height: 32rpx;
			color: $uni-color-success;
		}

	}


	.submit {
		margin: 0 auto;
		width: 85%;
		height: 96rpx;
		background: $uni-bg-color-button;

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
		flex-direction: column;
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