import React, { createContext, useContext, useState } from 'react';

interface BabyInfo {
  name: string;
  birthDate: Date;
  gender: 'male' | 'female' | null;
  image: string | null;
}

interface BabyContextType {
  babyInfo: BabyInfo;
  updateBabyInfo: (info: Partial<BabyInfo>) => void;
}

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const [babyInfo, setBabyInfo] = useState<BabyInfo>({
    name: '',
    birthDate: new Date(),
    gender: null,
    image: null,
  });

  const updateBabyInfo = (info: Partial<BabyInfo>) => {
    setBabyInfo(prev => ({ ...prev, ...info }));
  };

  return (
    <BabyContext.Provider value={{ babyInfo, updateBabyInfo }}>
      {children}
    </BabyContext.Provider>
  );
}

export function useBaby() {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
} 