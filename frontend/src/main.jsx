import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools();
/*
  Per ChatGPT Jan 10, 2024:
  global: This property is specifying global styles.

  (props) => ({ ... }): The function takes a props argument, which allows the styles to be dynamic and respond to the component's props.

  body: { ... }: This is specifying styles for the body element.

  color: mode('gray.800', 'whiteAlpha.900')(props): This is using the mode function from Chakra UI to determine the appropriate color based on the color mode (light or dark). The mode function takes two arguments: one for the light mode and one for the dark mode. It is invoked with (props) to dynamically calculate the color based on the current theme or mode.

  bg: mode('gray.100', '#101010')(props): Similar to the color property, this is determining the background color based on the color mode.

  import { mode } from '@chakra-ui/theme-tools';

  const styles = {
    global: (props) => ({
      body: {
       color: mode('gray.800', 'whiteAlpha.900')(props),
       bg: mode('gray.100', '#101010')(props),
      },
    }),
  };
  In this example, mode('gray.800', 'whiteAlpha.900') returns a function that, when called with props, dynamically selects the appropriate color based on the current color mode.
  */
const styles = {
  global: (props) => ({
    body:{
      color:mode('gray.800', 'whiteAlpha.900')(props),
      bg:mode('gray.100', '#101010')(props)
    }
  })
};

/*
  ChakraUI Color Mode
  Setup#
To get dark mode working correctly, you need to do two things:

Update your theme config to determine how Chakra UI should manage color mode updates.

Add the ColorModeScript to your application, and set the initial color mode your application should start with to either light, dark or system. It is light by default.

Updating the theme config#
The theme config for color mode has 2 options:

initialColorMode: The initial mode you'd like your app to start with when user visit the page for first time (or after storage reset). Can be one of dark, light or system. Default is light.

useSystemColorMode: If true, Chakra UI subscribes to changes in system color mode. If set to false, the app's color mode is detached from the system color mode. Default is false.

// theme.js

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme
*/

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
}

const colors = {
  gray: {
    light:"#616161",
    dark:"#1e1e1e"
  }
}

/*
  Per ChatGPT Jan 10, 2024:
  
  In Chakra UI, the extendTheme function is used to create a new theme by extending or overriding the default Chakra UI theme. It allows you to customize and add additional styles, colors, fonts, etc., to the existing theme.

Here's a basic example of how extendTheme is used:

jsx
Copy code
import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  colors: {
    primary: {
      500: '#ff6347', // Customize the primary color
    },
  },
  fonts: {
    heading: 'Roboto, sans-serif', // Add a custom font for headings
  },
  // ... other theme customizations
});

export default customTheme;
In this example:

The colors object is extended to customize the primary color.
The fonts object is extended to add a custom font for headings.
You can extend or override various aspects of the default theme, such as breakpoints, spacing, radii, shadows, etc. extendTheme provides a convenient way to create a theme that aligns with your design system.

After creating the custom theme using extendTheme, you can use it by wrapping your application with the ChakraProvider and providing the custom theme as a prop:

jsx
Copy code
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from './path-to-your-custom-theme';

function App() {
  return (
    <ChakraProvider theme={customTheme}>
  {/\* Your application components \*\/}
      </ChakraProvider>
      );
    }
    This way, your components will use the extended theme you've defined.
  
  The extendTheme function in Chakra UI takes an object as its argument, where you can specify the customizations you want to make to the default theme. The structure of this object should follow the theme specification of Chakra UI, which includes various sections such as colors, fonts, fontSizes, spacing, breakpoints, and more.

Here's a general overview of the common sections you might include in the object passed to extendTheme:

jsx
Copy code
import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  colors: {
    // Custom color definitions
  },
  fonts: {
    // Custom font definitions
  },
  fontSizes: {
    // Custom font size definitions
  },
  space: {
    // Custom spacing definitions
  },
  breakpoints: {
    // Custom breakpoint definitions
  },
  // ... other theme customizations
});

export default customTheme;
The actual parameters you provide depend on what aspects of the default theme you want to customize. You can refer to the Chakra UI documentation for a comprehensive list of theme options and their default values: Chakra UI Theme Specification.

Each section in the theme object corresponds to a particular aspect of the UI, and you can customize it according to your design requirements.

Keep in mind that Chakra UI is designed to be highly customizable, and you can tailor the theme to suit your application's visual style and branding.

*/
const theme = extendTheme({config, styles, colors});

ReactDOM.createRoot(document.getElementById('root')).render(
  //apparently React.StrictMode causes react to render every component twice (initially?) in development mode
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>{/*See SECTION 2 for explanation*/}
        <ChakraProvider theme={theme}>{/* I'm guessing similar to the redux provider. Allows you to use Chakra stuff, like chakra related components and props?*/}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
    
  </React.StrictMode>,
)

/*
  NOTES

  SECTION 2.
  REACT ROUTING:
    Reach routing is the mechanism by which React applications allow different views
    (or sets of components) to be displayed based on the URL in the browser's address bar.
    As per ChatGPT Jan 11, 2024:
      In the context of React, "views" generally refer to the different visual components or screens that make up the user interface of a web application. Each view typically represents a distinct page or section of the application, and it consists of one or more React components.
      React Router is a popular library for handling routing in React applications. It provides a set of components that can be used to define the navigation structure of your application. These components include:

      BrowserRouter: A router that uses the HTML5 history API for clean URLs.

      Route: A component that renders some UI when its path matches the current URL.

      Link: A component for navigating between pages. It renders an anchor tag (<a>) with a special behavior for handling client-side navigation.

      Switch: Renders the first child <Route> or <Redirect> that matches the current location.
      import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

      const Home = () => <h2>Home</h2>;
      const About = () => <h2>About</h2>;
      const Contact = () => <h2>Contact</h2>;

      const App = () => (
        <Router>
          <div>
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </nav>

            <Switch>
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </Router>
      );

      export default App;

    A note from React Router:
    Upgrade all <Switch> elements to <Routes>
    React Router v6 introduces a Routes component that is kind of like Switch, but a lot more powerful. The main advantages of Routes over Switch are:

    All <Route>s and <Link>s inside a <Routes> are relative. This leads to leaner and more predictable code in <Route path> and <Link to>
    Routes are chosen based on the best match instead of being traversed in order. This avoids bugs due to unreachable routes because they were defined later in your <Switch>
    Routes may be nested in one place instead of being spread out in different components. In small to medium-sized apps, this lets you easily see all your routes at once. In large apps, you can still nest routes in bundles that you load dynamically via React.lazy
    In order to use v6, you'll need to convert all your <Switch> elements to <Routes>. If you already made the upgrade to v5.1, you're halfway there.
*/