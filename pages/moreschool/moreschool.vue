<template>
	<view class="content animate__animated animate__jackInTheBox animate__faster">
		<!-- 顶部搜索界面 -->
		<view class="search-bar">
			<view class="search-bar-box">
				<view @click="toSearch()">
					<image class="search-span" src="../../static/image/search_new.png" />
				</view>
				<input confirm-type="search" @confirm="search" @focus="toSearch" value=""
					placeholder="Search universities" class="search-text" maxlength=90% />
				<view @tap="toCategory()">
					<image class="search-more" src="../../static/image/more_new.png" />
				</view>
			</view>
		</view>
		<!-- title -->
		<view class="title-school">
			school lists
		</view>
		<view class="schools" v-for="(schoolGroup, index) in groupedSchools" :key="index">
			<view class="schools-box1">
				<view @tap="toSchooldetail">
					<image class="schools-img" :src="schoolGroup[0].imageSrc" />
				</view>
				<view style="margin-left: 2%; color: #808080;">{{ schoolGroup[0].registrationCount }}</view>
				<view class="schools-name">{{ schoolGroup[0].schoolName }}
				</view>
			</view>
			<view class="schools-box2">
				<view @tap="toSchooldetail">
					<image class="schools-img" :src="schoolGroup[1].imageSrc" />
				</view>
				<view style="margin-left: 2%; color: #808080;">{{ schoolGroup[1].registrationCount }}</view>
				<view class="schools-name">{{ schoolGroup[1].schoolName }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			// 页面加载时获取数据
			this.$r({
				url: '/school/list',
				method: 'GET',
			}).then(res => {
				if (res.data.status === 200) {
					this.schoolsData = res.data.data.items.map(item => {
						return {
							id: item.id,
							imageSrc: item.imgurl,
							registrationCount: item.register_count + "k+",
							schoolName: item.name,
						}
					})
				}
			})
		},
		data() {
			return {
				search: "",
				schoolsData: [],
				// 添加更多学校数据
				// 使用一个变量来限制加载的学校组数量
				limitGroupsCount: 8, // 你可以根据需要设置限制的数量
			};
		},
		computed: {
			//使用计算属性来获取限制数量的学校组
			groupedSchools() {
				if  (!this.schoolsData.length){
					return []
				}
				const grouped = [];
				for (let i = 0; i < this.limitGroupsCount; i += 2) {
					grouped.push(this.schoolsData.slice(i, i + 2));
				}
				return grouped;
			},
		},
		methods: {
			toCategory() {
				uni.navigateTo({
					url: '../category/category',
					animationType: "zoom-out",
					animationDuration: 200
				})
			},
			toSearch() {
				console.log('fuck')
				uni.navigateTo({
					url: '../search/search',
					animationType: "zoom-out",
					animationDuration: 200
				})
			},
			toSchooldetail() {
				uni.navigateTo({
					url: '../moreschool/schooldetail',
					animationType: "zoom-out",
					animationDuration: 500
				})
			},
		}
	};
</script>


<style lang="scss">
	// @import '../../commons/css/mycss.scss';

	.search-bar {
		width: 100%;
		height: 100rpx;
		margin-top: 2%;
		margin-bottom: 20rpx;

		.search-bar-box {
			display: flex;
			margin: 0 auto;
			width: 90%;
			height: 70rpx;
			border: $uni-border-caliber solid $uni-border-color-search-bar-box;
			border-radius: $uni-border-radius-homepage-box;
		}

		.search-span {
			width: 60rpx;
			height: 50rpx;
			margin-top: 10rpx;
			margin-left: 15rpx;
			animation: tada;
			animation-duration: 1s;
			animation-iteration-count: infinite;
		}

		.search-more {
			width: 60rpx;
			height: 60rpx;
			margin-top: 6rpx;
			margin-right: 13rpx;
		}

		.search-text {
			width: 100%;
			margin-top: 15rpx;
			margin-left: 20rpx;
			font-size: $uni-font-size-search-text;
			color: $uni-tetx-color-search-text;
		}
	}

	/* 标题 */
	.title-school {
		margin-left: 5%;
		font-size: $uni-font-size-slogan;
		margin-bottom: 20rpx;
		font-weight: 600;
		margin-top: -10px;
	}

	/* 学校 */
	.schools {
		display: flex;
		margin-left: 5%;
		margin-bottom: 40rpx;
		width: 90%;

		.schools-box1 {
			width: 50%;
			border: $uni-border-caliber solid $uni-border-color-interested-box;
			border-radius: $uni-border-radius-homepage-school;
		}

		.schools-box2 {
			width: 50%;
			margin-left: 5%;
			border: $uni-border-caliber solid $uni-border-color-interested-box;
			border-radius: $uni-border-radius-homepage-school;
		}

		.schools-img {
			margin-bottom: 5rpx;
			width: 94%;
			max-height: 22vh;
			border-radius: $uni-border-radius-homepage-school;
			margin-top: 10rpx;
			margin-left: 3%;
		}

		.schools-name {
			margin-left: 2%;
			font-weight: 600;
			margin-bottom: 10rpx;
			font-size: $uni-font-size-schoolname;
		}
	}
</style>