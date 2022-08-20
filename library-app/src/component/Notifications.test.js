import React, {useContext} from 'react';
import renderer from 'react-test-renderer';
import Notifications, {defaultTitleCase, resetDefaults, defaultDigest, defaultAlert, defaultMessage} from "./Notifications.js";
import {strings, threads} from "@k2_tools/utils";

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

afterEach(() => {
  resetDefaults();
});

describe("Notifications", () => {
  
  it("1) Has a Panel attribute", () => {
    expect(Notifications.Panel).toBeTruthy();
  });
  
  it("2) Has a Context attribute", () => {
    expect(Notifications.Context).toBeTruthy();
  });
  
  it("2.1) Renders a empty notifications panel", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
      </Notifications>
    );
    
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });

it("3) Renders notices in the notifications panel", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "TITLE", message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });


    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });

  it("4) The notice type defaults to info", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{title: "TITLE", message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("5) If the title is ommitted no title is rendered", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
     
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("6) If no message is given the default message is rendered", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("7) Calling defaultTitleCase with a function changes how titles are formatted", async () => {
    
    defaultTitleCase(strings.kebabCase);
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "This is a title", message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("8) Calling defaultDigest with a function changes how notices are digested", async () => {
    
    defaultDigest((notice) => {
      notice.title = "THIS IS A NEW TITLE";
      return notice;
    });
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", message: "This is a message", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("9) Calling defaultAlert with a JSX component changes how notices are rendered", async () => {
    
    const newAlert = ({notice, onClose}) => {
      const className = "alert " + (notice.type ? notice.type.toLowerCase() : "primary");
      return <div className={className}>
            {notice.title && <h4>{notice.title}</h4>}
            <p>THIS IS A CUSTOM ALERT</p>
            <p>{notice.message}</p>
            <button onClick={onClose}>Close</button>
          </div>
    };
    
    defaultAlert(newAlert);
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "This is a title", message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("10) Calling defaultMessage with a string sets the default message", async () => {
    
    defaultMessage("CUSTOM DEFAULT MESSAGE");
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "This is a title", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("11) Rendering the notifications panel with titleCase as a function changes how titles are formatted", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel titleCase={strings.camelCase}/>
        <Notice notice={{type: "success", title: "This is a title", message: "This is a message", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("12) Rendering the notifications panel with digest as a function changes how notices are digested", async () => {
    
    const digest = (notice) => {
      notice.title = "THIS IS A NEW TITLE";
      return notice;
    };
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel digest={digest}/>
        <Notice notice={{type: "success", title: "This is a title", message: "This is a message", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("13) Rendering the notifications panel with alert as a JSX component changes how notices are rendered", async () => {
        
    const newAlert = ({notice, onClose}) => {
      const className = "alert " + (notice.type ? notice.type.toLowerCase() : "primary");
      return <div className={className}>
            {notice.title && <h4>{notice.title}</h4>}
            <p>THIS IS A CUSTOM ALERT</p>
            <p>{notice.message}</p>
            <button onClick={onClose}>Close</button>
          </div>
    };

    const component = renderer.create(
      <Notifications>
        <Notifications.Panel alert={newAlert}/>
        <Notice notice={{type: "success", title: "This is a title", message: "This is a message", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("14) Rendering the notifications panel with defaultMessage as string changes the default message", async () => {
        
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel defaultMessage={"DEFAULT MESSAGE"}/>
        <Notice notice={{type: "success", title: "This is a title", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });

  it("15) Setting timeout times out the alert", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "TITLE", message: "MESSAGE", timeout: 100}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(200);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("16) Clicking close button on the alert closes the alert", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "TITLE", message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[0].children[0].children[2].props.onClick();
      await threads.sleep(100);
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
});




