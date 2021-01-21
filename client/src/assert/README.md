# client tests

The following is a guide to classification of tests for client developers:

| classification | purpose                          |     |     |     |
| -------------- | -------------------------------- | --- | --- | --- |
| component      | custom made components           |     |     |     |
| unit           | individual methods and functions |     |     |     |

Please note that:

- The one API which the client intergrates with is the web server via openapi-generator.
- Component tests are used to check for client side validation of state and props, e.g. certain fields on a form are required.
