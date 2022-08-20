/**
 * React Notificationa Context module.
 * Provides a notices queue and alert display panel to display notifications accepted by the notices queue
 * @module react-notifications-context
 */
import React, {useState, createContext, useContext, useEffect} from 'react';
import {strings} from "@k2_tools/utils";
import queue from "../utils/queues/queues";
import "./Notifications.scss";
import {viewBox, offset, describeArc, cartesian2svg} from "../utils/svg/svg";
import {polar2cartesian} from "../utils/geometry/geometry";

/**
 * Define a basic self closing alert to show when a notice is accepted
 * @param {{type : string, title : string, message : string, timeout : int}} notice - The notice to show as an alert
 * @param {function} onClose - The function to call to close the notice
 * @param {int} timeout - The number of milliseconds that the alert should show for if not given in the notice defaults to 3000
 * @param {function} queued - The function to call to idnetify how many notices are still on the queue
 * @return {JSX} THe rendered alert
 */
const SelfClosingAlert = ({notice, onClose, timeout, queued}) => {
  
  // Set the timeout for the alert
  // - If the notice has a timeout then use that
  // - Otherwise if the alert was rendered with a time out use that
  // - Otherwise timeout after 3 seconds
  timeout = notice.timeout !== undefined ? notice.timeout : timeout ? timeout : 3000;
  
  //Set the class name of the alert for styling from the type of the notice accepted
  const className = "k2 alert " + (notice.type ? notice.type.toLowerCase() : "info");

  // Render the alert as a simple div
  // - It is intended that this be overridden in a production system
  // - This alert format is just to ensure that the react-notifications-context works out of the box 
  return <div className={className}>
        <div className={"inner"}>
          {notice.title && <h4>{notice.title}</h4>}
          <p>{notice.message}</p>
          <CloseIcon onClick={onClose}/>
          <QueuedCountDownTimer timeout={timeout} queued={queued} />
        </div>
      </div>
};

const CloseIcon = ({onClick}) => {
  return <svg onClick={onClick} className="close" viewBox="-25 -25 50 50">
    <path d="M0 -4 l16 -16 l4 4 l-16 16 l16 16 l-4 4 l-16 -16 l-16 16 l-4 -4 l16 -16 l-16 -16 l4 -4 Z" fill="currentColor" stroke="currentColor"/>
  </svg>;
}

const describeTimeoutArc = (complete, radius, thickness, viewBox, offset) => {
  const innerRadius = radius - thickness / 2;
  const outerRadius = radius + thickness / 2;
  const flags = {
    outer: {
      largeArc: 1,
      sweep: 1
    },
    inner: {
      largeArc: 1,
      sweep: 0
    }
  };
  const deg= 90 - complete * 360;
  if (complete <= 0.5) {
    flags.outer.largeArc = 0;
    flags.inner.largeArc = 0;
  } else {
    flags.outer.largeArc = 1;
    flags.inner.largeArc = 1;
  }
  const startSvg = cartesian2svg(0, outerRadius, viewBox, offset);
  const end = {x: 0, y: innerRadius};
  const endOuter = polar2cartesian(outerRadius, deg); 
  const endInner = polar2cartesian(innerRadius, deg); 
  const endInnerSvg = cartesian2svg(endInner.x, endInner.y, viewBox, offset);
  
  const d = [
    "M", startSvg.x, startSvg.y,
    describeArc(outerRadius, outerRadius, 0, flags.outer.largeArc, flags.outer.sweep, endOuter.x, endOuter.y, viewBox, offset),
    "L", endInnerSvg.x, endInnerSvg.y,
    describeArc(innerRadius, innerRadius, 0, flags.inner.largeArc, flags.inner.sweep, end.x, end.y, viewBox, offset),
    "Z"
  ];
  return d.join(" ");
};

/**
 * A simple countdown display showing how many items remain on the queue and showing a percentage time remaining
 * for the timeout
 * @param {int} timeout - The number of miliseconds to countdown
 * @param {function} queued - The function to call to get the number of items still on the queue
 * @param {function} onComplete - The callback to call when the countdown is complete
 * @return {JSX} The rendered countdown timeer
 */
export const QueuedCountDownTimer = ({timeout, queued}) => {
  const [queuedItems, setQueuedItems] = useState(queued());
  const [complete, setComplete] = useState(1);
  const vb = viewBox(-50, -50, 100, 100);
  const oSet = offset(vb, "center");
  const d = describeTimeoutArc(complete, 40, 8, vb, oSet);
  const origin = cartesian2svg(0, 0, vb, oSet);


  
  // On initial render or change of timeout, queued, or onComplete
  useEffect(() => {
    // Only start the countdown if timeout is greater than 0 milliseconds
    // This prefvents a divide by zero error and allows alerts to not timeout if they set a timeout to 0
    if (timeout > 0) {
      let countdown = timeout;
      // Coundown the timeout in 100 millisecond intervals calculating the percentage complete and 
      // evaluating how many items are still on the queue
      const interval = setInterval(() => {
        countdown = countdown - 100 < 0 ? 0 : countdown - 100;
        setQueuedItems(queued());
        setComplete(countdown/timeout);
        // When the countdown is complete call the onComplete callback
      }, 100);
      // Before re-render clear the interval if the coundown has completed
      return () => {
        if (countdown === 0) {
          clearInterval(interval);
        }
      };
    }
    return () => {};
  }, [timeout, queued]);
  return <svg className="queuedCountdownTimer" viewBox={vb.svg}>
      <path d={d} stroke="currentColor" fill="currentColor"/>
      <text 
        x={origin.x} 
        y={origin.y} 
        fill="currentColor" 
        stroke="currentColor"
        dominantBaseline="central"
        fontSize="60px"
        textAnchor="middle" >{queuedItems > 9 ? "+" : queuedItems}</text>
    </svg>;

}

/**
   * The function called to digest every notice before it is rendered
   * @param {{type : string, title : string, message : string, timeout : int}} notice - The notice to digest
   * @param {function} formatTitle - The function to call to format the title in the digested notice
   * @param {string} defaultMessage - The default message to show in the case that the notice does not include the message attribute
   * @return {{type : string, title : string, message : string, timeout : int}} The digested message
   */
const defaultNoticeDigest = (notice, formatTitle, defaultMessage) => {
    const tc = formatTitle ? formatTitle : defaults.titleCase;
    if (!notice.type) {
      notice.type = 'info';
    }
    if (notice.title) {
      notice.title = tc(notice.title);
    }
    if (!notice.message) {
      notice.message = defaultMessage ? defaultMessage : defaults.message;
    }
    return notice;
  }

/**
 * The Notifications defaults
 */
const defaults = {
  /**
   * The function called with a message title (if present) to format the message title
   * Defaults to titleCase
   * @param {string} title - The title to format
   * @return {string} The formatted title
   */ 
  titleCase: strings.titleCase,
  /**
   * The function called to digest every notice before it is rendered
   * @param {{type : string, title : string, message : string, timeout : int}} notice - The notice to digest
   * @param {function} formatTitle - The function to call to format the title in the digested notice
   * @param {string} defaultMessage - The default message to show in the case that the notice does not include the message attribute
   * @return {{type : string, title : string, message : string, timeout : int}} The digested message
   */
  digest: defaultNoticeDigest,
  /**
   * The react component to render as the alert
   * @type {JSX}
   */
  alert: SelfClosingAlert,
  /**
   * The default message text to use when the notice does not supply the message attribute
   * @type {string}
   */
  message: "No message!"
};

/**
 * A function to restore the defaults to their original values
 */
export const resetDefaults = () => {
  defaults.titleCase = strings.titleCase;
  defaults.digest = defaultNoticeDigest;
  defaults.alert = SelfClosingAlert;
  defaults.message = "No message!";
}

/**
 * A function to set the default format title function
 * @param {function} func - A function which accepts a string and returns the formatted version of the accepted string 
 */
export const defaultTitleCase = (func) => {
  if (func instanceof Function) {
    defaults.titleCase = func;
  } else {
    console.log("The given default title case function was not a function. - Nothing done!")
  }
};

/**
 * A function to set the default notice digestor
 * @param {function} func - The function to call to digest notices before being rendered
 * @see defaults.digest for detail on this functions arguments and return value
 */
export const defaultDigest = (func) => {
  if (func instanceof Function) {
    defaults.digest = func;
  } else {
    console.log("The given default message digest was not a function. - Nothing done!")
  }
};

/**
 * A function to set the default alert JSX
 * @param {function} func - The JSX component to use to render the notices
 * @see SelfClosingAlert for details on the properties sent to the JSX component on render
 */
export const defaultAlert = (func) => {
  if (func instanceof Function) {
    defaults.alert = func;
  } else {
    console.log("The given default alert was not a function. - Nothing done!")
  }
};

/**
 * A function to set the default message text
 * @param {string} message - The default message text
 */
export const defaultMessage = (message) => {
  if (typeof message === "string" || message instanceof String) {
    defaults.message = message;
  } else {
    console.log("The given default message was not a string. - Nothing done!")
  }
};


/**
 * The default notifications context used when a notice is sent by a JSX component whihc is not rendered within
 * a <Notifications>...</ Notifications> container
 * Such accepted notices are displayed using the browser alert(...) method
 */
const defaultNotices = {
  accept: (notice) => {
    const typeNotice = notice.type ? defaults.titleCase(notice.type) + "\n" : "";
    const titleNotice = notice.title ? defaults.titleCase(notice.title) + "\n" : "";
    const messageNotice = notice.message ? (notice.message) : defaults.message;
    alert(typeNotice + titleNotice + messageNotice);
  }
};
/**
 * The notifications context defaulted to the defaultNotices component which shows accepted notices as browser alerts
 */
const NotificationsContext = createContext(defaultNotices);

/**
 * The notifications panel JSX component which renders accepted notices
 * @param {function} props.titleCase - The function to call to format the title of the notice if given
 * @param {functio} props.digest - The function to call to digest accepted messages before they are rendered
 * @param {int} props.timeout - The deafult timeout for notices which do not supply a timeout
 * @param {function} props.alert - The JSX component to render as the alert
 * @return {JSX} The notifcations panel JSX
 */
const NotificationsPanel = (props) => {
  // Create a state for the displayed notice to handle changes of notice
  const [promiseNotice, setPromiseNotice] = useState({notice: undefined, promise: undefined, timeout: undefined});
  
  // Get the notifications context for this panel
  const notices = useContext(NotificationsContext);
  const buildLib = () => {
    const lib = {
      message: props.defaultMessage ? props.defaultMessage : defaults.message,
      titleCase: props.titleCase && props.titleCase instanceof Function ? props.titleCase : defaults.titleCase,
      digest: props.digest && props.digest instanceof Function ? props.digest : (notice) => {
        notice = defaults.digest(notice, lib.titleCase, lib.message);
        if (!notice.timeout && props.timeout) {
          notice.timeout = props.timeout;
        }
        return notice;
      }
    };
    return lib;
  };
  const [lib] = useState(buildLib());
  const Alert = props.alert  && props.alert instanceof Function ? props.alert : defaults.alert;
  const closeNotice = () => {
    notices.clearPromise();
    if (promiseNotice.timeout) {
      clearTimeout(promiseNotice.timeout);
    }
    setPromiseNotice({notice: undefined, promise: undefined, timeout: undefined});
  };
  
  useEffect(() => {
    if (!promiseNotice.notice  && !promiseNotice.promise) {
      let p = notices.next();
      p.then((notice) => {
        notice = lib.digest(notice, lib.titleCase, lib.message);
        let timeout;
        if (notice.timeout > 0) {
          timeout = setTimeout(() => {
            notices.clearPromise();
            if (promiseNotice.timeout) {
              clearTimeout(promiseNotice.timeout);
            }
            setPromiseNotice({notice: undefined, promise: undefined, timeout: undefined});
          }, notice.timeout ? notice.timeout : 3000);
        }
        setPromiseNotice({notice: lib.digest(notice, lib.titleCase, lib.message), promise: promiseNotice.promise, timeout: timeout});
      });
      setPromiseNotice({notice: promiseNotice.promise, promise: p, timeout: promiseNotice.timeout});
    }
    return () => {};
  }, [promiseNotice, notices, lib]);
  
  // If there is a notice render the notice using the lib.alert JSX component providing properties for
  // - notice - The digested notice to render
  // - onClose - the callback to close the notice
  // - timeout - The default timeout if the notice does not define the timeout attribute
  // - queues - The function to call to get the number of notices still on the queue
  if (promiseNotice.notice) return <Alert notice={promiseNotice.notice} onClose={closeNotice} timeout={props.timeout} queued={notices.size}/>;
  // If the is not notice to display render an empty span.
  else return <span />
};

/**
 * The notifications context container - JSX component which proivides the notifications context
 * @param {array} props.chldren - The child JSX components to render in the notifications context
 * @return {JSX} The notifcations context JSX
 */
const Notifications = (props) => {
  // Render the supplied child JSX copmonents in a Notifications Context Provider
  return <NotificationsContext.Provider value={queue()}>
    {props.children}
  </NotificationsContext.Provider>
};

/**
 * The notification panel to include as a child of a Notifications context to render accepted notices
 */
Notifications.Panel = NotificationsPanel;
/**
 * The notifications context to get the notices queue to submit notices to be rendered in the notifications panel of a Notifications context
 */
Notifications.Context = NotificationsContext;

export default Notifications;


