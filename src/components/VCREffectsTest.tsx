import React, { useState } from 'react';
import styled from 'styled-components';
import DraggableResizeableWindow from 'components/DraggableResizeableWindow';
import CutscenePlayer from './CutscenePlayer';
import VCREffectsControlPanel from './VCREffectsControlPanel';
import { WINDOW_IDS } from '../fixed';

interface VCREffectsConfig {
  scanLinesEnabled: boolean;
  scanLinesOpacity: number;
  scanLinesSpeed: number;
  noiseEnabled: boolean;
  noiseOpacity: number;
  noiseSpeed: number;
  chromaticEnabled: boolean;
  chromaticIntensity: number;
  chromaticSpeed: number;
  staticEnabled: boolean;
  staticOpacity: number;
  staticMovement: number;
  vintageEnabled: boolean;
  vintageWarmth: number;
  vintageVignette: number;
}

interface VCREffectsTestProps {
  onClose: () => void;
}

const TestContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 600px;
  font-family: 'MS Sans Serif', sans-serif;
`;

const CutsceneArea = styled.div`
  flex: 2;
  background: #000;
  position: relative;
  overflow: hidden;
`;

const ControlArea = styled.div`
  flex: 1;
  min-width: 350px;
  max-width: 450px;
  border-left: 2px solid #808080;
  background: #c0c0c0;
  overflow-y: auto;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`;

const TestInfo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 8px;
  border-radius: 4px;
  z-index: 100;
  max-width: 250px;
`;

const VCREffectsTest: React.FC<VCREffectsTestProps> = ({ onClose }) => {
  const [effectsConfig, setEffectsConfig] = useState<VCREffectsConfig>({
    scanLinesEnabled: true,
    scanLinesOpacity: 8, // Heavy scan lines
    scanLinesSpeed: 2,
    noiseEnabled: true,
    noiseOpacity: 60, // Heavy noise/grain
    noiseSpeed: 3,
    chromaticEnabled: true,
    chromaticIntensity: 4, // Heavy chromatic aberration
    chromaticSpeed: 25,
    staticEnabled: true,
    staticOpacity: 6, // Heavy static
    staticMovement: 3,
    vintageEnabled: true,
    vintageWarmth: 8, // Heavy vintage warmth
    vintageVignette: 12, // Heavy vignette
  });

  // Sample test scenes
  const testScenes = [
    {
      id: 'test-main',
      image: '/images/cutscenes/main.png',
      lines: [
        'This is a test of the VCR effects system.',
        'Use the controls on the right to adjust the retro effects in real-time.',
        'You can see how each effect changes the appearance of this cutscene.'
      ],
      music: '/music/child.mp3'
    },
    {
      id: 'test-1',
      image: '/images/cutscenes/1.png',
      lines: [
        'Try adjusting the scan lines for that classic CRT monitor look.',
        'The noise and static effects simulate VHS tape degradation.',
        'Chromatic aberration adds analog video distortion.'
      ]
    },
    {
      id: 'test-2',
      image: '/images/cutscenes/2.png',
      lines: [
        'The vintage filter adds warmth and aging effects.',
        'You can turn individual effects on/off or use the presets.',
        'Find the perfect balance for your retro aesthetic!'
      ]
    }
  ];

  const handleEffectsChange = (newConfig: VCREffectsConfig) => {
    setEffectsConfig(newConfig);
  };

  return (
    <TestContainer>
      <CutsceneArea>
        <TestInfo>
          🎛️ VCR Effects Test - Adjust controls on the right to see changes in real-time
        </TestInfo>
        <CutscenePlayer
          scenes={testScenes}
          vcrEffects={effectsConfig}
          onClose={() => {}} // Don't close cutscene, just let it loop
          autoStart={true}
          windowed={true}
        />
      </CutsceneArea>
      <ControlArea>
        <div style={{
          padding: '16px',
          color: '#000',
          fontSize: '14px',
          fontFamily: 'MS Sans Serif, sans-serif'
        }}>
          <h2 style={{ margin: '0 0 16px 0', color: '#000080' }}>🎛️ VCR Effects Controls</h2>
          <p style={{ marginBottom: '16px' }}>Use these controls to adjust retro effects in real-time:</p>
        </div>
        <VCREffectsControlPanel
          onClose={onClose}
          onEffectsChange={handleEffectsChange}
        />
      </ControlArea>
    </TestContainer>
  );
};

export default VCREffectsTest;