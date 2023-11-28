<template>
	<view class="emoji" :style="{height: height+'px'}">
		<view class="emoji-line" v-for="(line, i) in emoji" :key="i">
			<view class="emoji-line-item" @tap='clickEmoji(item)' v-for="(item, index) in line" :key='index'>
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			height: Number,
			default: 260
		},
		data() {
			return {
				emoji:[
					['😁','🥰','😍','😁','😁','😁','😁'],
				]
			};
		},
		methods:{
			//
			clickEmoji(e){
				this.$emit('emotion',e)
			},
		},
	}
</script>

<style lang="scss">
	.emoji {
		width: 100%;
		// height: 460rpx;
		padding: 16rpx;
		padding-bottom: 220rpx;
		box-sizing: border-box;
		overflow: hidden;
		overflow-y: auto;
		.emoji-line{
			display: flex;
			
			
			.emoji-line-item {
				flex: 1;
				text-align: center;
				font-size: 46rpx;
				line-height: 84rpx;
			}
		}
	}
	
	
</style>
