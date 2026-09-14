import type { User, Post } from "../types";

export const initialUsers: User[] = [
  {
    id: "u1",
    username: "alex.chen",
    fullName: "Alex Chen",
    bio: "Product designer & creative coder. Building things that matter. ✦",
    email: "alex@example.com",
    password: "password",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    coverPhoto:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=320&fit=crop&auto=format",
    followers: ["u2", "u3", "u4", "u5"],
    following: ["u2", "u3", "u4"],
    postIds: ["p1", "p2"],
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "u2",
    username: "sarah.kim",
    fullName: "Sarah Kim",
    bio: "UX researcher · Photography · Seoul → NYC",
    email: "sarah@example.com",
    password: "password",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
    coverPhoto:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=320&fit=crop&auto=format",
    followers: ["u1", "u3", "u6"],
    following: ["u1", "u4", "u5", "u6"],
    postIds: ["p3", "p4"],
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "u3",
    username: "marcus.j",
    fullName: "Marcus Johnson",
    bio: "Full-stack dev · Open source advocate · Coffee & code",
    email: "marcus@example.com",
    password: "password",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&auto=format",
    coverPhoto:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=320&fit=crop&auto=format",
    followers: ["u1", "u2", "u4", "u5", "u6"],
    following: ["u1", "u2", "u6"],
    postIds: ["p5", "p6"],
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "u4",
    username: "emma.r",
    fullName: "Emma Rodriguez",
    bio: "Motion designer & illustrator. Creating worlds one frame at a time 🎨",
    email: "emma@example.com",
    password: "password",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format",
    coverPhoto:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=900&h=320&fit=crop&auto=format",
    followers: ["u1", "u2", "u5"],
    following: ["u1", "u3", "u5"],
    postIds: ["p7", "p8"],
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "u5",
    username: "liam.park",
    fullName: "Liam Park",
    bio: "Founder @studioblock · Minimalism · Architecture",
    email: "liam@example.com",
    password: "password",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
    coverPhoto:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&h=320&fit=crop&auto=format",
    followers: ["u2", "u3", "u4"],
    following: ["u2", "u4", "u6"],
    postIds: ["p9", "p10"],
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "u6",
    username: "ava.w",
    fullName: "Ava Williams",
    bio: "Content creator & travel blogger · 42 countries & counting ✈️",
    email: "ava@example.com",
    password: "password",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&auto=format",
    coverPhoto:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&h=320&fit=crop&auto=format",
    followers: ["u3", "u4", "u5"],
    following: ["u2", "u3", "u5"],
    postIds: ["p11", "p12"],
    createdAt: "2024-02-20T10:00:00Z",
  },
];

export const initialPosts: Post[] = [
  {
    id: "p1",
    userId: "u1",
    content:
      "Just shipped a major redesign of our design system's token architecture. The key insight: naming conventions should describe the *intent*, not the value. `--color-action-primary` beats `--color-blue-600` every time. Three months of iteration, but it finally feels right.",
    likes: ["u2", "u3", "u4", "u5"],
    comments: [
      {
        id: "c1",
        userId: "u3",
        content:
          "This is the way. Intent-based naming changes everything for design handoffs too.",
        createdAt: "2024-03-10T11:00:00Z",
        likes: ["u1", "u2"],
      },
      {
        id: "c2",
        userId: "u2",
        content:
          "Would love to see a writeup on this! The before/after comparison must be interesting.",
        createdAt: "2024-03-10T12:00:00Z",
        likes: ["u1"],
      },
    ],
    createdAt: "2024-03-10T10:00:00Z",
  },
  {
    id: "p2",
    userId: "u1",
    content:
      "Late night prototyping session. There's something meditative about the quiet hours when the ideas finally start connecting.",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop&auto=format",
    likes: ["u2", "u4", "u6"],
    comments: [
      {
        id: "c3",
        userId: "u4",
        content: "3am ideas hit different ✨",
        createdAt: "2024-03-12T03:30:00Z",
        likes: ["u1", "u2", "u3"],
      },
    ],
    createdAt: "2024-03-12T03:00:00Z",
  },
  {
    id: "p3",
    userId: "u2",
    content:
      "Spent the afternoon at the High Line. NYC never stops surprising me — found a tiny exhibition about brutalist architecture tucked between the gardens. The contrast was everything.",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop&auto=format",
    likes: ["u1", "u3", "u5", "u6"],
    comments: [
      {
        id: "c4",
        userId: "u6",
        content: "I've been meaning to visit that exhibition! Is it still up?",
        createdAt: "2024-03-08T16:00:00Z",
        likes: ["u2"],
      },
    ],
    createdAt: "2024-03-08T15:00:00Z",
  },
  {
    id: "p4",
    userId: "u2",
    content:
      "Hot take: the best user research isn't in the lab. It's watching your mom try to use your product for the first time. Humbling every single time.",
    likes: ["u1", "u3", "u4", "u5", "u6"],
    comments: [
      {
        id: "c5",
        userId: "u1",
        content:
          "This is why guerrilla testing exists. No controlled environment replicates real-world usage patterns.",
        createdAt: "2024-03-05T10:00:00Z",
        likes: ["u2", "u3"],
      },
      {
        id: "c6",
        userId: "u3",
        content:
          "Absolutely true. Nothing beats watching a real user encounter your assumptions.",
        createdAt: "2024-03-05T11:00:00Z",
        likes: ["u2"],
      },
    ],
    createdAt: "2024-03-05T09:00:00Z",
  },
  {
    id: "p5",
    userId: "u3",
    content:
      "Open sourced my utility library for managing complex async state in React. No magic, no black box — just clear primitives that compose well. Stars appreciated 🌟\n\ngithub.com/marcusj/async-flow",
    likes: ["u1", "u2", "u4", "u6"],
    comments: [
      {
        id: "c7",
        userId: "u1",
        content:
          "Bookmarked. The API looks clean — this is the kind of library that doesn't get in your way.",
        createdAt: "2024-03-11T14:00:00Z",
        likes: ["u3"],
      },
    ],
    createdAt: "2024-03-11T13:00:00Z",
  },
  {
    id: "p6",
    userId: "u3",
    content:
      "Debugging tip nobody talks about: explain the problem out loud to an inanimate object. The act of articulating it forces you to examine your assumptions. Works 8/10 times. Your rubber duck is smarter than you think.",
    likes: ["u1", "u2", "u5"],
    comments: [
      {
        id: "c8",
        userId: "u4",
        content:
          "Rubber duck debugging is legitimately the GOAT technique. Underrated.",
        createdAt: "2024-03-03T10:00:00Z",
        likes: ["u3", "u1"],
      },
    ],
    createdAt: "2024-03-03T09:00:00Z",
  },
  {
    id: "p7",
    userId: "u4",
    content:
      "New piece dropping. Six months condensed into 2 seconds of animation. The less you notice the motion, the better the motion design.",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=500&fit=crop&auto=format",
    likes: ["u1", "u2", "u3", "u5", "u6"],
    comments: [
      {
        id: "c9",
        userId: "u1",
        content:
          "The restraint in this is incredible. The timing feels completely effortless.",
        createdAt: "2024-03-09T12:00:00Z",
        likes: ["u4", "u2"],
      },
      {
        id: "c10",
        userId: "u2",
        content: '"The less you notice the motion" — quoting this forever.',
        createdAt: "2024-03-09T13:00:00Z",
        likes: ["u4", "u1"],
      },
    ],
    createdAt: "2024-03-09T11:00:00Z",
  },
  {
    id: "p8",
    userId: "u4",
    content:
      "Color theory rabbit hole: #FF0000 and #FE0101 are indistinguishable to humans but wildly different to rendering engines. Design is full of fascinating edge cases that live in the gap between intent and implementation.",
    likes: ["u1", "u3", "u5"],
    comments: [],
    createdAt: "2024-03-06T14:00:00Z",
  },
  {
    id: "p9",
    userId: "u5",
    content:
      "The Ando exhibition at MoMA left me speechless. Concrete, light, and shadow as a complete vocabulary. There's a lesson in constraints here — the fewer the materials, the more intentional every single decision becomes.",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=500&fit=crop&auto=format",
    likes: ["u2", "u4", "u6"],
    comments: [
      {
        id: "c11",
        userId: "u4",
        content:
          "Architecture and UI design share so much DNA. The Ando connection makes complete sense.",
        createdAt: "2024-03-07T17:00:00Z",
        likes: ["u5"],
      },
    ],
    createdAt: "2024-03-07T16:00:00Z",
  },
  {
    id: "p10",
    userId: "u5",
    content:
      "Minimalism isn't the absence of things. It's the presence of the right things. A principle that applies equally to code, design, and life.",
    likes: ["u2", "u3", "u4", "u6"],
    comments: [
      {
        id: "c12",
        userId: "u6",
        content: "Adding this to my wall. A reminder I need every single day.",
        createdAt: "2024-03-04T10:00:00Z",
        likes: ["u5", "u4"],
      },
    ],
    createdAt: "2024-03-04T09:00:00Z",
  },
  {
    id: "p11",
    userId: "u6",
    content:
      "Morning views from the Dolomites. Woke up at 4:30am for this — worth every second of altitude sickness and cold fingers.",
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop&auto=format",
    likes: ["u1", "u2", "u3", "u4", "u5"],
    comments: [
      {
        id: "c13",
        userId: "u2",
        content:
          "The way this light hits the peaks... absolutely stunning photography.",
        createdAt: "2024-03-13T09:00:00Z",
        likes: ["u6", "u1"],
      },
      {
        id: "c14",
        userId: "u5",
        content:
          "The geometry of those mountains is unreal. Nature as the ultimate architect.",
        createdAt: "2024-03-13T10:00:00Z",
        likes: ["u6", "u2"],
      },
    ],
    createdAt: "2024-03-13T08:00:00Z",
  },
  {
    id: "p12",
    userId: "u6",
    content:
      "Unpopular travel take: slow down. You don't need 12 countries in 3 weeks. Pick one, rent a bicycle, get lost, talk to strangers. That's where the real stories live.",
    likes: ["u2", "u4", "u5"],
    comments: [
      {
        id: "c15",
        userId: "u1",
        content:
          'The "get lost" part is peak advice. Some of my best experiences happened when the plan completely fell apart.',
        createdAt: "2024-03-01T12:00:00Z",
        likes: ["u6", "u5"],
      },
    ],
    createdAt: "2024-03-01T11:00:00Z",
  },
];
