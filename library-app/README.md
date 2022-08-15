# React Notification Context

The React notifications context is a fully configurable notifications context for React web applications.

This project aims to provide a flexible and reusable approach to providing alerts to web application users.

The default broswer behaviour for alerts presents an unformatted alert dialog. This is invariably ugly and does not fit into the look and feel of any web application.
It does however, have the advantage of being invoked from a global broswer function `alert(...)`.

In a production web application we want the alerts to be formatted and appear at a sensible location within the page.

Bootstrap provides an `Alert` componet for formatting and rendeing user alerts. However, in order to render the alert ther developer must implement some javascript plumbing to show and hide the alert as required.
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
