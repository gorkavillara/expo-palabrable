import Game from './views/Game';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
  return (
    <RootSiblingParent>
      <Game />
    </RootSiblingParent>
  );
}