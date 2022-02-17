import Game from './views/Game';
import Principal from './views/Principal'
import { useState, createContext } from 'react';
import DevilGame from './views/DevilGame';

export const AppContext = createContext(null);

export default function App() {
  const [route, setRoute] = useState('home')
  // return Platform.OS === 'web' ? <GameWeb /> : <Game />
  return (
    <AppContext.Provider value={{ route, setRoute }}>
      {route === "home" && <Principal setRoute={setRoute} />}
      {route === "classic" && <Game setRoute={setRoute} />}
      {route === "inverted" && <Principal setRoute={setRoute} />}
      {route === "devil" && <DevilGame setRoute={setRoute} />}
    </AppContext.Provider>
  )
}