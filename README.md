# React Notification Context

The React notifications context is a fully configurable notifications context for React web applications.

This project aims to provide a flexible and reusable approach to providing alerts to web application users.

<details><summary><h2>Overview</h2></summary>
<p>
The default broswer behaviour for alerts presents an unformatted alert dialog. This is invariably ugly and does not fit into the look and feel of any web application.
It does however, have the advantage of being invoked from a global broswer function `alert(...)`.

In a production web application we want the alerts to be formatted and appear at a sensible location within the page.

Bootstrap provides an `Alert` component for formatting and rendeing user alerts. However, in order to render the alert the developer must implement some javascript plumbing to show and hide the alert as required.
In many cases this `plumbing` is effectively boiler plate and obfuscates the business logic implemented by the application.

The React notifications context abstracts this `plumbing` into a reusable React component `Notifications`

`Notifications` provides a react context `Notification.Context` in which notifications accepted by the context are dispatched to the `Notifications.Panel` to be rendered.

``` html
<App> <!-- The react application component -->
  ...
  <Notifications> <!-- The Notifications context is embedded somewhere in the React App -->
    ...
      <ComponentRaisesNotice /> <!-- Some component that raises a notice to be displayed to the user -->
    ...
    <Notifications.Panel /> <!-- The location in the React DOM where notices should be rendered for the user to see -->
    ...
      <ComponentRaisessNotice /> <!-- Some component that raises a notice to be displayed to the user -->
    ...
  </Notifications>
  ...
</App>
```

The `Notifications` component is embedded somewhere in a React application. A `Notifications.Panel` is embedded somewhere within the `Notifications` component.
Any component which submmits a notice to the `Notifications.Context` wihtin the `Notifications` component will have the notice sent to the `Notifications.Panel` to be rendered for the user to see.

The code below shows a basic React component which submits a notice to be shown on the `Notifications.Panel`

``` jsx
const ComponentRaisedNotice = (props) => {

  const notices = useContext(Notifications.Context);
  
  notices.accept({
    type: "success", 
    title: "Opps I did it again!", 
    message: "Hit me baby one more time!", 
    timeout: 5000});
    
  return <span>Notice Sent!</span>;

};
```

The accepted notice is routed to the `Notifications.Panel` to be rendered by the configured alert component. The only code which exists within the business logic of the application
is to get the notifications context 

``` jsx
const notices = useContext(Notifications.Context);
``` 

and to submit the notice

``` jsx
notices.accept({
  type: "success", 
  title: "Opps I did it again!", 
  message: "Hit me baby one more time!", 
  timeout: 5000});
```
</p>
</details>
<details><summary><h2>Getting Started</h2></summary>

### Install

```
npm import react-notifications-context
```

### Import

``` javascript
import Notifications from 'react-notifications-context';
```

### Usage

1. Include a `Notifications` component in the applications DOM to gather notices submitted by child components.
2. Include a `Notifications.Panel` within the `Notifications` component where the notices should be presented to the user
3. In a component which is to submit a notice get the notifications context 

``` javascript
const notices = useContext(Notifications.Context);
```
 
4. To submit a notice call the `accept` method of the notifications context with the notice to show to the user

``` jsx
notices.accept({
  type: "success", 
  title: "Opps I did it again!", 
  message: "Hit me baby one more time!", 
  timeout: 5000});
```
</details>
<details><summary><h2>Using Multipe Contexts And Notice Panels</h2></summary>

The React notifications context supports using multiple `Notifications` components in the application.
`Notifications` componnents can be included anywhere in the applications DOM. They can be siblings or children of each other.
The react `useContext` hook finds the closest parent `Notifications` component to the component submitting the notice and routes the notice to the `Notifications.Panel` embedded in that `Notifications` component.

There must be one and only one `Notifications.Panel` in any rendered `Notifications` component. If there is more than one it is indeterminate which panel will recieve notices. If there is no `Notifications.Panel` 
The notices will not be rendered but will be cached waiting for a `Notifications.Panel` to be included.

If a notice is submitted outside of a `Notifications` component then the notice is raised using a browser alert.

``` html
<App>
  <!-- Notices submitted here will raise browser alerts -->
  <Notifications>
    <!-- Notices submitted here will raise alerts in panel 1 -->
    <Noticifations.Panel /> <!-- Panel 1 -->
    <!-- Notices submitted here will raise alerts in panel 1 -->
    <Notifications>
      <!-- Notices submitted here will raise alerts in panel 2 -->
      <Noticifations.Panel /> <!-- Panel 2 -->
      <!-- Notices submitted here will raise alerts in panel 2 -->
    </Notifications>
    <!-- Notices submitted here will raise alerts in panel 1 -->
  </Notifications>
  <!-- Notices submitted here will raise browser alerts -->
</App>
```

**Note** There is no requirement for the `Notifications` component to be an immediate child of the `App` nor for the `Notifications.Panel` to be an immediate child of its `Notifications`. The exmaple given ommits more detailed nesting for reasons of clarity

**Note** Notices raised inside of a `Notifications` component are queued until a `Notifications.Panel` exists and is ready to display the notice

</details>
<details><summary><h2>Handling Multiple Notices</h2></summary>

The React notifications context uses a [@k2_tools/utils.queues.queue](https://www.npmjs.com/package/@k2_tools/utils) to queue notices until the `Notifications.Panel` is ready to display them.

Multiple notices can be submitted and all will be queued in the order they were submitted and displayed to the user one at a time.

The `Notifications.Panel` uses a `QueuedCountDownTimer` to automatically timeout the notice after the submitted or configured timeout has elapsed. Once a notice is closed, either by the user or timed out automatically the next queued notice is rendered for the user.

</details>
<details><summary><h2>Notice Data Type</h2></summary>

By default the notice data type is

``` jsx
const notice = {
  type : string, // Default 'primary'
  title : string, // If ommitted the notice will not have a title
  message : string, // Defaults to the default message 
  timeout : integer // Defaults to 3000ms
};
```

However, there is no absolute requirement to use this data type. 
Any java object can be submitted as a notice and that object will be passed to the appropriate `Notifications.Panel`. The configured alert component must handle received notice.

Since the alert component is configurable any format of notice can be submitted and will be passed to the configured alert component as its `notice` property under the assumption that the configured 
alert is capable of handling the submitted notice.

In addition to being able to customize the alert component and therefore the notice format notices are also digested before being rendered. See 'Digesting The Notice' below.

</details>
<details><summary><a name="digestingTheNotice"></a><h2>Digesting The Notice</h2></summary>

Digesting the notice allows the notice to be systematically adjusted before it is rendered to the user. 

Each notice is digested by a function that receives the following properties:

1. `notice`

The submitted notice to digest

2. `formatTitle`

A function to format the title. See 'Formatting The Notice Title' below.

3. `defaultMessage`

A string containing the default message to render if the notice does not contain a `message` attribute.

The notice digest processes the given notice and returns the digested notice. The is no limit to what can be done to the given notice.
The value returned by the notice digest function is the passed to the alert component as the `notice` property to be rendered to the user.

The default notice digest:

1. Sets the notice type to "primary" if the notice does not define a `type` attribute.
2. Formatst the notice title using the given `formatTitle` function if the notice defines a `title` attribute.
3. Sets the message of the notice to the given `defaultMessage` if the notice does not define a `message` attribute.

The notice digest function is configurable in 2 ways.

1. The default notice digest function can be changed globally.
2. The notice digest function can be set for a specific panel by setting its `digest` property.

### Changing The Default Notice Digest

The React notifications context provides a function `defaultDigest` to set the default message digest function.
The `defaultDigest` function will accept any object of type `Function` as the new default message digest.

``` jsx
import {defaultDigest} from 'react-notifications-context';

const myNewNoticeDigest = (notice, formatTitle, defefaultMessage) => {
  if (!notice.type) {
    notice.type = 'primary';
  } // Set the notice type to 'primary' if the notice does not have a type attribute
  notice.title = formatTitle(notice.type); // Set the notice title to the title formatted notice type.
  if (!notice.message) {
    notice.message = "This is the default message : " + defaultMessage;
  } // Set the notice message to be the default message if the notice does not define a message.
    // prefixed with "This is the default message : "
  return notice;  // return the digested notice to be rendered to the user.
}; // Define a new notice digest function

defaultDigest(myNewNoticeDigest); // Set the global notice digest function
```

### Changing The Digest For A Specific Notifications.Panel

The React notifications context allow the notice digest to be set for a specific `Notifications.Panel` by providing a notice digest function to its `digest` property.

``` jsx
import React from 'react';
import Notifications from 'react-notifications-context';

const myNewNoticeDigest = (notice, formatTitle, defefaultMessage) => {
  if (!notice.type) {
    notice.type = 'primary';
  } // Set the notice type to 'primary' if the notice does not have a type attribute
  notice.title = formatTitle(notice.type); // Set the notice title to the title formatted notice type.
  if (!notice.message) {
    notice.message = "This is the default message : " + defaultMessage;
  } // Set the notice message to be the default message if the notice does not define a message.
    // prefixed with "This is the default message : "
  return notice;  // return the digested notice to be rendered to the user.
}; // Define a new notice digest function

const App = () => {
  return (
    <div className="App">
      <Notifications>
        <Notifications.Panel digest={myNewNoticeDigest}/> <!-- Set the digest function for this Panel -->
        ...
      </Notifications>
    </div>
  );
}

export default App;
```

</details>
<details><summary><h2>Formatting The Notice Title</h2></summary>

By default React notifications context formats the title of each notice into title case, where the first letter of each word is capitalised.

This behaviour can be changed by changing the default notice digest function, see above.

It is also possible to just change the default title format function without relacing the whole default notice digest.

There are 2 ways to control the default title format function

1. The default title format function can be changed globally
2. The format title function can bet set for a spesific panel by settings its `titleCase` property.

### Changing The Default Format Title Function

The React notifications context provides a function `defaultTitleCase` to set the default format title function.
The `defaultTitleCase` function will accept any object of type `Function` as the new format title function.

``` jsx
import {defaultTitleCase} from 'react-notifications-context';
import {strings} from '@k2_tools/utils';

defaultTitleCase(strings.kebabCase); // All titles will be formatted in kebab case. aaa-bbb-ccc
```

### Changing The Format Title Function For A Specific Notifications.Panel

The React notifications context allow the format title function to be set for a specific `Notifications.Panel` by providing a format title function to its `titleCase` property.

``` jsx
import React from 'react';
import Notifications from 'react-notifications-context';

const upperCase = (title) => {
  return title.toUpperCase();
}; // Define a new format title function which returns the given title in upper case.

const App = () => {
  return (
    <div className="App">
      <Notifications>
        <Notifications.Panel titleCase={upperCase}/> <!-- Set the format title function for this Panel -->
        ...
      </Notifications>
    </div>
  );
}

export default App;
```

</details>
<details><summary><h2>Setting The Default Message</h2></summary>

By default the React notifications context uses "No message!" as the default message. This message is rendered when the notice does not define a `message` attribute.

There are 2 ways to control the default message

1. The default message can be changed globally
2. The default message can bet set for a spesific panel by settings its `defaultMessage` property.

### Changing The Default Message

The React notifications context provides a function `defaultMessage` to set the default message.
The `defaultMessage` function will accept any string as the new default message.

``` jsx
import {defaultMessage} from 'react-notifications-context';
import {strings} from '@k2_tools/utils';

defaultMessage("Nothing to alert!"); // Set the default message
```

### Changing The Default Message For A Specific Notifications.Panel

The React notifications context allow the default message to be set for a specific `Notifications.Panel` by providing a string to its `defaultMessage` property.

``` jsx
import React from 'react';
import Notifications from 'react-notifications-context';

const App = () => {
  return (
    <div className="App">
      <Notifications>
        <Notifications.Panel defaultMessage={"Nothing to alert!"}/> <!-- Set the default message for this Panel -->
        ...
      </Notifications>
    </div>
  );
}

export default App;
```

</details>
<details><summary><h2>Formatting The Alert</h2></summary>

Out of the box the React notifications context renders a very basic self-closing alert. 
Production applications will want to replace this basic alert format with a format consistent with the look and feel of the application.

There are 2 ways to control the component used to render the notice.

1. Setting a default alert
1. Setting an alert for a specific `Notifications.Panel`

### Setting A Default Alert

The React notifications context privides a function `defaultAlert` to set the default alert component for all `Notifications.Panel`

``` javascript
// Import the default alert function
import {defaultAlert} from 'react-notifications-context';

// Define an alert component
const MyAlert = ({notice, onClose, timeout, queued}) => {
  setTimeout(onClose, timeout);
  return <JSX>
};

// Register the alert component as the default
defaultAlert(MyAlert);
```

**Note** The alert copmponent recieves the following props.

1. `notice`

The notice submitted to the `Notifications.Context` after it has been digested

2. `onClose`

A callback function to close the alert

3. `timeout`

The number of milliseconds that the alert should be shown before calling `onClose`

4. `queued`

A function to call to get the number of notices still on the queue

### Setting An Alert For A Specific Panel

In addition to or instead of setting a default alert individual `Notifications.Panel` can specify the alert component to render through its rendered props

``` jsx
<App>
  <Notifications>
    <Notifications.Panel alert={MyAlert} />
    ...
  </Notifications>
</App>
```

**Note** Alert components set at the panel level override the default alert

</details>

<details><summary><h2>Resetting Defaults</h2></summary>

The React notifications context provides a function `resetDefaults` to reset the defaults to thier original state.
This function is particularly useful for testing.

``` jsx
import {resetDefaults} from 'react-notifications-context';

resetDefaults();
```

</details>














