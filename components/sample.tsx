// components/sample.tsx
"use client"

import { useState } from "react"
import { useCurrentAccount } from "@iota/dapp-kit"
import { useContract } from "@/hooks/useContract"
import { Button, Container, Flex, Heading, Text } from "@radix-ui/themes"
import ClipLoader from "react-spinners/ClipLoader"

const DeliveryIntegration = () => {
  const currentAccount = useCurrentAccount()
  const { data, actions, state, objectId, isOwner, objectExists, hasValidData } = useContract()
  
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
    setDeliveryForm({ trackingId: "", recipient: "", destination: "", items: "" })
  }

  if (!isConnected) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <Heading size="6" style={{ marginBottom: "1rem" }}>📦 Delivery Verification System</Heading>
          <Text>Please connect your IOTA wallet to manage deliveries.</Text>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", padding: "1rem", background: "var(--gray-a2)" }}>
      <Container style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Heading size="6" style={{ marginBottom: "2rem" }}>📦 Delivery Verification System</Heading>

        {!objectId ? (
          <div style={{ padding: "1.5rem", background: "var(--color-panel)", borderRadius: "8px" }}>
            <Heading size="4" style={{ marginBottom: "1rem" }}>Create New Delivery</Heading>
            
            <div style={{ marginBottom: "1rem" }}>
              <Text size="2" weight="medium" style={{ display: "block", marginBottom: "0.5rem" }}>Tracking ID *</Text>
              <input
                type="text"
                placeholder="e.g., DLV-2024-001"
                value={deliveryForm.trackingId}
                onChange={(e) => setDeliveryForm({...deliveryForm, trackingId: e.target.value})}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--gray-a6)" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Text size="2" weight="medium" style={{ display: "block", marginBottom: "0.5rem" }}>Recipient *</Text>
              <input
                type="text"
                placeholder="e.g., John Doe"
                value={deliveryForm.recipient}
                onChange={(e) => setDeliveryForm({...deliveryForm, recipient: e.target.value})}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--gray-a6)" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Text size="2" weight="medium" style={{ display: "block", marginBottom: "0.5rem" }}>Destination</Text>
              <input
                type="text"
                placeholder="e.g., 123 Main St"
                value={deliveryForm.destination}
                onChange={(e) => setDeliveryForm({...deliveryForm, destination: e.target.value})}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--gray-a6)" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <Text size="2" weight="medium" style={{ display: "block", marginBottom: "0.5rem" }}>Items</Text>
              <textarea
                placeholder="e.g., 2x Electronics"
                value={deliveryForm.items}
                onChange={(e) => setDeliveryForm({...deliveryForm, items: e.target.value})}
                rows={3}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--gray-a6)" }}
              />
            </div>

            <Button size="3" onClick={handleCreateDelivery} disabled={state.isPending}>
              {state.isPending ? <><ClipLoader size={16} color="#fff" /> Creating...</> : "Create Delivery"}
            </Button>

            {state.error && (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--red-a3)", borderRadius: "8px" }}>
                <Text style={{ color: "var(--red-11)" }}>Error: {(state.error as Error)?.message || String(state.error)}</Text>
              </div>
            )}
          </div>
        ) : (
          <div>
            {state.isLoading && !data ? (
              <Text>Loading delivery...</Text>
            ) : state.error ? (
              <div style={{ padding: "1rem", background: "var(--red-a3)", borderRadius: "8px" }}>
                <Text style={{ color: "var(--red-11)", display: "block", marginBottom: "0.5rem" }}>Error loading delivery</Text>
                <Text size="2" style={{ color: "var(--red-11)" }}>{state.error.message || "Delivery not found"}</Text>
                <Text size="1" style={{ color: "var(--gray-a11)", marginTop: "0.5rem", display: "block" }}>ID: {objectId}</Text>
                <Button size="2" variant="soft" onClick={actions.clearObject} style={{ marginTop: "1rem" }}>Clear & Create New</Button>
              </div>
            ) : objectExists && !hasValidData ? (
              <div style={{ padding: "1rem", background: "var(--yellow-a3)", borderRadius: "8px" }}>
                <Text style={{ color: "var(--yellow-11)" }}>Invalid data structure</Text>
              </div>
            ) : data ? (
              <div>
                <div style={{ marginBottom: "1rem", padding: "1rem", background: "var(--gray-a3)", borderRadius: "8px" }}>
                  <Heading size="5" style={{ marginBottom: "0.5rem" }}>Delivery Details</Heading>
                  <Text size="2" style={{ display: "block" }}><b>Tracking:</b> {data.trackingId}</Text>
                  <Text size="2" style={{ display: "block", marginTop: "4px" }}><b>Status:</b> {data.status}</Text>
                  <Text size="2" style={{ display: "block", marginTop: "4px" }}><b>Recipient:</b> {data.recipient}</Text>
                  <Text size="2" style={{ display: "block", marginTop: "4px" }}><b>Destination:</b> {data.destination || "N/A"}</Text>
                  <Text size="1" style={{ color: "var(--gray-a11)", marginTop: "0.6rem", display: "block" }}>ID: {objectId}</Text>
                </div>

                <Flex gap="2" style={{ marginBottom: "1rem" }}>
                  <Button onClick={() => actions.updateStatus(1)} disabled={state.isPending || data.status === "DELIVERED"}>In Transit</Button>
                  <Button onClick={() => actions.updateStatus(2)} disabled={state.isPending || data.status === "DELIVERED"}>Out for Delivery</Button>
                  <Button onClick={actions.confirmDelivery} disabled={state.isPending || data.status === "DELIVERED"} color="green">Confirm Delivery</Button>
                </Flex>

                {state.hash && (
                  <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--gray-a3)", borderRadius: "8px" }}>
                    <Text size="1" style={{ display: "block", marginBottom: "0.5rem" }}>Transaction Hash</Text>
                    <Text size="2" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{state.hash}</Text>
                    {state.isConfirmed && <Text size="2" style={{ color: "green", marginTop: "0.5rem", display: "block" }}>Confirmed!</Text>}
                  </div>
                )}

                {state.error && (
                  <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--red-a3)", borderRadius: "8px" }}>
                    <Text style={{ color: "var(--red-11)" }}>Error: {(state.error as Error)?.message || String(state.error)}</Text>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: "1rem", background: "var(--yellow-a3)", borderRadius: "8px" }}>
                <Text style={{ color: "var(--yellow-11)" }}>Delivery not found</Text>
                <Text size="1" style={{ color: "var(--gray-a11)", marginTop: "0.5rem" }}>ID: {objectId}</Text>
                <Button size="2" variant="soft" onClick={actions.clearObject} style={{ marginTop: "1rem" }}>Clear & Create New</Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default DeliveryIntegration
