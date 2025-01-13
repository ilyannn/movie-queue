# Chakra UI v3.3

Here's a list of all the components available in the library:

**Accordion**
: Used to show and hide sections of related content on a page

**Action Bar**
: Used to display a bottom action bar with a set of actions

**Alert**
: Used to communicate a state that affects a system, feature or page.

**Aspect Ratio**
: Used to embed responsive videos and maps, etc

**Avatar**
: Used to represent user profile picture or initials

**Badge**
: Used to highlight an item's status for quick recognition.

**Bleed**
: Used to break an element from the boundaries of its container

**Blockquote**
: Used to quote text content from an external source

**Box**
: The most abstract styling component in Chakra UI on top of which all other Chakra UI components are built.

**Breadcrumb**
: Used to display a page's location within a site's hierarchical structure

**Button**
: Used to trigger an action or event

**Card**
: Used to display content related to a single subject.

**Center**
: Used to center its child within itself.

**Checkbox Card**
: Used to select or deselect options displayed within cards.

**Checkbox**
: Used in forms when a user needs to select multiple values from several options

**Client Only**
: Used to render content only on the client side.

**Clipboard**
: Used to copy text to the clipboard

**Close Button**
: Used to trigger close functionality

**Code**
: Used to display inline code

**Collapsible**
: Used to expand and collapse additional content.

**Color Picker**
: Used to select colors from a color area or a set of defined swatches

**Color Swatch**
: Used to preview a color

**Container**
: Used to constrain a content's width to the current breakpoint, while keeping it fluid.

**DataList**
: Used to display a list of similar data items.

**Dialog**
: Used to display a dialog prompt

**Drawer**
: Used to render a content that slides in from the side of the screen.

**Editable**
: Used for inline renaming of some text.

**Em**
: Used to mark text for emphasis.

**Empty State**
: Used to indicate when a resource is empty or unavailable.

**Environment Provider**
: Used to render components in iframes, Shadow DOM, or Electron.

**Field**
: Used to add labels, help text, and error messages to form fields.

**Fieldset**
: A set of form controls optionally grouped under a common name.

**File Upload**
: Used to select and upload files from their device.

**Flex**
: Used to manage flex layouts

**Float**
: Used to anchor an element to the edge of a container.

**For**
: Used to loop over an array and render a component for each item.

**Format Byte**
: Used to format bytes to a human-readable format

**Format Number**
: Used to format numbers to a specific locale and options

**Grid**
: Used to manage grid layouts

**Group**
: Used to group and attach elements together

**Heading**
: Used to render semantic HTML heading elements.

**Highlight**
: Used to highlight substrings of a text.

**Hover Card**
: Used to display content when hovering over an element

**Icon Button**
: Used to render an icon within a button

**Icon**
: Used to display an svg icon

**Image**
: Used to display images

**Input**
: Used to get user input in a text field.

**Kbd**
: Used to show key combinations for an action

**Link Overlay**
: Used to stretch a link over a container.

**Link**
: Used to provide accessible navigation

**List**
: Used to display a list of items

**Locale Provider**
: Used for globally setting the locale

**Mark**
: Used to mark text for emphasis.

**Menu**
: Used to create an accessible dropdown menu

**Select (Native)**
: Used to pick a value from predefined options.

**Number Input**
: Used to enter a number, and increment or decrement the value using stepper buttons.

**Pagination**
: Used to navigate through a series of pages.

**Password Input**
: Used to collect passwords.

**Pin Input**
: Used to capture a pin code or otp from the user

**Popover**
: Used to show detailed information inside a pop-up

**Portal**
: Used to render an element outside the DOM hierarchy.

**Progress Circle**
: Used to display a task's progress in a circular form.

**Progress**
: Used to display the progress status for a task.

**Prose**
: Used to style remote HTML content

**QR Code**
: A component that generates a QR code based on the provided data.

**Radio Card**
: Used to select an option from list

**Radio**
: Used to select one option from several options

**Rating**
: Used to show reviews and ratings in a visual format.

**Segmented Control**
: Used to pick one choice from a linear set of options

**Select**
: Used to pick a value from predefined options.

**Separator**
: Used to visually separate content

**Show**
: Used to conditional render part of the view based on a condition.

**SimpleGrid**
: SimpleGrid provides a friendly interface to create responsive grid layouts with ease.

**Skeleton**
: Used to render a placeholder while the content is loading.

**Slider**
: Used to allow users to make selections from a range of values.

**Spinner**
: Used to provide a visual cue that an action is processing

**Stack**
: Used to layout its children in a vertical or horizontal stack.

**Stat**
: Used to display a statistic with a title and value.

**Status**
: Used to indicate the status of a process or state

**Steps**
: Used to indicate progress through a multi-step process

**Switch**
: Used to capture a binary state

**Table**
: Used to display data in a tabular format.

**Tabs**
: Used to display content in a tabbed interface

**Tag**
: Used for categorizing or labeling content

**Text**
: Used to render text and paragraphs within an interface.

**Textarea**
: Used to enter multiple lines of text.

**Theme**
: Used to force a part of the tree to light or dark mode.

**Timeline**
: Used to display a list of events in chronological order

**Toast**
: Used to display a temporary message to the user

**Toggle Tip**
: Looks like a tooltip, but works like a popover.

**Tooltip**
: Used to display additional information when a user hovers over an element.

**Visually Hidden**
: Used to hide content visually but keep it accessible to screen readers.

---
title: Button
description: Used to trigger an action or event
links:
  source: components/button
  storybook: components-button--basic
  recipe: button
---

<ExampleTabs name="button-basic" />

## Setup

If you don't already have the snippet, run the following command to add the
`button` snippet

```sh
npx @chakra-ui/cli snippet add button
```

The snippet includes enhances the Button with `loading` and `loadingText` props.

## Usage

```jsx
import { Button } from "@/components/ui/button"
```

```jsx
<Button>Click me</Button>
```

## Examples

### Sizes

Use the `size` prop to change the size of the button.

<ExampleTabs name="button-with-sizes" />

### Variants

Use the `variant` prop to change the visual style of the Button.

<ExampleTabs name="button-with-variants" />

### Icon

Use icons within a button

<ExampleTabs name="button-with-icons" />

### Color

Use the `colorPalette` prop to change the color of the button

<ExampleTabs name="button-with-colors" />

### Loading

Use the `loading` and `loadingText` prop to show a loading spinner

<ExampleTabs name="button-with-loading" />

### Group

Use the `Group` component to group buttons together

<ExampleTabs name="button-with-group" />

## Props

<PropTable component="Button" part="Button" />

---

title: Server Components
description: Learn how to use Chakra UI with React Server Components
---

React Server Components is a new feature in React that allows you to build
components that render on the server and return UI to the client without hydration.

Client components are still server-rendered but hydrated on the client. Learn
more about
[Server component patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

Chakra UI components are client components because they rely on `useState`,
`useRef` and `useState` which are not available in server components.

:::info

**TLDR:** By default, Chakra UI components can be used with React Server
Components without adding the 'use client' directive.

:::

## Usage

Here's an example of how to use Chakra UI components with React Server
Components in Next.js

```jsx [app/page.tsx]
import { Heading } from "@chakra-ui/react"
import fs from "node:fs"

export default async function Page() {
  const content = fs.readFileSync("path/to/file.md", "utf-8")
  return <Heading as="h1">{content}</Heading>
}
```

## Chakra Factory

When using the `chakra()` factory function, use the `use client` directive and
move the component to a dedicated file.

```jsx [blog-post.tsx]
"use client"

import { chakra } from "@chakra-ui/react"

export const BlogPost = chakra("div", {
  base: {
    color: "red",
  },
  variants: {
    primary: {
      true: { color: "blue" },
      false: { color: "green" },
    },
  },
})
```

Then import the component in your page server component

```jsx [blogs/page.tsx]
import { BlogPost } from "./blog-post"

export default async function Page() {
  const content = fs.readFileSync("path/to/file.md", "utf-8")
  return <BlogPost>{content}</BlogPost>
}
```

## Hooks

When importing hooks from Chakra UI, use the `use client` directive

```jsx
"use client"

import { useBreakpointValue } from "@chakra-ui/react"

export function MyComponent() {
  const value = useBreakpointValue({ base: "mobile", md: "desktop" })
  return <div>{value}</div>
}
```

## Render Props

When using render props, use the `use client` directive

```jsx
"use client"

import { ProgressContext } from "@chakra-ui/react"

export function MyComponent() {
  return <ProgressContext>{({ value }) => <div>{value}</div>}</ProgressContext>
}
```
