import css from "./HomePage.module.less";
import { RefObject } from "react";
import * as React from "react";
import PageTransitionHelper from "../../common/helpers/PageTransitionHelper";
import { ReactPage } from "../../common/lib/core/ReactPage";
import { prepareComponent } from "../../common/helpers/prepareComponent";
import Metas from "../../common/lib/react-components/metas";
import { merge } from "../../common/lib/helpers/classNameHelper";

interface IProps {
  classNames?: string[];

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}
interface IStates {}

// prepare
const { componentName, log } = prepareComponent("HomePage");

/**
 * @name HomePage
 */
class HomePage extends ReactPage<IProps, IStates> {
  // define ref
  protected rootRef: RefObject<HTMLDivElement>;

  /**
   * Constructor
   * @param pProps
   * @param pContext
   */
  constructor(pProps: IProps, pContext: any) {
    // relay
    super(pProps, pContext);
    // create ref
    this.rootRef = React.createRef();
  }

  // --------------------------------------------------------------------------- LIFE

  componentDidMount(): void {
    // set current page name in store
    this.props?.setcurrentPageName?.(componentName);
  }

  // --------------------------------------------------------------------------- TRANSITION

  /**
   * Action on this page.
   * Check props.action and props.parameters to show proper content.
   */
  action() {
    // Remove if not used
  }

  /**
   * Play in animation.
   * Call complete handler when animation is done.
   */
  protected playInHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayIn(this.rootRef, pCompleteHandler);
  }

  /**
   * Play out animation.
   * Call complete handler when animation is done.
   */
  protected playOutHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayOut(this.rootRef, pCompleteHandler);
  }

  // --------------------------------------------------------------------------- RENDER

  render() {
    return (
      <div className={merge([css.Root, componentName])} ref={this.rootRef}>
        <Metas
          title={`${componentName} title`}
          description={`${componentName} description`}
        />
        {componentName}
      </div>
    );
  }
}

export default HomePage;
