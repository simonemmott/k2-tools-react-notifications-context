import {useContext} from "react";
import './App.css';
import Notifications from "./lib/Notifications";

const Notice = () => {
  const notices = useContext(Notifications.Context);
  notices.accept({type: "success", title: "Opps I did it again! - XXX", message: "Hit me baby one more time!", timeout: 5000});
  
  return <p>Notified!</p>;
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Notifications>
          <Notifications.Panel />
          <Notice />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
      </Notifications>
      </header>
    </div>
  );
}

export default App;
