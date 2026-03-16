# Project Instructions

## Working Process
- Log all significant changes, design decisions, and AI-generated code as concise simplified descriptions of the request and decision in chronological order in a root AI_LOG.md file.

## Architecture

- Follow typical best practices for a simple and easy to understand React project
- Opt for lightweight libraries when possible rather than custom code (eg @uidotdev/usehooks)
- Only abstract or introduce complexity or custom code when absolutely necessary
- Only abstract to a reusable component once a component needs to be used in more than location
- Use tailwind for any layout and design needs beyond a component's OOTB design
- Use reusable shared tailwind styles for typography and any other reused styles
- Opt for simpler architecture when possible (eg React Context until it becomes too complex and requires Redux)
- Always use tree-shaking friendly imports for the dependencies to reduce bundle size

## Code Style

- Use TypeScript
- Prefer React functional components
- Always use level AA compliant accessible semantic HTML, and rely on built-in components of the libraries we've introduced whenever possible
- Use simple CSS transitions or CSS @keyframes animations whenever possible, prioritizing OOTB component features, then tailwind
- Use <Suspense> and other built-in React features for handling UI response to state changes

## Design

- Ensure clear visual hierarchy
- Prioritize mobile first, then simple reflows up to desktop
- Choose a lightweight editorial friendly clean monospaced google font
- Opt for a no-click required experience whenever possible, show content immediately without requiring user interaction if possible
- Show simple CSS based skeleton UI whenever there is a possible delay before displaying content, and a loading indicator if it's potentially longer than 2 seconds
- Animate state transitiions (waiting on weather data, changing weather data, error message)
- Opt for lighweight SVG libraries rather than creating custom graphics (eg lucide-react)
- Opt for animated SVGs for all weather related icons (eg @bybas/weather-icons)
- Opt for lightweight UI toolkit for any complex interfaces rather than creating a custom one (eg shadcn/ui)