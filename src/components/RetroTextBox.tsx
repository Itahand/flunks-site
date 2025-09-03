import React from 'react';
import styled from 'styled-components';
import { CliqueType, getCliqueColors, getCliqueIcon } from 'utils/cliqueColors';

interface RetroTextBoxProps {
  title: string;
  content: string;
  clique?: CliqueType;
  className?: string;
}

const RetroContainer = styled.div<{ cliqueColors?: any }>`
  background: ${props => props.cliqueColors?.primary || '#0080FF'};
  border: 2px outset ${props => props.cliqueColors?.primary || '#0080FF'};
  border-radius: 0;
  padding: 12px;
  font-family: 'MS Sans Serif', 'Arial', sans-serif;
  color: #000000;
  position: relative;
  box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.3);
`;

const TitleBar = styled.div<{ cliqueColors?: any }>`
  background: ${props => props.cliqueColors?.secondary || '#004080'};
  color: #ffffff;
  padding: 6px 10px;
  margin: -12px -12px 10px -12px;
  border-radius: 0;
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  font-family: 'MS Sans Serif', 'Arial', sans-serif;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
`;

const ContentArea = styled.div`
  font-family: 'MS Sans Serif', 'Arial', sans-serif;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.5;
  color: #000000;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.3);
  overflow: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const RetroTextBox: React.FC<RetroTextBoxProps> = ({ 
  title, 
  content, 
  clique, 
  className 
}) => {
  const cliqueColors = clique ? getCliqueColors(clique) : null;

  return (
    <RetroContainer cliqueColors={cliqueColors} className={className}>
      <TitleBar cliqueColors={cliqueColors}>
        {clique && `${getCliqueIcon(clique)} `}{title}
      </TitleBar>
      
      <ContentArea>
        {content}
      </ContentArea>
    </RetroContainer>
  );
};

export default RetroTextBox;
