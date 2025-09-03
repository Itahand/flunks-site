import React from 'react';
import DraggableResizeableWindow from 'components/DraggableResizeableWindow';
import { useWindowsContext } from 'contexts/WindowsContext';
import RetroTextBox from 'components/RetroTextBox';
import { CliqueType } from 'utils/cliqueColors';

const RetroTextBoxDemo: React.FC = () => {
  const { closeWindow } = useWindowsContext();

  const cliques: { clique: CliqueType; title: string; content: string }[] = [
    {
      clique: 'GEEK',
      title: "Science Lab",
      content: "Beakers bubble with mysterious experiments. Chemistry sets and microscopes cover the workbench. The smell of sulfur and the sound of electricity crackling through various contraptions fill the air."
    },
    {
      clique: 'JOCK',
      title: "Gym Basement", 
      content: "Weight sets and exercise equipment fill the space. Motivational posters cover the walls with bold messages: 'ZERO EXCUSES', 'WINNERS NEVER QUIT', and 'THERE ARE NO SHORTCUTS TO ANY PLACE WORTH GOING'."
    },
    {
      clique: 'PREP',
      title: "Grand Foyer",
      content: "Marble floors and crystal chandeliers create an atmosphere of luxury. Designer furniture is arranged perfectly around a mahogany coffee table with fresh orchids in crystal vases."
    },
    {
      clique: 'FREAK',
      title: "Attic Sanctuary", 
      content: "Dusty old books about the occult and conspiracy theories line makeshift shelves. Candles flicker in the darkness, casting eerie shadows on mysterious artifacts and ancient symbols carved into the wooden beams."
    }
  ];

  return (
    <DraggableResizeableWindow
      windowsId="retro_text_demo"
      headerTitle="🎮 Retro Text Box Demo - Clique Colors"
      onClose={() => closeWindow("retro_text_demo")}
      initialWidth="800px"
      initialHeight="600px"
      resizable={true}
    >
      <div className="p-6 bg-gray-100 h-full overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Classic Video Game Text Boxes</h1>
        <p className="text-center mb-6 text-gray-600">
          Each clique now has their own color-coded classic dialog boxes inspired by 90s video games!
          <br />
          Simple, pixelated aesthetic with MS Sans Serif font for that authentic retro feel.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cliques.map(({ clique, title, content }) => (
            <div key={clique} className="space-y-2">
              <h3 className="text-lg font-semibold text-center">{clique} HOUSE</h3>
              <RetroTextBox
                title={title}
                content={content}
                clique={clique}
                className="h-40"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-center">Default Style (No Clique)</h3>
          <RetroTextBox
            title="Mystery Location"
            content="A location shrouded in mystery. Without a clique affiliation, this text box uses the classic blue theme reminiscent of old Windows 95 dialog boxes and classic RPGs."
            className="h-32"
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>✨ Each clique's text windows now feature classic 90s video game styling!</p>
          <p>🎮 MS Sans Serif font, outset borders, and bright retro colors</p>
          <p>📺 Authentic old-school aesthetic without fancy effects</p>
        </div>
      </div>
    </DraggableResizeableWindow>
  );
};

export default RetroTextBoxDemo;
