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

``` javascript
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

``` javascript
const notices = useContext(Notifications.Context);
``` 

and to submit the notice

``` javascript
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

``` javascript
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

**Note** There is no requirement for the `Notifications` component to be an immediate child of the <App> nor for the `Notifications.Panel` to be an immediate child of its `Notifications`. The exmaple given ommits more detailed nesting for reasons of clarity

**Note** Notices raised inside of a `Notifications` component are queued until a `Notifications.Panel` exists and is ready to display the notice

</details>
<details><summary><h2>Handling Multiple Notices</h2></summary>

The React notifications context uses a [@k2_tools/utils.queues.queue](https://github.com/simonemmott/k2-tools-utils/blob/HEAD/docs/QUEUES.md) to queue notices until the `Notifications.Panel` is ready to display them.

Multiple notices can be submitted and all will be queued in the order they were submitted and displayed to the user one at a time.

The `Notifications.Panel` uses a `QueuedCountDownTimer` to automatically timeout the notice after the submitted or configured timeout has elapsed. Once a notice is closed, either by the user or timed out automatically the next queued notice is rendered for the user.

</details>
<details><summary><h2>Formatting The Alert</h2></summary>

Out of the box the React notifications context renders a very basic self-closing alert. 
Production applicaitons will want to replace this basic alert format with a format consistent with the look and feel of the application.




</details>