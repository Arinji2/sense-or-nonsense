"use client";
import React, { useState } from "react";
import { GameFighterSchemaType } from "../../../validations/game-data/types";

export const FighterContext = React.createContext<
  FighterContextType | undefined
>(undefined);

export type FighterContextType = {
  fighterData: GameFighterSchemaType[];
  isMultiplayer: boolean;
};

export function useFighterContext() {
  const context = React.useContext(FighterContext);
  if (!context) {
    throw new Error("useFighterContext must be used within a FighterProvider");
  }
  return context;
}

export function FighterProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: Partial<FighterContextType>;
}) {
  const [fighterData, setFighterData] = useState<GameFighterSchemaType[]>(
    value?.fighterData || [],
  );
  const [isMultiplayer, setIsMultiplayer] = useState(
    value?.isMultiplayer ?? false,
  );

  return (
    <FighterContext.Provider value={{ fighterData, isMultiplayer }}>
      {children}
    </FighterContext.Provider>
  );
}
