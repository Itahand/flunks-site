import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";

const FreaksHouseKitchen = () => {
  return (
    <DraggableResizeableWindow
      headerTitle="☕ Kitchen - Freak's House"
      windowsId={WINDOW_IDS.FREAKS_HOUSE_KITCHEN}
      initialWidth="800px"
      initialHeight="600px"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/locations/freaks-kitchen.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </DraggableResizeableWindow>
  );
};

export default FreaksHouseKitchen;
