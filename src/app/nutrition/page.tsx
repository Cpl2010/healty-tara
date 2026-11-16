"use client";

import React, { useState } from "react";
import { NutritionTracker } from "@/components/dashboard/NutritionTracker";
import { AuthModal } from "@/components/shared/AuthModal";

export default function NutritionPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <NutritionTracker onOpenAuth={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
