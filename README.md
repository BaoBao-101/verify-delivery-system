# verify-delivery-system

A decentralized Verify Delivery System built on the IOTA Tangle, allowing users to create, track, and confirm delivery orders with full on-chain transparency. The system records essential delivery details — including order ID, items, customer name, and delivery address — and enables couriers or recipients to verify and confirm deliveries directly on-chain.
This project showcases a complete integration of a Move smart contract with a modern Next.js / React frontend and the IOTA Wallet Standard for secure transaction signing.

## Table of Contents

- [Verify Delivery System](#verify-delivery-system)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Key Features](#key-features)
  - [Techniques \& Architecture](#techniques--architecture)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Installation \& Setup](#installation--setup)
    - [Prerequisites](#prerequisites)
    - [1. Smart Contract Deployment](#1-smart-contract-deployment)
    - [2. Frontend Setup](#2-frontend-setup)
  - [Configuration](#configuration)
  - [Smart Contract API](#smart-contract-api)
  - [Contribution](#contribution)
  - [License](#license)

## Introduction

The Verify Delivery System leverages the IOTA network’s object-centric architecture to create a transparent and tamper-proof system for managing delivery orders.
Unlike traditional delivery tracking platforms, this dApp ensures that delivery data — including order ID, customer name, address, and item list — is stored immutably on-chain. Each order becomes a Move Order resource, enabling secure tracking, verification, and updates without the need for a trusted intermediary.

This project demonstrates a full-stack integration of IOTA Move smart contracts, a Next.js frontend, and the IOTA Wallet Standard, providing end-to-end verification for real-world delivery workflows.

## Key Features

- **Tamper-Proof Delivery Records**: Every order is stored as an on-chain Move resource containing order ID, customer name, address, and items.

- **State-Driven Delivery Workflow**: Enforces a strict lifecycle:Created → InTransit → Delivered → Verified.

- **Role-Based Permissions**:
  - **Senders** can create orders and update delivery status.
  - **Couriers** can mark progress (e.g., picked up, in transit).
  - **Recipients** can verify that the delivery was successfully completed.
- **Transparent Order Tracking**: Anyone with the Order ID can check delivery status directly from the Tangle.

- **Wallet Integration**: Fully integrated with the IOTA Wallet Standard for creating and verifying delivery transactions.
- **Responsive UI**: Built with Radix UI and Next.js for a clean, accessible, reactive user experience.

## Techniques & Architecture

This project employs several advanced patterns suitable for scalable dApp development:

- **Resource-Oriented Programming (Move)**:
  The smart contract treats the `Task` as a [Move Resource](https://docs.iota.org/developer/move-overview/move-intro). This ensures that the bounty reward (an `IOTA` Coin) is physically stored within the task object and cannot be duplicated or accidentally destroyed.

- **Client-Side State Management**:
  We utilize [TanStack Query (React Query)](https://tanstack.com/query/latest) to manage server state. This abstracts the complexity of asynchronous blockchain data fetching, caching, and synchronization, providing a snappy user experience.

- **Component Composition**:
  The UI is built using [Radix UI](https://www.radix-ui.com/) primitives. This allows for accessible, unstyled components that are composed into a custom design system using `@radix-ui/themes`, avoiding the overhead of runtime CSS-in-JS libraries.

## Technologies Used

- **[IOTA Move](https://docs.iota.org/developer/move-overview/move-intro)**: Smart contract logic.
- **[React](https://react.dev/)**: Frontend library.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling.
- **[@iota/dapp-kit](https://sdk.iota.org/dapp-kit)**: React hooks and components for IOTA.
- **[@radix-ui/themes](https://www.radix-ui.com/themes/docs/overview/getting-started)**: High-quality, accessible UI components.
- **[TypeScript](https://www.typescriptlang.org/)**: Static typing for safer code.

## Project Structure

```string
verify-delivery-system/
│
├── app/
|   ├── favicon.ico
|   ├── globals.css
|   ├── layout.tsx
|   ├── page.tsx
|   └── providers.tsx
│
├──components/
|   ├── CreateOrder.tsx
|   ├── DeliveryVerificationSystem.tsx
|   ├── Header.tsx
|   ├── OrderCard.tsx
|   ├── OrderList.tsx
|   ├── Provider.tsx
|   ├── sample.tsx
|   └── WalletConnect.tsx
│
├── hooks/
│   └── useContract.ts
│
├── contract/
│   ├── sources/
│   │   └── delivery_verification.move
│   └── Move.toml
│
├── public/                 # Static assets
│
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites

- **Node.js** (v18+)
- **IOTA CLI** (for smart contract deployment)
- **IOTA Wallet** (browser extension)

### 1. Smart Contract Deployment

Navigate to the move directory and publish the package to the IOTA Testnet.

```bash
cd move
iota move build
iota move publish --gas-budget 100000000
```

> **Note**: Copy the **Package ID** from the output. You will need this for the frontend configuration.

### 2. Frontend Setup

Navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
npm run dev
```

## Configuration

After deploying the contract, update the frontend configuration to point to your new package.

Edit `frontend/src/constants.ts`:

```typescript
export const PACKAGE_ID = "0x...<YOUR_PACKAGE_ID>";
export const MODULE_NAME = "delivery_verifycation";
export const NETWORK = "testnet";
```

## Smart Contract API

The `lucky_bounty` module exposes the following entry functions:

| Function          | Description                                                                           |
| :---------------- | :------------------------------------------------------------------------------------ |
| `create_order`    | Creates a new `Order` object containing order ID, customer info, address, and items.  |

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/{your-amazing-feature}`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/{your-amazing-feature}`).
5. Open a Pull Request.

## Contract address
https://explorer.iota.org/address/0xd9607bd5e8ed0634c3105aaa31604bacb420eca1393437119835c7f7d6233a3a?network=testnet

<img width="1600" height="781" alt="image" src="https://github.com/user-attachments/assets/4c5fb235-393d-4d39-831e-6ccb15a29a6a" />

## License

Distributed under the MIT License.
