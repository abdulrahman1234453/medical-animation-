import React from "react";
import { Composition } from "remotion";
import { MedicalShort } from "./MedicalShort";

export const Root: React.FC = () => (
  <Composition
    id="MedicalShort"
    component={MedicalShort}
    durationInFrames={570}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{}}
  />
);