import os
import uuid
from django.http import JsonResponse
from alipay import AliPay

APPID="2021004129669299"
APP_PRIVATE_KEY_PATH="C:\\Users\\86136\\Documents\\支付宝开放平台密钥工具\\pem\\app_private_key.txt" # 生成的私钥路径，需要根据实际修改
ALIPAY_PUBLIC_KEY_PATH="C:\\Users\\86136\\Documents\\支付宝开放平台密钥工具\\pem\\alipay_public_key.txt" # 生成的公钥路径，需要根据实际修改

def get_order_info(request):
    # 参数设置
    order_id = str(uuid.uuid1())
    merchant_private_key_path = open(os.path.join(APP_PRIVATE_KEY_PATH)).read()
    alipay_public_key_path = open(os.path.join(ALIPAY_PUBLIC_KEY_PATH)).read()

    # 业务处理:使用Python sdk调用支付宝的支付接口
    alipay = AliPay(
        appid=APPID,  # APPID
        app_notify_url=None,  # 默认回调url,可以传也可以不传
        app_private_key_string=merchant_private_key_path,  # 私钥的路径
        alipay_public_key_string=alipay_public_key_path,  # 支付宝公钥的路径
        sign_type="RSA2",  # 签名的算法为RSA2
        debug=True  # 默认False，沙箱环境改成True
    )

    # 向支付宝发送请求
    total_pay = request.GET.get('total_pay')
    result = alipay.api_alipay_trade_page_pay(
        out_trade_no=order_id,  # 订单id
        total_amount=str(total_pay),  # 支付宝总金额
        subject="测试支付",  # 订单标题
        # return_url="http://127.0.0.1:8000/success/",
        notify_url=None
    )

    # 处理返回的结果
    # ...（根据您的需要处理和解析结果）

    # 将结果返回给前端
    return JsonResponse({'status': 'success', 'data': result})
