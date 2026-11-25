import React from 'react';
import {Composition} from 'remotion';
import {NeonatalRespiratoryDistress} from './RespiratoryDistress';
export const Root: React.FC = () => <Composition id="NeonatalRespiratoryDistress" component={NeonatalRespiratoryDistress} durationInFrames={2250} fps={30} width={1080} height={1920} />;
