"use client";

import { useState } from "react";
import { useContract } from "@/hooks/useContract";
import { Button, TextField, Heading, Flex } from "@radix-ui/themes";

export default function CreateOrder() {
  const { createOrder } = useContract();

  const [customer, setCustomer] = useState("");
  const [courier, setCourier] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    try {
      setLoading(true);
      await createOrder(customer, courier);
      alert("Order created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create order");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "1.5rem", background: "var(--gray-a3)", borderRadius: "12px" }}>
      <Heading size="5" mb="3">Create Delivery Order</Heading>

      <Flex direction="column" gap="3">
        <TextField.Input
          placeholder="Customer address (0x...)"
          value={customer}
          onChange={e => setCustomer(e.target.value)}
        />
        <TextField.Input
          placeholder="Courier address (0x...)"
          value={courier}
          onChange={e => setCourier(e.target.value)}
        />

        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Processing..." : "Create Order"}
        </Button>
      </Flex>
    </div>
  );
}
