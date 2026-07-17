export const billSplitterAbi = [
  {
    type: "function",
    name: "createBill",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "totalAmount", type: "uint256" },
      { name: "participants", type: "address[]" },
      { name: "shares", type: "uint256[]" },
    ],
    outputs: [{ name: "billId", type: "uint256" }],
  },
  {
    type: "function",
    name: "confirm",
    stateMutability: "nonpayable",
    inputs: [{ name: "billId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "settle",
    stateMutability: "payable",
    inputs: [{ name: "billId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getBill",
    stateMutability: "view",
    inputs: [{ name: "billId", type: "uint256" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "title", type: "string" },
      { name: "totalAmount", type: "uint256" },
      { name: "participants", type: "address[]" },
      { name: "shares", type: "uint256[]" },
      { name: "settled", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "isFullyConfirmed",
    stateMutability: "view",
    inputs: [{ name: "billId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "isConfirmed",
    stateMutability: "view",
    inputs: [
      { name: "billId", type: "uint256" },
      { name: "participant", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "isParticipant",
    stateMutability: "view",
    inputs: [
      { name: "billId", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "nextBillId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "BillCreated",
    inputs: [
      { name: "billId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "title", type: "string", indexed: false },
      { name: "totalAmount", type: "uint256", indexed: false },
      { name: "participants", type: "address[]", indexed: false },
      { name: "shares", type: "uint256[]", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BillConfirmed",
    inputs: [
      { name: "billId", type: "uint256", indexed: true },
      { name: "participant", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "BillSettled",
    inputs: [
      { name: "billId", type: "uint256", indexed: true },
      { name: "totalAmount", type: "uint256", indexed: false },
    ],
  },
] as const;
