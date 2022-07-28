import type * as CSSUtil from "@stitches/react/types/css-util";
import type * as _StyledComponent from "@stitches/react/types/styled-component";
import type * as Util from "@stitches/react/types/util";

type ToVariantsType<Variants> = {
  [k in keyof Variants]?: unknown extends Variants[k]
    ? string
    : keyof Variants[k];
};

export type CreateDynamicStyled = {
  <
    Config extends { media?: {}; utils?: {}; themeMap?: {}; theme?: {} },
    Media = Config["media"] extends {} ? Config["media"] : {},
    Theme = Config["theme"] extends {} ? Config["theme"] : {},
    ThemeMap = Config["themeMap"] extends {} ? Config["themeMap"] : {},
    Utils = Config["utils"] extends {} ? Config["utils"] : {}
  >(
    styled: any
  ): {
    <
      Type extends
        | keyof JSX.IntrinsicElements
        | React.ComponentType<any>
        | Util.Function,
      Config extends CSS,
      Variants,
      CVariants extends Variants,
      DynamicVariants,
      CSS = CSSUtil.CSS<Media, Theme, ThemeMap, Utils>
    >(
      type: Type,
      StyleConfig: {
        variants?: {
          [k in keyof Variants]: { [b in keyof Variants[k]]: CSS };
        };
        dynamicVariants?: {
          [k in keyof DynamicVariants]?: (val: string) => CSS;
        };
        compoundVariants?: ({ [k in keyof CVariants]: keyof CVariants[k] } & {
          css?: CSS;
        })[];
        defaultVariants?: {
          [k in keyof CVariants]?: keyof CVariants[k];
        };
      } & {
        [K2 in keyof Config]: K2 extends
          | "compoundVariants"
          | "defaultVariants"
          | "variants"
          ? unknown
          : K2 extends keyof CSS
          ? CSS[K2]
          : unknown;
      }
    ): StyledComponent<
      Type,
      ToVariantsType<Variants>,
      ToVariantsType<DynamicVariants>,
      Media,
      CSS
    >;
  };
};

/** Returns a new Styled Component. */
export interface StyledComponent<
  Type = "span",
  ResponsiveVariants = {},
  DynamicVariants = {},
  Media = {},
  CSS = {}
>
  extends React.ForwardRefExoticComponent<
    Util.Assign<
      Type extends
        | _StyledComponent.IntrinsicElementsKeys
        | React.ComponentType<any>
        ? React.ComponentPropsWithRef<Type>
        : never,
      _StyledComponent.TransformProps<ResponsiveVariants, Media> & {
        css?: CSS;
      } & DynamicVariants
    >
  > {
  (
    props: Util.Assign<
      Type extends
        | _StyledComponent.IntrinsicElementsKeys
        | React.ComponentType<any>
        ? React.ComponentPropsWithRef<Type>
        : {},
      _StyledComponent.TransformProps<ResponsiveVariants, Media> & {
        as?: never;
        css?: CSS;
      } & DynamicVariants
    >
  ): React.ReactElement | null;

  <
    C extends CSS,
    As extends string | React.ComponentType<any> = Type extends
      | string
      | React.ComponentType<any>
      ? Type
      : any,
    InnerProps = Type extends StyledComponent<any, infer IP, any, any> ? IP : {}
  >(
    props: Util.Assign<
      React.ComponentPropsWithRef<
        As extends
          | _StyledComponent.IntrinsicElementsKeys
          | React.ComponentType<any>
          ? As
          : never
      >,
      _StyledComponent.TransformProps<
        Util.Assign<InnerProps, ResponsiveVariants>,
        Media
      > & {
        as?: As;
        css?: {
          [K in keyof C]: K extends keyof CSS ? CSS[K] : never;
        } &
          DynamicVariants;
      }
    >
  ): React.ReactElement | null;

  className: string;
  selector: string;

  [_StyledComponent.$$StyledComponentType]: Type;
  [_StyledComponent.$$StyledComponentProps]: ResponsiveVariants;
  [_StyledComponent.$$StyledComponentMedia]: Media;
}

export declare const createDynamicStyled: CreateDynamicStyled;