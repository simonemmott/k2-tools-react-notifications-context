import React, {useContext} from 'react';
import renderer from 'react-test-renderer';
import Notifications from "./Notifications.js";

const Notice = ({notice, send}) => {
  const notices = useContext(Notifications.Context);
  const sendNotice = () => {
    notices.accept(notice);
  };
  if (send) {
    notices.accept(notice);
  }
  return <button onClick={sendNotice} >Send</button>;
}

describe("Notifications", () => {
  
  it("Has a Panel attribute", () => {
    expect(Notifications.Panel).toBeTruthy();
  })
  
  it("Has a Context attribute", () => {
    expect(Notifications.Context).toBeTruthy();
  })
  
  it("Renders notices in the notifications panel", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "TITLE", message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  })
  
});