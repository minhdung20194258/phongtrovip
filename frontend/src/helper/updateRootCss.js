export default function updateRootCss(variables = {}) {
  if (!variables || !Object.keys(variables).length) return;

  for (const property in variables) {
    if (variables[property])
      document.documentElement.style.setProperty(property, variables[property]);
  }
}
