// Figure helpers for writing new questions. Example (run from the project folder):
//
//   node -e "import('./scripts/figures/index.js').then(({ svg, circuits }) => {
//     const body = circuits.battery(20, 100, 20, 20, '12 V', { plus: 'end', side: -1 }) + circuits.wire([20, 20], [120, 20])
//       + circuits.resistor(120, 20, 120, 100, 'R = 4 Ω', -1) + circuits.wire([120, 100], [20, 100]);
//     console.log(JSON.stringify(svg.svg(170, 120, body, 'A 12 V battery connected to a 4 ohm resistor')));
//   })"
//
// Paste the printed string (with its quotes) as the "figure" value of a question.
export * as svg from './svg.js';
export * as circuits from './circuits.js';
export * as gates from './gates.js';
export * as flow from './flow.js';
export * as shapes from './shapes.js';
