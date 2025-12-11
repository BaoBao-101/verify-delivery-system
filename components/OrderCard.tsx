"use client";

import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useContract } from "@/hooks/useContract";

export default function OrderCard({ order }) {
  const { assignCourier, markDelivered, confirmOrder, account } = useContract();

  const isCustomer = account?.address === order.customer;
  const isCourier = account?.address === order.courier;

  return (
    <Card style={{ padding: "1rem", marginBottom: "1rem" }}>
      <Heading size="4">Order #{order.id}</Heading>

      <Text as="p">Customer: {order.customer}</Text>
      <Text as="p">Courier: {order.courier}</Text>
      <Text as="p">Status: <strong>{order.status}</strong></Text>

      <Flex gap="2" mt="3">
        {isCourier && order.status === "ASSIGNED" && (
          <Button onClick={() => markDelivered(order.id)}>
            Mark Delivered
          </Button>
        )}

        {isCustomer && order.status === "DELIVERED" && (
          <Button variant="soft" onClick={() => confirmOrder(order.id)}>
            Confirm Received
          </Button>
        )}
      </Flex>
    </Card>
  );
}
