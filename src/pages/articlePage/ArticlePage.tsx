import css from "./ArticlePage.module.less";
import React, { useRef } from "react";
import { usePageRegister } from "../../common/lib/router/usePageRegister";
import Metas from "../../common/lib/react-components/metas";
import PageTransitionHelper from "../../common/helpers/PageTransitionHelper";
import { prepare } from "../../common/helpers/prepare";
import { IActionParameters } from "../../common/lib/router/Router";

interface IProps {
  classNames?: string[];
  parameters?: IActionParameters;
  action?: string;
}

// prepare
const { componentName, log } = prepare("ArticlePage");

/**
 * @name ArticlePage
 */
const ArticlePage = (props: IProps) => {
  // get current route
  const rootRef = useRef<HTMLDivElement>(null);

  // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

  // register page transition
  usePageRegister({
    componentName,
    rootRef,
    playIn: (): Promise<any> => PageTransitionHelper.promisePlayIn(rootRef),
    playOut: (): Promise<any> => PageTransitionHelper.promisePlayOut(rootRef),
    actionName: props?.action,
    actionParameters: props?.parameters
  });

  // -------------------–-------------------–-------------------–--------------- RENDER

  return (
    <div ref={rootRef} className={css.Root}>
      <Metas
        title={`${componentName} title`}
        description={`${componentName} description`}
      />
      {componentName}
      <h1>slug {props?.parameters?.slug}</h1>
    </div>
  );
};

export default ArticlePage;
