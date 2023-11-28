<template>
	<view class="content animate__animated animate__zoomIn animate__faster">
		<!-- 添加界面 -->
		<view class="title-text">
			Add
		</view>

		<!-- 上传图片或视频 -->
		<view class="clue-text">
			Photo/Video
		</view>


		<view class="photo_video-box" @tap="openUploadPage">
			<view v-if="list.length===0" class="photo_video-box-bar">
				<view class="loc-img-container">
					<image class="uplo-img" src="../../static/image/upload.png" />
				</view>
				<view id="app">
					<view class="upload">
						<view type="file" id="file" @tap="upload"></view>
					</view>
				</view>
			</view>
			<view>
				<view v-for="(item,index) in list" :key="index">
					<img class="post-img" :src="item">
					<view class="delect" @click="delect(index)">×</view>
				</view>
			</view>
		</view>

		<!-- 输入名称 -->
		<view class="clue-text">
			Name
		</view>

		<view class="inputs">
			<input v-model="goodsname" type="text" placeholder="Splashray.."
				placeholder-style="color: #aaa; font-weight:400;" />
		</view>
		<view class="spacer"></view>

		<!-- 输入产品信息 -->
		<view class="clue-text">
			Bio
		</view>

		<view class="inputs">
			<textarea v-model="bio"
				placeholder="Let people know about vour work,&#10creativity & inspiration about this work"
				placeholder-style="color: #aaa; font-weight: 400;"></textarea>
		</view>
		<view class="spacer"></view>

		<!-- 定位 -->
		<view class="clue-text">
			Location(School)
		</view>

		<view class="inputs-loc">
			<input v-model="location" type="text" style="padding-left:55px;padding-right:30px;"
				placeholder="Select location/ School" placeholder-style="color: #aaa; font-weight: 400; " />
			<view class="loc-img-container">
				<image class="loc-img" src="../../static/image/location.png" />
			</view>
		</view>
		<view class="spacer"></view>

		<!-- 价格 -->
		<view class="clue-text">
			Price
		</view>

		<view class="inputs">
			<input v-model="price" type="text" placeholder="Enter GBP amount"
				placeholder-style="color: #aaa; font-weight:400;" />
		</view>
		<view class="spacer"></view>
		<view class="submit" @tap="post" hover-class='button-hover'>Post for sale</view>
		<view class="spacer"></view>
	</view>
</template>


<script>
	export default {

		data() {
			return {
				list: [], //上传图片或视频
				goodsname: '', //产品名称
				bio: '', //产品信息
				location: '', //学校信息
				price: '', //价格信息
				uploaded: [], //已经上传的图片
			};
		},
		methods: {
			upload(e) {
				uni.chooseImage({
					count: 4,
					// mediaType: ['mix'],
					// sizeType: ['compress'],
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const tempFiles = chooseImageRes.tempFiles
						const addList = tempFiles.map((value, index) => {
							console.log(value.size)
							if (value.size < 1024 * 1024 * 5) {
								return value.path
							} else {
								uni.showToast({
									title: "图片大于5M!",
									icon: 'none',
									duration: 1500
								})
							}

						})
						// console.log(tempFilePaths)
						this.list = [...this.list, ...addList]
					},
					complete: () => {
						console.log("complete!")
					}
				})
			},
			delect(index) {
				console.log(index);
				this.list.splice(index, 1);
			},
			check() {
				if (!this.list.length > 0) {
					uni.showToast({
						title: "图片信息不完整",
						icon: 'none',
						duration: 1500
					})
					return false
				}
				if (!this.goodsname) {
					uni.showToast({
						title: "商品名称不完整",
						icon: 'none',
						duration: 1500
					})
					return false
				}
				if (!this.location) {
					uni.showToast({
						title: "位置信息不完整",
						icon: 'none',
						duration: 1500
					})
					return false
				}
				if (!this.bio) {
					uni.showToast({
						title: "商品信息不完整",
						icon: 'none',
						duration: 1500
					})
					return false
				}
				if (!this.price) {
					uni.showToast({
						title: "价格信息不完整",
						icon: 'none',
						duration: 1500
					})
					return false
				}
				return true
			},
			// // 这是默认图片的方法，弹出默认图片无法删除
			// },
			// }
			//})
			uploadMedia() {
				return new Promise((resolve, reject) => {
					console.log(this.list)
					let to_upload = this.list.length
					for (const file of this.list) {
						this.$f({
							type: 'image',
							file: file,
						}).then(res => {
							console.log(res)
							to_upload -= 1
							if (res.data.status === 200) {
								this.uploaded.push(res.data.data.src)
							} else {
								uni.showToast({
									title: `[${res.data.status}]图片上传失败:${res.data.msg}`,
									icon: 'none',
									duration: 1500
								})
							}
						})
					}
					setTimeout(() => {
						if (!to_upload) {
							resolve()
						} else {
							reject(to_upload)
						}
					}, 1000)
				})
			},
			//产品发布
			post() {
				if (this.check()) {
					this.uploadMedia().then(() => {
						this.$r({
							url: '/goods/add',
							method: 'POST',
							data: {
								name: this.goodsname,
								bio: this.bio,
								imgs: this.uploaded,
								location: this.location,
								price: this.price,
							}
						}).then(
							res => {
								if (res.data.status === 200) {
									uni.showToast({
										title: "物品上传成功！",
										icon: 'none',
										duration: 1500
									})
								}else{
									uni.showToast({
										title: `[${res.data.status}]物品上传失败:${res.data.msg}`,
										icon: 'none',
										duration: 1500
									})
								}

							}
						)
					})

				}
			},

		},
	};
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';

	/* 添加界面 */
	.title-text {
		font-size: 45rpx;
		margin-bottom: 15rpx;
		font-weight: 600;
		text-align: center;
		margin-top: 5px;
	}

	/* 提示文本 */
	.clue-text {
		font-size: 30rpx;
		margin-bottom: 15rpx;
		font-weight: 400;
		margin-left: 3px;
	}

	/* 上传图片或视频框*/
	.photo_video-box {
		width: 65%;
		margin: 0 auto;
		border: 3rpx solid $uni-border-color-interested-box;
		border-radius: 20rpx;
		margin-bottom: 50rpx;
		padding-top: 20%;
		padding-bottom: 20%;
		padding-left: 16%;
		padding-right: 16%;

		.interested-box-bar {
			margin-top: 0 auto;
			display: flex;
			justify-content: center;
		}
	}

	/* 上传图片或视频*/
	.upload {
		width: 500px;
		height: 20px;
		background-color: transparent;
		border-radius: 5px;
		position: relative;
		margin-top: -4px;
	}

	// .upload:hover{
	// 	 background-color: transparent;
	// }
	.upload::before {
		position: absolute;
		content: 'Upload Photo/Video';
		font-size: 30rpx;
		text-align: center;
		line-height: 20px;
		user-select: none;
		color: $uni-text-color-grey;
		margin-left: 15%;
	}

	#file {
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	/* 调整图片格式*/
	.uplo-img-container {
		position: relative;
	}

	.uplo-img {
		width: 62rpx;
		height: 52rpx;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		margin-bottom: 50%;
		margin-right: 83%;
		animation: tada;
		animation-duration: 2.5s;
		animation-iteration-count: infinite;
	}

	.delect {
		position: absolute;
		right: 0;
		top: 0;
		width: 20px;
		height: 20px;
		text-align: center;
		line-height: 20px;
		ont-size: 15px;
		background-color: $uni-text-color-grey;
		user-select: none;
		cursor: pointer;
		opacity: 0;
	}

	.delect:hover {
		background-color: rgba(31, 31, 31, 0.5);
		color: white;
	}

	/* 输入框*/
	.inputs {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 3rpx;
	}

	.inputs input {
		height: 40rpx;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 50rpx;
		width: 92%;
		border: 1rpx solid $uni-border-color-interested-box;
		border-radius: 15rpx;
		padding: 10px;
		display: flex;
		align-items: center;
		flex-direction: column;
		align-items: center;
	}

	.inputs-loc input {
		height: 40rpx;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 50rpx;
		width: 75%;
		margin-left: 3px;
		border: 1rpx solid $uni-border-color-interested-box;
		border-radius: 15rpx;
		padding: 10px;
		display: flex;
		align-items: center;
		flex-direction: column;
		align-items: center;
	}

	/* 增加间距*/
	.spacer {
		height: 20px;
	}

	.inputs textarea {
		height: 300rpx;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 35rpx;
		width: 92%;
		border: 1rpx solid $uni-border-color-interested-box;
		border-radius: 15rpx;
		padding: 10px;
		display: flex;
		align-items: center;
		flex-direction: column;
	}


	/* 调整图片格式*/
	.loc-img-container {
		position: relative;
	}

	.loc-img {
		width: 62rpx;
		height: 52rpx;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		margin-top: -9%;
		margin-right: 90%;
		z-index: -1;
		animation: tada;
		animation-duration: 1s;
		animation-iteration-count: infinite;
	}
	
	.post-img{/*上传的照片*/
		margin-bottom: 10rpx;
		width:96%; 
		height:25vh; 
		border-radius: $uni-border-radius-homepage-school; 
		margin-top: 15rpx; 
		margin-left: 2%;
	}

	/* 发布按钮*/
	.submit {
		margin: 0 auto;
		width: 85%;
		height: 96rpx;
		background: $uni-bg-color-button-dark;

		border-radius: $uni-border-radius-base;
		font-size: 19px;
		font-weight: 500;
		color: $uni-bg-color;
		line-height: 96rpx;
		text-align: center;
		box-shadow: 8rpx 10rpx 25rpx -5rpx $uni-bg-color-mask;
	}
</style>