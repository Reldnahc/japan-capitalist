import { createContext, ReactNode, useEffect, useState, useRef } from "react";
import type { Engine } from "@tsparticles/engine";
import { initParticlesEngine } from "@tsparticles/react";
import {loadFull} from "tsparticles";

interface ParticlesContextType {
    initialized: boolean;
    engine?: Engine;
}

export const ParticlesContext = createContext<ParticlesContextType>({
    initialized: false,
    engine: undefined,
});

export const ParticlesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [engine, setEngine] = useState<Engine>();
    const [initialized, setInitialized] = useState(false);
    const isInitializing = useRef(false); // Use a ref here

    useEffect(() => {
        if (initialized || isInitializing.current) {
            return;
        }
        isInitializing.current = true;
        console.log("ParticlesProvider useEffect");
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
            setEngine(engine);
        }).then(() => {
            setInitialized(true);
        });
    }, [initialized]);

    return (
        <ParticlesContext.Provider value={{ initialized, engine }}>
            {children}
        </ParticlesContext.Provider>
    );
};
