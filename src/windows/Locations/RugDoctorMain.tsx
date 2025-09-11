import React from "react";
import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import RetroTextBox from "components/RetroTextBox";

const RugDoctorMain: React.FC = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  
  // Use day/night images for Rug Doctor
  const dayImage = "/images/icons/rug-doctor-day.png";
  const nightImage = "/images/icons/rug-doctor-night.png";
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

  const openRoom = (roomKey: string, title: string, content: string) => {
    openWindow({
      key: roomKey,
      window: (
        <DraggableResizeableWindow
          windowsId={roomKey}
          headerTitle={title}
          onClose={() => closeWindow(roomKey)}
          initialWidth="400px"
          initialHeight="300px"
          resizable={false}
        >
          <div className="p-4 w-full h-full">
            <RetroTextBox
              title={title}
              content={content}
              className="w-full h-full"
            />
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row">
      {/* Left Side Buttons - Hidden on mobile */}
      <div className="hidden md:flex w-64 bg-gradient-to-b from-orange-900 to-amber-800 flex-col justify-center gap-8 p-6 shadow-2xl">
        {/* Front Counter */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.RUG_DOCTOR_FRONT_COUNTER,
              "Front Counter",
              "Customer service with a smile. The receptionist greets you warmly while industrial cleaning machines hum in the background. Price lists hang on the wall showing various cleaning packages."
            )
          }
          className="bg-gradient-to-br from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 text-yellow-100 px-6 py-6 rounded-xl border-4 border-orange-400 hover:border-orange-300 transition-all duration-300 hover:scale-110 text-center text-lg font-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
        >
          🏢 Front Counter
        </button>

        {/* Cleaning Bay */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.RUG_DOCTOR_CLEANING_BAY,
              "Cleaning Bay",
              "Industrial machines and chemical solutions fill this workspace. Steam rises from the powerful cleaning equipment, and the sound of high-pressure water echoes through the bay. Freshly cleaned rugs hang on drying racks."
            )
          }
          className="bg-gradient-to-br from-amber-700 to-orange-900 hover:from-amber-600 hover:to-orange-800 text-yellow-100 px-6 py-6 rounded-xl border-4 border-amber-400 hover:border-amber-300 transition-all duration-300 hover:scale-110 text-center text-lg font-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
        >
          🧽 Cleaning Bay
        </button>
      </div>

      {/* Center Image Section */}
      <div className="relative flex-1">
        <img
          src={timeBasedInfo.currentImage}
          alt={`Rug Doctor Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
          className="absolute inset-0 w-full h-full object-contain z-0 transition-opacity duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/backdrops/BLANK.png";
          }}
        />

        {/* Day/Night Atmospheric Overlay */}
        <div 
          className={`absolute inset-0 z-1 transition-all duration-500 ${
            !timeBasedInfo.isDay 
              ? 'bg-blue-900 bg-opacity-20' 
              : 'bg-yellow-100 bg-opacity-10'
          }`}
        />

        {/* Time Info Display */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm z-20">
          {timeBasedInfo.currentTime}
        </div>
      </div>

      {/* Right Side Buttons - Hidden on mobile */}
      <div className="hidden md:flex w-64 bg-gradient-to-b from-orange-900 to-amber-800 flex-col justify-center gap-8 p-6 shadow-2xl">
        {/* Storage Room */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.RUG_DOCTOR_STORAGE_ROOM,
              "Storage Room",
              "Cleaning supplies and equipment are neatly organized on metal shelving. Bottles of specialized detergents line the walls, and spare machine parts are sorted in labeled bins."
            )
          }
          className="bg-gradient-to-br from-amber-800 to-orange-900 hover:from-amber-700 hover:to-orange-800 text-yellow-100 px-6 py-6 rounded-xl border-4 border-amber-500 hover:border-amber-400 transition-all duration-300 hover:scale-110 text-center text-lg font-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
        >
          📦 Storage Room
        </button>

        {/* Back Office */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.RUG_DOCTOR_BACK_OFFICE,
              "Back Office",
              "Business records and appointment books are meticulously organized. A desk calendar shows customer appointments, and filing cabinets contain years of business history. A coffee mug sits next to a calculator."
            )
          }
          className="bg-gradient-to-br from-orange-700 to-amber-900 hover:from-orange-600 hover:to-amber-800 text-yellow-100 px-6 py-6 rounded-xl border-4 border-orange-400 hover:border-orange-300 transition-all duration-300 hover:scale-110 text-center text-lg font-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
        >
          📋 Back Office
        </button>
      </div>

      {/* Mobile Bottom Buttons - Only visible on mobile */}
      <div className="md:hidden bg-gradient-to-r from-orange-900 to-amber-800 p-6 border-t-4 border-orange-400 shadow-2xl">
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Front Counter */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.RUG_DOCTOR_FRONT_COUNTER,
                "Front Counter",
                "Customer service with a smile. The receptionist greets you warmly while industrial cleaning machines hum in the background. Price lists hang on the wall showing various cleaning packages."
              )
            }
            className="bg-gradient-to-br from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 text-yellow-100 px-4 py-4 rounded-lg border-3 border-orange-400 hover:border-orange-300 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🏢 Front Counter
          </button>

          {/* Cleaning Bay */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.RUG_DOCTOR_CLEANING_BAY,
                "Cleaning Bay",
                "Industrial machines and chemical solutions fill this workspace. Steam rises from the powerful cleaning equipment, and the sound of high-pressure water echoes through the bay. Freshly cleaned rugs hang on drying racks."
              )
            }
            className="bg-gradient-to-br from-amber-700 to-orange-900 hover:from-amber-600 hover:to-orange-800 text-yellow-100 px-4 py-4 rounded-lg border-3 border-amber-400 hover:border-amber-300 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🧽 Cleaning Bay
          </button>

          {/* Storage Room */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.RUG_DOCTOR_STORAGE_ROOM,
                "Storage Room",
                "Cleaning supplies and equipment are neatly organized on metal shelving. Bottles of specialized detergents line the walls, and spare machine parts are sorted in labeled bins."
              )
            }
            className="bg-gradient-to-br from-amber-800 to-orange-900 hover:from-amber-700 hover:to-orange-800 text-yellow-100 px-4 py-4 rounded-lg border-3 border-amber-500 hover:border-amber-400 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            📦 Storage Room
          </button>

          {/* Back Office */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.RUG_DOCTOR_BACK_OFFICE,
                "Back Office",
                "Business records and appointment books are meticulously organized. A desk calendar shows customer appointments, and filing cabinets contain years of business history. A coffee mug sits next to a calculator."
              )
            }
            className="bg-gradient-to-br from-orange-700 to-amber-900 hover:from-orange-600 hover:to-amber-800 text-yellow-100 px-4 py-4 rounded-lg border-3 border-orange-400 hover:border-orange-300 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            📋 Back Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default RugDoctorMain;
