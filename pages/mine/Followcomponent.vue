<template>
	<view class="follow-container">
		<view class="follow-btn-container">
			<button :class="isFollowing||self ?'followed-btn':'follow-btn' " @tap="toggleFollow()||(isFollowing=!isFollowing)">
				{{ isFollowing||self ? 'Following' : 'Follow' }}
			</button>
		</view>
		<view class="count-container">
			<view class="number">{{ followersCount }}</view>
			<view class="description">Followers</view>
		</view>
		<view class="count-container">
			<view class="number">{{ followingCount }}</view>
			<view class="description">Following</view>
		</view>
	</view>
</template>

<!-- 如果是用户点进自己的主页页面，则不能对自己follow，加载的页面也是自己的数据。-->
<!-- 如果点进的是别人的主页，则页面加载的是别人的数据，但是follow的那个地方还是加载该用户对此页面用户是否关注 -->
<script>
	export default {
		props: {
			// 检测类型 + 其他验证
			self: {
				type: Boolean,
				default: false,
				required: true,
			},
			func: {
				type: Function,
				require: true
			},
			isFollowing: {
				type: Boolean,
				default: true,
			},
			followers_count: {
				type: Number,
				default: 0,
			},
			following_count: {
				type: Number,
				default: 0,
			},
		},
		data() {
			return {
				// isFollowing: this.isFollowing,
				toggleFollow: this.func,
				followersCount: this.followers_count, //被关注数
				followingCount: this.following_count, //关注数
			};
		},
		methods: {
			// toggleFollow() {
			//点击follow后改变为following，并增加该页面的followersCount
			//测试用
			// this.isFollowing = !this.isFollowing;
			// TODO: 更新到后端API
			// 如果成功，可以通过 this.fetchFollowData() 更新数据



			// },
			// toggleFollow() {
			// 	uni.request({
			// 		url: 'https://your-backend-api.com/follow/userId', // 你的API endpoint
			// 		method: this.isFollowing ? 'DELETE' : 'POST',
			// 		success: (res) => {
			// 			if (res.statusCode === 200) {
			// 				this.isFollowing = !this.isFollowing;
			// 				this.fetchFollowData();
			// 			} else {
			// 				// handle error
			// 			}
			// 		}
			// 	});
			// },

			fetchFollowData() {
				// TODO: 从后端API获取关注数据，并更新followersCount和followingCount
			}
		}
	}
</script>

<style>
	.follow-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 30px;
	}

	.follow-btn-container {
		margin-left: 4%;
		width: 44vw;
	}

	.follow-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		padding: 8px 12px;
		background-color: #0000CD;
		color: white;
		border-radius: 6px;
		font-size: 18px;
	}

	.followed-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		padding: 8px 12px;
		background-color: #6f6f6f;
		color: white;
		border-radius: 6px;
		font-size: 18px;
	}

	.count-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: 2vw;
		padding-left: 3vw;
	}

	.number {
		font-size: 24px;
		font-weight: 600;
		/* 你可以调整字体大小 */
	}

	.description {
		font-size: 14px;
		color: #808080;
		font-weight: 600;
		/* 同样可以根据需要调整 */
	}
</style>