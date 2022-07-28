import * as React from "react";

export const createStitchesPropertyName = (variantName) =>
  `--stitches-dynamic-${variantName}`;

export const createDynamicStyled = (_css) => {
  return (type, styleConfig) => {
    const { dynamicVariants, ...restOfStyleConfig } = styleConfig;
    const cssComponent = _css(restOfStyleConfig);

    const dVarToClassMap = {};
    const dynamicVariantsMap = {};

    for (const variantName in dynamicVariants) {
      dynamicVariantsMap[variantName] = dynamicVariants[variantName](
        `var(${createStitchesPropertyName(variantName)})`
      );
    }

    return React.forwardRef(({ css, style, as, ...props }, ref) => {
      const {
        props: { className, ..._fProps }
      } = cssComponent(props);

      const Component = as || type;
      const { dynamicVariantStyles, classNames } = processDynamicVariantsProps(
        className,
        dynamicVariantsMap,
        props,
        dVarToClassMap,
        cssComponent,
        _fProps,
        as
      );

      return (
        <Component
          {..._fProps}
          style={{ ...style, ...dynamicVariantStyles }}
          className={classNames.join(" ")}
          ref={ref}
        />
      );
    });
  };
};
function processDynamicVariantsProps(
  className,
  dynamicVariantsMap,
  props,
  dVarToClassMap,
  cssComponent,
  _fProps
) {
  const dynamicVariantStyles = {};
  const classNames = className ? [className] : [];

  for (const key in dynamicVariantsMap) {
    if (key in props) {
      dynamicVariantStyles[createStitchesPropertyName(key)] = props[key];
      if (!dVarToClassMap[key]) {
        dVarToClassMap[key] = String(
          cssComponent({ css: dynamicVariantsMap[key] })
        ).split(" ")[1];
      }
      classNames.push(dVarToClassMap[key]);
      _fProps[key] = undefined;
    }
  }

  _fProps["as"] = undefined;
  return { dynamicVariantStyles, classNames };
}
