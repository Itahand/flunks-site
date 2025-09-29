import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { useWindowsContext } from "contexts/WindowsContext";
import { WINDOW_IDS } from "fixed";
import ZoltarFortuneApp from "./ZoltarFortuneApp";

const ZoltarFortuneWindow: React.FC = () => {
  const { closeWindow } = useWindowsContext();

  return (
    <DraggableResizeableWindow
      windowsId={WINDOW_IDS.ZOLTAR_FORTUNE_APP}
      onClose={() => closeWindow(WINDOW_IDS.ZOLTAR_FORTUNE_APP)}
      headerTitle="Mystical Zoltar Fortune Machine"
      headerIcon="/images/icons/crystal-ball.png"
      initialWidth="900px"
      initialHeight="700px"
      showMaximizeButton={true}
      resizable={true}
      style={{
        background: 'linear-gradient(135deg, #1a0033, #330066, #1a0033)'
      }}
    >
      <ZoltarFortuneApp />
    </DraggableResizeableWindow>
  );
};

export default ZoltarFortuneWindow;