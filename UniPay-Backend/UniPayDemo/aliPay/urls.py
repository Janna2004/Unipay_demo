from django.urls import path

from . import views

urlpatterns = [
    path("getOrderInfo", views.get_order_info, name="get_order_info"),
]