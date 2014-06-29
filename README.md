# Social Harvest Dashboard

[![Build Status](https://drone.io/github.com/tmaiaroto/social-harvest-dashboard/status.png)](https://drone.io/github.com/tmaiaroto/social-harvest-dashboard/latest) [![Coverage Status](https://coveralls.io/repos/tmaiaroto/social-harvest-dashboard/badge.png?branch=master)](https://coveralls.io/r/tmaiaroto/social-harvest-dashboard?branch=master)

A dashboard for Social Harvest&reg;, an open-source social media analytics platform.

This application uses AngularJS, D3.js, and NVD3 to create a modular and extensible dashboard for analyzing harvested social media data stored in InfluxDB.

The [Yearofmoo AngularJS Seed Repo](https://github.com/yearofmoo/angularjs-seed-repo) was used as a starting point for this application and includes helpful unit testing tools, Protractor integration and coverage testing.
Several packages have been updated, but the installation, development, and testing instructions remain the same.

## Installation

1. `npm install -g grunt-cli`
2. `npm install`
3. `grunt install`

## Development

1. `grunt dev`
2. Go to: `http://localhost:8888`

## Testing

### Run all tests with
`grunt test`

### Unit Testing

#### Single run tests
`grunt test:unit`

#### Auto watching tests
`grunt autotest:unit`

### End to End Testing (Protractor)

#### Single run tests
`grunt test:e2e`

#### Auto watching tests
`grunt autotest:e2e`

### Coverage Testing

`grunt coverage`
