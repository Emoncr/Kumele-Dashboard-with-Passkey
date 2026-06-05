"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Dog, CircleDollarSign, Clock, Users, Play, Check } from "lucide-react";
import Image from "next/image";

const cardData = [
  { id: 1, image: "/meditation.png", category: "Pet Love", title: "www show event", price: "100.0", time: "23:59-0:0", guests: "24 guests", location: "Indore, Madhya radesh, IN", startsIn: "7 hrs" },
  { id: 2, image: "/meditation.png", category: "Wellness", title: "Meditation Retreat", price: "50.0", time: "10:00-12:00", guests: "12 guests", location: "Online", startsIn: "12 hrs" },
  { id: 3, image: "/meditation.png", category: "Community", title: "Local Meetup", price: "Free", time: "18:00-20:00", guests: "50 guests", location: "City Center", startsIn: "2 days" },
  { id: 4, image: "/meditation.png", category: "Music", title: "Acoustic Night", price: "20.0", time: "19:00-22:00", guests: "100 guests", location: "Downtown Cafe", startsIn: "3 days" },
  { id: 5, image: "/meditation.png", category: "Art", title: "Painting Workshop", price: "75.0", time: "14:00-16:00", guests: "15 guests", location: "Art Studio", startsIn: "1 week" },
  { id: 6, image: "/meditation.png", category: "Tech", title: "Developer Meetup", price: "Free", time: "17:30-20:30", guests: "40 guests", location: "Tech Hub", startsIn: "Tomorrow" },
  { id: 7, image: "/meditation.png", category: "Fitness", title: "Yoga in the Park", price: "10.0", time: "07:00-08:00", guests: "30 guests", location: "Central Park", startsIn: "14 hrs" },
  { id: 8, image: "/meditation.png", category: "Food", title: "Cooking Class", price: "120.0", time: "11:00-14:00", guests: "8 guests", location: "Culinary Institute", startsIn: "4 days" },
  { id: 9, image: "/meditation.png", category: "Networking", title: "Business Mixer", price: "30.0", time: "18:00-21:00", guests: "80 guests", location: "Grand Hotel", startsIn: "5 days" },
  { id: 10, image: "/meditation.png", category: "Education", title: "Marketing Seminar", price: "45.0", time: "09:00-17:00", guests: "200 guests", location: "Convention Center", startsIn: "2 weeks" },
];

const Card = ({ card, active, removeCard, zIndex, offsetIndex }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const exitDirectionRef = useRef("right");

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      exitDirectionRef.current = "right";
      removeCard(card.id, "right");
    } else if (info.offset.x < -100 || info.velocity.x < -500) {
      exitDirectionRef.current = "left";
      removeCard(card.id, "left");
    }
  };

  return (
    <motion.div
      custom={exitDirectionRef}
      style={{
        x: active ? x : 0,
        rotate: active ? rotate : 0,
        zIndex,
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={active ? { cursor: "grabbing" } : {}}
      className={`absolute w-full h-full rounded-[32px] overflow-hidden shadow-2xl bg-[#0a0a0a] flex flex-col ${
        active ? "cursor-grab" : "pointer-events-none"
      }`}
      initial={{ scale: 1 - offsetIndex * 0.07, y: offsetIndex * 50 }}
      animate={{ 
        scale: active ? 1 : 1 - (offsetIndex * 0.07), 
        y: active ? 0 : offsetIndex * 50 
      }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
      exit={(ref) => ({ 
        x: ref.current === "right" ? 1000 : -1000, 
        opacity: 0,
        rotate: ref.current === "right" ? 20 : -20,
        transition: { duration: 0.4, ease: "easeOut" } 
      })}
    >
      {/* Overlay for inactive cards to look like a solid stacked grey card */}
      <motion.div
        className="absolute inset-0 z-50 pointer-events-none"
        initial={{ opacity: active ? 0 : 1 }}
        animate={{ opacity: active ? 0 : 1 }}
        style={{
          backgroundColor: offsetIndex === 1 ? "#555555" : "#333333",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Image Section */}
      <div className="relative w-full h-[60%] pointer-events-none">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
          priority
          draggable={false}
        />
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2">
          <Dog className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">{card.category}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">{card.title}</h2>
          
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-1.5">
              <CircleDollarSign className="w-4 h-4 text-zinc-500" />
              <span className="text-[#FBBF24]">{card.price}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span className="text-[#FBBF24]">{card.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-zinc-500" />
              <span className="text-[#FBBF24]">{card.guests}</span>
            </div>
          </div>

          <div className="text-sm mb-3">
            <span className="text-zinc-400">Location: </span>
            <span className="text-[#FBBF24]">{card.location}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-zinc-400">Starts in </span>
            <Play className="w-3 h-3 text-zinc-500 fill-zinc-500" />
            <span className="text-[#FBBF24]">{card.startsIn}</span>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button className="bg-zinc-600 rounded-full p-3 hover:bg-zinc-500 transition-colors">
            <Check className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function CardStack() {
  const [cards, setCards] = useState(cardData);

  const removeCard = (id, direction) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[600px] text-white">
        <p className="text-xl font-medium">No more events</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[360px] h-[600px] mx-auto perspective-1000">
      <AnimatePresence>
        {cards.slice(0, 3).map((card, index) => {
          const isTop = index === 0;
          return (
            <Card
              key={card.id}
              card={card}
              active={isTop}
              removeCard={removeCard}
              zIndex={cards.length - index}
              offsetIndex={index}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
