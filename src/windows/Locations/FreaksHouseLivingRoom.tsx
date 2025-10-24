import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";

const FreaksHouseLivingRoom = () => {
  return (
    <DraggableResizeableWindow
      headerTitle="🎸 Living Room - Freak's House"
      windowsId={WINDOW_IDS.FREAKS_HOUSE_BASEMENT}
      initialWidth="800px"
      initialHeight="600px"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/locations/freaks-living-room.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </DraggableResizeableWindow>
  );
};

export default FreaksHouseLivingRoom;
