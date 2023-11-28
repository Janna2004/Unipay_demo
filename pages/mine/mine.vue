<!-- 把mine页面分开了写了 -->
<template>
	<view class="profile">
		<!-- 长按上传背景 -->
		<view class="background-container" @longtap="self||uploadBackground">
			<image class="background-image" :src="backgroundImage" mode="aspectFill"></image>
			<view class="avatar-overlay" @tap="self||uploadAvatar()">
				<image :src="avatarImage" mode="aspectFill"></image>
			</view>
		</view>
	</view>
	<view class="user_name">
		{{username}}
	</view>
	<view class="user_school">
		<view style="display: inline-block;">{{userschool}}</view>
	</view>
	<Followcomponent :func="toggleFollow" :self="self" :isFollowing="isFollowing" :followers_count="followers_count"
		:following_count="following_count" />
	<Collections ></Collections>
</template>


<!-- 如果是用户点进自己的主页页面，（我不知道为啥那个follow的标签为啥那么大）则不能对自己follow，加载的
页面也是自己的数据。如果点进的是别人的主页，则页面加载的是别人的数据，但是follow的那个地方还是加载该
 用户对页面用户是否关注-->
<script>
	import Followcomponent from './Followcomponent.vue'
	import Collections from './Collections.vue'

	export default {
		components: {
			Followcomponent,
			Collections
		},
		data() {
			return {
				self: false,
				backgroundImage: '../../static/image/sample.png', //测试用背景
				avatarImage: '../../static/image/mine.png', //测试用头像
				username: 'leo', //用户名
				userschool: 'Beijing University of Posts and Telecommunications', //用户学校信息
				isFollowing: false,
				follwering_count: 0,
				follwers_count: 0,
			}
		},
		onLoad(e) {
			//加载用户名和头像等信息
			if (e.uid) {
				this.$r({
					url: '/user/profile',
					method: 'POST',
					data: {
						uid: e.uid
					}
				}).then(res => {
					if (res.data.status === 200) {
						let userdata = res.data.data
						this.username = userdata.username
						this.avatarImage = userdata.avatar
						this.userschool = userdata.school
						this.followers_count = userdata.followers_count
						this.follwering_count = userdata.follwering_count
						this.isFollowing = userdata.isFollowing
						this.backgroundImage = userdata.profile_bg
					}
				})
			} else {
				uni.setStorageSync(
					'userdata', {
						username: 'leo',
						avatar: '../../static/image/mine.png',
						school: 'Beijing University of Posts and Telecommunications',
						email: "whl@whl.com",
						gender: "male",
						phone: "1111111111",
						profile_bg:'../../static/image/sample.png',
						isFollowing:false,
						followers_count: 12,
						following_count: 14,
					}
				)
				// this.self = true
				const userdata = uni.getStorageSync(
					"userdata"
				)
				this.username = userdata.username
				this.avatarImage = userdata.avatar
				this.userschool = userdata.school
				this.followers_count = userdata.followers_count
				this.following_count = userdata.following_count
				this.isFollowing = userdata.isFollowing
				this.backgroundImage = userdata.profile_bg
			}

		},

		methods: {
			uploadBackground() {
				uni.chooseImage({
					count: 1, // 默认9，设置用户一次可以选择的图片数量
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: (file) => {
						// 将图片路径存入imageSrc,后续要取消这步
						this.avatarImage = file.tempFilePaths[0];
						//this.cropImage();//裁剪图片的组件还没写
						this.$f({
							type: 'image',
							file: this.avatarImage,
						}).then(res => {
							console.log(res)
							if (res.data.status === 200) {
								this.updateInfo({
									avatar: res.data.src
								}, res => {
									uni.showToast({
										title: "头像更改成功！",
										icon: 'none',
										duration: 1500
									})
								})
							} else {
								uni.showToast({
									title: `[${res.data.status}]图片上传失败:${res.data.msg}`,
									icon: 'none',
									duration: 1500
								})
							}
						})
					}
				});
			},
			// 用户点击按钮，选择图片
			uploadAvatar() {
				uni.chooseImage({
					count: 1, // 默认9，设置用户一次可以选择的图片数量
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: (file) => {
						// 将图片路径存入imageSrc,后续要取消这步
						this.avatarImage = file.tempFilePaths[0];
						//this.cropImage();//裁剪图片的组件还没写
						this.$f({
							type: 'image',
							file: this.avatarImage,
						}).then(res => {
							console.log(res)
							if (res.data.status === 200) {
								this.updateInfo({
									avatar: res.data.src
								}, res => {
									uni.showToast({
										title: "头像更改成功！",
										icon: 'none',
										duration: 1500
									})
								})
							} else {
								uni.showToast({
									title: `[${res.data.status}]图片上传失败:${res.data.msg}`,
									icon: 'none',
									duration: 1500
								})
							}
						})
					}
				});
			},
			toggleFollow() {
				this.updateInfo({
					uid: "1212",
					is_following: !this.isFollowing
				}, res => {
					this.isFollowing = !this.isFollowing
				})
			},
			updateInfo(info, callback) {
				const data = info
				this.$r({
					url: '/user/update',
					method: 'POST',
					data
				}).then(
					res => {
						if (res.data.status === 200) {
							console.log(this.isFollowing)
							callback && callback(res.data)
						}

					}
				)
			}
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';

	/*放置头像，背景和用户信息*/
	.profile {
		width: 100vw;
		height: 160px;
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		/* 隐藏超出父容器的部分 *
		/* 调整区域高度根据需要 */
	}

	/*背景图*/
	.background-container {
		width: 100%;
		height: 120px;
		position: absolute;
		/* 绝对定位，相对于父容器定位 */
		cursor: pointer;
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		overflow: hidden;
	}

	.background-container .background-image {
		width: 93%;
		/* 图像最大宽度为父元素宽度 */
		max-height: 100%;
		/* 图像最大高度为父元素高度 */
		border-radius: 15px;
	}

	.avatar-overlay {
		width: 70px;
		/* 调整头像大小根据需要 */
		height: 70px;
		background-size: cover;
		/* 头像图片充满容器 */
		background-position: center;
		/* 头像图片居中对齐 */
		border-radius: 50%;
		/* 制作圆形头像 */
		position: absolute;
		top: 25%;
		/* 上下居中 */
		overflow: hidden;
		position: absolute;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.avatar-overlay image {
		width: 100%;
		height: 100%;
	}

	.avatar-overlay:hover {
		transform: scale(1.1);
		/* 头像点击后缩放效果，可根据需要调整 */
	}

	.user_name {
		font-size: 21px;
		position: relative;
		text-align: center;
		margin-top: -20px;
	}

	.user_school {
		margin-top: 8px;
		margin-left: 2%;
		color: #808080;
		font-size: 14px;
		text-align: center;
	}
</style>