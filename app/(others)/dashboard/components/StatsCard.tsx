"use client"
import React from "react";
import { Card, CardHeader, CardTitle } from "@components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="group bg-white/5 hover:bg-[#0B1528] transition-colors duration-300 border border-border">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="text-3xl text-primary group-hover:text-accent transition-colors">
          {icon}
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-sm text-muted-foreground group-hover:text-white transition-colors">
            {title}
          </CardTitle>
          <p className="text-xl font-bold text-foreground group-hover:text-white transition-colors">
            {value}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
};

export default StatsCard;
