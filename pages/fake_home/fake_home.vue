<template>
	<view class="content animate__animated animate__fadeIn animate__faster">
		<!-- 搜索界面 -->
		<!-- 顶部 -->
		<view class="search-bar">
			<view class="search-bar-box">
			<view @tap="toSearch()">
				<image class="search-span" src="../../static/image/search_new.png"/>
			</view>
			<input confirm-type="search" @tap="toSearch()" @confirm="search" value=""  placeholder="Search collections users or universities" class="search-text" maxlength=90%/>
			<view @tap="toCategory()">
				<image class="search-more" src="../../static/image/more_new.png"/>
			</view>
			</view>
		</view>
		
		<!-- 刷新 -->
		<view class="refresh" v-if="refresh">
			<i class="iconfont iconfont-jiazaizhong3" style= "color: rgba(60, 213, 255, 1.0);"></i>
			<view class="refresh-title">下拉刷新</view>
		</view>
		
		<!-- 首页推荐 -->
		<view class="title-text">
			Might be interested
		</view>
		
		<view class="interested-box">
			<view class="interested-box-bar">
				<image class="user-profile" src="../../static/image/sample.png"/>
				<view class="user-name">
					Leo
				</view>
				<view @tap="show_option()">
					<image class="interested-more" src="../../static/image/more2.png"/>
				</view>
			</view>
			
			<view class="interested-pic-box">
				<image mode="aspectFill" style="width:96%; height:40vh; border-radius: 10rpx; margin-top: 30rpx; margin-left: 2%;" src="../../static/image/sample.png"/>
			</view>
			
			<button class="negotiate-button" click="">Negotiate</button>
			<view class="bid-text">
				current bid
			</view>
			<view class="price-text">
				30 GBP
			</view>
			
		</view>
		
		<!-- 学校 -->
		<button class="more-button" @tap="toMoreschool()">MORE</button>
		<view class="title-text">
			Most clicked schools
		</view>
		
		<view class="schools">
			<view class="schools-box1">
				<view @tap="">
					<image class="schools-img" src="../../static/image/sample.png"/>
				</view>
				<view style="margin-left: 2%; color: #808080;">10k+</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">University of Combridge</view>
			</view>
			<view class="schools-box2">
				<view @tap="">
					<image class="schools-img" src="../../static/image/sample.png"/>
				</view>
				<view style="margin-left: 2%; color: #808080;">10k+</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">University of Oxford</view>
			</view>
		</view>
		
		<view class="schools">
			<view class="schools-box1">
				<view @tap="">
					<image class="schools-img" src="../../static/image/sample.png"/>
				</view>
				<view style="margin-left: 2%; color: #808080;">8k+</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">Imperial College London</view>
			</view>
			<view class="schools-box2">
				<view @tap="">
					<image class="schools-img" src="../../static/image/sample.png"/>
				</view>
				<view style="margin-left: 2%; color: #808080;">8k+</view>
				<view style="margin-left: 2%; font-weight: 600; margin-bottom: 10rpx;">University College London</view>
			</view>
		</view>

	</view>
</template>

<script>
	//import datas from '../../commons/js/datas.js'
	
	export default {
		data() {
			return {
				pageIndex: 0,
				refresh: false,
			}
		},
		components:{},
		onLoad() {
			this.getStorages()
		},
		onPullDownRefresh() {
			this.getStorages()
			setTimeout(function () {
					uni.stopPullDownRefresh();
			}, 2000);
		},
		methods: {
			// 搜索
			search(){
				
			},
					
			//推送选项
			show_option(){
				uni.showActionSheet({
					itemList: ['收藏', '不感兴趣', '加入黑名单'],
					success (res) {
						console.log(res.tapIndex)
					},
					fail (res) {
						console.log(res.errMsg)
					}
				})
			},
			
			// 获取缓存数据
			getStorages() {
				try{
					const value = uni.getStorageSync('usr')
					console.log('pp')
					if(value) {
						this.uid = value.id
						console.log(value.id)
						this.imgurl = this.serverUrl+'/'+ value.imgurl
						this.token = value.token
					}else {
						uni.navigateTo({
							url: '../signin/signin',
						})
					}
					
					// console.log(value)
				}catch(e){
					console.log('error')
					//TODO handle the exception
				}
			},
			toMoreschool() {
				console.log('jump')
				uni.navigateTo({
					
					url: '../moreschool/moreschool',
				})
			},
				
			// 跳转搜索页
			toSearch() {
				console.log('really')
				uni.navigateTo({
					url:'../search/search',
				})
			},

			toCategory() {
				uni.navigateTo({
					url:'../category/category',
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
	.search-bar{
		width: 100%;
		height: 100rpx;
		margin-top: 2%;
		margin-bottom: 50rpx;
		.search-bar-box{
			display: flex;
			margin: 0 auto;
			width: 90%;
			height: 70rpx;
			border:5rpx solid #c0c0c0;
			border-radius: 20rpx;
		}
		.search-span{
			width: 60rpx;
			height: 50rpx;
			margin-top: 10rpx;
			margin-left: 15rpx;
		}
		.search-more{
			width: 60rpx;
			height: 60rpx;
			margin-top: 6rpx;
			margin-right: 13rpx;
		}
		.search-text{
			width: 100%;
			margin-top: 15rpx;
			margin-left: 20rpx;
			font-size: 27rpx;
			color: #7f7f81;
		}
	}
	
	.refresh{
		text-align: center;
		padding-top: 20rpx;
		i{
			font-size: 32rpx;
			color: rgba(39,40,50,0.8);
		}
		.refresh-title{
			padding-top: 10rpx;
			font-size: $uni-font-size-base;
			color: rgba(39,40,50,0.4);
			line-height: 40rpx;
		}
	}
	
	/* 搜索界面 */
	.title_text {
		text-align: center;
		font-size: 50rpx;
		margin-bottom: 30rpx;
		font-weight: 600;
		margin-top: 12px;
	}
	/* 首页推荐 */
	.title-text {
		margin-left: 5%;
		font-size: 40rpx;
		margin-bottom: 20rpx;
		font-weight: 600;
		margin-top: -10px;
	}
	
	.interested-box {
		width: 90%;
		margin: 0 auto;
		border: 5rpx solid #D3D3D3;
		padding-top: 10rpx;
		border-radius: 20rpx;
		margin-bottom: 50rpx;
		.interested-box-bar{
			margin-top: 10rpx;
			display: flex;
			justify-content: center;
			.user-profile {
				width: 150rpx;
				height: 120rpx;
				border-radius: 50%;
				margin-left: 12px;
			}
			.user-name {
				width: 80%;
				margin-left: 15px;
				margin-top: 37rpx;
				font-size: 42rpx;
			}
			.interested-more {
				margin-top: 34rpx;
				margin-right: 5px;
				width: 60rpx;
				height: 60rpx;
				flex-shrink: 0;
			}
		}
	}
	
	.interested-pic-box {
		width:96%; 
		height:40vh; 
		border-radius: 10rpx; 
		margin-top: 18rpx; 
		margin-left: 2%;
		margin-bottom: 50rpx;
	}
	
	.bid-text{
		margin-left: 2%; 
		color: #808080;
	}
	
	.negotiate-button{
		width: 250rpx; 
		background-color: blue; 
		color: white; 
		margin-right: 2%;
		float:right;
	}
	
	.price-text{
		font-weight: 700;
		flex-basis: 100%; 
		margin-left: 2%; 
		margin-bottom: 40rpx;
	}
		
	.more-button{
		width: 120rpx; 
		height: 60rpx; 
		font-size: 11pt;
		display: flex; 
		justify-content: center; 
		align-items: center; 
		background-color: white; 
		color: lightslategrey; 
		margin-right: 6%; 
		float:right;
		margin-top: -11px;
		border: none !important;
		outline: none !important
	}
	
	/* 首页学校 */
	.schools{
		display: flex;
		margin-left: 5%;
		margin-bottom: 40rpx;
		width: 90%;
		.schools-box1{
			width: 50%;
			border: 5rpx solid #D3D3D3;
			border-radius: 10rpx; 
		}
		.schools-box2{
			width: 50%;
			margin-left: 5%;
			border: 5rpx solid #D3D3D3;
			border-radius: 10rpx; 
		}
		.schools-img{
			margin-bottom: 10rpx;
			width:96%; 
			height:25vh; 
			border-radius: 10rpx; 
			margin-top: 15rpx; 
			margin-left: 2%;
		}
	}
	
</style>
