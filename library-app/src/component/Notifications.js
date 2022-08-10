import React, {useState, createContext, useContext, useEffect, Fragment} from 'react';
import {strings, queues} from "@k2_tools/utils";


const SelfClosingAlert = ({notice, onClose, timeout, queued}) => {
  timeout = notice.timeout !== undefined ? notice.timeout : timeout ? timeout : 3000;
  let className = "alert";
  const type = notice.type.toLowerCase();
  if (type === "primary") {
    className = className + " primary";
  } else if (type === "secondary") {
    className = className + " secondary";
  } else if (type === "success") {
    className = className + " success";
  } else if (type === "danger") {
    className = className + " danger";
  } else if (type === "warning") {
    className = className + " warning";
  } else if (type === "info") {
    className = className + " info";
  } else if (type === "dark") {
    className = className + " dark";
  } else if (type === "light") {
    className = className + " light";
  }

  return <div className={className}>
        {notice.title && <h4>{notice.title}</h4>}
        <p>{notice.message}</p>
        <QueuedCountDownTimer timeout={timeout} queued={queued} onComplete={onClose}/>
        <button onClick={onClose}>Close</button>
      </div>
};

const QueuedCountDownTimer = ({timeout, queued, onComplete}) => {
  const [queuedItems, setQueuedItems] = useState(queued());
  const [complete, setComplete] = useState(1);
  
  useEffect(() => {
    if (timeout > 0) {
      let countdown = timeout;
      const interval = setInterval(() => {
        countdown = countdown - 100 < 0 ? 0 : countdown - 100;
        setQueuedItems(queued());
        setComplete(countdown/timeout);
        if (countdown === 0) {
          if (onComplete && onComplete instanceof Function) {
            onComplete();
          }
        }
      }, 100);
      return () => {
        if (countdown === 0) {
          clearInterval(interval);
        }
      };
    }
  }, [timeout, queued, onComplete]);
  
  return <p>{`${queuedItems} - ${complete * 100}%`}</p>;
}

const defaults = {
  titleCase: strings.titleCase,
  digest: (notice, titleCase, defaultMessage) => {
    const tc = titleCase ? titleCase : defaults.titleCase;
    if (!notice.type) {
      notice.type = 'primary';
    }
    if (notice.title) {
      notice.title = tc(notice.title);
    }
    if (!notice.message) {
      notice.message = defaultMessage ? defaultMessage : defaults.defaultMessage;
    }
    return notice;
  },
  alert: SelfClosingAlert,
  defaultMessage: "No message!"
};

export const defaultTitleCase = (func) => {
  if (func instanceof Function) {
    defaults.titleCase = func;
  } else {
    console.log("The given default title case function was not a function. - Nothing done!")
  }
};

export const defaultDigest = (func) => {
  if (func instanceof Function) {
    defaults.digest = func;
  } else {
    console.log("The given default message digest was not a function. - Nothing done!")
  }
};

export const defaultAlert = (func) => {
  if (func instanceof Function) {
    defaults.alert = func;
  } else {
    console.log("The given default alert was not a function. - Nothing done!")
  }
};

export const defaultMessage = (message) => {
  if (message instanceof String) {
    defaults.message = message;
  } else {
    console.log("The given default message was not a string. - Nothing done!")
  }
};


// Define a function to be returned as the default notify fuction context
const defaultNotices = {
  accept: (notice) => {
    const typeNotice = notice.type ? defaults.titleCase(notice.type) + "\n" : "";
    const titleNotice = notice.title ? defaults.titleCase(notice.title) + "\n" : "";
    const messageNotice = notice.message ? (notice.message) : defaults.message;
    alert(typeNotice + titleNotice + messageNotice);
  }
};
// Create the Notification context with the default notify function as default context value
const NotificationsContext = createContext(defaultNotices);

const NotificationsPanel = (props) => {
  const [notice, setNotice] = useState(undefined);

  const lib = {
    titleCase: props.titleCase && props.titleCase instanceof Function ? props.titleCase : defaults.titleCase,
    digest: props.digest && props.digest instanceof Function ? props.digest : (notice) => {
      notice = defaults.digest(notice, lib.titleCase, lib.defaultMessage);
      if (!notice.timeout && props.timeout) {
        notice.timeout = props.timeout;
      }
      return notice;
    },
    timeout: props.timeout,
    alert: props.alert  && props.alert instanceof Function ? props.alert : defaults.alert,
    defaultMessage: props.defaultMessage ? props.defaultMessage : defaults.defaultMessage
  };
  
  const notices = useContext(NotificationsContext);
  if (notice === undefined) {
    if (notices.next && notices.next instanceof Function) {
      notices.next().then((notice) => {
        setNotice(lib.digest(notice, lib.titleCase, lib.defaultMessage));
      });
    } else {
      console.log("Received default notify function. \n"+
      `No notifications will be received in this notifications panel [${props.id}]\n`+
      "make sure that the Notifications.Panel is a child of a Notifications component");
    }
  }
  
  if (notice) return <lib.alert notice={notice} onClose={() => setNotice(undefined)} timeout={lib.timeout} queued={notices.queued}/>;
  else return <span />
};

const Notifications = (props) => {
  
  return <Fragment>
    <NotificationsContext.Provider value={queues.queue()}>
      {props.children}
    </NotificationsContext.Provider>
  </Fragment>;
};

Notifications.Panel = NotificationsPanel;
Notifications.Context = NotificationsContext;

export default Notifications;


