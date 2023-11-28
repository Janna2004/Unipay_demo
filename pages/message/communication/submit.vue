<template>
	<view>
		<view class="submit">
			<!-- 输入框组 -->
			<view class="submit-chat  animate__animated animate__faster animate__fadeInUpBig">
				
				<!-- 语音 -->
				<view class="bt-img" @tap="records">
					<i class="iconfont"
						 :class="{'icon-jianpan': isrecord, 'icon-yuyin': !isrecord}"></i>
				
				</view>
				
				<!-- 输入框 -->
				<textarea :class="{displaynone: isrecord}" 
									class="chat-send btn" 
									auto-height="true"
									@input="inputs"
									@focus="isFocus"
									v-model="msg"/>
				<!-- 按住说话 -->
				<view :class="{displaynone: !isrecord, voiceActive: !voiceBg}" 
							class="record btn"
							@touchstart="touchstart"
							@touchend="touchend"
							@touchmove="touchmove">按住说话</view>
				
				<!-- emojiBtn -->
				<view class="bt-img" @tap="emoji">
					<i class="iconfont icon-xiaolian"
						 :class="{'iconActive':!isemoji}"></i>
				</view>
				
				<!-- + -->
				<view v-if="msg.length===0" class="bt-img" @tap="more">
					<i class="iconfont icon-jia2"
						 :class="{'iconActive':!ismore}"></i>
				</view>
				<view @tap="inputsByClick" v-if="msg.length>0" class="bt-send">
					<view class="bt-send-text">
						发送
					</view>
				</view>
				
			</view>
			
			<!-- 表情下拉框 -->
			<view class="emoji animate__animated animate__fadeIn animate__faster" 
						:class="{displaynone: isemoji}">
				<view class="emoji-send">
					<view class="emoji-send-del" @tap="emojiDelOne">
						<i class="iconfont icon-backspace"></i>
					</view>
					<view class="emoji-send-btn" @tap="emojiSend">发送</view>
				</view>
				<emoji @emotion="emotion" :height="260"></emoji>
			</view>
			
			<!-- 拓展下拉框 -->
			<view class="more animate__animated animate__fadeIn animate__faster"
						:class="{displaynone: ismore}">
				<view class="more-list" hover-class='button-hover' @tap="sendImg('album')">
					<i class="iconfont icon-zhaopian1"></i>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendImg('camera')" hover-class='button-hover'>
					<i class="iconfont icon-ziyuan"></i>
					<view class="more-list-title">拍摄</view>
				</view>
				<view class="more-list" @tap="chooseLocation" hover-class='button-hover'>
					<i class="iconfont icon-dizhidingweiweizhi"></i>
					<view class="more-list-title">位置</view>
				</view>
				<view class="more-list" hover-class='button-hover'>
					<i class="iconfont icon-luxiang-tianchong"></i>
					<view class="more-list-title">录像</view>
				</view>
				<view class="more-list" hover-class='button-hover'>
					<i class="iconfont icon-wenjian2"></i>
					<view class="more-list-title">文件</view>
				</view>
				<view class="more-list" @tap="showPaymentOptions" hover-class='button-hover'>
					<i class="iconfont icon-pay1"></i>
					<view class="more-list-title">转账</view>
				</view>
				
				
			</view>
			
			
		</view>
		<!-- 录音背景 -->
			<view class="voice-bg" :class="{displaynone: voiceBg}">
				<view class="voice-bg-len">
					<view class="voice-bg-time" :style="{width:vLength/0.6+'%'}">{{vLength}}″</view>
				</view>
				<view class="voice-del">
					<i class="iconfont icon-quxiao"
						 :class="{iconActive1: changeIconCol}"></i>
				</view>
			</view>
	</view>
</template>

<script>
	import emoji from './emoji.vue'
	
	// 录音配置
	//const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	// innerAudioContext.autoplay = true;
	
	export default {
		data() {
			return {
				isrecord: false,
				isemoji: true,
				ismore: true,
				msg: '',//单条输入框内信息
				timer:null,
				voicePath: '',
				vLength: 0,//声音长度
				voiceBg: true,
				pageY: 0,
				changeIconCol: false
			};
		},
		components:{
			emoji
		},
		onLoad() {
			
		},
		methods:{
			// 获取位置
			chooseLocation (){
				console.log("tap location");
				uni.chooseLocation({
					success: res => {
						let { name, address, latitude, longitude } = res
						let data={
							name,address,latitude,longitude
						}
						// console.log(data)
						// json->字符串 方便存储到数据库
						let strData = JSON.stringify(data)
						this.send(strData, 3)
					}
				});
			},
			
			// 聚焦输入框
			isFocus(){
				// console.log(this.msgs)
				this.isemoji = true
				this.ismore = true
				setTimeout(()=>{
					this.getSubHeigh()
				}, 10)
				
			},
			// 切换音频
			records() {
				this.isemoji = true
				this.ismore = true
				this.isrecord = !this.isrecord
				setTimeout(()=>{
					this.getSubHeigh()
				}, 10)
			},
			
			// 表情按钮
			emoji (){
				this.isemoji = !this.isemoji
				this.ismore = true
				setTimeout(()=>{
					this.getSubHeigh()
				},10)
			},
			// 文字发送(回车)
			inputs (e) {
				let chatMsg = e.detail.value
				let pos = chatMsg.indexOf('\n')
				if(pos!=-1 && chatMsg.length>1){	// 匹配到回车键
					this.send(this.msg, 0)
				}	
			},
			// 文字发送（按钮）
			inputsByClick(){
				console.log("sasf")
				this.send(this.msg, 0)
			},
			// 接收点击的表情
			emotion(e){
				// console.log(e)
				console.log("sasf")
				this.msg += e
			},
			// 表情内发送按钮
			emojiSend (){
				if(this.msg.length>1){	// 匹配到回车键
					this.send(this.msg, 0)
				}	
			},
			// 表情内删除表情
			emojiDelOne() {
				if(this.msg.length>0){	// 匹配到回车键
					this.msg = this.msg.substring(0, this.msg.length-1)
				}	
			},
			// +按钮
			more (){
				this.ismore = !this.ismore
				this.isemoji = true
				setTimeout(()=>{
					this.getSubHeigh()
				},10)
			},
			// 图片发送
			sendImg(e){
				let count = 9
				if(e==='album'){
					count = 9	
				} else {
					count = 1
				}
				
				uni.chooseImage({
			    count: count, //默认9
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: [e], //从相册选择
			    success: (res) => {
						let filePath = res.tempFilePaths
						filePath.map((item)=>{
							// console.log(this.msg, item)
							this.send(item, 1)
						})
			    }
				});
			},
			// 音频处理
			touchstart:function(e){
				// 点击获取高度
				this.pageY = e.changedTouches[0].pageY
				let i=1
				this.timer = setInterval(()=>{
					this.vLength = i
					i++
					if(i>59) {
						clearInterval(this.timer)
						this.touchend()
					}
					
				}, 1000)
				this.voiceBg = false
				recorderManager.start();
			},
			touchend:function() {
				clearInterval(this.timer)
				recorderManager.stop();
				
				recorderManager.onStop((res)=> {
					// console.log('recorder stop' + JSON.stringify(res));
					// 音频数据
					let data = {
						voice: res.tempFilePath,
						time: this.vLength
					}
					if(!this.voiceBg && this.vLength>0) {
						this.send(data, 2)
					}
						
					this.vLength=0
					this.voiceBg = true
					this.changeIconCol = false				
				});
			},
			// 上滑结束录音
			touchmove(e){
				// console.log(e.changedTouches[0].pageY)
				this.changeIconCol = true
				if(this.pageY - e.changedTouches[0].pageY > 60){
					this.voiceBg = true
				}
			},
			// 播放录音
			playVoice() {
				if (this.voicePath) {
					innerAudioContext.src = this.voicePath;
					innerAudioContext.play();
				}
			},
			// 获取高度
			getSubHeigh() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.submit').boundingClientRect(data=>{
					// console.log(data.height)
					this.$emit('heights', data.height)
				}).exec()
			},
			// 发送封装
			send (msg, types) {
				console.log("sasf")
				let data = {
					msg, types	// 消息类型
				}
				console.log("sasf")
				this.$emit('inputs', data)
				setTimeout(()=>{
					this.msg = ''
				}, 0)
			},
			//支付选项
			showPaymentOptions() {
			    uni.showActionSheet({
			        itemList: ['微信支付', '支付宝支付'],
			        success: (res) => {
			          if (res.tapIndex === 0) {
			            // 微信支付选项被选中
			            console.log('微信支付');
			            // 这里可以添加微信支付的逻辑
			          } else if (res.tapIndex === 1) {
			            // 支付宝支付选项被选中
			            console.log('支付宝支付');
			            // 跳转到新页面
			            uni.navigateTo({
			              url: '../../payment/alipay' // 替换为您的页面路径
			            });
			          }
			        },
			        fail(err) {
			          console.log('ActionSheet失败：', err);
			        }
			    });
			}
		}
	}
</script>

<style lang="scss">
	.submit {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 1002;
		background: rgba(244,244,244,1);
		// background: rgba(25, 25, 25, 0.4);
		// padding-bottom: var(--status-bar-height);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.submit-chat {
		width: 100%;
		// height: 100rpx;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;
		
		.bt-img {
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			line-height: 56rpx;
			padding-bottom: 10rpx;
			i {
				font-size: 56rpx;
			}
			.icon-xiaolian {
				display: inline-block;
				font-size: 60rpx;
			}

		}
		.btn {
			flex: auto;
			background-color: #fff;
			border-radius: 25rpx;
			padding: 15rpx;
			max-height: 180rpx;
			margin: 0 10rpx;
		}
		.chat-send {
			line-height: 54rpx;
		}
		.record {
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
			line-height: 54rpx;
		}
		
		.bt-send{
			flex: none;
			line-height: 64rpx;
			width: 100rpx;
			height: 71rpx;
			text-align: center;
			.bt-send-text {
				font-size: 28rpx;
				font-weight: 500;
				background-color: $uni-color-logo;
				border-radius: $uni-border-radius-base;
				padding: 0rpx 10rpx;
				padding-top: -20rpx;
			}
		}
	}
	.emoji {
		width: 100%;
		height: 460rpx;
		background: #FFFFFF;
		box-shadow: 0 -1rpx 0 0 rgba(0,0,0,0.1);
		
		.emoji-send{
			width: 280rpx;
			height: 100rpx;
			position: fixed;
			bottom: 40rpx;
			right: 0;
			// padding-top: 20rpx;
			display: flex;
			// padding-bottom: env(safe-area-inset-bottom);
			
			.emoji-send-btn {
				flex: 1;
				width: 120rpx;
				height: 70rpx;
				background: $uni-color-logo;
				font-size: 32rpx;
				text-align: center;
				line-height: 70rpx;
				border-radius: 24rpx;
				margin: 0 32rpx 0 20rpx;
				box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
			}
			.emoji-send-del {
				flex: 1;
				width: 120rpx;
				height: 70rpx;
				background: #efefef;
				text-align: center;
				line-height: 70rpx;
				border-radius: 24rpx;
				margin-left: 24rpx;
				color: #000;
				box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
				i{
					font-size: 60rpx;
				}
			}
			
		}
	}
	
	.more {
		width: 100%;
		height: 460rpx;
		background: #FFFFFF;
		box-shadow: 0 -1rpx 0 0 rgba(0,0,0,0.1);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		box-sizing: border-box;
		.more-list {
			width: 139rpx;
			text-align: center;
			background-color: $uni-bg-color-grey;
			margin: 10rpx;
			padding: 15rpx;
			border-radius: 20rpx;
			box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
			
			i {
				font-size: 66rpx;
			}
			.more-list-title {
				font-size: 26rpx;
				padding-top: 7rpx;
				color: $uni-text-color-grey;
			}
		}
	}
	
	.voice-bg{
		z-index: 1001;
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,0.3);
		position: fixed;
		top: 0;
		bottom: 0;
		.voice-bg-len {
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			background-color: rgba(255,255,255,0.2);
			border-radius: 42rpx;
			text-align: center;
		}
		.voice-bg-time {
			display: inline-block;
			line-height: 84rpx;
			max-width: 600rpx;
			min-width: 120rpx;
			background-color: $uni-color-primary;
			border-radius: 42rpx;
		}
		.voice-del {
			position: absolute;
			bottom: 148rpx;
			width: 100%;
			text-align: center;
			i {
				color: #fff;
				font-size: 86rpx;
			}
			
			margin-bottom: env(safe-area-inset-bottom);
		}
		
	}
	
	
	// 工具类
	.displaynone {
		display: none;
	}
	.iconActive {
		color: #808080;
	}
	.iconActive1 {
		color: $uni-color-primary !important;
	}
	.voiceActive {
		background-color: $uni-bg-color-hover !important;
	}
</style>
