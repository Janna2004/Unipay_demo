<template>
	<!--页面跳转动画在这里-->
  <view class="content animate__animated animate__lightSpeedInRight animate__faster">
    <!-- 顶部 -->
    <view class="search-bar">
      <view class="search-bar-box">
        <view @tap="toHome()">
          <image class="search-span" src="../../static/image/search.png"/>
        </view>
        <input confirm-type="search" @confirm="search" @input="resultlist" v-model="search_content"
               placeholder="Search collections or users" class="search-text" maxlength=90% focus/>
        <view @tap="toCategory()">
          <image class="search-more" src="../../static/image/more.png"/>
        </view>
      </view>
    </view>

    <!--弹出式关键词搜索列表实现-->
    <view class="List">
      <view class="search-item result">
        <view class="title" v-show="ListArr.length">可能想搜</view>
		
		<!--此处将关键词添加跳动动画-->
        <view class="list user anim"
              v-for="(item, index) in ListArr" :keys="index">

          <!--需要图片吗？-->
          <navigator :url="'../searchresult/searchresult?id='+item.id">
            <image :src="item.imgurl" mode=""></image>
          </navigator>

          <!--点击标签会跳转，需要item.name-->
          <view class="iteminfo">
            <navigator :url="'../searchresult/searchresult?id='+item.id" hover-class="navigator-hover">
              <button class="name">{{ item.name }}</button>
            </navigator>
          </view>
        </view>
      </view>
    </view>
    <!-- 刷新 -->
    <view class="refresh" v-if="refresh">
      <i class='iconfont icon-jiazaizhong3'></i>
      <view class="refresh-title">下拉刷新</view>
    </view>

  </view>
</template>

<script>
//import datas from '../../commons/js/datas.js'

export default {
  data() {
    return {
      pageIndex: 0,
      uid: 0,
      refresh: false,
      search_content: "", //搜索框内容
      ListArr: [{
        name: "ucla",
        imgurl: "../../static/image/deathstranding.png",
        id: "114514"
      },
        {
          name: "harvard",
          imgurl: "../../static/image/forza.png",
          id: "444555666"
        },
      ], //搜索存储列表
    }
  },
  components: {},
  onLoad() {
    console.log('search!')
  },
  onBackPress() {
    console.log("return!")
  },
  methods: {
    // 搜索（相关度匹配机制）
    search() {
      this.$r({
        url: '/goods/search',
        method: 'POST',
        data: {
          keywords: this.search_content,
          details: {
            "area": "all",
            "time": "all",
            "type": "all"
          }
        }
      }).then(
          res => {
            if (res.data.status === 200) {
              this.ListArr = res.data.data.items
            } else {
              uni.showToast({
                title: '检查网络',
                icon: 'none',
                duration: 1500
              })
            }
          })
    },
    // 传输关键字让服务器返回按关键字查找结果存入ListArr
    resultlist() {
      this.$r({
        url: '/goods/prompt',
        method: 'POST',
        data: {
          keywords: this.search_content,
        }
      }).then(
          res => {
            if (res.data.status === 200) {
              this.ListArr = res.data.data.items
            } else {
              uni.showToast({
                title: '检查网络',
                icon: 'none',
                duration: 1500
              })
            }
          })
    },
    // 获取缓存数据
    getStorages() {
      try {
        this.uid = uni.getStorageInfoSync('uid')
        // console.log(value)
      } catch (e) {
        console.log('error')
        //TODO handle the exception
      }
    },

    // 跳转fakehome
    toHome() {
    	uni.switchTab({
    		url: '../homepage/homepage',
    	})
    },
    
    toCategory() {
    	uni.navigateTo({
    		url: '../category/category',
    	})
    },
  }
}
</script>

<style lang="scss">
@import '../../commons/css/mycss.scss';

.search-bar {
  width: 100%;
  height: 100rpx;
  margin-top: 2%;
  margin-bottom: 50rpx;

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
    margin-right: 20rpx;
  }

  .search-text {
    width: 100%;
    margin-top: 15rpx;
    margin-left: 20rpx;
    font-size: $uni-font-size-search-text;
    color: $uni-tetx-color-search-text;
  }
}

.refresh {
  text-align: center;
  padding-top: 20rpx;

  i {
    font-size: $uni-font-size-refresh-icon;
    color: $uni-color-refresh-icon;
  }

  .refresh-title {
    padding-top: 10rpx;
    font-size: $uni-font-size-base;
    color: $uni-color-refresh-title;
    line-height: 40rpx;
  }
}

.List {
  padding: $uni-spacing-col-base;

  .result {
    padding-top: $uni-spacing-col-base;

    .title {
      font-size: $uni-font-size-add-title;
      font-weight: 600;
      color: $uni-text-color;
      line-height: 80rpx;
    }

    .list {
      width: 100%;
      height: 90rpx;
      padding: 20rpx 0;

      image {
        float: left;
        width: 80rpx;
        height: 80rpx;
        border-radius: $uni-border-radius-base;
      }
    }
	
	.anim {
		animation: headShake;
		animation-duration: 2.5s;
		animation-iteration-count: infinite;
	}
    .iteminfo {
      float: left;
      padding-left: $uni-spacing-col-base;

      .name {
        font-size: $uni-font-size-add-clue;
        color: $uni-text-color;
        line-height: 50rpx;
      }
    }
  }
}
</style>