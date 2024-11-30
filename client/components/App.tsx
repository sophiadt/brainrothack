import React from 'react';
import Card from './Card';

function App() {
  return (
    <>
      <Card
        imageSrc="/assets/giga-chad.jpg"
        title="Giga Chad"
        description="Giga Chad reeks of peak masculinity — rizzing him up is nearly impossible."
        tags={['Confident', 'Sigma', 'Alpha']}
      />
      <Card
        imageSrc="/assets/chill-guy.jpg"
        title="Chill Guy"
        description="His whole deal is that he’s a chill guy that lowkey doesn’t gaf."
        tags={['Chill', 'Nonchalant', 'No Care']}
        disabled
      />
      <Card
        imageSrc="/assets/don-pollo.jpg"
        title="Don Pollo"
        description="Linganguli guli guli wacha lingangu lingangu linganguli guli wacha."
        tags={['Linganguli', 'Guli', 'Guli']}
        disabled
      />
      <Card
        imageSrc="/assets/ksi.jpg"
        title="KSI"
        description="He already has too much negative aura, please save him."
        tags={['Screen', 'Ring', 'Pen', 'King']}
        disabled
      />
      <Card
        imageSrc="/assets/freakbob.jpg"
        title="Freakbob"
        description="Who can match each others freak first? Pick up Freakbob’s call!!!"
        tags={['Freaky', 'Bold', 'No Shame']}
        disabled
      />
      <Card
        imageSrc="/assets/granola-bar.jpg"
        title="Granola Bar"
        description="It easily crumbles on its own. Come with an ashtray and rizz it up. EZ W."
        tags={['Crumbly AF', 'May Contain Nuts']}
        disabled
      />
    </>
  );
}

export default App;


