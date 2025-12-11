"use client"

import { useCurrentAccount } from "@iota/dapp-kit"
import { useContract } from "@/hooks/useContract"
import { Button, Container, Flex, Heading, Text, TextField, TextArea } from "@radix-ui/themes"
import ClipLoader from "react-spinners/ClipLoader"
import { useState } from "react"
import { DeliveryStatus } from "@/types/delivery"

const DeliveryVerificationSystem = () => {
  const currentAccount = useCurrentAccount()
  const { 
    delivery, 
    actions, 
    state, 
    objectId, 
    isOwner, 
    objectExists, 
    hasValidData 
  } = useContract()

  const [deliveryForm, setDeliveryForm] = useState({
    trackingId: "",
    recipient: "",
    destination: "",
    items: ""
  })

  const isConnected = !!currentAccount

  const handleCreateDelivery = async () => {
    if (!deliveryForm.trackingId || !deliveryForm.recipient) {
      alert("Please fill in Tracking ID and Recipient Name")
      return
    }
    await actions.createDelivery(
      deliveryForm.trackingId,
      deliveryForm.recipient,
      deliveryForm.destination,
      deliveryForm.items
    )
    // Reset form after creation
    setDeliveryForm({ trackingId: "", recipient: "", destination: "", items: "" })
  }

  const getStatusColor = (status: DeliveryStatus) => {
    const colors = {
      PENDING: "#f59e0b",
      IN_TRANSIT: "#3b82f6",
      OUT_FOR_DELIVERY: "#8b5cf6",
      DELIVERED: "#10b981",
      CANCELLED: "#ef4444"
    }
    return colors[status] || "#6b7280"
  }

  if (!isConnected) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <Container size="2">
          <Heading size="8" mb="4">📦 Delivery Verification System</Heading>
          <Text size="3" mb="4">Secure delivery tracking on IOTA blockchain</Text>
          <div style={{ padding: "1rem", background: "var(--gray-a3)", borderRadius: "8px" }}>
            <Text>🔐 Please connect your IOTA wallet to continue</Text>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "var(--gray-a2)" }}>
      <Container size="3">
        <Heading size="8" mb="2">📦 Delivery Verification System</Heading>
        <Text size="2" color="gray" mb="6">
          Connected: {currentAccount.address?.slice(0, 8)}...{currentAccount.address?.slice(-6)}
        </Text>

        {!objectId ? (
          <div style={{ background: "var(--color-panel)", padding: "2rem", borderRadius: "12px" }}>
            <Heading size="6" mb="4">Create New Delivery Record</Heading>
            
            <Flex direction="column" gap="3">
              <div>
                <Text size="2" weight="medium" mb="1">Tracking ID *</Text>
                <TextField.Root
                  placeholder="e.g., DLV-2024-001"
                  value={deliveryForm.trackingId}
                  onChange={(e) => setDeliveryForm({...deliveryForm, trackingId: e.target.value})}
                />
              </div>

              <div>
                <Text size="2" weight="medium" mb="1">Recipient Name *</Text>
                <TextField.Root
                  placeholder="e.g., John Doe"
                  value={deliveryForm.recipient}
                  onChange={(e) => setDeliveryForm({...deliveryForm, recipient: e.target.value})}
                />
              </div>

              <div>
                <Text size="2" weight="medium" mb="1">Destination Address</Text>
                <TextField.Root
                  placeholder="e.g., 123 Main St, City, Country"
                  value={deliveryForm.destination}
                  onChange={(e) => setDeliveryForm({...deliveryForm, destination: e.target.value})}
                />
              </div>

              <div>
                <Text size="2" weight="medium" mb="1">Items Description</Text>
                <TextArea
                  placeholder="e.g., 2x Electronics, 1x Document"
                  value={deliveryForm.items}
                  onChange={(e) => setDeliveryForm({...deliveryForm, items: e.target.value})}
                  rows={3}
                />
              </div>

              <Button size="3" onClick={handleCreateDelivery} disabled={state.isPending}>
                {state.isPending ? (
                  <>
                    <ClipLoader size={16} color="#fff" />
                    Creating...
                  </>
                ) : (
                  "🚀 Create Delivery Record"
                )}
              </Button>

              {state.error && (
                <div style={{ padding: "1rem", background: "var(--red-a3)", borderRadius: "8px" }}>
                  <Text color="red">❌ Error: {(state.error as Error)?.message || String(state.error)}</Text>
                </div>
              )}
            </Flex>
          </div>
        ) : (
          <div>
            {state.isLoading && !delivery ? (
              <Text>⏳ Loading delivery record...</Text>
            ) : state.error ? (
              <div style={{ background: "var(--color-panel)", padding: "2rem", borderRadius: "12px" }}>
                <div style={{ padding: "1rem", background: "var(--red-a3)", borderRadius: "8px", marginBottom: "1rem" }}>
                  <Text color="red" weight="medium">❌ Error Loading Delivery Record</Text>
                  <Text size="2" color="red" mt="2">{state.error.message || "Object not found"}</Text>
                  <Text size="1" color="gray" mt="2">Object ID: {objectId}</Text>
                </div>
                <Button variant="soft" onClick={actions.clearObject}>🔄 Clear & Create New</Button>
              </div>
            ) : objectExists && !hasValidData ? (
              <div style={{ background: "var(--color-panel)", padding: "2rem", borderRadius: "12px" }}>
                <div style={{ padding: "1rem", background: "var(--yellow-a3)", borderRadius: "8px" }}>
                  <Text color="orange">⚠️ Invalid data structure. Check contract.</Text>
                  <Text size="1" color="gray" mt="2">Object ID: {objectId}</Text>
                </div>
              </div>
            ) : delivery ? (
              <div style={{ background: "var(--color-panel)", padding: "2rem", borderRadius: "12px" }}>
                <div style={{ padding: "1.5rem", background: "var(--gray-a3)", borderRadius: "12px", marginBottom: "1.5rem" }}>
                  <Heading size="5" mb="3">📋 Delivery Details</Heading>
                  
                  <Flex direction="column" gap="2">
                    <div>
                      <Text weight="bold">Tracking ID: </Text>
                      <Text>{delivery.trackingId}</Text>
                    </div>
                    <div>
                      <Text weight="bold">Status: </Text>
                      <span style={{ 
                        padding: "0.25rem 0.75rem",
                        background: getStatusColor(delivery.status),
                        color: "white",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        {delivery.status}
                      </span>
                    </div>
                    <div>
                      <Text weight="bold">Recipient: </Text>
                      <Text>{delivery.recipient}</Text>
                    </div>
                    <div>
                      <Text weight="bold">Destination: </Text>
                      <Text>{delivery.destination || "N/A"}</Text>
                    </div>
                    <div>
                      <Text weight="bold">Items: </Text>
                      <Text>{delivery.items || "N/A"}</Text>
                    </div>
                    <div>
                      <Text weight="bold">Created: </Text>
                      <Text size="2" color="gray">{new Date(delivery.createdAt).toLocaleString()}</Text>
                    </div>
                    {delivery.deliveredAt && (
                      <div>
                        <Text weight="bold">Delivered: </Text>
                        <Text size="2" color="gray">{new Date(delivery.deliveredAt).toLocaleString()}</Text>
                      </div>
                    )}
                  </Flex>

                  <Text size="1" color="gray" mt="3">Object ID: {objectId}</Text>
                </div>

                <Flex gap="2" mb="3" wrap="wrap">
                  <Button
                    onClick={() => actions.updateStatus(DeliveryStatus.IN_TRANSIT)}
                    disabled={state.isPending || delivery.status === DeliveryStatus.DELIVERED}
                    color="blue"
                  >
                    {state.isPending ? <ClipLoader size={16} color="#fff" /> : "🚚"} In Transit
                  </Button>
                  
                  <Button
                    onClick={() => actions.updateStatus(DeliveryStatus.OUT_FOR_DELIVERY)}
                    disabled={state.isPending || delivery.status === DeliveryStatus.DELIVERED}
                    color="purple"
                  >
                    {state.isPending ? <ClipLoader size={16} color="#fff" /> : "📦"} Out for Delivery
                  </Button>

                  <Button
                    onClick={actions.confirmDelivery}
                    disabled={state.isPending || delivery.status === DeliveryStatus.DELIVERED}
                    color="green"
                  >
                    {state.isPending ? <ClipLoader size={16} color="#fff" /> : "✅"} Confirm Delivery
                  </Button>

                  {isOwner && delivery.status !== DeliveryStatus.DELIVERED && (
                    <Button
                      onClick={() => actions.updateStatus(DeliveryStatus.CANCELLED)}
                      disabled={state.isPending}
                      color="red"
                      variant="soft"
                    >
                      {state.isPending ? <ClipLoader size={16} /> : "❌"} Cancel
                    </Button>
                  )}
                </Flex>

                {isOwner && (
                  <Button variant="outline" onClick={actions.clearObject} style={{ width: "100%", marginBottom: "1rem" }}>
                    🔄 Clear & Create New Delivery
                  </Button>
                )}

                {state.hash && (
                  <div style={{ padding: "1rem", background: "var(--gray-a3)", borderRadius: "8px" }}>
                    <Text size="2" weight="medium" mb="2">Transaction Hash</Text>
                    <Text size="2" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{state.hash}</Text>
                    {state.isConfirmed && (
                      <Text color="green" mt="2" weight="medium">✅ Transaction confirmed!</Text>
                    )}
                  </div>
                )}

                {state.error && (
                  <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--red-a3)", borderRadius: "8px" }}>
                    <Text color="red">❌ Error: {(state.error as Error)?.message || String(state.error)}</Text>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: "var(--color-panel)", padding: "2rem", borderRadius: "12px" }}>
                <div style={{ padding: "1rem", background: "var(--yellow-a3)", borderRadius: "8px", marginBottom: "1rem" }}>
                  <Text color="orange">⚠️ Delivery record not found</Text>
                  <Text size="1" color="gray" mt="2">Object ID: {objectId}</Text>
                </div>
                <Button variant="soft" onClick={actions.clearObject}>🔄 Clear & Create New</Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default DeliveryVerificationSystem
