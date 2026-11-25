import React from 'react';
import {Composition} from 'remotion';
import {BreastfeedingNewborn} from './RespiratoryDistress';
import {TOTAL_DURATION_FRAMES} from './generated-timing';
export const Root:React.FC=()=> <Composition id="BreastfeedingNewborn" component={BreastfeedingNewborn} durationInFrames={TOTAL_DURATION_FRAMES} fps={30} width={1080} height={1920}/>;
