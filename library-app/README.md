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
  <Notifications>
    ...
      <ComponentRaisesNotice />
    ...
    <Notifications.Panel />
    ...
      <ComponentRaisessNotice />
    ...
  </Notifications>
  ...
</App>
```

 
