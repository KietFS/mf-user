import { apiURL } from "@/constanst";
import { setCurrentOrder, setOrders } from "@/redux/slices/order";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "./useToast";
import { ICreateOrder } from "@/@types";

const useOrder = () => {
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useSelector((state: any) => state.auth);
  const { currentOrder, orders } = useSelector((state: any) => state.order);
  const dispatch = useDispatch();
  const toast = useToast();

  const createOrder = async (createOrder: ICreateOrder) => {
    try {
      setActionLoading(true);
      const response = await axios.post(`${apiURL}/orders`, createOrder, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        toast.sendToast("success", "Đặt hàng thành công");
        dispatch(setCurrentOrder(response?.data?.data));
      }
    } catch (error) {
      toast.sendToast("error", "Đặt hàng thất bại, vui lòng thử lại sau");
      console.error("Create order ereor", error);
    } finally {
      setActionLoading(false);
    }
  };

  const cancelOrder = async (id: number) => {
    try {
      setActionLoading(true);
      const response = await axios.delete(`${apiURL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        toast.sendToast("success", "Xóa đơn hàng thành công");
        dispatch(setCurrentOrder(response?.data?.data));
      }
    } catch (error) {
      toast.sendToast("error", "Xóa đơn hàng thất bại, vui lòng thử lại sau");
      console.error("Create order ereor", error);
    } finally {
      setActionLoading(false);
    }
  };

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/orders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setLoading(false);
        dispatch(setOrders(response?.data?.data));
      }
    } catch (error) {
      setLoading(false);
      console.error("Get all orders error", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    actionLoading,
    currentOrder,
    getAllOrders,
    cancelOrder,
    orders,
  };
};

export default useOrder;
