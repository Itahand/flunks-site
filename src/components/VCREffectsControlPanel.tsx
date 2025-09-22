import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Window, WindowHeader, WindowContent, Checkbox, Slider } from 'react95';

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

interface VCREffectsControlPanelProps {
  onClose: () => void;
  onEffectsChange: (config: VCREffectsConfig) => void;
}

const ControlPanel = styled.div`
  padding: 16px;
  background: #c0c0c0;
  min-height: 400px;
  font-family: 'MS Sans Serif', sans-serif;
`;

const EffectSection = styled.div`
  margin-bottom: 20px;
  padding: 12px;
  border: 2px inset #c0c0c0;
  background: #f0f0f0;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #000080;
  font-weight: bold;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 12px;
`;

const ControlLabel = styled.label`
  min-width: 120px;
  color: #000;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 200px;
`;

const ValueDisplay = styled.span`
  min-width: 30px;
  text-align: right;
  font-family: 'Courier New', monospace;
  font-size: 11px;
`;

const PresetButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const TestArea = styled.div`
  margin-top: 16px;
  padding: 12px;
  border: 2px inset #c0c0c0;
  background: #000;
  color: #fff;
  font-family: 'Courier New', monospace;
  min-height: 60px;
  position: relative;
  overflow: hidden;
`;

const VCREffectsControlPanel: React.FC<VCREffectsControlPanelProps> = ({ onClose, onEffectsChange }) => {
  const [config, setConfig] = useState<VCREffectsConfig>({
    scanLinesEnabled: true,
    scanLinesOpacity: 3,
    scanLinesSpeed: 1,
    
    noiseEnabled: true,
    noiseOpacity: 40,
    noiseSpeed: 2,
    
    chromaticEnabled: true,
    chromaticIntensity: 2,
    chromaticSpeed: 30,
    
    staticEnabled: true,
    staticOpacity: 3,
    staticMovement: 1,
    
    vintageEnabled: true,
    vintageWarmth: 4,
    vintageVignette: 8,
  });

  const updateConfig = (updates: Partial<VCREffectsConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onEffectsChange(newConfig);
  };

  const applyPreset = (preset: 'off' | 'subtle' | 'medium' | 'heavy' | 'extreme') => {
    let newConfig: VCREffectsConfig;
    
    switch (preset) {
      case 'off':
        newConfig = {
          scanLinesEnabled: false,
          scanLinesOpacity: 0,
          scanLinesSpeed: 0,
          noiseEnabled: false,
          noiseOpacity: 0,
          noiseSpeed: 0,
          chromaticEnabled: false,
          chromaticIntensity: 0,
          chromaticSpeed: 0,
          staticEnabled: false,
          staticOpacity: 0,
          staticMovement: 0,
          vintageEnabled: false,
          vintageWarmth: 0,
          vintageVignette: 0,
        };
        break;
      case 'subtle':
        newConfig = {
          scanLinesEnabled: true,
          scanLinesOpacity: 1,
          scanLinesSpeed: 1,
          noiseEnabled: true,
          noiseOpacity: 20,
          noiseSpeed: 1,
          chromaticEnabled: true,
          chromaticIntensity: 1,
          chromaticSpeed: 50,
          staticEnabled: true,
          staticOpacity: 1,
          staticMovement: 1,
          vintageEnabled: true,
          vintageWarmth: 2,
          vintageVignette: 4,
        };
        break;
      case 'medium':
        newConfig = {
          scanLinesEnabled: true,
          scanLinesOpacity: 3,
          scanLinesSpeed: 1,
          noiseEnabled: true,
          noiseOpacity: 40,
          noiseSpeed: 2,
          chromaticEnabled: true,
          chromaticIntensity: 2,
          chromaticSpeed: 30,
          staticEnabled: true,
          staticOpacity: 3,
          staticMovement: 1,
          vintageEnabled: true,
          vintageWarmth: 4,
          vintageVignette: 8,
        };
        break;
      case 'heavy':
        newConfig = {
          scanLinesEnabled: true,
          scanLinesOpacity: 6,
          scanLinesSpeed: 2,
          noiseEnabled: true,
          noiseOpacity: 60,
          noiseSpeed: 3,
          chromaticEnabled: true,
          chromaticIntensity: 4,
          chromaticSpeed: 20,
          staticEnabled: true,
          staticOpacity: 5,
          staticMovement: 2,
          vintageEnabled: true,
          vintageWarmth: 6,
          vintageVignette: 12,
        };
        break;
      case 'extreme':
        newConfig = {
          scanLinesEnabled: true,
          scanLinesOpacity: 10,
          scanLinesSpeed: 3,
          noiseEnabled: true,
          noiseOpacity: 80,
          noiseSpeed: 5,
          chromaticEnabled: true,
          chromaticIntensity: 8,
          chromaticSpeed: 10,
          staticEnabled: true,
          staticOpacity: 8,
          staticMovement: 3,
          vintageEnabled: true,
          vintageWarmth: 10,
          vintageVignette: 20,
        };
        break;
    }
    
    setConfig(newConfig);
    onEffectsChange(newConfig);
  };

  return (
    <Window style={{ width: '100%', height: '100%' }}>
      <WindowHeader>
        <span>🎛️ VCR Effects Control Panel</span>
        <Button onClick={onClose}>×</Button>
      </WindowHeader>
      <WindowContent>
        <ControlPanel>
          <PresetButtons>
            <Button onClick={() => applyPreset('off')}>Off</Button>
            <Button onClick={() => applyPreset('subtle')}>Subtle</Button>
            <Button onClick={() => applyPreset('medium')}>Medium</Button>
            <Button onClick={() => applyPreset('heavy')}>Heavy</Button>
            <Button onClick={() => applyPreset('extreme')}>Extreme</Button>
          </PresetButtons>

          <EffectSection>
            <SectionTitle>📺 Scan Lines</SectionTitle>
            <ControlRow>
              <Checkbox 
                checked={config.scanLinesEnabled}
                onChange={(e) => updateConfig({ scanLinesEnabled: e.target.checked })}
              />
              <ControlLabel>Enable Scan Lines</ControlLabel>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Opacity:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={config.scanLinesOpacity}
                  onChange={(value) => updateConfig({ scanLinesOpacity: value })}
                />
                <ValueDisplay>{config.scanLinesOpacity}</ValueDisplay>
              </SliderContainer>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Speed:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={config.scanLinesSpeed}
                  onChange={(value) => updateConfig({ scanLinesSpeed: value })}
                />
                <ValueDisplay>{config.scanLinesSpeed}</ValueDisplay>
              </SliderContainer>
            </ControlRow>
          </EffectSection>

          <EffectSection>
            <SectionTitle>⚡ Static Noise</SectionTitle>
            <ControlRow>
              <Checkbox 
                checked={config.noiseEnabled}
                onChange={(e) => updateConfig({ noiseEnabled: e.target.checked })}
              />
              <ControlLabel>Enable Noise</ControlLabel>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Opacity:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={config.noiseOpacity}
                  onChange={(value) => updateConfig({ noiseOpacity: value })}
                />
                <ValueDisplay>{config.noiseOpacity}%</ValueDisplay>
              </SliderContainer>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Speed:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={config.noiseSpeed}
                  onChange={(value) => updateConfig({ noiseSpeed: value })}
                />
                <ValueDisplay>{config.noiseSpeed}</ValueDisplay>
              </SliderContainer>
            </ControlRow>
          </EffectSection>

          <EffectSection>
            <SectionTitle>🌈 Chromatic Aberration</SectionTitle>
            <ControlRow>
              <Checkbox 
                checked={config.chromaticEnabled}
                onChange={(e) => updateConfig({ chromaticEnabled: e.target.checked })}
              />
              <ControlLabel>Enable Chromatic</ControlLabel>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Intensity:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={config.chromaticIntensity}
                  onChange={(value) => updateConfig({ chromaticIntensity: value })}
                />
                <ValueDisplay>{config.chromaticIntensity}</ValueDisplay>
              </SliderContainer>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Speed:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={5}
                  max={100}
                  step={5}
                  value={config.chromaticSpeed}
                  onChange={(value) => updateConfig({ chromaticSpeed: value })}
                />
                <ValueDisplay>{config.chromaticSpeed}s</ValueDisplay>
              </SliderContainer>
            </ControlRow>
          </EffectSection>

          <EffectSection>
            <SectionTitle>📡 VHS Static</SectionTitle>
            <ControlRow>
              <Checkbox 
                checked={config.staticEnabled}
                onChange={(e) => updateConfig({ staticEnabled: e.target.checked })}
              />
              <ControlLabel>Enable Static</ControlLabel>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Opacity:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={config.staticOpacity}
                  onChange={(value) => updateConfig({ staticOpacity: value })}
                />
                <ValueDisplay>{config.staticOpacity}</ValueDisplay>
              </SliderContainer>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Movement:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={0}
                  max={5}
                  step={1}
                  value={config.staticMovement}
                  onChange={(value) => updateConfig({ staticMovement: value })}
                />
                <ValueDisplay>{config.staticMovement}</ValueDisplay>
              </SliderContainer>
            </ControlRow>
          </EffectSection>

          <EffectSection>
            <SectionTitle>🎞️ Vintage Filter</SectionTitle>
            <ControlRow>
              <Checkbox 
                checked={config.vintageEnabled}
                onChange={(e) => updateConfig({ vintageEnabled: e.target.checked })}
              />
              <ControlLabel>Enable Vintage</ControlLabel>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Warmth:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={config.vintageWarmth}
                  onChange={(value) => updateConfig({ vintageWarmth: value })}
                />
                <ValueDisplay>{config.vintageWarmth}</ValueDisplay>
              </SliderContainer>
            </ControlRow>
            <ControlRow>
              <ControlLabel>Vignette:</ControlLabel>
              <SliderContainer>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={config.vintageVignette}
                  onChange={(value) => updateConfig({ vintageVignette: value })}
                />
                <ValueDisplay>{config.vintageVignette}</ValueDisplay>
              </SliderContainer>
            </ControlRow>
          </EffectSection>

          <TestArea>
            <div style={{ padding: '8px' }}>
              Test Area - The effects you adjust will be applied to the cutscene player in real-time.
              <br />
              Current preset: See effects above
            </div>
          </TestArea>
        </ControlPanel>
      </WindowContent>
    </Window>
  );
};

export default VCREffectsControlPanel;