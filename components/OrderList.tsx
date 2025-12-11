"use client";

import { useEffect, useState } from "react";
import { useContract } from "@/hooks/useContract";
import OrderCard from "./OrderCard";
import { Heading } from "@radix-ui/themes";

export default function OrderList() {
  const { getOrders } = useContract();
  const [orders, setOrders] = useState([]);

  async function load() {
    const res = await getOrders();
    const items = res.data?.content?.fields?.orders || [];
    setOrders(items);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <Heading size="5" mb="3">Orders</Heading>

      {orders.map(o => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}
