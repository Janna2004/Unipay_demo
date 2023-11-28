if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  const isMail = (text) => {
    let reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
    return reg.test(text);
  };
  const isPwdValid = (text) => {
    return text.length > 6;
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$i = {
    data() {
      return {
        type: "password",
        username: "",
        password: "",
        iserr: false,
        look: false,
        // 是否显示密码
        debug: true
      };
    },
    computed: {
      logintype() {
        return isMail(this.username) ? "email" : "phone";
      }
    },
    onLoad(e) {
      const token2 = uni.getStorageSync("token");
      if (token2) {
        this.$r({
          url: "/user/info",
          method: "GET"
        }).then((res) => {
          if (res.data.status === 200) {
            uni.setStorage({
              key: "userdata",
              data: res.data.data
            });
            this.toHome();
          } else {
            uni.removeStorage({
              key: "token"
            });
          }
        });
      }
      if (e.username) {
        this.username = e.username;
        uni.showToast({
          title: "注册成功！请登录",
          icon: "none",
          duration: 1500
        });
      }
    },
    methods: {
      // 登录
      pwdlogin() {
        if (this.debug) {
          formatAppLog("log", "at pages/signin/signin.vue:113", "Debug on!");
          this.toHome();
          uni.setStorageSync(
            "token",
            "111111111"
          );
          uni.setStorageSync(
            "userdata",
            {
              username: "leo",
              avatar: "../../static/image/mine.png",
              school: "Beijing University of Posts and Telecommunications",
              email: "whl@whl.com",
              gender: "male",
              phone: "1111111111",
              followers_count: 12,
              following_count: ""
            }
          );
          return;
        }
        const f_username = this.username;
        this.logintype;
        formatAppLog("log", "at pages/signin/signin.vue:135", f_username);
        formatAppLog("log", "at pages/signin/signin.vue:136", this.logintype);
        this.$r({
          url: "/user/login",
          method: "POST",
          data: {
            type: this.logintype,
            data: {
              userinfo: this.username,
              pwd: this.password
            }
          }
        }).then((res) => {
          if (res.data.status === 200) {
            this.toHome();
            uni.setStorage({
              key: "token",
              data: res.data.token,
              success: function() {
                formatAppLog("log", "at pages/signin/signin.vue:154", "success store user" + f_username);
                formatAppLog("log", "at pages/signin/signin.vue:155", res.data.data.username);
              }
            });
            uni.setStorage({
              key: "username",
              data: res.data.username,
              success: function() {
                formatAppLog("log", "at pages/signin/signin.vue:162", "success store user" + f_username);
              }
            });
          } else {
            this.iserr = true;
            this.password = "";
          }
        });
      },
      wxLogin() {
        formatAppLog("log", "at pages/signin/signin.vue:172", "wx login!");
        uni.login({
          provider: "weixin",
          onlyAuthorize: true,
          success: (event) => {
            formatAppLog("log", "at pages/signin/signin.vue:177", "success wx oathu");
            const {
              code
            } = event;
            this.$r({
              url: "/user/login",
              method: "POST",
              data: {
                type: "weixin",
                data: {
                  userinfo: code
                }
              }
            }).then((res) => {
              if (res.data.status === 200) {
                this.toHome();
                uni.setStorage({
                  key: "uid",
                  data: res.data.uid,
                  success: function() {
                    formatAppLog("log", "at pages/signin/signin.vue:197", "success store user");
                    formatAppLog("log", "at pages/signin/signin.vue:198", res.data.data.username);
                  }
                });
                uni.setStorage({
                  key: "username",
                  data: res.data.username,
                  success: function() {
                    formatAppLog("log", "at pages/signin/signin.vue:205", "success store user");
                  }
                });
              } else {
                uni.showToast({
                  title: "微信登录失败！",
                  icon: "none",
                  duration: 1500
                });
              }
            });
          },
          fail: (err) => {
            formatAppLog("log", "at pages/signin/signin.vue:218", err);
            uni.showToast({
              title: "微信登录失败！",
              icon: "none",
              duration: 1500
            });
          }
        });
      },
      // 密码是否显示
      looks() {
        if (this.look) {
          this.type = "password";
          this.look = !this.look;
        } else {
          this.type = "text";
          this.look = !this.look;
        }
      },
      // 跳转注册页面
      toSignup() {
        uni.navigateTo({
          url: "../signup/signup",
          animationType: "zoom-out",
          animationDuration: 200
        });
      },
      // 跳转主页
      toHome() {
        uni.switchTab({
          url: "../homepage/homepage",
          animationType: "zoom-out",
          animationDuration: 200
        });
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "contents animate__animated animate__fadeIn animate__faster" }, [
      vue.createCommentVNode(" 顶部 "),
      vue.createElementVNode("view", { class: "top-bar" }, [
        vue.createElementVNode("view", { class: "top-bar-right" }, [
          vue.createElementVNode("view", {
            onClick: _cache[0] || (_cache[0] = (...args) => $options.toSignup && $options.toSignup(...args)),
            class: "search"
          }, [
            vue.createElementVNode("view", { class: "text" }, " 注册 ")
          ])
        ])
      ]),
      vue.createCommentVNode(" logo "),
      vue.createElementVNode("view", { class: "logo" }, [
        vue.createElementVNode("view", { class: "moni-img-logo" }, [
          vue.createElementVNode("view", {
            style: { "display": "inline-block" },
            class: "animate__animated animate__bounceInDown"
          }, "Uniswap"),
          vue.createCommentVNode(' <i class="iconfont icon-kakao-talk-fill logo"></i> ')
        ])
      ]),
      vue.createCommentVNode(" 表单 "),
      vue.createElementVNode("view", { class: "main" }, [
        vue.createElementVNode("view", { class: "slogan" }, [
          vue.createElementVNode("span", null, "登陆")
        ]),
        vue.createElementVNode("view", { class: "inputs" }, [
          vue.createElementVNode("view", { class: "inputgroup" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                onFocus: _cache[1] || (_cache[1] = ($event) => $data.iserr = false),
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.username = $event),
                class: "username",
                type: "text",
                placeholder: "手机号/邮箱",
                "placeholder-style": "color: #aaa; font-weight:400;"
              },
              null,
              544
              /* HYDRATE_EVENTS, NEED_PATCH */
            ), [
              [vue.vModelText, $data.username]
            ])
          ]),
          vue.createElementVNode("view", { class: "inputs-div" }, [
            vue.createElementVNode("form", null, [
              vue.withDirectives(vue.createElementVNode("input", {
                onFocus: _cache[3] || (_cache[3] = ($event) => $data.iserr = false),
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.password = $event),
                class: "psw",
                type: $data.type,
                placeholder: "密码",
                "placeholder-style": "color: #aaa; font-weight:400;"
              }, null, 40, ["type"]), [
                [vue.vModelDynamic, $data.password]
              ])
            ]),
            vue.createCommentVNode(' <i @click="looks" v-if="!look" class="iconfont icon-yanjing ok" style="color: #808080; font-size: 24px; line-height: 24px; margin-top: -15px;margin-right: 7px;"></i>\r\n            <i @click="looks" v-if="look" class="iconfont icon-yanjingnew ok"\r\n              style="color: rgba(255, 228, 49, 1); font-size: 24px; line-height: 24px; margin-top: -15px;margin-right: 7px;"></i> '),
            vue.createElementVNode("view", { class: "eye-img-container" }, [
              !$data.look ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                onClick: _cache[5] || (_cache[5] = (...args) => $options.looks && $options.looks(...args)),
                class: "eye-img",
                src: "/static/image/eye_close.png"
              })) : vue.createCommentVNode("v-if", true),
              $data.look ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 1,
                onClick: _cache[6] || (_cache[6] = (...args) => $options.looks && $options.looks(...args)),
                class: "eye-img eye-open",
                src: "/static/image/eye_open.png"
              })) : vue.createCommentVNode("v-if", true)
            ])
          ])
        ]),
        $data.iserr ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "tips"
        }, "账号或密码错误！")) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode("view", {
        class: "submit",
        onClick: _cache[7] || (_cache[7] = (...args) => $options.pwdlogin && $options.pwdlogin(...args)),
        "hover-class": "button-hover"
      }, "登陆"),
      vue.createCommentVNode(" 底部logo "),
      vue.createElementVNode("view", { class: "bot-logo" }, [
        vue.createCommentVNode(' <i class="iconfont icon-tengxun"></i> '),
        vue.createElementVNode("view", {
          onClick: _cache[8] || (_cache[8] = (...args) => $options.wxLogin && $options.wxLogin(...args))
        }, "微信"),
        vue.createElementVNode("span", null, "Uniswap Dev Version")
      ])
    ]);
  }
  const PagesSigninSignin = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/signin/signin.vue"]]);
  const _sfc_main$h = {
    data() {
      return {
        type: "password",
        info: "",
        infoType: "phone",
        isPhoneRepeat: true,
        // 用户是否占用
        isMailRepeat: true,
        // 邮箱是否可用
        // isMailValid: false, // 邮箱是否无效（文字）
        look: false,
        // 是否显示密码
        ispwdValid: true,
        email: "",
        // isok: false, // 注册信息是否完整
        username: "",
        psw: ""
        // init: true
      };
    },
    computed: {
      // 判断按钮变色
      isOk() {
        formatAppLog("log", "at pages/signup/signup.vue:92", !this.isPhoneRepeat, !this.isMailRepeat, this.ispwdValid);
        if (this.psw && this.info && this.username && !this.isPhoneRepeat && !this.isMailRepeat && this.ispwdValid)
          return true;
        return false;
      }
    },
    onLoad(e) {
    },
    methods: {
      // 密码是否显示
      looks() {
        if (this.look) {
          this.type = "password";
          this.look = !this.look;
        } else {
          this.type = "text";
          this.look = !this.look;
        }
      },
      // 设置用户名
      setUsername(e) {
        this.username = e.detail.value;
      },
      //检测类型
      checkType(e) {
        this.info = e.detail.value;
        if (isMail(this.info)) {
          this.infoType = "mail";
          this.isPhoneRepeat = false;
          this.$r({
            url: "/user/mail_exist",
            method: "POST",
            data: {
              "email": this.info
            }
          }).then((res) => {
            if (res.data.status === 404) {
              this.isMailRepeat = false;
            } else {
              this.isMailRepeat = true;
            }
          });
        } else {
          this.infoType = "phone";
          this.isMailRepeat = false;
          this.$r({
            url: "/user/phone_exist",
            method: "POST",
            data: {
              phonenumber: this.info
            }
          }).then((res) => {
            if (res.data.status === 404) {
              this.isPhoneRepeat = false;
            } else {
              this.isPhoneRepeat = true;
            }
          });
        }
      },
      checkPwd(e) {
        this.psw = e.detail.value;
        this.ispwdValid = isPwdValid(this.psw);
      },
      // 注册提交
      signUp() {
        if (this.isOk) {
          var that = this;
          uni.showLoading({
            title: "正在注册",
            mask: true
          });
          this.$r({
            url: "/user/signup",
            method: "POST",
            data: {
              data: {
                userinfo: that.info,
                pwd: that.psw,
                username: that.username
              },
              type: that.infoType
            }
          }).then((res) => {
            formatAppLog("log", "at pages/signup/signup.vue:182", res);
            uni.hideLoading();
            if (res.data.status === 200) {
              uni.reLaunch({
                url: `/pages/signin/signin?username=${that.info}&pwd=${that.psw}`
              });
            } else {
              uni.showToast({
                title: res.data.status + ":注册失败，请联系开发者",
                icon: "none",
                duration: 2e3
              });
            }
          });
        }
      },
      // 返回上一页
      backOnePage() {
        uni.navigateBack({
          delta: 1,
          animationType: "zoom-in",
          animationDuration: 200
        });
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "contents animate__animated animate__fadeIn animate__faster" }, [
      vue.createCommentVNode(" 顶部 "),
      vue.createElementVNode("view", { class: "top-bar" }, [
        vue.createElementVNode("view", {
          onClick: _cache[0] || (_cache[0] = (...args) => $options.backOnePage && $options.backOnePage(...args)),
          class: "top-bar-left"
        }, [
          vue.createElementVNode("i", { class: "iconfont icon-xiazai6" })
        ])
      ]),
      vue.createCommentVNode(" logo "),
      vue.createElementVNode("view", { class: "logo" }, [
        vue.createElementVNode("view", { class: "moni-img-logo" }, [
          vue.createElementVNode("view", {
            style: { "display": "inline-block" },
            class: "animate__animated animate__bounceInDown"
          }, "Uniswap"),
          vue.createCommentVNode(' <i class="iconfont icon-kakao-talk-fill logo"></i> ')
        ])
      ]),
      vue.createCommentVNode(" 表单 "),
      vue.createElementVNode("view", { class: "main" }, [
        vue.createElementVNode("view", { class: "title" }, "注册中心"),
        vue.createElementVNode("view", { class: "inputs" }, [
          vue.createElementVNode("view", { class: "inputgroup" }, [
            vue.createElementVNode("view", { class: "inputs-div" }, [
              vue.createElementVNode(
                "input",
                {
                  onBlur: _cache[1] || (_cache[1] = (...args) => $options.setUsername && $options.setUsername(...args)),
                  class: "user",
                  type: "text",
                  value: "",
                  placeholder: "用户名",
                  "placeholder-style": "color: #aaa; font-weight:400;"
                },
                null,
                32
                /* HYDRATE_EVENTS */
              ),
              vue.createCommentVNode(' 						<view v-if="isUserRepeat" class="employ">手机号码已注册</view>\r\n						<i v-if="isUserRepeat" class="iconfont icon-profile ok"></i> ')
            ])
          ]),
          vue.createElementVNode("view", { class: "spacer" }),
          vue.createElementVNode("view", { class: "inputgroup" }, [
            vue.createElementVNode("view", { class: "inputs-div" }, [
              vue.createElementVNode(
                "input",
                {
                  onBlur: _cache[2] || (_cache[2] = (...args) => $options.checkType && $options.checkType(...args)),
                  class: "email",
                  type: "text",
                  value: "",
                  placeholder: "邮箱/手机号码",
                  "placeholder-style": "color: #aaa; font-weight:400;"
                },
                null,
                32
                /* HYDRATE_EVENTS */
              ),
              vue.createCommentVNode(' <view v-if="!isMailValid" class="invalid">无效邮箱</view> '),
              $data.info && $data.isMailRepeat ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "invalid"
              }, "重复邮箱")) : vue.createCommentVNode("v-if", true),
              $data.info && $data.isPhoneRepeat ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "employ"
              }, "手机号码已注册")) : vue.createCommentVNode("v-if", true),
              vue.createCommentVNode(' <i v-if="isMailRepeat" class="iconfont icon-atsign ok"></i> ')
            ])
          ]),
          vue.createElementVNode("view", { class: "spacer" }),
          vue.createElementVNode("view", { class: "inputs-div" }, [
            vue.createElementVNode("input", {
              onInput: _cache[3] || (_cache[3] = (...args) => $options.checkPwd && $options.checkPwd(...args)),
              class: "psw",
              type: $data.type,
              maxlength: "140",
              stepautocomplete: "off",
              value: "",
              placeholder: "密码",
              "placeholder-style": "color: #aaa; font-weight: 400;"
            }, null, 40, ["type"]),
            !$data.ispwdValid ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "employ"
            }, "请输入至少6位密码")) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(' <i @click="looks" v-if="!look" class="iconfont icon-yanjing ok"\r\n						style="color: #808080; font-size: 24px; line-height: 24px; margin-top: -15px;margin-right: 7px;"></i>\r\n					<i @click="looks" v-if="look" class="iconfont icon-yanjing ok"\r\n						style="color: rgba(255, 228, 49, 1); font-size: 24px; line-height: 24px; margin-top: -15px;margin-right: 7px;"></i> '),
            vue.createElementVNode("view", { class: "eye-img-container" }, [
              !$data.look ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                onClick: _cache[4] || (_cache[4] = (...args) => $options.looks && $options.looks(...args)),
                class: "eye-img",
                src: "/static/image/eye_close.png"
              })) : vue.createCommentVNode("v-if", true),
              $data.look ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 1,
                onClick: _cache[5] || (_cache[5] = (...args) => $options.looks && $options.looks(...args)),
                class: "eye-img eye-open",
                src: "/static/image/eye_open.png"
              })) : vue.createCommentVNode("v-if", true)
            ])
          ])
        ])
      ]),
      vue.createElementVNode(
        "view",
        {
          onClick: _cache[6] || (_cache[6] = (...args) => $options.signUp && $options.signUp(...args)),
          class: vue.normalizeClass({ submit: $options.isOk, submit1: !$options.isOk })
        },
        "点击注册",
        2
        /* CLASS */
      ),
      vue.createCommentVNode(" 底部logo "),
      vue.createElementVNode("view", { class: "bot-logo" }, [
        vue.createCommentVNode(' <i class="iconfont icon-tengxun"></i> '),
        vue.createElementVNode("span", null, " Uniswap Dev Version")
      ])
    ]);
  }
  const PagesSignupSignup = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/signup/signup.vue"]]);
  const _sfc_main$g = {
    data() {
      return {
        pageIndex: 0,
        refresh: false,
        bottom_status: "more"
      };
    },
    components: {},
    onLoad() {
      formatAppLog("log", "at pages/homepage/homepage.vue:188", "fake_home!");
      this.getStorages();
    },
    onPullDownRefresh() {
      this.getStorages();
      setTimeout(function() {
        uni.stopPullDownRefresh();
      }, 1e3);
    },
    onReachBottom() {
      formatAppLog("log", "at pages/homepage/homepage.vue:198", "reach bottom!");
      this.bottom_status = "loading";
      setTimeout(() => {
        this.bottom_status = "noMore";
      }, 1e3);
    },
    methods: {
      // 搜索
      search() {
      },
      //推送选项
      show_option() {
        uni.showActionSheet({
          itemList: ["收藏", "不感兴趣", "加入黑名单"],
          success(res) {
            formatAppLog("log", "at pages/homepage/homepage.vue:215", res.tapIndex);
          },
          fail(res) {
            formatAppLog("log", "at pages/homepage/homepage.vue:218", res.errMsg);
          }
        });
      },
      // 获取缓存数据
      getStorages() {
        try {
          const value = uni.getStorageSync("usr");
          if (value) {
            this.uid = value.id;
            formatAppLog("log", "at pages/homepage/homepage.vue:229", value.id);
            this.imgurl = this.serverUrl + "/" + value.imgurl;
            this.token = value.token;
          } else {
          }
        } catch (e) {
          formatAppLog("log", "at pages/homepage/homepage.vue:240", "error");
        }
      },
      toMoreschool() {
        formatAppLog("log", "at pages/homepage/homepage.vue:245", "jump");
        uni.navigateTo({
          url: "../moreschool/moreschool",
          animationType: "zoom-out",
          animationDuration: 200
        });
      },
      // 跳转搜索页
      toSearch() {
        formatAppLog("log", "at pages/homepage/homepage.vue:255", "really");
        uni.navigateTo({
          url: "../search/search"
        });
      },
      toCategory() {
        uni.navigateTo({
          url: "../category/category"
        });
      },
      toDetails() {
        uni.navigateTo({
          url: "../detail/detail"
        });
      },
      toSchooldetail() {
        uni.navigateTo({
          url: "../moreschool/schooldetail",
          animationType: "zoom-out",
          animationDuration: 500
        });
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode("页面跳转动画在这里"),
        vue.createElementVNode("view", { class: "content animate__animated animate__zoomIn animate__faster" }, [
          vue.createCommentVNode(" 搜索界面 "),
          vue.createCommentVNode(" 顶部 "),
          vue.createElementVNode("view", { class: "search-bar" }, [
            vue.createElementVNode("view", { class: "search-bar-box" }, [
              vue.createElementVNode("view", {
                onClick: _cache[0] || (_cache[0] = ($event) => $options.toSearch())
              }, [
                vue.createElementVNode("image", {
                  class: "search-span",
                  src: "/static/image/search_new.png"
                })
              ]),
              vue.createElementVNode(
                "input",
                {
                  "confirm-type": "search",
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.toSearch()),
                  onConfirm: _cache[2] || (_cache[2] = (...args) => $options.search && $options.search(...args)),
                  value: "",
                  placeholder: "Search collections users or universities",
                  class: "search-text",
                  maxlength: "90%/"
                },
                null,
                32
                /* HYDRATE_EVENTS */
              ),
              vue.createElementVNode("view", {
                onClick: _cache[3] || (_cache[3] = ($event) => $options.toCategory())
              }, [
                vue.createElementVNode("image", {
                  class: "search-more",
                  src: "/static/image/more_new.png"
                })
              ])
            ])
          ]),
          vue.createCommentVNode(" 刷新 "),
          $data.refresh ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "refresh"
          }, [
            vue.createElementVNode("i", {
              class: "iconfont iconfont-jiazaizhong3",
              style: { "color": "$uni-color-logo" }
            }),
            vue.createElementVNode("view", { class: "refresh-title" }, "下拉刷新")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 首页推荐 "),
          vue.createElementVNode("view", { class: "title-text" }, " Might be interested "),
          vue.createElementVNode("view", { class: "interested" }, [
            vue.createElementVNode("view", { class: "interested-box1" }, [
              vue.createElementVNode("view", { class: "interested-box-bar" }, [
                vue.createElementVNode("image", {
                  class: "user-profile",
                  src: "/static/image/sample.png"
                }),
                vue.createElementVNode("view", { class: "user-name" }, " Leo "),
                vue.createElementVNode("view", {
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.show_option())
                }, [
                  vue.createElementVNode("image", {
                    class: "interested-more",
                    src: "/static/image/more2.png"
                  })
                ])
              ]),
              vue.createElementVNode("view", {
                onClick: _cache[5] || (_cache[5] = ($event) => $options.toDetails())
              }, [
                vue.createCommentVNode(" 得改 "),
                vue.createElementVNode("image", {
                  class: "interested-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("button", {
                class: "negotiate-button",
                click: ""
              }, "Negotiate"),
              vue.createElementVNode("view", { class: "bid-text" }, " current bid "),
              vue.createElementVNode("view", { class: "price-text" }, " 30 GBP ")
            ]),
            vue.createElementVNode("view", { class: "interested-box2" }, [
              vue.createElementVNode("view", { class: "interested-box-bar" }, [
                vue.createElementVNode("image", {
                  class: "user-profile",
                  src: "/static/image/sample.png"
                }),
                vue.createElementVNode("view", { class: "user-name" }, " Leo "),
                vue.createElementVNode("view", {
                  onClick: _cache[6] || (_cache[6] = ($event) => $options.show_option())
                }, [
                  vue.createElementVNode("image", {
                    class: "interested-more",
                    src: "/static/image/more2.png"
                  })
                ])
              ]),
              vue.createElementVNode("view", {
                onClick: _cache[7] || (_cache[7] = ($event) => $options.toDetails())
              }, [
                vue.createCommentVNode(" 得改 "),
                vue.createElementVNode("image", {
                  class: "interested-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("button", {
                class: "negotiate-button",
                click: ""
              }, "Negotiate"),
              vue.createElementVNode("view", { class: "bid-text" }, " current bid "),
              vue.createElementVNode("view", { class: "price-text" }, " 30 GBP ")
            ])
          ]),
          vue.createElementVNode("view", { class: "interested" }, [
            vue.createElementVNode("view", { class: "interested-box1" }, [
              vue.createElementVNode("view", { class: "interested-box-bar" }, [
                vue.createElementVNode("image", {
                  class: "user-profile",
                  src: "/static/image/sample.png"
                }),
                vue.createElementVNode("view", { class: "user-name" }, " Leo "),
                vue.createElementVNode("view", {
                  onClick: _cache[8] || (_cache[8] = ($event) => $options.show_option())
                }, [
                  vue.createElementVNode("image", {
                    class: "interested-more",
                    src: "/static/image/more2.png"
                  })
                ])
              ]),
              vue.createElementVNode("view", {
                onClick: _cache[9] || (_cache[9] = () => {
                })
              }, [
                vue.createElementVNode("image", {
                  class: "interested-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("button", {
                class: "negotiate-button",
                click: ""
              }, "Negotiate"),
              vue.createElementVNode("view", { class: "bid-text" }, " current bid "),
              vue.createElementVNode("view", { class: "price-text" }, " 30 GBP ")
            ]),
            vue.createElementVNode("view", { class: "interested-box2" }, [
              vue.createElementVNode("view", { class: "interested-box-bar" }, [
                vue.createElementVNode("image", {
                  class: "user-profile",
                  src: "/static/image/sample.png"
                }),
                vue.createElementVNode("view", { class: "user-name" }, " Leo "),
                vue.createElementVNode("view", {
                  onClick: _cache[10] || (_cache[10] = ($event) => $options.show_option())
                }, [
                  vue.createElementVNode("image", {
                    class: "interested-more",
                    src: "/static/image/more2.png"
                  })
                ])
              ]),
              vue.createElementVNode("view", {
                onClick: _cache[11] || (_cache[11] = () => {
                })
              }, [
                vue.createElementVNode("image", {
                  class: "interested-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("button", {
                class: "negotiate-button",
                click: ""
              }, "Negotiate"),
              vue.createElementVNode("view", { class: "bid-text" }, " current bid "),
              vue.createElementVNode("view", { class: "price-text" }, " 30 GBP ")
            ])
          ]),
          vue.createCommentVNode(" 学校 "),
          vue.createElementVNode("button", {
            class: "more-button",
            onClick: _cache[12] || (_cache[12] = ($event) => $options.toMoreschool())
          }, "MORE"),
          vue.createElementVNode("view", { class: "title-text" }, " Most clicked schools "),
          vue.createElementVNode("view", { class: "schools" }, [
            vue.createElementVNode("view", { class: "schools-box1" }, [
              vue.createElementVNode("view", {
                onClick: _cache[13] || (_cache[13] = (...args) => $options.toSchooldetail && $options.toSchooldetail(...args))
              }, [
                vue.createCommentVNode("需要大改该页面实现逻辑"),
                vue.createElementVNode("image", {
                  class: "schools-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "color": "$uni-text-color-grey" } }, "10k+"),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "font-weight": "600", "margin-bottom": "10rpx" } }, "University of Combridge")
            ]),
            vue.createElementVNode("view", { class: "schools-box2" }, [
              vue.createElementVNode("view", {
                onClick: _cache[14] || (_cache[14] = (...args) => $options.toSchooldetail && $options.toSchooldetail(...args))
              }, [
                vue.createElementVNode("image", {
                  class: "schools-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "color": "$uni-text-color-grey" } }, "10k+"),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "font-weight": "600", "margin-bottom": "10rpx" } }, "University of Oxford")
            ])
          ]),
          vue.createElementVNode("view", { class: "schools" }, [
            vue.createElementVNode("view", { class: "schools-box1" }, [
              vue.createElementVNode("view", {
                onClick: _cache[15] || (_cache[15] = (...args) => $options.toSchooldetail && $options.toSchooldetail(...args))
              }, [
                vue.createElementVNode("image", {
                  class: "schools-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "color": "$uni-text-color-grey" } }, "8k+"),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "font-weight": "600", "margin-bottom": "10rpx" } }, "Imperial College London")
            ]),
            vue.createElementVNode("view", { class: "schools-box2" }, [
              vue.createElementVNode("view", {
                onClick: _cache[16] || (_cache[16] = (...args) => $options.toSchooldetail && $options.toSchooldetail(...args))
              }, [
                vue.createElementVNode("image", {
                  class: "schools-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "color": "$uni-text-color-grey" } }, "8k+"),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "font-weight": "600", "margin-bottom": "10rpx" } }, "University College London")
            ])
          ])
        ]),
        vue.createCommentVNode(' <uni-load-more :status="bottom_status"></uni-load-more> ')
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesHomepageHomepage = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/homepage/homepage.vue"]]);
  const _sfc_main$f = {
    onLoad() {
      this.$r({
        url: "/school/list",
        method: "GET"
      }).then((res) => {
        if (res.data.status === 200) {
          this.schoolsData = res.data.data.items.map((item) => {
            return {
              id: item.id,
              imageSrc: item.imgurl,
              registrationCount: item.register_count + "k+",
              schoolName: item.name
            };
          });
        }
      });
    },
    data() {
      return {
        search: "",
        schoolsData: [],
        // 添加更多学校数据
        // 使用一个变量来限制加载的学校组数量
        limitGroupsCount: 8
        // 你可以根据需要设置限制的数量
      };
    },
    computed: {
      //使用计算属性来获取限制数量的学校组
      groupedSchools() {
        if (!this.schoolsData.length) {
          return [];
        }
        const grouped = [];
        for (let i = 0; i < this.limitGroupsCount; i += 2) {
          grouped.push(this.schoolsData.slice(i, i + 2));
        }
        return grouped;
      }
    },
    methods: {
      toCategory() {
        uni.navigateTo({
          url: "../category/category",
          animationType: "zoom-out",
          animationDuration: 200
        });
      },
      toSearch() {
        formatAppLog("log", "at pages/moreschool/moreschool.vue:92", "fuck");
        uni.navigateTo({
          url: "../search/search",
          animationType: "zoom-out",
          animationDuration: 200
        });
      },
      toSchooldetail() {
        uni.navigateTo({
          url: "../moreschool/schooldetail",
          animationType: "zoom-out",
          animationDuration: 500
        });
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content animate__animated animate__jackInTheBox animate__faster" }, [
      vue.createCommentVNode(" 顶部搜索界面 "),
      vue.createElementVNode("view", { class: "search-bar" }, [
        vue.createElementVNode("view", { class: "search-bar-box" }, [
          vue.createElementVNode("view", {
            onClick: _cache[0] || (_cache[0] = ($event) => $options.toSearch())
          }, [
            vue.createElementVNode("image", {
              class: "search-span",
              src: "/static/image/search_new.png"
            })
          ]),
          vue.createElementVNode(
            "input",
            {
              "confirm-type": "search",
              onConfirm: _cache[1] || (_cache[1] = (...args) => $data.search && $data.search(...args)),
              onFocus: _cache[2] || (_cache[2] = (...args) => $options.toSearch && $options.toSearch(...args)),
              value: "",
              placeholder: "Search universities",
              class: "search-text",
              maxlength: "90%"
            },
            null,
            32
            /* HYDRATE_EVENTS */
          ),
          vue.createElementVNode("view", {
            onClick: _cache[3] || (_cache[3] = ($event) => $options.toCategory())
          }, [
            vue.createElementVNode("image", {
              class: "search-more",
              src: "/static/image/more_new.png"
            })
          ])
        ])
      ]),
      vue.createCommentVNode(" title "),
      vue.createElementVNode("view", { class: "title-school" }, " school lists "),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($options.groupedSchools, (schoolGroup, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "schools",
            key: index
          }, [
            vue.createElementVNode("view", { class: "schools-box1" }, [
              vue.createElementVNode("view", {
                onClick: _cache[4] || (_cache[4] = (...args) => $options.toSchooldetail && $options.toSchooldetail(...args))
              }, [
                vue.createElementVNode("image", {
                  class: "schools-img",
                  src: schoolGroup[0].imageSrc
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode(
                "view",
                { style: { "margin-left": "2%", "color": "#808080" } },
                vue.toDisplayString(schoolGroup[0].registrationCount),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "schools-name" },
                vue.toDisplayString(schoolGroup[0].schoolName),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "schools-box2" }, [
              vue.createElementVNode("view", {
                onClick: _cache[5] || (_cache[5] = (...args) => $options.toSchooldetail && $options.toSchooldetail(...args))
              }, [
                vue.createElementVNode("image", {
                  class: "schools-img",
                  src: schoolGroup[1].imageSrc
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode(
                "view",
                { style: { "margin-left": "2%", "color": "#808080" } },
                vue.toDisplayString(schoolGroup[1].registrationCount),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "schools-name" },
                vue.toDisplayString(schoolGroup[1].schoolName),
                1
                /* TEXT */
              )
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesMoreschoolMoreschool = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/moreschool/moreschool.vue"]]);
  const _sfc_main$e = {
    data() {
      return {
        list: [],
        //上传图片或视频
        goodsname: "",
        //产品名称
        bio: "",
        //产品信息
        location: "",
        //学校信息
        price: "",
        //价格信息
        uploaded: []
        //已经上传的图片
      };
    },
    methods: {
      upload(e) {
        uni.chooseImage({
          count: 4,
          // mediaType: ['mix'],
          // sizeType: ['compress'],
          success: (chooseImageRes) => {
            chooseImageRes.tempFilePaths;
            const tempFiles = chooseImageRes.tempFiles;
            const addList = tempFiles.map((value, index) => {
              formatAppLog("log", "at pages/add/add.vue:109", value.size);
              if (value.size < 1024 * 1024 * 5) {
                return value.path;
              } else {
                uni.showToast({
                  title: "图片大于5M!",
                  icon: "none",
                  duration: 1500
                });
              }
            });
            this.list = [...this.list, ...addList];
          },
          complete: () => {
            formatAppLog("log", "at pages/add/add.vue:125", "complete!");
          }
        });
      },
      delect(index) {
        formatAppLog("log", "at pages/add/add.vue:130", index);
        this.list.splice(index, 1);
      },
      check() {
        if (!this.list.length > 0) {
          uni.showToast({
            title: "图片信息不完整",
            icon: "none",
            duration: 1500
          });
          return false;
        }
        if (!this.goodsname) {
          uni.showToast({
            title: "商品名称不完整",
            icon: "none",
            duration: 1500
          });
          return false;
        }
        if (!this.location) {
          uni.showToast({
            title: "位置信息不完整",
            icon: "none",
            duration: 1500
          });
          return false;
        }
        if (!this.bio) {
          uni.showToast({
            title: "商品信息不完整",
            icon: "none",
            duration: 1500
          });
          return false;
        }
        if (!this.price) {
          uni.showToast({
            title: "价格信息不完整",
            icon: "none",
            duration: 1500
          });
          return false;
        }
        return true;
      },
      // // 这是默认图片的方法，弹出默认图片无法删除
      // },
      // }
      //})
      uploadMedia() {
        return new Promise((resolve, reject) => {
          formatAppLog("log", "at pages/add/add.vue:182", this.list);
          let to_upload = this.list.length;
          for (const file of this.list) {
            this.$f({
              type: "image",
              file
            }).then((res) => {
              formatAppLog("log", "at pages/add/add.vue:189", res);
              to_upload -= 1;
              if (res.data.status === 200) {
                this.uploaded.push(res.data.data.src);
              } else {
                uni.showToast({
                  title: `[${res.data.status}]图片上传失败:${res.data.msg}`,
                  icon: "none",
                  duration: 1500
                });
              }
            });
          }
          setTimeout(() => {
            if (!to_upload) {
              resolve();
            } else {
              reject(to_upload);
            }
          }, 1e3);
        });
      },
      //产品发布
      post() {
        if (this.check()) {
          this.uploadMedia().then(() => {
            this.$r({
              url: "/goods/add",
              method: "POST",
              data: {
                name: this.goodsname,
                bio: this.bio,
                imgs: this.uploaded,
                location: this.location,
                price: this.price
              }
            }).then(
              (res) => {
                if (res.data.status === 200) {
                  uni.showToast({
                    title: "物品上传成功！",
                    icon: "none",
                    duration: 1500
                  });
                } else {
                  uni.showToast({
                    title: `[${res.data.status}]物品上传失败:${res.data.msg}`,
                    icon: "none",
                    duration: 1500
                  });
                }
              }
            );
          });
        }
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content animate__animated animate__zoomIn animate__faster" }, [
      vue.createCommentVNode(" 添加界面 "),
      vue.createElementVNode("view", { class: "title-text" }, " Add "),
      vue.createCommentVNode(" 上传图片或视频 "),
      vue.createElementVNode("view", { class: "clue-text" }, " Photo/Video "),
      vue.createElementVNode("view", {
        class: "photo_video-box",
        onClick: _cache[1] || (_cache[1] = (...args) => _ctx.openUploadPage && _ctx.openUploadPage(...args))
      }, [
        $data.list.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "photo_video-box-bar"
        }, [
          vue.createElementVNode("view", { class: "loc-img-container" }, [
            vue.createElementVNode("image", {
              class: "uplo-img",
              src: "/static/image/upload.png"
            })
          ]),
          vue.createElementVNode("view", { id: "app" }, [
            vue.createElementVNode("view", { class: "upload" }, [
              vue.createElementVNode("view", {
                type: "file",
                id: "file",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.upload && $options.upload(...args))
              })
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", null, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.list, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", { key: index }, [
                vue.createElementVNode("img", {
                  class: "post-img",
                  src: item
                }, null, 8, ["src"]),
                vue.createElementVNode("view", {
                  class: "delect",
                  onClick: ($event) => $options.delect(index)
                }, "×", 8, ["onClick"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 输入名称 "),
      vue.createElementVNode("view", { class: "clue-text" }, " Name "),
      vue.createElementVNode("view", { class: "inputs" }, [
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.goodsname = $event),
            type: "text",
            placeholder: "Splashray..",
            "placeholder-style": "color: #aaa; font-weight:400;"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.goodsname]
        ])
      ]),
      vue.createElementVNode("view", { class: "spacer" }),
      vue.createCommentVNode(" 输入产品信息 "),
      vue.createElementVNode("view", { class: "clue-text" }, " Bio "),
      vue.createElementVNode("view", { class: "inputs" }, [
        vue.withDirectives(vue.createElementVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.bio = $event),
            placeholder: "Let people know about vour work,\ncreativity & inspiration about this work",
            "placeholder-style": "color: #aaa; font-weight: 400;"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.bio]
        ])
      ]),
      vue.createElementVNode("view", { class: "spacer" }),
      vue.createCommentVNode(" 定位 "),
      vue.createElementVNode("view", { class: "clue-text" }, " Location(School) "),
      vue.createElementVNode("view", { class: "inputs-loc" }, [
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.location = $event),
            type: "text",
            style: { "padding-left": "55px", "padding-right": "30px" },
            placeholder: "Select location/ School",
            "placeholder-style": "color: #aaa; font-weight: 400; "
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.location]
        ]),
        vue.createElementVNode("view", { class: "loc-img-container" }, [
          vue.createElementVNode("image", {
            class: "loc-img",
            src: "/static/image/location.png"
          })
        ])
      ]),
      vue.createElementVNode("view", { class: "spacer" }),
      vue.createCommentVNode(" 价格 "),
      vue.createElementVNode("view", { class: "clue-text" }, " Price "),
      vue.createElementVNode("view", { class: "inputs" }, [
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.price = $event),
            type: "text",
            placeholder: "Enter GBP amount",
            "placeholder-style": "color: #aaa; font-weight:400;"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.price]
        ])
      ]),
      vue.createElementVNode("view", { class: "spacer" }),
      vue.createElementVNode("view", {
        class: "submit",
        onClick: _cache[6] || (_cache[6] = (...args) => $options.post && $options.post(...args)),
        "hover-class": "button-hover"
      }, "Post for sale"),
      vue.createElementVNode("view", { class: "spacer" })
    ]);
  }
  const PagesAddAdd = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/add/add.vue"]]);
  const _sfc_main$d = {
    data() {
      return {
        pageIndex: 0,
        uid: 0,
        refresh: false,
        search_content: "",
        //搜索框内容
        ListArr: [
          {
            name: "ucla",
            imgurl: "../../static/image/deathstranding.png",
            id: "114514"
          },
          {
            name: "harvard",
            imgurl: "../../static/image/forza.png",
            id: "444555666"
          }
        ]
        //搜索存储列表
      };
    },
    components: {},
    onLoad() {
      formatAppLog("log", "at pages/search/search.vue:75", "search!");
    },
    onBackPress() {
      formatAppLog("log", "at pages/search/search.vue:78", "return!");
    },
    methods: {
      // 搜索（相关度匹配机制）
      search() {
        this.$r({
          url: "/goods/search",
          method: "POST",
          data: {
            keywords: this.search_content,
            details: {
              "area": "all",
              "time": "all",
              "type": "all"
            }
          }
        }).then(
          (res) => {
            if (res.data.status === 200) {
              this.ListArr = res.data.data.items;
            } else {
              uni.showToast({
                title: "检查网络",
                icon: "none",
                duration: 1500
              });
            }
          }
        );
      },
      // 传输关键字让服务器返回按关键字查找结果存入ListArr
      resultlist() {
        this.$r({
          url: "/goods/prompt",
          method: "POST",
          data: {
            keywords: this.search_content
          }
        }).then(
          (res) => {
            if (res.data.status === 200) {
              this.ListArr = res.data.data.items;
            } else {
              uni.showToast({
                title: "检查网络",
                icon: "none",
                duration: 1500
              });
            }
          }
        );
      },
      // 获取缓存数据
      getStorages() {
        try {
          this.uid = uni.getStorageInfoSync("uid");
        } catch (e) {
          formatAppLog("log", "at pages/search/search.vue:134", "error");
        }
      },
      // 跳转fakehome
      toHome() {
        uni.switchTab({
          url: "../homepage/homepage"
        });
      },
      toCategory() {
        uni.navigateTo({
          url: "../category/category"
        });
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode("页面跳转动画在这里"),
        vue.createElementVNode("view", { class: "content animate__animated animate__lightSpeedInRight animate__faster" }, [
          vue.createCommentVNode(" 顶部 "),
          vue.createElementVNode("view", { class: "search-bar" }, [
            vue.createElementVNode("view", { class: "search-bar-box" }, [
              vue.createElementVNode("view", {
                onClick: _cache[0] || (_cache[0] = ($event) => $options.toHome())
              }, [
                vue.createElementVNode("image", {
                  class: "search-span",
                  src: "/static/image/search.png"
                })
              ]),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "confirm-type": "search",
                  onConfirm: _cache[1] || (_cache[1] = (...args) => $options.search && $options.search(...args)),
                  onInput: _cache[2] || (_cache[2] = (...args) => $options.resultlist && $options.resultlist(...args)),
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.search_content = $event),
                  placeholder: "Search collections or users",
                  class: "search-text",
                  maxlength: "90%",
                  focus: ""
                },
                null,
                544
                /* HYDRATE_EVENTS, NEED_PATCH */
              ), [
                [vue.vModelText, $data.search_content]
              ]),
              vue.createElementVNode("view", {
                onClick: _cache[4] || (_cache[4] = ($event) => $options.toCategory())
              }, [
                vue.createElementVNode("image", {
                  class: "search-more",
                  src: "/static/image/more.png"
                })
              ])
            ])
          ]),
          vue.createCommentVNode("弹出式关键词搜索列表实现"),
          vue.createElementVNode("view", { class: "List" }, [
            vue.createElementVNode("view", { class: "search-item result" }, [
              vue.withDirectives(vue.createElementVNode(
                "view",
                { class: "title" },
                "可能想搜",
                512
                /* NEED_PATCH */
              ), [
                [vue.vShow, $data.ListArr.length]
              ]),
              vue.createCommentVNode("此处将关键词添加跳动动画"),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.ListArr, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "list user anim",
                    keys: index
                  }, [
                    vue.createCommentVNode("需要图片吗？"),
                    vue.createElementVNode("navigator", {
                      url: "../searchresult/searchresult?id=" + item.id
                    }, [
                      vue.createElementVNode("image", {
                        src: item.imgurl,
                        mode: ""
                      }, null, 8, ["src"])
                    ], 8, ["url"]),
                    vue.createCommentVNode("点击标签会跳转，需要item.name"),
                    vue.createElementVNode("view", { class: "iteminfo" }, [
                      vue.createElementVNode("navigator", {
                        url: "../searchresult/searchresult?id=" + item.id,
                        "hover-class": "navigator-hover"
                      }, [
                        vue.createElementVNode(
                          "button",
                          { class: "name" },
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        )
                      ], 8, ["url"])
                    ])
                  ], 8, ["keys"]);
                }),
                256
                /* UNKEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 刷新 "),
          $data.refresh ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "refresh"
          }, [
            vue.createElementVNode("i", { class: "iconfont icon-jiazaizhong3" }),
            vue.createElementVNode("view", { class: "refresh-title" }, "下拉刷新")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesSearchSearch = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/search/search.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        pageIndex: 0,
        refresh: false
      };
    },
    components: {},
    onLoad() {
      formatAppLog("log", "at pages/category/category.vue:103", "category!");
    },
    onBackPress() {
      formatAppLog("log", "at pages/category/category.vue:106", "return!");
    },
    methods: {
      // 搜索
      search() {
      },
      // 获取缓存数据
      getStorages() {
        try {
          const value = uni.getStorageSync("usr");
          if (value) {
            this.uid = value.id;
            formatAppLog("log", "at pages/category/category.vue:120", value.id);
            this.imgurl = this.serverUrl + "/" + value.imgurl;
            this.token = value.token;
          } else {
          }
        } catch (e) {
          formatAppLog("log", "at pages/category/category.vue:127", "error");
        }
      },
      // 跳转搜索页
      toHome() {
        uni.switchTab({
          url: "../homepage/homepage"
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode("页面跳转动画在这里"),
        vue.createElementVNode("view", { class: "content animate__animated animate__slideInDown animate__faster" }, [
          vue.createCommentVNode(" 顶部 "),
          vue.createElementVNode("view", { class: "search-bar" }, [
            vue.createElementVNode("view", { class: "search-bar-box" }, [
              vue.createElementVNode("image", {
                class: "search-span",
                src: "/static/image/search.png"
              }),
              vue.createElementVNode(
                "input",
                {
                  "confirm-type": "search",
                  onConfirm: _cache[0] || (_cache[0] = (...args) => $options.search && $options.search(...args)),
                  value: "",
                  placeholder: "Search collections or users",
                  class: "search-text",
                  maxlength: "90%",
                  focus: ""
                },
                null,
                32
                /* HYDRATE_EVENTS */
              ),
              vue.createCommentVNode(' <image class="search-more" src="../../static/image/more.png"/> ')
            ])
          ]),
          vue.createCommentVNode(" 刷新 "),
          $data.refresh ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "refresh"
          }, [
            vue.createElementVNode("i", { class: "iconfont icon-jiazaizhong3" }),
            vue.createElementVNode("view", { class: "refresh-title" }, "下拉刷新")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 分类 "),
          vue.createCommentVNode("此处将关键词添加跳动动画"),
          vue.createElementVNode("scroll-view", {
            "scroll-x": true,
            class: "keywords",
            style: { "white-space": "nowrap", "margin": "0 auto", "width": "90%" }
          }, [
            vue.createElementVNode("button", { style: { "display": "inline-block" } }, " 全部 "),
            vue.createElementVNode("button", { style: { "display": "inline-block" } }, " 地区1 "),
            vue.createElementVNode("button", { style: { "display": "inline-block" } }, " 地区2 "),
            vue.createElementVNode("button", { style: { "display": "inline-block" } }, " 地区3 ")
          ]),
          vue.createElementVNode("scroll-view", {
            "scroll-x": true,
            class: "keywords",
            style: { "white-space": "nowrap", "margin": "0 auto", "width": "90%" }
          }, [
            vue.createElementVNode("button", { style: { "display": "inline-block" } }, " 全部 "),
            vue.createElementVNode("button", {
              class: "item1",
              style: { "display": "inline-block" }
            }, " 物品类型1 "),
            vue.createElementVNode("button", {
              class: "item2",
              style: { "display": "inline-block" }
            }, " 物品类型2 "),
            vue.createElementVNode("button", {
              class: "item3",
              style: { "display": "inline-block" }
            }, " 物品类型3 ")
          ]),
          vue.createElementVNode("scroll-view", {
            "scroll-x": true,
            class: "keywords",
            style: { "white-space": "nowrap", "margin": "0 auto", "width": "90%", "margin-bottom": "20rpx" }
          }, [
            vue.createElementVNode("button", {
              class: "date0",
              style: { "display": "inline-block" }
            }, " 全部 "),
            vue.createElementVNode("button", {
              class: "date1",
              style: { "display": "inline-block" }
            }, " 一个月内 "),
            vue.createElementVNode("button", {
              class: "date2",
              style: { "display": "inline-block" }
            }, " 一周内 "),
            vue.createElementVNode("button", {
              class: "date3",
              style: { "display": "inline-block" }
            }, " 三天内 "),
            vue.createElementVNode("button", {
              class: "date4",
              style: { "display": "inline-block" }
            }, " 一天内 ")
          ]),
          vue.createCommentVNode(" 搜索商品，css样式暂时用school样式 "),
          vue.createElementVNode("view", { class: "schools" }, [
            vue.createElementVNode("view", { class: "schools-box1" }, [
              vue.createElementVNode("view", {
                onClick: _cache[1] || (_cache[1] = () => {
                })
              }, [
                vue.createElementVNode("image", {
                  class: "schools-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "color": "$uni-text-color-grey" } }, "10 CNY"),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "font-weight": "600", "margin-bottom": "10rpx" } }, "商品1")
            ]),
            vue.createElementVNode("view", { class: "schools-box2" }, [
              vue.createElementVNode("view", {
                onClick: _cache[2] || (_cache[2] = () => {
                })
              }, [
                vue.createElementVNode("image", {
                  class: "schools-img",
                  src: "/static/image/sample.png"
                })
              ]),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "color": "$uni-text-color-grey" } }, "20 CNY"),
              vue.createElementVNode("view", { style: { "margin-left": "2%", "font-weight": "600", "margin-bottom": "10rpx" } }, "商品2")
            ])
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesCategoryCategory = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/category/category.vue"]]);
  const _sfc_main$b = {
    props: {
      // 检测类型 + 其他验证
      self: {
        type: Boolean,
        default: false,
        required: true
      },
      func: {
        type: Function,
        require: true
      },
      isFollowing: {
        type: Boolean,
        default: true
      },
      followers_count: {
        type: Number,
        default: 0
      },
      following_count: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // isFollowing: this.isFollowing,
        toggleFollow: this.func,
        followersCount: this.followers_count,
        //被关注数
        followingCount: this.following_count
        //关注数
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
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "follow-container" }, [
      vue.createElementVNode("view", { class: "follow-btn-container" }, [
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass($props.isFollowing || $props.self ? "followed-btn" : "follow-btn"),
            onClick: _cache[0] || (_cache[0] = ($event) => $data.toggleFollow() || ($props.isFollowing = !$props.isFollowing))
          },
          vue.toDisplayString($props.isFollowing || $props.self ? "Following" : "Follow"),
          3
          /* TEXT, CLASS */
        )
      ]),
      vue.createElementVNode("view", { class: "count-container" }, [
        vue.createElementVNode(
          "view",
          { class: "number" },
          vue.toDisplayString($data.followersCount),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "description" }, "Followers")
      ]),
      vue.createElementVNode("view", { class: "count-container" }, [
        vue.createElementVNode(
          "view",
          { class: "number" },
          vue.toDisplayString($data.followingCount),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "description" }, "Following")
      ])
    ]);
  }
  const PagesMineFollowcomponent = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/mine/Followcomponent.vue"]]);
  const _sfc_main$a = {
    mounted() {
      formatAppLog("log", "at pages/mine/Collections.vue:27", "collections!");
      this.$r({
        url: "/user/items",
        method: "GET"
      }).then((res) => {
        if (res.data.status === 200) {
          this.Collections = res.data.data.items.map((item) => {
            return {
              id: item.id,
              imageUrl: item.imgurl,
              name: item.name,
              price: item.price,
              timeInterval: item.add_time
            };
          });
        }
      });
    },
    data() {
      return {
        Collections: [],
        // 用于存储商品数据
        userId: "123456"
        // 发布商品的用户ID，根据这个id请求数据
      };
    },
    methods: {
      toDetails() {
        uni.navigateTo({
          url: "../detail/detail",
          animationType: "zoom-out",
          animationDuration: 200
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content animate__animated animate__fadeIn animate__faster" }, [
      vue.createCommentVNode(" title "),
      vue.createElementVNode("view", { class: "title-Collections" }, " Collections "),
      vue.createElementVNode("view", { class: "collections" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.Collections, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "collections-box"
            }, [
              vue.createElementVNode("view", {
                onClick: _cache[0] || (_cache[0] = ($event) => $options.toDetails())
              }, [
                vue.createElementVNode("image", {
                  class: "collections-img",
                  src: item.imageUrl
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode(
                "view",
                { class: "collections-name" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "collections-state" }, [
                vue.createElementVNode(
                  "view",
                  { class: "collections-price" },
                  vue.toDisplayString(item.price) + " " + vue.toDisplayString(item.currencyType),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "collections-timeInterval" },
                  vue.toDisplayString(item.timeInterval),
                  1
                  /* TEXT */
                )
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesMineCollections = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/mine/Collections.vue"]]);
  const _sfc_main$9 = {
    components: {
      Followcomponent: PagesMineFollowcomponent,
      Collections: PagesMineCollections
    },
    data() {
      return {
        self: false,
        backgroundImage: "../../static/image/sample.png",
        //测试用背景
        avatarImage: "../../static/image/mine.png",
        //测试用头像
        username: "leo",
        //用户名
        userschool: "Beijing University of Posts and Telecommunications",
        //用户学校信息
        isFollowing: false,
        follwering_count: 0,
        follwers_count: 0
      };
    },
    onLoad(e) {
      if (e.uid) {
        this.$r({
          url: "/user/profile",
          method: "POST",
          data: {
            uid: e.uid
          }
        }).then((res) => {
          if (res.data.status === 200) {
            let userdata = res.data.data;
            this.username = userdata.username;
            this.avatarImage = userdata.avatar;
            this.userschool = userdata.school;
            this.followers_count = userdata.followers_count;
            this.follwering_count = userdata.follwering_count;
            this.isFollowing = userdata.isFollowing;
            this.backgroundImage = userdata.profile_bg;
          }
        });
      } else {
        uni.setStorageSync(
          "userdata",
          {
            username: "leo",
            avatar: "../../static/image/mine.png",
            school: "Beijing University of Posts and Telecommunications",
            email: "whl@whl.com",
            gender: "male",
            phone: "1111111111",
            profile_bg: "../../static/image/sample.png",
            isFollowing: false,
            followers_count: 12,
            following_count: 14
          }
        );
        const userdata = uni.getStorageSync(
          "userdata"
        );
        this.username = userdata.username;
        this.avatarImage = userdata.avatar;
        this.userschool = userdata.school;
        this.followers_count = userdata.followers_count;
        this.following_count = userdata.following_count;
        this.isFollowing = userdata.isFollowing;
        this.backgroundImage = userdata.profile_bg;
      }
    },
    methods: {
      uploadBackground() {
        uni.chooseImage({
          count: 1,
          // 默认9，设置用户一次可以选择的图片数量
          sizeType: ["original", "compressed"],
          // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"],
          // 可以指定来源是相册还是相机，默认二者都有
          success: (file) => {
            this.avatarImage = file.tempFilePaths[0];
            this.$f({
              type: "image",
              file: this.avatarImage
            }).then((res) => {
              formatAppLog("log", "at pages/mine/mine.vue:113", res);
              if (res.data.status === 200) {
                this.updateInfo({
                  avatar: res.data.src
                }, (res2) => {
                  uni.showToast({
                    title: "头像更改成功！",
                    icon: "none",
                    duration: 1500
                  });
                });
              } else {
                uni.showToast({
                  title: `[${res.data.status}]图片上传失败:${res.data.msg}`,
                  icon: "none",
                  duration: 1500
                });
              }
            });
          }
        });
      },
      // 用户点击按钮，选择图片
      uploadAvatar() {
        uni.chooseImage({
          count: 1,
          // 默认9，设置用户一次可以选择的图片数量
          sizeType: ["original", "compressed"],
          // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"],
          // 可以指定来源是相册还是相机，默认二者都有
          success: (file) => {
            this.avatarImage = file.tempFilePaths[0];
            this.$f({
              type: "image",
              file: this.avatarImage
            }).then((res) => {
              formatAppLog("log", "at pages/mine/mine.vue:149", res);
              if (res.data.status === 200) {
                this.updateInfo({
                  avatar: res.data.src
                }, (res2) => {
                  uni.showToast({
                    title: "头像更改成功！",
                    icon: "none",
                    duration: 1500
                  });
                });
              } else {
                uni.showToast({
                  title: `[${res.data.status}]图片上传失败:${res.data.msg}`,
                  icon: "none",
                  duration: 1500
                });
              }
            });
          }
        });
      },
      toggleFollow() {
        this.updateInfo({
          uid: "1212",
          is_following: !this.isFollowing
        }, (res) => {
          this.isFollowing = !this.isFollowing;
        });
      },
      updateInfo(info, callback) {
        const data = info;
        this.$r({
          url: "/user/update",
          method: "POST",
          data
        }).then(
          (res) => {
            if (res.data.status === 200) {
              formatAppLog("log", "at pages/mine/mine.vue:188", this.isFollowing);
              callback && callback(res.data);
            }
          }
        );
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Followcomponent = vue.resolveComponent("Followcomponent");
    const _component_Collections = vue.resolveComponent("Collections");
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "profile" }, [
          vue.createCommentVNode(" 长按上传背景 "),
          vue.createElementVNode(
            "view",
            {
              class: "background-container",
              onLongtap: _cache[1] || (_cache[1] = ($event) => $data.self || $options.uploadBackground)
            },
            [
              vue.createElementVNode("image", {
                class: "background-image",
                src: $data.backgroundImage,
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", {
                class: "avatar-overlay",
                onClick: _cache[0] || (_cache[0] = ($event) => $data.self || $options.uploadAvatar())
              }, [
                vue.createElementVNode("image", {
                  src: $data.avatarImage,
                  mode: "aspectFill"
                }, null, 8, ["src"])
              ])
            ],
            32
            /* HYDRATE_EVENTS */
          )
        ]),
        vue.createElementVNode(
          "view",
          { class: "user_name" },
          vue.toDisplayString($data.username),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "user_school" }, [
          vue.createElementVNode(
            "view",
            { style: { "display": "inline-block" } },
            vue.toDisplayString($data.userschool),
            1
            /* TEXT */
          )
        ]),
        vue.createVNode(_component_Followcomponent, {
          func: $options.toggleFollow,
          self: $data.self,
          isFollowing: $data.isFollowing,
          followers_count: _ctx.followers_count,
          following_count: _ctx.following_count
        }, null, 8, ["func", "self", "isFollowing", "followers_count", "following_count"]),
        vue.createVNode(_component_Collections)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesMineMine = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/mine/mine.vue"]]);
  const _sfc_main$8 = {
    components: {},
    data() {
      return {
        title: "Hello"
      };
    },
    onLoad() {
      formatAppLog("log", "at pages/message/message.vue:123", this.$store.getters.GET_TOKEN);
    },
    //onShow() {
    //	uni.hideTabBar({
    //		animation: false
    //	})
    //},
    methods: {
      search() {
      },
      set_username() {
        this.$store.commit("SET_TOKEN", "HH");
        formatAppLog("log", "at pages/message/message.vue:136", this.$store.state.token);
      },
      toCommiuncation() {
        uni.navigateTo({
          url: "./communication/communication"
        });
      },
      toSearch() {
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-body" }, [
      vue.createCommentVNode("搜索框"),
      vue.createElementVNode("view", { class: "search-bar" }, [
        vue.createElementVNode("view", { class: "search-bar-box" }, [
          vue.createElementVNode("view", {
            onClick: _cache[0] || (_cache[0] = ($event) => $options.toSearch())
          }, [
            vue.createElementVNode("image", {
              class: "search-span",
              src: "/static/image/search_new.png"
            })
          ]),
          vue.createElementVNode(
            "input",
            {
              "confirm-type": "search",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.toSearch()),
              onConfirm: _cache[2] || (_cache[2] = (...args) => $options.search && $options.search(...args)),
              value: "",
              placeholder: "Search here",
              class: "search-text",
              maxlength: "90%/"
            },
            null,
            32
            /* HYDRATE_EVENTS */
          )
        ])
      ]),
      vue.createCommentVNode(" 群列表 "),
      vue.createElementVNode("view", { class: "chat-list" }, [
        vue.createCommentVNode(" 我的聊天列表 "),
        vue.createElementVNode("view", {
          class: "chat-list-item",
          onClick: _cache[3] || (_cache[3] = ($event) => $options.toCommiuncation())
        }, [
          vue.createCommentVNode(" 群头像、基础信息 "),
          vue.createElementVNode("view", { class: "chat-object-info" }, [
            vue.createElementVNode("image", {
              src: "http://q2.qlogo.cn/headimg_dl?dst_uin=21171326&spec=100",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "chat-object-bease-info" }, [
              vue.createElementVNode("p", null, "Faith Paul"),
              vue.createElementVNode("text", null, "I love your tables Paul and i'll bid....")
            ])
          ]),
          vue.createCommentVNode(" 聊天时间 "),
          vue.createElementVNode("view", { class: "chat-info-time" }, " 18:06 ")
        ]),
        vue.createCommentVNode(" 我的聊天列表 "),
        vue.createElementVNode("view", { class: "chat-list-item" }, [
          vue.createCommentVNode(" 群头像、基础信息 "),
          vue.createElementVNode("view", { class: "chat-object-info" }, [
            vue.createElementVNode("image", {
              src: "http://q2.qlogo.cn/headimg_dl?dst_uin=2369668922&spec=100",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "chat-object-bease-info" }, [
              vue.createElementVNode("p", null, "Mary Jane"),
              vue.createElementVNode("text", null, "When will i get the word from you")
            ])
          ]),
          vue.createCommentVNode(" 聊天时间 "),
          vue.createElementVNode("view", { class: "chat-info-time" }, " 1:06 ")
        ]),
        vue.createCommentVNode(" 我的聊天列表 "),
        vue.createElementVNode("view", { class: "chat-list-item" }, [
          vue.createCommentVNode(" 群头像、基础信息 "),
          vue.createElementVNode("view", { class: "chat-object-info" }, [
            vue.createElementVNode("image", {
              src: "http://q2.qlogo.cn/headimg_dl?dst_uin=12540701&spec=100",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "chat-object-bease-info" }, [
              vue.createElementVNode("p", null, "Lucas Jobs"),
              vue.createElementVNode("text", null, "Nice work,but i'll need it delivered from")
            ])
          ]),
          vue.createCommentVNode(" 聊天时间 "),
          vue.createElementVNode("view", { class: "chat-info-time" }, " 8:05 ")
        ]),
        vue.createElementVNode("view", { class: "chat-list-item" }, [
          vue.createCommentVNode(" 群头像、基础信息 "),
          vue.createElementVNode("view", { class: "chat-object-info" }, [
            vue.createElementVNode("image", {
              src: "http://q2.qlogo.cn/headimg_dl?dst_uin=21171326&spec=100",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "chat-object-bease-info" }, [
              vue.createElementVNode("p", null, "Stan Lee"),
              vue.createElementVNode("text", null, "I don't' know for now")
            ])
          ]),
          vue.createCommentVNode(" 聊天时间 "),
          vue.createElementVNode("view", { class: "chat-info-time" }, " 1:00 ")
        ]),
        vue.createElementVNode("view", { class: "chat-list-item" }, [
          vue.createCommentVNode(" 群头像、基础信息 "),
          vue.createElementVNode("view", { class: "chat-object-info" }, [
            vue.createElementVNode("image", {
              src: "http://q2.qlogo.cn/headimg_dl?dst_uin=2369668922&spec=100",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "chat-object-bease-info" }, [
              vue.createElementVNode("p", null, "Lucy P."),
              vue.createElementVNode("text", null, "You can talk about it")
            ])
          ]),
          vue.createCommentVNode(" 聊天时间 "),
          vue.createElementVNode("view", { class: "chat-info-time" }, " 13:06 ")
        ]),
        vue.createElementVNode("view", { class: "chat-list-item" }, [
          vue.createCommentVNode(" 群头像、基础信息 "),
          vue.createElementVNode("view", { class: "chat-object-info" }, [
            vue.createElementVNode("image", {
              src: "http://q2.qlogo.cn/headimg_dl?dst_uin=12540701&spec=100",
              mode: ""
            }),
            vue.createElementVNode("view", { class: "chat-object-bease-info" }, [
              vue.createElementVNode("p", null, "Rooky"),
              vue.createElementVNode("text", null, "I love your lamps Paul and i'll bid")
            ])
          ]),
          vue.createCommentVNode(" 聊天时间 "),
          vue.createElementVNode("view", { class: "chat-info-time" }, " 8:05 ")
        ])
      ])
    ]);
  }
  const PagesMessageMessage = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/message/message.vue"]]);
  const _sfc_main$7 = {
    props: {
      height: Number,
      default: 260
    },
    data() {
      return {
        emoji: [
          ["😁", "🥰", "😍", "😁", "😁", "😁", "😁"]
        ]
      };
    },
    methods: {
      //
      clickEmoji(e) {
        this.$emit("emotion", e);
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "emoji",
        style: vue.normalizeStyle({ height: $props.height + "px" })
      },
      [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.emoji, (line, i) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "emoji-line",
              key: i
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(line, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "emoji-line-item",
                    onClick: ($event) => $options.clickEmoji(item),
                    key: index
                  }, vue.toDisplayString(item), 9, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ],
      4
      /* STYLE */
    );
  }
  const PagesMessageCommunicationEmoji = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/message/communication/emoji.vue"]]);
  const innerAudioContext = uni.createInnerAudioContext();
  const _sfc_main$6 = {
    data() {
      return {
        isrecord: false,
        isemoji: true,
        ismore: true,
        msg: "",
        //单条输入框内信息
        timer: null,
        voicePath: "",
        vLength: 0,
        //声音长度
        voiceBg: true,
        pageY: 0,
        changeIconCol: false
      };
    },
    components: {
      emoji: PagesMessageCommunicationEmoji
    },
    onLoad() {
    },
    methods: {
      // 获取位置
      chooseLocation() {
        formatAppLog("log", "at pages/message/communication/submit.vue:137", "tap location");
        uni.chooseLocation({
          success: (res) => {
            let { name, address, latitude, longitude } = res;
            let data = {
              name,
              address,
              latitude,
              longitude
            };
            let strData = JSON.stringify(data);
            this.send(strData, 3);
          }
        });
      },
      // 聚焦输入框
      isFocus() {
        this.isemoji = true;
        this.ismore = true;
        setTimeout(() => {
          this.getSubHeigh();
        }, 10);
      },
      // 切换音频
      records() {
        this.isemoji = true;
        this.ismore = true;
        this.isrecord = !this.isrecord;
        setTimeout(() => {
          this.getSubHeigh();
        }, 10);
      },
      // 表情按钮
      emoji() {
        this.isemoji = !this.isemoji;
        this.ismore = true;
        setTimeout(() => {
          this.getSubHeigh();
        }, 10);
      },
      // 文字发送(回车)
      inputs(e) {
        let chatMsg = e.detail.value;
        let pos = chatMsg.indexOf("\n");
        if (pos != -1 && chatMsg.length > 1) {
          this.send(this.msg, 0);
        }
      },
      // 文字发送（按钮）
      inputsByClick() {
        formatAppLog("log", "at pages/message/communication/submit.vue:190", "sasf");
        this.send(this.msg, 0);
      },
      // 接收点击的表情
      emotion(e) {
        formatAppLog("log", "at pages/message/communication/submit.vue:196", "sasf");
        this.msg += e;
      },
      // 表情内发送按钮
      emojiSend() {
        if (this.msg.length > 1) {
          this.send(this.msg, 0);
        }
      },
      // 表情内删除表情
      emojiDelOne() {
        if (this.msg.length > 0) {
          this.msg = this.msg.substring(0, this.msg.length - 1);
        }
      },
      // +按钮
      more() {
        this.ismore = !this.ismore;
        this.isemoji = true;
        setTimeout(() => {
          this.getSubHeigh();
        }, 10);
      },
      // 图片发送
      sendImg(e) {
        let count = 9;
        if (e === "album") {
          count = 9;
        } else {
          count = 1;
        }
        uni.chooseImage({
          count,
          //默认9
          sizeType: ["original", "compressed"],
          //可以指定是原图还是压缩图，默认二者都有
          sourceType: [e],
          //从相册选择
          success: (res) => {
            let filePath = res.tempFilePaths;
            filePath.map((item) => {
              this.send(item, 1);
            });
          }
        });
      },
      // 音频处理
      touchstart: function(e) {
        this.pageY = e.changedTouches[0].pageY;
        let i = 1;
        this.timer = setInterval(() => {
          this.vLength = i;
          i++;
          if (i > 59) {
            clearInterval(this.timer);
            this.touchend();
          }
        }, 1e3);
        this.voiceBg = false;
        recorderManager.start();
      },
      touchend: function() {
        clearInterval(this.timer);
        recorderManager.stop();
        recorderManager.onStop((res) => {
          let data = {
            voice: res.tempFilePath,
            time: this.vLength
          };
          if (!this.voiceBg && this.vLength > 0) {
            this.send(data, 2);
          }
          this.vLength = 0;
          this.voiceBg = true;
          this.changeIconCol = false;
        });
      },
      // 上滑结束录音
      touchmove(e) {
        this.changeIconCol = true;
        if (this.pageY - e.changedTouches[0].pageY > 60) {
          this.voiceBg = true;
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
        const query = uni.createSelectorQuery().in(this);
        query.select(".submit").boundingClientRect((data) => {
          this.$emit("heights", data.height);
        }).exec();
      },
      // 发送封装
      send(msg, types) {
        formatAppLog("log", "at pages/message/communication/submit.vue:303", "sasf");
        let data = {
          msg,
          types
          // 消息类型
        };
        formatAppLog("log", "at pages/message/communication/submit.vue:307", "sasf");
        this.$emit("inputs", data);
        setTimeout(() => {
          this.msg = "";
        }, 0);
      },
      //支付选项
      showPaymentOptions() {
        uni.showActionSheet({
          itemList: ["微信支付", "支付宝支付"],
          success: (res) => {
            if (res.tapIndex === 0) {
              formatAppLog("log", "at pages/message/communication/submit.vue:320", "微信支付");
            } else if (res.tapIndex === 1) {
              formatAppLog("log", "at pages/message/communication/submit.vue:324", "支付宝支付");
              uni.navigateTo({
                url: "../../payment/alipay"
                // 替换为您的页面路径
              });
            }
          },
          fail(err) {
            formatAppLog("log", "at pages/message/communication/submit.vue:332", "ActionSheet失败：", err);
          }
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_emoji = vue.resolveComponent("emoji");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "submit" }, [
        vue.createCommentVNode(" 输入框组 "),
        vue.createElementVNode("view", { class: "submit-chat animate__animated animate__faster animate__fadeInUpBig" }, [
          vue.createCommentVNode(" 语音 "),
          vue.createElementVNode("view", {
            class: "bt-img",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.records && $options.records(...args))
          }, [
            vue.createElementVNode(
              "i",
              {
                class: vue.normalizeClass(["iconfont", { "icon-jianpan": $data.isrecord, "icon-yuyin": !$data.isrecord }])
              },
              null,
              2
              /* CLASS */
            )
          ]),
          vue.createCommentVNode(" 输入框 "),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              class: vue.normalizeClass([{ displaynone: $data.isrecord }, "chat-send btn"]),
              "auto-height": "true",
              onInput: _cache[1] || (_cache[1] = (...args) => $options.inputs && $options.inputs(...args)),
              onFocus: _cache[2] || (_cache[2] = (...args) => $options.isFocus && $options.isFocus(...args)),
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.msg = $event)
            },
            null,
            34
            /* CLASS, HYDRATE_EVENTS */
          ), [
            [vue.vModelText, $data.msg]
          ]),
          vue.createCommentVNode(" 按住说话 "),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass([{ displaynone: !$data.isrecord, voiceActive: !$data.voiceBg }, "record btn"]),
              onTouchstart: _cache[4] || (_cache[4] = (...args) => $options.touchstart && $options.touchstart(...args)),
              onTouchend: _cache[5] || (_cache[5] = (...args) => $options.touchend && $options.touchend(...args)),
              onTouchmove: _cache[6] || (_cache[6] = (...args) => $options.touchmove && $options.touchmove(...args))
            },
            "按住说话",
            34
            /* CLASS, HYDRATE_EVENTS */
          ),
          vue.createCommentVNode(" emojiBtn "),
          vue.createElementVNode("view", {
            class: "bt-img",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.emoji && $options.emoji(...args))
          }, [
            vue.createElementVNode(
              "i",
              {
                class: vue.normalizeClass(["iconfont icon-xiaolian", { "iconActive": !$data.isemoji }])
              },
              null,
              2
              /* CLASS */
            )
          ]),
          vue.createCommentVNode(" + "),
          $data.msg.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "bt-img",
            onClick: _cache[8] || (_cache[8] = (...args) => $options.more && $options.more(...args))
          }, [
            vue.createElementVNode(
              "i",
              {
                class: vue.normalizeClass(["iconfont icon-jia2", { "iconActive": !$data.ismore }])
              },
              null,
              2
              /* CLASS */
            )
          ])) : vue.createCommentVNode("v-if", true),
          $data.msg.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            onClick: _cache[9] || (_cache[9] = (...args) => $options.inputsByClick && $options.inputsByClick(...args)),
            class: "bt-send"
          }, [
            vue.createElementVNode("view", { class: "bt-send-text" }, " 发送 ")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createCommentVNode(" 表情下拉框 "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["emoji animate__animated animate__fadeIn animate__faster", { displaynone: $data.isemoji }])
          },
          [
            vue.createElementVNode("view", { class: "emoji-send" }, [
              vue.createElementVNode("view", {
                class: "emoji-send-del",
                onClick: _cache[10] || (_cache[10] = (...args) => $options.emojiDelOne && $options.emojiDelOne(...args))
              }, [
                vue.createElementVNode("i", { class: "iconfont icon-backspace" })
              ]),
              vue.createElementVNode("view", {
                class: "emoji-send-btn",
                onClick: _cache[11] || (_cache[11] = (...args) => $options.emojiSend && $options.emojiSend(...args))
              }, "发送")
            ]),
            vue.createVNode(_component_emoji, {
              onEmotion: $options.emotion,
              height: 260
            }, null, 8, ["onEmotion"])
          ],
          2
          /* CLASS */
        ),
        vue.createCommentVNode(" 拓展下拉框 "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["more animate__animated animate__fadeIn animate__faster", { displaynone: $data.ismore }])
          },
          [
            vue.createElementVNode("view", {
              class: "more-list",
              "hover-class": "button-hover",
              onClick: _cache[12] || (_cache[12] = ($event) => $options.sendImg("album"))
            }, [
              vue.createElementVNode("i", { class: "iconfont icon-zhaopian1" }),
              vue.createElementVNode("view", { class: "more-list-title" }, "图片")
            ]),
            vue.createElementVNode("view", {
              class: "more-list",
              onClick: _cache[13] || (_cache[13] = ($event) => $options.sendImg("camera")),
              "hover-class": "button-hover"
            }, [
              vue.createElementVNode("i", { class: "iconfont icon-ziyuan" }),
              vue.createElementVNode("view", { class: "more-list-title" }, "拍摄")
            ]),
            vue.createElementVNode("view", {
              class: "more-list",
              onClick: _cache[14] || (_cache[14] = (...args) => $options.chooseLocation && $options.chooseLocation(...args)),
              "hover-class": "button-hover"
            }, [
              vue.createElementVNode("i", { class: "iconfont icon-dizhidingweiweizhi" }),
              vue.createElementVNode("view", { class: "more-list-title" }, "位置")
            ]),
            vue.createElementVNode("view", {
              class: "more-list",
              "hover-class": "button-hover"
            }, [
              vue.createElementVNode("i", { class: "iconfont icon-luxiang-tianchong" }),
              vue.createElementVNode("view", { class: "more-list-title" }, "录像")
            ]),
            vue.createElementVNode("view", {
              class: "more-list",
              "hover-class": "button-hover"
            }, [
              vue.createElementVNode("i", { class: "iconfont icon-wenjian2" }),
              vue.createElementVNode("view", { class: "more-list-title" }, "文件")
            ]),
            vue.createElementVNode("view", {
              class: "more-list",
              onClick: _cache[15] || (_cache[15] = (...args) => $options.showPaymentOptions && $options.showPaymentOptions(...args)),
              "hover-class": "button-hover"
            }, [
              vue.createElementVNode("i", { class: "iconfont icon-pay1" }),
              vue.createElementVNode("view", { class: "more-list-title" }, "转账")
            ])
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 录音背景 "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["voice-bg", { displaynone: $data.voiceBg }])
        },
        [
          vue.createElementVNode("view", { class: "voice-bg-len" }, [
            vue.createElementVNode(
              "view",
              {
                class: "voice-bg-time",
                style: vue.normalizeStyle({ width: $data.vLength / 0.6 + "%" })
              },
              vue.toDisplayString($data.vLength) + "″",
              5
              /* TEXT, STYLE */
            )
          ]),
          vue.createElementVNode("view", { class: "voice-del" }, [
            vue.createElementVNode(
              "i",
              {
                class: vue.normalizeClass(["iconfont icon-quxiao", { iconActive1: $data.changeIconCol }])
              },
              null,
              2
              /* CLASS */
            )
          ])
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const PagesMessageCommunicationSubmit = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/message/communication/submit.vue"]]);
  const myfun = {
    // 首页时间处理
    dataTime(d) {
      let old = new Date(d);
      let now = /* @__PURE__ */ new Date();
      let h = old.getHours();
      let m = old.getMinutes();
      let Y = old.getFullYear();
      let M = old.getMonth() + 1;
      let D = old.getDate();
      now.getTime();
      now.getHours();
      now.getMinutes();
      let nY = now.getFullYear();
      let nM = now.getMonth() + 1;
      let nD = now.getDate();
      if (D === nD && M === nM && Y === nY) {
        if (h < 10)
          h = "0" + h;
        if (m < 10)
          m = "0" + m;
        return h + ":" + m;
      }
      if (D + 1 === nD && M === nM && Y === nY) {
        if (h < 10)
          h = "0" + h;
        if (m < 10)
          m = "0" + m;
        return "昨天 " + h + ":" + m;
      } else {
        return Y + "/" + M + "/" + D;
      }
    },
    // 详细时间
    detialTime(d) {
      let old = new Date(d);
      let h = old.getHours();
      let m = old.getMinutes();
      let Y = old.getFullYear();
      let M = old.getMonth() + 1;
      let D = old.getDate();
      if (M < 10)
        M = "0" + M;
      if (D < 10)
        D = "0" + D;
      if (h < 10)
        h = "0" + h;
      if (m < 10)
        m = "0" + m;
      return Y + "-" + M + "-" + D + " " + h + ":" + m;
    },
    // 聊天时间
    dataTime1(d) {
      let old = new Date(d);
      let now = /* @__PURE__ */ new Date();
      let h = old.getHours();
      let m = old.getMinutes();
      let Y = old.getFullYear();
      let M = old.getMonth() + 1;
      let D = old.getDate();
      now.getTime();
      now.getHours();
      now.getMinutes();
      let nY = now.getFullYear();
      let nM = now.getMonth() + 1;
      let nD = now.getDate();
      if (D === nD && M === nM && Y === nY) {
        if (h < 10)
          h = "0" + h;
        if (m < 10)
          m = "0" + m;
        return h + ":" + m;
      }
      if (D + 1 === nD && M === nM && Y === nY) {
        if (h < 10)
          h = "0" + h;
        if (m < 10)
          m = "0" + m;
        return "昨天 " + h + ":" + m;
      } else if (Y === nY) {
        if (h < 10)
          h = "0" + h;
        if (m < 10)
          m = "0" + m;
        return M + "月" + D + "日 " + h + ":" + m;
      } else {
        if (h < 10)
          h = "0" + h;
        if (m < 10)
          m = "0" + m;
        return Y + "年" + M + "月" + D + "日 " + h + ":" + m;
      }
    },
    // 每天建的文件夹名称
    fileName(e) {
      let old = new Date(e);
      let Y = old.getFullYear();
      let M = old.getMonth() + 1;
      let D = old.getDate();
      if (M < 10)
        M = "0" + M;
      if (D < 10)
        D = "0" + D;
      return Y + M + D;
    },
    // 间隔时间差
    spacTime(old, now) {
      old = new Date(old);
      now = new Date(now);
      var told = old.getTime();
      var tnow = now.getTime();
      if (tnow > told + 1e3 * 60 * 5) {
        return now;
      } else {
        return "";
      }
    },
    /**
    * 函数防抖 (只执行最后一次点击)
    * @param fn
    * @param delay
    * @returns {Function}
    * @constructor
    */
    debounce(fn, t) {
      let delay = t || 500;
      let timer;
      return function() {
        let args = arguments;
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          timer = null;
          fn.apply(this, args);
        }, delay);
      };
    },
    /**
     * 函数节流
     * @param fn
     * @param interval
     * @returns {Function}
     * @constructor
     */
    Throttle(fn, t) {
      let last;
      let timer;
      let interval = t || 500;
      return function() {
        let args = arguments;
        let now = +/* @__PURE__ */ new Date();
        if (last && now - last < interval) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            last = now;
            fn.apply(this, args);
          }, interval);
        } else {
          last = now;
          fn.apply(this, args);
        }
      };
    },
    // 数组排序
    mySort(arr, obj, tip) {
      var s;
      if (tip === 0) {
        for (let i = 1; i < arr.length; i++) {
          for (let j = i; j > 0; j--) {
            if (arr[j][obj] > arr[j - 1][obj]) {
              s = arr[j];
              arr[j] = arr[j - 1];
              arr[j - 1] = s;
            }
          }
        }
        return arr;
      } else if (tip === 1) {
        for (let i = 1; i < arr.length; i++) {
          for (let j = i; j > 0; j--) {
            if (arr[j][obj] < arr[j - 1][obj]) {
              s = arr[j];
              arr[j] = arr[j - 1];
              arr[j - 1] = s;
            }
          }
        }
        return arr;
      }
    }
  };
  const _sfc_main$5 = {
    data() {
      return {
        msgs: [
          {
            id: "a",
            fromId: "a",
            types: 0,
            imgurl: "../../../static/logo.png",
            tip: 13,
            name: "西西",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date(),
            message: "我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息"
          },
          {
            id: "a",
            fromId: "a",
            types: 0,
            imgurl: "../../../static/logo.png",
            tip: 12,
            name: "西西",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date(),
            message: "我是消息我是消息我是消息我是消息我是消息我是消息我是消息我是消息"
          },
          {
            id: "",
            fromId: "a",
            types: 0,
            imgurl: "../../../static/logo.png",
            tip: 9,
            name: "哥哥",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date() - 1e3 * 60 * 24,
            message: "我是消息我5"
          },
          {
            id: "a",
            fromId: "a",
            types: 2,
            imgurl: "avatar5.jpg",
            tip: 21,
            name: "西西",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date(),
            message: {
              voice: "a",
              time: 10
            }
          },
          {
            id: "a",
            fromId: "a",
            types: 2,
            imgurl: "avatar5.jpg",
            tip: 20,
            name: "西西",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date(),
            message: {
              voice: "a",
              time: 10
            }
          },
          {
            id: "a",
            fromId: "a",
            types: 2,
            imgurl: "avatar5.jpg",
            tip: 19,
            name: "西西",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date(),
            message: {
              voice: "a",
              time: 10
            }
          },
          {
            id: "a",
            fromId: "a",
            types: 2,
            imgurl: "avatar5.jpg",
            tip: 18,
            name: "西西",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date(),
            message: {
              voice: "a",
              time: 10
            }
          },
          {
            id: "b",
            fromId: "a",
            types: 2,
            imgurl: "avatar2.jpg",
            tip: 17,
            name: "西西",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date(),
            message: {
              voice: "a",
              time: 20
            }
          },
          {
            id: "b",
            fromId: "a",
            types: 3,
            imgurl: "avatar3.jpg",
            tip: 16,
            name: "西西",
            email: "1123@qq.com",
            time: /* @__PURE__ */ new Date(),
            message: {
              name: "锡广场",
              address: "西街",
              latitude: "39.901951",
              longitude: "116.406403"
            }
          }
        ],
        //所有的消息队列
        oldTime: 0,
        scrollToView: "",
        inputh: "60",
        isPlay: false,
        animationData1: {},
        animation: {},
        loading: "",
        isloading: true,
        scrollAnimation: true,
        beginLoading: true,
        uid: "",
        // 缓存数据
        uimgurl: "",
        //用户头像
        token: "",
        uname: "",
        fid: "",
        // 路由参数
        fname: "",
        type: "",
        // 1:群、2：好友
        fimgurl: "",
        pageSize: 10,
        // 每页消息数
        nowPage: 0
      };
    },
    components: {
      submit: PagesMessageCommunicationSubmit
    },
    onLoad(e) {
      this.fid = e.id;
      this.fname = e.name;
      this.type = e.type;
      this.fimgurl = e.img;
    },
    methods: {
      // 获取缓存数据
      getStorages() {
      },
      // 获取聊天数据
      getMsg() {
      },
      // 下拉刷新
      nextPage() {
        if (this.nowPage > 0 && this.beginLoading) {
          this.loading = false;
          this.beginLoading = false;
          var animation = uni.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
          });
          this.animation = animation;
          this.animationData1 = animation.export();
          let i = 1;
          this.loading = setInterval(function() {
            animation.rotate(i * 20).step();
            this.animationData1 = animation.export();
            i++;
            this.getMsg(this.nowPage);
          }.bind(this), 60);
        }
      },
      // 地图位置标点
      covers(e) {
        return [{
          latitude: e.latitude,
          longitude: e.longitude,
          iconPath: "../../static/images/pos.png"
        }];
      },
      // 点击地图
      openLocation(e) {
        uni.openLocation({
          latitude: e.latitude,
          longitude: e.longitude,
          name: e.name,
          address: e.address,
          success: function() {
            formatAppLog("log", "at pages/message/communication/communication.vue:334", "success");
          }
        });
      },
      // 处理时间
      changeTime(date) {
        return myfun.dataTime1(date);
      },
      // 预览图片
      previewImg(e) {
      },
      // 接收输入框内容
      inputs(e) {
        this.receiveMsg(e, this.uid, this.uimgurl, 0);
        this.ToBottom();
      },
      // 接收输入框消息
      receiveMsg(e, id, img, tip) {
        if (e.types === 1) {
          this.msgImgArr.push(e.msg);
          myfun.fileName(/* @__PURE__ */ new Date());
          if (e.types === 2)
            ;
        }
        this.scrollAnimation = true;
        let nowTime = /* @__PURE__ */ new Date();
        let t = myfun.spacTime(this.oldTime, nowTime);
        if (t) {
          this.oldTime = t;
        }
        nowTime = t;
        if (e.types == 3) {
          e.msg = JSON.parse(e.msg);
        }
        let newMsg = {
          fromId: id,
          types: e.types,
          imgurl: img,
          id: this.msgs.length,
          time: nowTime,
          message: e.msg
        };
        this.msgs.push(newMsg);
      },
      // 聊天数据发送到后端-socket
      sendSocket(e) {
      },
      // 接收好友发来的消息-socket
      // 播放音频
      playVoice(e) {
        const innerAudioContext2 = uni.createInnerAudioContext();
        innerAudioContext2.autoplay = true;
        innerAudioContext2.src = e;
        innerAudioContext2.onPlay(() => {
        });
      },
      // 接收输入框高度，防止阻挡
      heights(e) {
        this.inputh = e;
        this.ToBottom();
      },
      // 消息自动定位到（最后一条）
      ToBottom() {
        this.scrollAnimation = true;
        this.scrollToView = "";
        this.$nextTick(function() {
          this.scrollToView = "msg" + this.msgs[this.msgs.length - 1].id;
        });
      },
      // 返回上一页
      backOnePage() {
        uni.navigateBack({
          delta: 1
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_submit = vue.resolveComponent("submit");
    return vue.openBlock(), vue.createElementBlock("view", { class: "contents animate__animated animate__fadeInRightBig animate__faster" }, [
      vue.createCommentVNode(" 顶部 "),
      vue.createElementVNode("view", { class: "top-bar" }, [
        vue.createElementVNode("view", {
          onClick: _cache[0] || (_cache[0] = (...args) => $options.backOnePage && $options.backOnePage(...args)),
          class: "top-bar-left"
        }, [
          vue.createElementVNode("i", { class: "iconfont icon-xiazai6" })
        ]),
        vue.createElementVNode("view", { class: "top-bar-center" }, [
          vue.createElementVNode(
            "view",
            { class: "title" },
            vue.toDisplayString($data.fname),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "top-bar-right" }, [
          vue.createElementVNode("view", { class: "pice" }),
          $data.type === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "group-img"
          }, [
            vue.createElementVNode("image", { src: $data.fimgurl }, null, 8, ["src"])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createCommentVNode(" main "),
      vue.createElementVNode("scroll-view", {
        class: "chat",
        "scroll-with-animation": $data.scrollAnimation,
        "scroll-y": "true",
        "scroll-into-view": $data.scrollToView,
        onScrolltoupper: _cache[1] || (_cache[1] = (...args) => $options.nextPage && $options.nextPage(...args))
      }, [
        vue.createElementVNode(
          "view",
          {
            class: "chat-main",
            style: vue.normalizeStyle({ paddingBottom: $data.inputh + "px" })
          },
          [
            vue.createCommentVNode(" 加载中 "),
            vue.createElementVNode("view", {
              animation: $data.animationData1,
              class: vue.normalizeClass(["loading", { displaynone: $data.isloading }])
            }, [
              vue.createElementVNode("i", { class: "iconfont icon-jiazaizhong8" })
            ], 10, ["animation"]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.msgs, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "chat-ls",
                  key: index,
                  id: "msg" + item.id
                }, [
                  item.time !== "" ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: "chat-time"
                    },
                    vue.toDisplayString($options.changeTime(item.time)),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createCommentVNode(" 好友消息 "),
                  item.fromId !== $data.uid ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "msg-m msg-left"
                  }, [
                    vue.createElementVNode("navigator", { url: "../../../static/logo.png" }, [
                      vue.createElementVNode("image", {
                        class: "user-img",
                        src: item.imgurl,
                        mode: ""
                      }, null, 8, ["src"])
                    ], 8, ["url"]),
                    vue.createCommentVNode(" 图像消息 "),
                    item.types == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "message"
                    }, [
                      vue.createElementVNode("image", {
                        onClick: ($event) => $options.previewImg(item.message),
                        class: "msg-img",
                        src: item.message,
                        mode: "widthFix"
                      }, null, 8, ["onClick", "src"])
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createCommentVNode(" 文字消息 "),
                    item.types == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "message animate__animated animate__fadeIn animate__faster"
                    }, [
                      vue.createElementVNode(
                        "view",
                        { class: "msg-text" },
                        vue.toDisplayString(item.message),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createCommentVNode(" 音频消息 "),
                    item.types == 2 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 2,
                      class: "message"
                    }, [
                      vue.createElementVNode("view", {
                        onClick: ($event) => $options.playVoice(item.message.voice),
                        class: "msg-text voice",
                        style: vue.normalizeStyle({ width: item.message.time * 3.5 + "px" })
                      }, [
                        vue.createElementVNode(
                          "i",
                          {
                            class: vue.normalizeClass(["iconfont icon-yuyin1", { "isActive": $data.isPlay }])
                          },
                          null,
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "span",
                          null,
                          vue.toDisplayString(item.message.time) + "″",
                          1
                          /* TEXT */
                        )
                      ], 12, ["onClick"])
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createCommentVNode(" 位置消息 "),
                    item.types == 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 3,
                      class: "message"
                    }, [
                      vue.createElementVNode("view", {
                        class: "msg-map",
                        onClick: ($event) => $options.openLocation(item.message)
                      }, [
                        vue.createElementVNode(
                          "view",
                          { class: "map-name" },
                          vue.toDisplayString(item.message.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "view",
                          { class: "map-addr" },
                          vue.toDisplayString(item.message.address),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("map", {
                          class: "map",
                          markers: $options.covers(item.message),
                          latitude: item.message.latitude,
                          longitude: item.message.longitude
                        }, null, 8, ["markers", "latitude", "longitude"])
                      ], 8, ["onClick"])
                    ])) : vue.createCommentVNode("v-if", true)
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createCommentVNode(" 本人消息 "),
                  item.fromId === $data.uid ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 2,
                    class: "msg-m msg-right"
                  }, [
                    vue.createElementVNode("navigator", {
                      url: "../userhome/userhome?id=" + $data.uid
                    }, [
                      vue.createElementVNode("image", {
                        class: "user-img",
                        src: item.imgurl,
                        mode: ""
                      }, null, 8, ["src"])
                    ], 8, ["url"]),
                    vue.createCommentVNode(" 图片消息 "),
                    item.types == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "message animate__animated animate__fadeIn animate__faster"
                    }, [
                      vue.createElementVNode("image", {
                        onClick: ($event) => $options.previewImg(item.message),
                        class: "msg-img",
                        src: item.message,
                        mode: "widthFix"
                      }, null, 8, ["onClick", "src"])
                    ])) : vue.createCommentVNode("v-if", true),
                    item.types == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "message"
                    }, [
                      vue.createElementVNode(
                        "view",
                        { class: "msg-text" },
                        vue.toDisplayString(item.message),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createCommentVNode(" 音频消息 "),
                    item.types == 2 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 2,
                      class: "message"
                    }, [
                      vue.createElementVNode("view", {
                        onClick: ($event) => $options.playVoice(item.message.voice),
                        class: "msg-text voice",
                        style: vue.normalizeStyle({ width: item.message.time * 3.5 + "px" })
                      }, [
                        vue.createElementVNode(
                          "i",
                          {
                            class: vue.normalizeClass(["iconfont icon-yuyin1", { "isActive": $data.isPlay }])
                          },
                          null,
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "span",
                          null,
                          vue.toDisplayString(item.message.time) + "″",
                          1
                          /* TEXT */
                        )
                      ], 12, ["onClick"])
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createCommentVNode(" 位置消息 "),
                    item.types == 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 3,
                      class: "message"
                    }, [
                      vue.createElementVNode("view", {
                        class: "msg-map",
                        onClick: ($event) => $options.openLocation(item.message)
                      }, [
                        vue.createElementVNode(
                          "view",
                          { class: "map-name" },
                          vue.toDisplayString(item.message.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "view",
                          { class: "map-addr" },
                          vue.toDisplayString(item.message.address),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("map", {
                          class: "map",
                          markers: $options.covers(item.message),
                          latitude: item.message.latitude,
                          longitude: item.message.longitude
                        }, null, 8, ["markers", "latitude", "longitude"])
                      ], 8, ["onClick"])
                    ])) : vue.createCommentVNode("v-if", true)
                  ])) : vue.createCommentVNode("v-if", true)
                ], 8, ["id"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        )
      ], 40, ["scroll-with-animation", "scroll-into-view"]),
      vue.createVNode(_component_submit, {
        onInputs: $options.inputs,
        onHeights: $options.heights
      }, null, 8, ["onInputs", "onHeights"])
    ]);
  }
  const PagesMessageCommunicationCommunication = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/message/communication/communication.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        //轮播图图片
        imageList: [
          "../../static/image/sample.png",
          "../../static/image/sample.png",
          "../../static/image/sample.png"
        ],
        //轮播图参数
        indicatorDots: true,
        autoplay: true,
        interval: 4e3,
        duration: 700,
        nextMargin: "26px",
        //该商品具体内容
        goodsname: "Sofa chair",
        price: 2,
        currencytype: "GDB",
        location: "Beijing Univeuiaf wefweacfwa",
        //需要限定长度
        useTime: "~~~",
        traceOfUse: "~~~",
        productState: "~~~",
        negotiate: "Online/offline",
        //用户信息
        authentication: 1,
        //是否进行认证
        userprofile: "../../static/image/sample.png",
        //用户头像
        username: "Leo",
        //用户名
        userschool: "Beijing University of Posts and Telecommunications"
        //用户学校信息
      };
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode("页面跳转动画在这里"),
        vue.createElementVNode("view", { class: "content animate__animated animate__slideInDown animate__faster" }, [
          vue.createElementVNode("view", null, [
            vue.createElementVNode("view", { class: "title-Details" }, [
              vue.createElementVNode("image", {
                class: "back-img",
                src: "/static/image/upload.png",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
              }),
              vue.createTextVNode("Details ")
            ]),
            vue.createElementVNode("view", { class: "uni-margin-wrap" }, [
              vue.createElementVNode("swiper", {
                class: "swiper",
                circular: "",
                "indicator-dots": $data.indicatorDots,
                autoplay: $data.autoplay,
                interval: $data.interval,
                duration: $data.duration,
                "next-margin": $data.nextMargin
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.imageList, (imageSrc, index) => {
                    return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                      vue.createElementVNode("image", {
                        class: "swiper-image",
                        src: imageSrc
                      }, null, 8, ["src"])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ], 8, ["indicator-dots", "autoplay", "interval", "duration", "next-margin"])
            ])
          ]),
          vue.createElementVNode("view", null, [
            vue.createElementVNode("view", { class: "nameAndprice" }, [
              vue.createElementVNode(
                "view",
                { class: "name-info" },
                vue.toDisplayString($data.goodsname),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "price-info" }, [
                vue.createTextVNode(
                  vue.toDisplayString($data.price) + " ",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "p",
                  { style: { "font-weight": "600" } },
                  vue.toDisplayString($data.currencytype),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "details-info" }, [
              vue.createElementVNode("view", { class: "location-info" }, [
                vue.createElementVNode("p", { class: "ptitle" }, "Location: "),
                vue.createElementVNode(
                  "p",
                  { class: "pcontent" },
                  vue.toDisplayString($data.location),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "other-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "text-info" },
                  " Use time: " + vue.toDisplayString($data.useTime),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "text-info" },
                  " Trace of use: " + vue.toDisplayString($data.traceOfUse),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "text-info" },
                  " Product state: " + vue.toDisplayString($data.productState),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "text-info" },
                  " negotiate: " + vue.toDisplayString($data.negotiate),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "user-info" }, [
                vue.createElementVNode("view", { class: "user-profile" }, [
                  vue.createElementVNode("image", {
                    class: "user-profile-img",
                    src: $data.userprofile
                  }, null, 8, ["src"]),
                  vue.createCommentVNode(" 认证图标 "),
                  vue.createElementVNode("image", {
                    class: "overlay-img",
                    src: "/static/image/upload.png"
                  })
                ]),
                vue.createElementVNode("view", { class: "user-info-details" }, [
                  vue.createElementVNode(
                    "p",
                    { class: "user-name" },
                    vue.toDisplayString($data.username),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "p",
                    { class: "user-school" },
                    vue.toDisplayString($data.userschool),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "negotiate" }, [
                vue.createElementVNode("button", {
                  class: "negotiate-btn",
                  onClick: _cache[1] || (_cache[1] = () => {
                  })
                }, [
                  vue.createElementVNode("p", null, "negotiate")
                ])
              ])
            ])
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesGoodsdetailGoodsdetail = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/goodsdetail/goodsdetail.vue"]]);
  const icons = {
    "id": "2852637",
    "name": "uniui图标库",
    "font_family": "uniicons",
    "css_prefix_text": "uniui-",
    "description": "",
    "glyphs": [
      {
        "icon_id": "25027049",
        "name": "yanse",
        "font_class": "color",
        "unicode": "e6cf",
        "unicode_decimal": 59087
      },
      {
        "icon_id": "25027048",
        "name": "wallet",
        "font_class": "wallet",
        "unicode": "e6b1",
        "unicode_decimal": 59057
      },
      {
        "icon_id": "25015720",
        "name": "settings-filled",
        "font_class": "settings-filled",
        "unicode": "e6ce",
        "unicode_decimal": 59086
      },
      {
        "icon_id": "25015434",
        "name": "shimingrenzheng-filled",
        "font_class": "auth-filled",
        "unicode": "e6cc",
        "unicode_decimal": 59084
      },
      {
        "icon_id": "24934246",
        "name": "shop-filled",
        "font_class": "shop-filled",
        "unicode": "e6cd",
        "unicode_decimal": 59085
      },
      {
        "icon_id": "24934159",
        "name": "staff-filled-01",
        "font_class": "staff-filled",
        "unicode": "e6cb",
        "unicode_decimal": 59083
      },
      {
        "icon_id": "24932461",
        "name": "VIP-filled",
        "font_class": "vip-filled",
        "unicode": "e6c6",
        "unicode_decimal": 59078
      },
      {
        "icon_id": "24932462",
        "name": "plus_circle_fill",
        "font_class": "plus-filled",
        "unicode": "e6c7",
        "unicode_decimal": 59079
      },
      {
        "icon_id": "24932463",
        "name": "folder_add-filled",
        "font_class": "folder-add-filled",
        "unicode": "e6c8",
        "unicode_decimal": 59080
      },
      {
        "icon_id": "24932464",
        "name": "yanse-filled",
        "font_class": "color-filled",
        "unicode": "e6c9",
        "unicode_decimal": 59081
      },
      {
        "icon_id": "24932465",
        "name": "tune-filled",
        "font_class": "tune-filled",
        "unicode": "e6ca",
        "unicode_decimal": 59082
      },
      {
        "icon_id": "24932455",
        "name": "a-rilidaka-filled",
        "font_class": "calendar-filled",
        "unicode": "e6c0",
        "unicode_decimal": 59072
      },
      {
        "icon_id": "24932456",
        "name": "notification-filled",
        "font_class": "notification-filled",
        "unicode": "e6c1",
        "unicode_decimal": 59073
      },
      {
        "icon_id": "24932457",
        "name": "wallet-filled",
        "font_class": "wallet-filled",
        "unicode": "e6c2",
        "unicode_decimal": 59074
      },
      {
        "icon_id": "24932458",
        "name": "paihangbang-filled",
        "font_class": "medal-filled",
        "unicode": "e6c3",
        "unicode_decimal": 59075
      },
      {
        "icon_id": "24932459",
        "name": "gift-filled",
        "font_class": "gift-filled",
        "unicode": "e6c4",
        "unicode_decimal": 59076
      },
      {
        "icon_id": "24932460",
        "name": "fire-filled",
        "font_class": "fire-filled",
        "unicode": "e6c5",
        "unicode_decimal": 59077
      },
      {
        "icon_id": "24928001",
        "name": "refreshempty",
        "font_class": "refreshempty",
        "unicode": "e6bf",
        "unicode_decimal": 59071
      },
      {
        "icon_id": "24926853",
        "name": "location-ellipse",
        "font_class": "location-filled",
        "unicode": "e6af",
        "unicode_decimal": 59055
      },
      {
        "icon_id": "24926735",
        "name": "person-filled",
        "font_class": "person-filled",
        "unicode": "e69d",
        "unicode_decimal": 59037
      },
      {
        "icon_id": "24926703",
        "name": "personadd-filled",
        "font_class": "personadd-filled",
        "unicode": "e698",
        "unicode_decimal": 59032
      },
      {
        "icon_id": "24923351",
        "name": "back",
        "font_class": "back",
        "unicode": "e6b9",
        "unicode_decimal": 59065
      },
      {
        "icon_id": "24923352",
        "name": "forward",
        "font_class": "forward",
        "unicode": "e6ba",
        "unicode_decimal": 59066
      },
      {
        "icon_id": "24923353",
        "name": "arrowthinright",
        "font_class": "arrow-right",
        "unicode": "e6bb",
        "unicode_decimal": 59067
      },
      {
        "icon_id": "24923353",
        "name": "arrowthinright",
        "font_class": "arrowthinright",
        "unicode": "e6bb",
        "unicode_decimal": 59067
      },
      {
        "icon_id": "24923354",
        "name": "arrowthinleft",
        "font_class": "arrow-left",
        "unicode": "e6bc",
        "unicode_decimal": 59068
      },
      {
        "icon_id": "24923354",
        "name": "arrowthinleft",
        "font_class": "arrowthinleft",
        "unicode": "e6bc",
        "unicode_decimal": 59068
      },
      {
        "icon_id": "24923355",
        "name": "arrowthinup",
        "font_class": "arrow-up",
        "unicode": "e6bd",
        "unicode_decimal": 59069
      },
      {
        "icon_id": "24923355",
        "name": "arrowthinup",
        "font_class": "arrowthinup",
        "unicode": "e6bd",
        "unicode_decimal": 59069
      },
      {
        "icon_id": "24923356",
        "name": "arrowthindown",
        "font_class": "arrow-down",
        "unicode": "e6be",
        "unicode_decimal": 59070
      },
      {
        "icon_id": "24923356",
        "name": "arrowthindown",
        "font_class": "arrowthindown",
        "unicode": "e6be",
        "unicode_decimal": 59070
      },
      {
        "icon_id": "24923349",
        "name": "arrowdown",
        "font_class": "bottom",
        "unicode": "e6b8",
        "unicode_decimal": 59064
      },
      {
        "icon_id": "24923349",
        "name": "arrowdown",
        "font_class": "arrowdown",
        "unicode": "e6b8",
        "unicode_decimal": 59064
      },
      {
        "icon_id": "24923346",
        "name": "arrowright",
        "font_class": "right",
        "unicode": "e6b5",
        "unicode_decimal": 59061
      },
      {
        "icon_id": "24923346",
        "name": "arrowright",
        "font_class": "arrowright",
        "unicode": "e6b5",
        "unicode_decimal": 59061
      },
      {
        "icon_id": "24923347",
        "name": "arrowup",
        "font_class": "top",
        "unicode": "e6b6",
        "unicode_decimal": 59062
      },
      {
        "icon_id": "24923347",
        "name": "arrowup",
        "font_class": "arrowup",
        "unicode": "e6b6",
        "unicode_decimal": 59062
      },
      {
        "icon_id": "24923348",
        "name": "arrowleft",
        "font_class": "left",
        "unicode": "e6b7",
        "unicode_decimal": 59063
      },
      {
        "icon_id": "24923348",
        "name": "arrowleft",
        "font_class": "arrowleft",
        "unicode": "e6b7",
        "unicode_decimal": 59063
      },
      {
        "icon_id": "24923334",
        "name": "eye",
        "font_class": "eye",
        "unicode": "e651",
        "unicode_decimal": 58961
      },
      {
        "icon_id": "24923335",
        "name": "eye-filled",
        "font_class": "eye-filled",
        "unicode": "e66a",
        "unicode_decimal": 58986
      },
      {
        "icon_id": "24923336",
        "name": "eye-slash",
        "font_class": "eye-slash",
        "unicode": "e6b3",
        "unicode_decimal": 59059
      },
      {
        "icon_id": "24923337",
        "name": "eye-slash-filled",
        "font_class": "eye-slash-filled",
        "unicode": "e6b4",
        "unicode_decimal": 59060
      },
      {
        "icon_id": "24923305",
        "name": "info-filled",
        "font_class": "info-filled",
        "unicode": "e649",
        "unicode_decimal": 58953
      },
      {
        "icon_id": "24923299",
        "name": "reload-01",
        "font_class": "reload",
        "unicode": "e6b2",
        "unicode_decimal": 59058
      },
      {
        "icon_id": "24923195",
        "name": "mic_slash_fill",
        "font_class": "micoff-filled",
        "unicode": "e6b0",
        "unicode_decimal": 59056
      },
      {
        "icon_id": "24923165",
        "name": "map-pin-ellipse",
        "font_class": "map-pin-ellipse",
        "unicode": "e6ac",
        "unicode_decimal": 59052
      },
      {
        "icon_id": "24923166",
        "name": "map-pin",
        "font_class": "map-pin",
        "unicode": "e6ad",
        "unicode_decimal": 59053
      },
      {
        "icon_id": "24923167",
        "name": "location",
        "font_class": "location",
        "unicode": "e6ae",
        "unicode_decimal": 59054
      },
      {
        "icon_id": "24923064",
        "name": "starhalf",
        "font_class": "starhalf",
        "unicode": "e683",
        "unicode_decimal": 59011
      },
      {
        "icon_id": "24923065",
        "name": "star",
        "font_class": "star",
        "unicode": "e688",
        "unicode_decimal": 59016
      },
      {
        "icon_id": "24923066",
        "name": "star-filled",
        "font_class": "star-filled",
        "unicode": "e68f",
        "unicode_decimal": 59023
      },
      {
        "icon_id": "24899646",
        "name": "a-rilidaka",
        "font_class": "calendar",
        "unicode": "e6a0",
        "unicode_decimal": 59040
      },
      {
        "icon_id": "24899647",
        "name": "fire",
        "font_class": "fire",
        "unicode": "e6a1",
        "unicode_decimal": 59041
      },
      {
        "icon_id": "24899648",
        "name": "paihangbang",
        "font_class": "medal",
        "unicode": "e6a2",
        "unicode_decimal": 59042
      },
      {
        "icon_id": "24899649",
        "name": "font",
        "font_class": "font",
        "unicode": "e6a3",
        "unicode_decimal": 59043
      },
      {
        "icon_id": "24899650",
        "name": "gift",
        "font_class": "gift",
        "unicode": "e6a4",
        "unicode_decimal": 59044
      },
      {
        "icon_id": "24899651",
        "name": "link",
        "font_class": "link",
        "unicode": "e6a5",
        "unicode_decimal": 59045
      },
      {
        "icon_id": "24899652",
        "name": "notification",
        "font_class": "notification",
        "unicode": "e6a6",
        "unicode_decimal": 59046
      },
      {
        "icon_id": "24899653",
        "name": "staff",
        "font_class": "staff",
        "unicode": "e6a7",
        "unicode_decimal": 59047
      },
      {
        "icon_id": "24899654",
        "name": "VIP",
        "font_class": "vip",
        "unicode": "e6a8",
        "unicode_decimal": 59048
      },
      {
        "icon_id": "24899655",
        "name": "folder_add",
        "font_class": "folder-add",
        "unicode": "e6a9",
        "unicode_decimal": 59049
      },
      {
        "icon_id": "24899656",
        "name": "tune",
        "font_class": "tune",
        "unicode": "e6aa",
        "unicode_decimal": 59050
      },
      {
        "icon_id": "24899657",
        "name": "shimingrenzheng",
        "font_class": "auth",
        "unicode": "e6ab",
        "unicode_decimal": 59051
      },
      {
        "icon_id": "24899565",
        "name": "person",
        "font_class": "person",
        "unicode": "e699",
        "unicode_decimal": 59033
      },
      {
        "icon_id": "24899566",
        "name": "email-filled",
        "font_class": "email-filled",
        "unicode": "e69a",
        "unicode_decimal": 59034
      },
      {
        "icon_id": "24899567",
        "name": "phone-filled",
        "font_class": "phone-filled",
        "unicode": "e69b",
        "unicode_decimal": 59035
      },
      {
        "icon_id": "24899568",
        "name": "phone",
        "font_class": "phone",
        "unicode": "e69c",
        "unicode_decimal": 59036
      },
      {
        "icon_id": "24899570",
        "name": "email",
        "font_class": "email",
        "unicode": "e69e",
        "unicode_decimal": 59038
      },
      {
        "icon_id": "24899571",
        "name": "personadd",
        "font_class": "personadd",
        "unicode": "e69f",
        "unicode_decimal": 59039
      },
      {
        "icon_id": "24899558",
        "name": "chatboxes-filled",
        "font_class": "chatboxes-filled",
        "unicode": "e692",
        "unicode_decimal": 59026
      },
      {
        "icon_id": "24899559",
        "name": "contact",
        "font_class": "contact",
        "unicode": "e693",
        "unicode_decimal": 59027
      },
      {
        "icon_id": "24899560",
        "name": "chatbubble-filled",
        "font_class": "chatbubble-filled",
        "unicode": "e694",
        "unicode_decimal": 59028
      },
      {
        "icon_id": "24899561",
        "name": "contact-filled",
        "font_class": "contact-filled",
        "unicode": "e695",
        "unicode_decimal": 59029
      },
      {
        "icon_id": "24899562",
        "name": "chatboxes",
        "font_class": "chatboxes",
        "unicode": "e696",
        "unicode_decimal": 59030
      },
      {
        "icon_id": "24899563",
        "name": "chatbubble",
        "font_class": "chatbubble",
        "unicode": "e697",
        "unicode_decimal": 59031
      },
      {
        "icon_id": "24881290",
        "name": "upload-filled",
        "font_class": "upload-filled",
        "unicode": "e68e",
        "unicode_decimal": 59022
      },
      {
        "icon_id": "24881292",
        "name": "upload",
        "font_class": "upload",
        "unicode": "e690",
        "unicode_decimal": 59024
      },
      {
        "icon_id": "24881293",
        "name": "weixin",
        "font_class": "weixin",
        "unicode": "e691",
        "unicode_decimal": 59025
      },
      {
        "icon_id": "24881274",
        "name": "compose",
        "font_class": "compose",
        "unicode": "e67f",
        "unicode_decimal": 59007
      },
      {
        "icon_id": "24881275",
        "name": "qq",
        "font_class": "qq",
        "unicode": "e680",
        "unicode_decimal": 59008
      },
      {
        "icon_id": "24881276",
        "name": "download-filled",
        "font_class": "download-filled",
        "unicode": "e681",
        "unicode_decimal": 59009
      },
      {
        "icon_id": "24881277",
        "name": "pengyouquan",
        "font_class": "pyq",
        "unicode": "e682",
        "unicode_decimal": 59010
      },
      {
        "icon_id": "24881279",
        "name": "sound",
        "font_class": "sound",
        "unicode": "e684",
        "unicode_decimal": 59012
      },
      {
        "icon_id": "24881280",
        "name": "trash-filled",
        "font_class": "trash-filled",
        "unicode": "e685",
        "unicode_decimal": 59013
      },
      {
        "icon_id": "24881281",
        "name": "sound-filled",
        "font_class": "sound-filled",
        "unicode": "e686",
        "unicode_decimal": 59014
      },
      {
        "icon_id": "24881282",
        "name": "trash",
        "font_class": "trash",
        "unicode": "e687",
        "unicode_decimal": 59015
      },
      {
        "icon_id": "24881284",
        "name": "videocam-filled",
        "font_class": "videocam-filled",
        "unicode": "e689",
        "unicode_decimal": 59017
      },
      {
        "icon_id": "24881285",
        "name": "spinner-cycle",
        "font_class": "spinner-cycle",
        "unicode": "e68a",
        "unicode_decimal": 59018
      },
      {
        "icon_id": "24881286",
        "name": "weibo",
        "font_class": "weibo",
        "unicode": "e68b",
        "unicode_decimal": 59019
      },
      {
        "icon_id": "24881288",
        "name": "videocam",
        "font_class": "videocam",
        "unicode": "e68c",
        "unicode_decimal": 59020
      },
      {
        "icon_id": "24881289",
        "name": "download",
        "font_class": "download",
        "unicode": "e68d",
        "unicode_decimal": 59021
      },
      {
        "icon_id": "24879601",
        "name": "help",
        "font_class": "help",
        "unicode": "e679",
        "unicode_decimal": 59001
      },
      {
        "icon_id": "24879602",
        "name": "navigate-filled",
        "font_class": "navigate-filled",
        "unicode": "e67a",
        "unicode_decimal": 59002
      },
      {
        "icon_id": "24879603",
        "name": "plusempty",
        "font_class": "plusempty",
        "unicode": "e67b",
        "unicode_decimal": 59003
      },
      {
        "icon_id": "24879604",
        "name": "smallcircle",
        "font_class": "smallcircle",
        "unicode": "e67c",
        "unicode_decimal": 59004
      },
      {
        "icon_id": "24879605",
        "name": "minus-filled",
        "font_class": "minus-filled",
        "unicode": "e67d",
        "unicode_decimal": 59005
      },
      {
        "icon_id": "24879606",
        "name": "micoff",
        "font_class": "micoff",
        "unicode": "e67e",
        "unicode_decimal": 59006
      },
      {
        "icon_id": "24879588",
        "name": "closeempty",
        "font_class": "closeempty",
        "unicode": "e66c",
        "unicode_decimal": 58988
      },
      {
        "icon_id": "24879589",
        "name": "clear",
        "font_class": "clear",
        "unicode": "e66d",
        "unicode_decimal": 58989
      },
      {
        "icon_id": "24879590",
        "name": "navigate",
        "font_class": "navigate",
        "unicode": "e66e",
        "unicode_decimal": 58990
      },
      {
        "icon_id": "24879591",
        "name": "minus",
        "font_class": "minus",
        "unicode": "e66f",
        "unicode_decimal": 58991
      },
      {
        "icon_id": "24879592",
        "name": "image",
        "font_class": "image",
        "unicode": "e670",
        "unicode_decimal": 58992
      },
      {
        "icon_id": "24879593",
        "name": "mic",
        "font_class": "mic",
        "unicode": "e671",
        "unicode_decimal": 58993
      },
      {
        "icon_id": "24879594",
        "name": "paperplane",
        "font_class": "paperplane",
        "unicode": "e672",
        "unicode_decimal": 58994
      },
      {
        "icon_id": "24879595",
        "name": "close",
        "font_class": "close",
        "unicode": "e673",
        "unicode_decimal": 58995
      },
      {
        "icon_id": "24879596",
        "name": "help-filled",
        "font_class": "help-filled",
        "unicode": "e674",
        "unicode_decimal": 58996
      },
      {
        "icon_id": "24879597",
        "name": "plus-filled",
        "font_class": "paperplane-filled",
        "unicode": "e675",
        "unicode_decimal": 58997
      },
      {
        "icon_id": "24879598",
        "name": "plus",
        "font_class": "plus",
        "unicode": "e676",
        "unicode_decimal": 58998
      },
      {
        "icon_id": "24879599",
        "name": "mic-filled",
        "font_class": "mic-filled",
        "unicode": "e677",
        "unicode_decimal": 58999
      },
      {
        "icon_id": "24879600",
        "name": "image-filled",
        "font_class": "image-filled",
        "unicode": "e678",
        "unicode_decimal": 59e3
      },
      {
        "icon_id": "24855900",
        "name": "locked-filled",
        "font_class": "locked-filled",
        "unicode": "e668",
        "unicode_decimal": 58984
      },
      {
        "icon_id": "24855901",
        "name": "info",
        "font_class": "info",
        "unicode": "e669",
        "unicode_decimal": 58985
      },
      {
        "icon_id": "24855903",
        "name": "locked",
        "font_class": "locked",
        "unicode": "e66b",
        "unicode_decimal": 58987
      },
      {
        "icon_id": "24855884",
        "name": "camera-filled",
        "font_class": "camera-filled",
        "unicode": "e658",
        "unicode_decimal": 58968
      },
      {
        "icon_id": "24855885",
        "name": "chat-filled",
        "font_class": "chat-filled",
        "unicode": "e659",
        "unicode_decimal": 58969
      },
      {
        "icon_id": "24855886",
        "name": "camera",
        "font_class": "camera",
        "unicode": "e65a",
        "unicode_decimal": 58970
      },
      {
        "icon_id": "24855887",
        "name": "circle",
        "font_class": "circle",
        "unicode": "e65b",
        "unicode_decimal": 58971
      },
      {
        "icon_id": "24855888",
        "name": "checkmarkempty",
        "font_class": "checkmarkempty",
        "unicode": "e65c",
        "unicode_decimal": 58972
      },
      {
        "icon_id": "24855889",
        "name": "chat",
        "font_class": "chat",
        "unicode": "e65d",
        "unicode_decimal": 58973
      },
      {
        "icon_id": "24855890",
        "name": "circle-filled",
        "font_class": "circle-filled",
        "unicode": "e65e",
        "unicode_decimal": 58974
      },
      {
        "icon_id": "24855891",
        "name": "flag",
        "font_class": "flag",
        "unicode": "e65f",
        "unicode_decimal": 58975
      },
      {
        "icon_id": "24855892",
        "name": "flag-filled",
        "font_class": "flag-filled",
        "unicode": "e660",
        "unicode_decimal": 58976
      },
      {
        "icon_id": "24855893",
        "name": "gear-filled",
        "font_class": "gear-filled",
        "unicode": "e661",
        "unicode_decimal": 58977
      },
      {
        "icon_id": "24855894",
        "name": "home",
        "font_class": "home",
        "unicode": "e662",
        "unicode_decimal": 58978
      },
      {
        "icon_id": "24855895",
        "name": "home-filled",
        "font_class": "home-filled",
        "unicode": "e663",
        "unicode_decimal": 58979
      },
      {
        "icon_id": "24855896",
        "name": "gear",
        "font_class": "gear",
        "unicode": "e664",
        "unicode_decimal": 58980
      },
      {
        "icon_id": "24855897",
        "name": "smallcircle-filled",
        "font_class": "smallcircle-filled",
        "unicode": "e665",
        "unicode_decimal": 58981
      },
      {
        "icon_id": "24855898",
        "name": "map-filled",
        "font_class": "map-filled",
        "unicode": "e666",
        "unicode_decimal": 58982
      },
      {
        "icon_id": "24855899",
        "name": "map",
        "font_class": "map",
        "unicode": "e667",
        "unicode_decimal": 58983
      },
      {
        "icon_id": "24855825",
        "name": "refresh-filled",
        "font_class": "refresh-filled",
        "unicode": "e656",
        "unicode_decimal": 58966
      },
      {
        "icon_id": "24855826",
        "name": "refresh",
        "font_class": "refresh",
        "unicode": "e657",
        "unicode_decimal": 58967
      },
      {
        "icon_id": "24855808",
        "name": "cloud-upload",
        "font_class": "cloud-upload",
        "unicode": "e645",
        "unicode_decimal": 58949
      },
      {
        "icon_id": "24855809",
        "name": "cloud-download-filled",
        "font_class": "cloud-download-filled",
        "unicode": "e646",
        "unicode_decimal": 58950
      },
      {
        "icon_id": "24855810",
        "name": "cloud-download",
        "font_class": "cloud-download",
        "unicode": "e647",
        "unicode_decimal": 58951
      },
      {
        "icon_id": "24855811",
        "name": "cloud-upload-filled",
        "font_class": "cloud-upload-filled",
        "unicode": "e648",
        "unicode_decimal": 58952
      },
      {
        "icon_id": "24855813",
        "name": "redo",
        "font_class": "redo",
        "unicode": "e64a",
        "unicode_decimal": 58954
      },
      {
        "icon_id": "24855814",
        "name": "images-filled",
        "font_class": "images-filled",
        "unicode": "e64b",
        "unicode_decimal": 58955
      },
      {
        "icon_id": "24855815",
        "name": "undo-filled",
        "font_class": "undo-filled",
        "unicode": "e64c",
        "unicode_decimal": 58956
      },
      {
        "icon_id": "24855816",
        "name": "more",
        "font_class": "more",
        "unicode": "e64d",
        "unicode_decimal": 58957
      },
      {
        "icon_id": "24855817",
        "name": "more-filled",
        "font_class": "more-filled",
        "unicode": "e64e",
        "unicode_decimal": 58958
      },
      {
        "icon_id": "24855818",
        "name": "undo",
        "font_class": "undo",
        "unicode": "e64f",
        "unicode_decimal": 58959
      },
      {
        "icon_id": "24855819",
        "name": "images",
        "font_class": "images",
        "unicode": "e650",
        "unicode_decimal": 58960
      },
      {
        "icon_id": "24855821",
        "name": "paperclip",
        "font_class": "paperclip",
        "unicode": "e652",
        "unicode_decimal": 58962
      },
      {
        "icon_id": "24855822",
        "name": "settings",
        "font_class": "settings",
        "unicode": "e653",
        "unicode_decimal": 58963
      },
      {
        "icon_id": "24855823",
        "name": "search",
        "font_class": "search",
        "unicode": "e654",
        "unicode_decimal": 58964
      },
      {
        "icon_id": "24855824",
        "name": "redo-filled",
        "font_class": "redo-filled",
        "unicode": "e655",
        "unicode_decimal": 58965
      },
      {
        "icon_id": "24841702",
        "name": "list",
        "font_class": "list",
        "unicode": "e644",
        "unicode_decimal": 58948
      },
      {
        "icon_id": "24841489",
        "name": "mail-open-filled",
        "font_class": "mail-open-filled",
        "unicode": "e63a",
        "unicode_decimal": 58938
      },
      {
        "icon_id": "24841491",
        "name": "hand-thumbsdown-filled",
        "font_class": "hand-down-filled",
        "unicode": "e63c",
        "unicode_decimal": 58940
      },
      {
        "icon_id": "24841492",
        "name": "hand-thumbsdown",
        "font_class": "hand-down",
        "unicode": "e63d",
        "unicode_decimal": 58941
      },
      {
        "icon_id": "24841493",
        "name": "hand-thumbsup-filled",
        "font_class": "hand-up-filled",
        "unicode": "e63e",
        "unicode_decimal": 58942
      },
      {
        "icon_id": "24841494",
        "name": "hand-thumbsup",
        "font_class": "hand-up",
        "unicode": "e63f",
        "unicode_decimal": 58943
      },
      {
        "icon_id": "24841496",
        "name": "heart-filled",
        "font_class": "heart-filled",
        "unicode": "e641",
        "unicode_decimal": 58945
      },
      {
        "icon_id": "24841498",
        "name": "mail-open",
        "font_class": "mail-open",
        "unicode": "e643",
        "unicode_decimal": 58947
      },
      {
        "icon_id": "24841488",
        "name": "heart",
        "font_class": "heart",
        "unicode": "e639",
        "unicode_decimal": 58937
      },
      {
        "icon_id": "24839963",
        "name": "loop",
        "font_class": "loop",
        "unicode": "e633",
        "unicode_decimal": 58931
      },
      {
        "icon_id": "24839866",
        "name": "pulldown",
        "font_class": "pulldown",
        "unicode": "e632",
        "unicode_decimal": 58930
      },
      {
        "icon_id": "24813798",
        "name": "scan",
        "font_class": "scan",
        "unicode": "e62a",
        "unicode_decimal": 58922
      },
      {
        "icon_id": "24813786",
        "name": "bars",
        "font_class": "bars",
        "unicode": "e627",
        "unicode_decimal": 58919
      },
      {
        "icon_id": "24813788",
        "name": "cart-filled",
        "font_class": "cart-filled",
        "unicode": "e629",
        "unicode_decimal": 58921
      },
      {
        "icon_id": "24813790",
        "name": "checkbox",
        "font_class": "checkbox",
        "unicode": "e62b",
        "unicode_decimal": 58923
      },
      {
        "icon_id": "24813791",
        "name": "checkbox-filled",
        "font_class": "checkbox-filled",
        "unicode": "e62c",
        "unicode_decimal": 58924
      },
      {
        "icon_id": "24813794",
        "name": "shop",
        "font_class": "shop",
        "unicode": "e62f",
        "unicode_decimal": 58927
      },
      {
        "icon_id": "24813795",
        "name": "headphones",
        "font_class": "headphones",
        "unicode": "e630",
        "unicode_decimal": 58928
      },
      {
        "icon_id": "24813796",
        "name": "cart",
        "font_class": "cart",
        "unicode": "e631",
        "unicode_decimal": 58929
      }
    ]
  };
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$3 = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: icons.glyphs
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return unescape(`%u${code.unicode}`);
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle({ color: $props.color, "font-size": $options.iconSize }),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      null,
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-d31e1c47"], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        topSpace: 0,
        //top区高度
        searchSpace: 0,
        //search区高度
        fixed: false,
        // 是否滑动时固定元素
        search: "",
        // 学校信息
        schoolprofile: "../../static/image/sample.png",
        schoolname: "Univedsa sdaddasdadaddfsdfsdfdsadd sdmbridge",
        schoollocation: "CambrCdasdasdasdasdB2 1TN, UK",
        distance: 1,
        schoolid: 1,
        //学校id，用于请求商品信息
        //推荐的商品信息
        GoodLists: [
          {
            goodid: 1,
            imageUrl: "../../static/image/sample.png",
            name: "feafcafa",
            price: 55,
            timeInterval: "sdadas"
            //时间间隔
          },
          {
            goodid: 2,
            imageUrl: "../../static/image/sample.png",
            name: "kuyafa",
            price: 5435,
            timeInterval: "sggerg"
          },
          {
            goodid: 3,
            imageUrl: "../../static/image/sample.png",
            name: "feafcafa",
            price: 1235,
            timeInterval: "223"
          },
          {
            goodid: 4,
            imageUrl: "../../static/image/sample.png",
            name: "hhhh",
            price: 222,
            timeInterval: "猪"
          },
          {
            goodid: 1,
            imageUrl: "../../static/image/sample.png",
            name: "feafcafa",
            price: 55,
            timeInterval: "sdadas"
            //时间间隔
          }
        ]
      };
    },
    mounted() {
      window.addEventListener("scroll", this.handleScroll);
      window.addEventListener("resize", this.getHeight);
    },
    //在组件销毁之前，移除之前添加的滚动事件监听器。
    beforeDestroy() {
      window.removeEventListener("scroll", this.handleScroll);
      window.addEventListener("resize", this.getHeight);
    },
    methods: {
      //处理滑动页面逻辑
      handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.getHeight();
        this.fixed = scrollTop > this.topSpace;
        formatAppLog(
          "log",
          "at pages/moreschool/schooldetail.vue:141",
          "fixed:",
          this.fixed,
          "scrollTop:",
          scrollTop,
          "topSpace:",
          this.topSpace,
          "searchSpace:",
          this.searchSpace
        );
      },
      //获得顶部top盒子高度
      getHeight() {
        const query = uni.createSelectorQuery().in(this);
        query.select(".top").boundingClientRect((data) => {
          const height_all = data.height;
          this.topSpace = height_all;
        }).exec();
        query.select(".search-bar").boundingClientRect((data) => {
          const searchHeight = data.height;
          this.searchSpace = searchHeight;
        }).exec();
      },
      //推送选项
      show_option() {
        uni.showActionSheet({
          itemList: ["收藏", "不感兴趣", "加入黑名单"],
          success(res) {
            formatAppLog("log", "at pages/moreschool/schooldetail.vue:172", res.tapIndex);
          },
          fail(res) {
            formatAppLog("log", "at pages/moreschool/schooldetail.vue:175", res.errMsg);
          }
        });
      },
      //返回上一级页面
      goBack() {
        this.$router.go(-1);
      },
      // 跳转搜索页
      toSearch() {
        formatAppLog("log", "at pages/moreschool/schooldetail.vue:185", "really");
        uni.navigateTo({
          url: "../search/search",
          animationType: "zoom-out",
          animationDuration: 200
        });
      },
      toDetails() {
        uni.navigateTo({
          url: "../goodsdetail/goodsdetail",
          animationType: "zoom-out",
          animationDuration: 200
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" title和back区 "),
        vue.createElementVNode("view", { class: "top" }, [
          vue.createCommentVNode(" 顶部标题 "),
          vue.createElementVNode("view", { class: "title-school" }, [
            vue.createElementVNode("view", { style: { "width": "100%", "height": "100%", "display": "flex", "align-items": "flex-start", "justify-content": "center" } }, [
              vue.createElementVNode("view", { style: { "margin-top": "-4px" } }, "School")
            ])
          ]),
          vue.createCommentVNode(" 返回键 "),
          vue.createElementVNode("view", { class: "back-section" }, [
            vue.createVNode(_component_uni_icons, {
              class: "back-icon",
              type: "back",
              size: "33",
              onClick: $options.goBack
            }, null, 8, ["onClick"]),
            vue.createElementVNode("view", { class: "back-text" }, "  Back ")
          ])
        ]),
        vue.createCommentVNode("搜索框"),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["search-bar", { "fixed-title": $data.fixed }])
          },
          [
            vue.createElementVNode("view", { class: "search-bar-box" }, [
              vue.createElementVNode("view", {
                onClick: _cache[0] || (_cache[0] = ($event) => $options.toSearch())
              }, [
                vue.createElementVNode("image", {
                  class: "search-span",
                  src: "/static/image/search_new.png"
                })
              ]),
              vue.createElementVNode(
                "input",
                {
                  "confirm-type": "search",
                  onClick: _cache[1] || (_cache[1] = ($event) => $options.toSearch()),
                  onConfirm: _cache[2] || (_cache[2] = (...args) => $data.search && $data.search(...args)),
                  value: "",
                  placeholder: "Search schools or locations",
                  class: "search-text",
                  maxlength: "90%"
                },
                null,
                32
                /* HYDRATE_EVENTS */
              )
            ])
          ],
          2
          /* CLASS */
        ),
        vue.createCommentVNode(" 占空view,根据上方被悬挂的块高度自动调整 "),
        $data.fixed ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            style: vue.normalizeStyle({ height: $data.searchSpace + "px" })
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 头像及信息框 "),
        vue.createElementVNode("view", { class: "school-info" }, [
          vue.createCommentVNode(" 学校头像 "),
          vue.createElementVNode("view", { class: "school-profile" }, [
            vue.createElementVNode("image", {
              class: "school-profile-img",
              src: $data.schoolprofile
            }, null, 8, ["src"])
          ]),
          vue.createCommentVNode(" 名字，地点，距离 "),
          vue.createElementVNode("view", { class: "school-info-details" }, [
            vue.createElementVNode(
              "p",
              { class: "school-name" },
              vue.toDisplayString($data.schoolname),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "p",
              { class: "school-location" },
              vue.toDisplayString($data.schoollocation),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "school-distance" }, [
              vue.createElementVNode("image", {
                class: "loc-img",
                src: "/static/image/location.png"
              }),
              vue.createElementVNode(
                "view",
                null,
                vue.toDisplayString($data.distance) + "km away from you",
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" 更多"),
          vue.createElementVNode("view", { class: "more-threepoints" }, [
            vue.createElementVNode("image", {
              class: "more-img",
              src: "/static/image/more2.png",
              onClick: _cache[3] || (_cache[3] = ($event) => $options.show_option())
            })
          ])
        ]),
        vue.createCommentVNode(" 推荐商品 "),
        vue.createElementVNode("view", { class: "recommendGoods" }, [
          vue.createElementVNode("view", { class: "collections" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.GoodLists, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "collections-box"
                }, [
                  vue.createElementVNode("view", {
                    onClick: _cache[4] || (_cache[4] = ($event) => $options.toDetails())
                  }, [
                    vue.createElementVNode("image", {
                      class: "collections-img",
                      src: item.imageUrl
                    }, null, 8, ["src"])
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "collections-name" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "collections-state" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "collections-price" },
                      vue.toDisplayString(item.price) + " GBP",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "collections-timeInterval" },
                      vue.toDisplayString(item.timeInterval),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesMoreschoolSchooldetail = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/moreschool/schooldetail.vue"]]);
  const _sfc_main$1 = {
    methods: {
      handlePayment() {
        formatAppLog("log", "at pages/payment/alipay.vue:12", "a try");
        const orderInfo = {
          // 订单信息
          // 示例: provider: 'alipay', orderInfo: 'xxx'
        };
        formatAppLog("log", "at pages/payment/alipay.vue:17", "alipay");
        uni.requestPayment({
          provider: "alipay",
          orderInfo,
          // 真实的订单信息
          success: (res) => {
            formatAppLog("log", "at pages/payment/alipay.vue:22", "支付成功", res);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/payment/alipay.vue:26", "支付失败", err);
          }
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "payment-page" }, [
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.handlePayment && $options.handlePayment(...args))
      }, "确认支付")
    ]);
  }
  const PagesPaymentAlipay = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/86136/Desktop/Uniswap/appdev/pages/payment/alipay.vue"]]);
  __definePage("pages/signin/signin", PagesSigninSignin);
  __definePage("pages/signup/signup", PagesSignupSignup);
  __definePage("pages/homepage/homepage", PagesHomepageHomepage);
  __definePage("pages/moreschool/moreschool", PagesMoreschoolMoreschool);
  __definePage("pages/add/add", PagesAddAdd);
  __definePage("pages/search/search", PagesSearchSearch);
  __definePage("pages/category/category", PagesCategoryCategory);
  __definePage("pages/mine/mine", PagesMineMine);
  __definePage("pages/mine/Followcomponent", PagesMineFollowcomponent);
  __definePage("pages/mine/Collections", PagesMineCollections);
  __definePage("pages/message/message", PagesMessageMessage);
  __definePage("pages/message/communication/communication", PagesMessageCommunicationCommunication);
  __definePage("pages/goodsdetail/goodsdetail", PagesGoodsdetailGoodsdetail);
  __definePage("pages/moreschool/schooldetail", PagesMoreschoolSchooldetail);
  __definePage("pages/message/communication/submit", PagesMessageCommunicationSubmit);
  __definePage("pages/message/communication/emoji", PagesMessageCommunicationEmoji);
  __definePage("pages/payment/alipay", PagesPaymentAlipay);
  const _sfc_main = {
    onLaunch: function() {
    },
    onShow: function() {
    },
    onHide: function() {
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/86136/Desktop/Uniswap/appdev/App.vue"]]);
  let API_BASE_URL = "";
  let token = "";
  {
    API_BASE_URL = "http://152.136.158.210:8086";
  }
  const request = (options) => {
    return new Promise((resolve, reject) => {
      if (options.auth === false) {
        token = "";
      } else {
        token = token || uni.getStorageSync("token");
        if (!token) {
          uni.navigateTo({
            url: "../pages/signin/signin"
          });
        }
      }
      uni.request({
        url: API_BASE_URL + options.url,
        method: options.method || "GET",
        data: options.data || {},
        header: {
          token
        },
        dataType: "json",
        success(res) {
          {
            formatAppLog("log", "at config/request.js:34", options.url, res.data);
          }
          if (res && res.data.status !== 200) {
            let err = {};
            switch (res.data.status) {
              case 301:
                err.message = "请求的数据具有新的位置且更改是永久的";
                break;
              case 302:
                err.message = "请求的数据临时具有不同 URI";
                break;
              case 304:
                err.message = "未按预期修改文档";
                break;
              case 305:
                err.message = "必须通过代理来访问请求的资源";
                break;
              case 400:
                err.message = "请求中有语法问题，或不能满足请求";
                break;
              case 402:
                err.message = "所使用的模块需要付费使用";
                break;
              case 403:
                err.message = "当前操作没有权限";
                break;
              case 404:
                err.message = "服务器找不到给定的资源";
                break;
              case 407:
                err.message = "客户机首先必须使用代理认证自身";
                break;
              case 415:
                err.message = "请求类型不支持，服务器拒绝服务";
                break;
              case 417:
                err.message = "未绑定登录账号，请使用密码登录后绑定";
                break;
              case 426:
                err.message = "用户名不存在或密码错误";
                break;
              case 429:
                err.message = "请求过于频繁";
                break;
              case 500:
                err.message = "服务器内部错误，无法完成请求";
                break;
              case 501:
                err.message = "服务不支持请求";
                break;
              case 502:
                err.message = "网络错误，服务器接收到上上游服务器无效响应";
                break;
              case 503:
                err.message = "服务器无法处理请求";
                break;
              case 504:
                err.message = "网络请求超时";
                break;
              case 999:
                err.message = "系统未知错误，请反馈给管理员";
                break;
            }
            uni.showToast({
              title: err.message,
              icon: "none",
              duration: 1e3
            });
            resolve(res);
          }
          if (res.data.status === 401) {
            uni.showToast({
              title: "登录失效，请重新登录",
              icon: "none",
              duration: 2e3
            });
            setTimeout(function() {
              uni.navigateTo({
                url: "../pages/signin/signin"
              });
            }, 1500);
            reject();
          }
          if (res.data.status === 1002) {
            uni.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2e3
            });
            reject(res.data.msg);
          }
          return resolve(res);
        },
        fail(error) {
          uni.showToast({
            title: "连接服务器失败!",
            icon: "none",
            duration: 2e3
          });
          reject(error);
        }
      });
    });
  };
  function createApp() {
    const app = vue.createVueApp(App);
    app.config.globalProperties.$r = request;
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
