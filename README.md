# 支付宝开发文档（前后端都有）

# 整体业务逻辑：

![img](https://paper-attachments.dropboxusercontent.com/s_6BE2F2DD0343517988ABE9CF5F556E8467F2528BFB715BAC1915666C5F926A21_1702120628113_image.png)

# 支付宝支付——前端部分

使用uniapp框架

## **界面规范**

demo中没有配置。**↓文档中有资源文件↓**

https://opendocs.alipay.com/open/204/0191v1?pathHash=d80d9069

## **配置文件**

打开manifest.json，选择支付宝支付

![img](https://paper-attachments.dropboxusercontent.com/s_6BE2F2DD0343517988ABE9CF5F556E8467F2528BFB715BAC1915666C5F926A21_1702120658964_image.png)

## **主要参考文档**

**uniapp的支付模块（主要看app支付模块）**

链接：[https://zh.uniapp.dcloud.io/api/plugins/payment.html#app%E6%94%AF%E4%BB%98](https://zh.uniapp.dcloud.io/api/plugins/payment.html#app支付)

# 支付宝支付——后端部分

使用django框架

服务器需要生成订单信息，并传给前端

## **demo的python环境**

python 3.11

## **安装必要的包**

```
 pip install python-alipay-sdk
 pip install pycryptodome
```

## **注意**

- 密钥和公钥不要明文写在代码里，要写在文件里然后用读文件的操作。更安全。

```
 merchant_private_key_path = open(os.path.join("文件路径")).read()
 alipay_public_key_path  =open(os.path.join("文件路径")).read()
```

公钥泄露会怎么样：https://opensupport.alipay.com/support/FAQ/6b4c9dd7-d509-44b3-b59e-0355067afc99

- 支付多少元是前端传来的，为了避免数据篡改，后端要查验一下是不是要支付这么多钱
- ...待补充

## **主要参考文档（仍需补充）**

**支付宝的sdk文档**

https://opendocs.alipay.com/open/cd12c885_alipay.trade.app.pay?scene=20&pathHash=c0e35284

**支付宝app支付文档**

https://opendocs.alipay.com/open/204/01dcc0?pathHash=cf89b2be

**支付宝沙箱文档**

https://opendocs.alipay.com/open/204/106450?pathHash=f5e7ce65
