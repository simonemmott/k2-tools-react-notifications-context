import {useContext, useEffect, useState} from "react";
import './App.css';
import Notifications from "./component/Notifications";

const Notice = () => {
  const [notify, setNotify] = useState(false);
  const notices = useContext(Notifications.Context);

  useEffect(() => {
    if (notify) {
      setNotify(false);
      notices.accept({type: "danger", title: "Opps I did it again!", message: "Hit me baby one more time!", timeout: 10000});
    } 
  }, [notify, notices])
  
  return <button onClick={() => setNotify(true)}>Notify</button>;
};

export const AutoNotice = ({notice}) => {
  const [notified, setNotified] = useState(false);
  const notices = useContext(Notifications.Context);

  useEffect(() => {
    if (!notified) {
      notices.accept(notice);
      setNotified(true);
    }
    return () => {};
  }, [notified, notice, notices]);
  return <span>{notified ? "notified" : "not yet notified"}</span>;
};

function App() {
//  const d = describePath([
//    {x: 0, y: 40},
//    {x: 40, y: 0},
//    {x: 0, y: -40},
//    {x: -40, y: 0}
//  ], vb, oSet);
//  const d = "M 0 -40 "+ describeArc(40, 40, 0, 0, 1, 0, -40, vb, oSet);
  
  return (
    <div className="App">
      <header className="App-header">
        <Notifications>
          <Notifications.Panel timeout={3000}/>
          <Notice />
       </Notifications>
      </header>
    </div>
  );
}

export default App;
