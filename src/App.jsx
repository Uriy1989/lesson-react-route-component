import './App.css';
import styles from './styles.module.css';

import { ReactRouteComponent } from './route-lesson/ReactRouteComponent.jsx';

//import { Game } from './Game/Game.jsx';
function App() {
	return (
		<>
			<div className={styles.block}></div>
			<ReactRouteComponent />
		</>
	);
}

export default App;
