import React, {useContext} from 'react';
import renderer from 'react-test-renderer';
import Notifications, {defaultTitleCase, resetDefaults, defaultDigest, defaultAlert, defaultMessage} from "./Notifications.js";
import {strings} from "@k2_tools/utils";

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
  
  it("Has a Panel attribute", () => {
    expect(Notifications.Panel).toBeTruthy();
  });
  
  it("Has a Context attribute", () => {
    expect(Notifications.Context).toBeTruthy();
  });
  
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
    
  });
  
  it("The notice type defaults to primary", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{title: "TITLE", message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("If the title is ommitted no title is rendered", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("If no message is given the default message is rendered", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Calling defaultTitleCase with a function changes how titles are formatted", async () => {
    
    defaultTitleCase(strings.kebabCase);
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "This is a title", message: "MESSAGE", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Calling defaultDigest with a function changes how notices are digested", async () => {
    
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
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Calling defaultAlert with a JSX component changes how notices are rendered", async () => {
    
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
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Calling defaultMessage with a string sets the default message", async () => {
    
    defaultMessage("CUSTOM DEFAULT MESSAGE");
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "This is a title", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Rendering the notifications panel with titleCase as a function changes how titles are formatted", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel titleCase={strings.camelCase}/>
        <Notice notice={{type: "success", title: "This is a title", message: "This is a message", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Rendering the notifications panel with digest as a function changes how notices are digested", async () => {
    
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
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Rendering the notifications panel with alert as a JSX component changes how notices are rendered", async () => {
        
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
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Rendering the notifications panel with defaultMessage as string changes the default message", async () => {
        
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel defaultMessage={"DEFAULT MESSAGE"}/>
        <Notice notice={{type: "success", title: "This is a title", timeout: 0}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });

  it("Setting timeout times out the alert", async () => {
    
    const component = renderer.create(
      <Notifications>
        <Notifications.Panel />
        <Notice notice={{type: "success", title: "TITLE", message: "MESSAGE", timeout: 1000}} />
      </Notifications>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
    await renderer.act(async () => {
      tree[1].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
  it("Clicking close button on the alert closes the alert", async () => {
    
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
    
    await renderer.act(async () => {
      tree[0].children[3].props.onClick();
    });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    
  });
  
});




