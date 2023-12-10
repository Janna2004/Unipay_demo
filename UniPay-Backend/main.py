import os
import uuid
from alipay import AliPay
from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View

APPID="2016102200736331"
APP_PRIVATE_KEY_PATH="/app_private_key.pem"
ALIPAY_PUBLIC_KEY_PATH="/alipay_public_key.pem"


class OrderPayView(View):
	def post(self,total_pay,request):
		#接收参数
		order_id = str(uuid.uuid1())
		merchant_private_key_path = open(os.path.join(APP_PRIVATE_KEY_PATH)).read()
		alipay_public_key_path = open(os.path.join(ALIPAY_PUBLIC_KEY_PATH)).read()
		# print(x,'eeeee')

		# 检验总金额是否等于业务金额，防止传输过程中被篡改
		# if (total_pay == res.updated):
		# 		user_order_success = True # 通知插件我的自定义回调逻辑执行成功
		# else:
		# 		user_order_success = False # 通知插件我的自定义回调逻辑执行失败

		#业务处理:使用Python sdk调用支付宝的支付接口
		alipay = AliPay(
			appid=APPID,   #APPID
			app_notify_url=None,  # 默认回调url,可以传也可以不传
			app_private_key_string=merchant_private_key_path, #私钥的路径
			alipay_public_key_string=alipay_public_key_path,#支付宝公钥的路径
			sign_type="RSA2",  # 签名的算法为RSA2
			debug = True  # 默认False，沙箱环境改成True
		)
		#借助alipay对象，向支付宝发起支付请求
		#电脑网站支付，需要跳转到https://openapi.alipaydev.com/gateway.do?+order_string
		order_string = alipay.api_alipay_trade_page_pay(
			out_trade_no=order_id,  #订单id
			total_amount=str(total_pay), #支付宝总金额
			subject="测试支付", #订单标题
			return_url="http://127.0.0.1:8000/success/",
			notify_url=None
		)
		#返回应答
		pay_url = "https://openapi.alipaydev.com/gateway.do?"+order_string
		return JsonResponse({"pay_url":pay_url})
