import css from "./App.module.less";
import React, { Component } from "react";
import { EEnv } from "../../types";
import { GridLayout } from "@wbe/libraries";
import { ETransitionType, ViewStack } from "../../lib/router/ViewStack";
import { isEnv, showGridByDefault } from "../../helpers/nodeHelper";
import { IRouteMatch, Router } from "../../lib/router/Router";
import { TPageRegisterObject } from "../../lib/router/usePageRegister";
import { atoms } from "../../atoms/atoms";
import {
  DEFAULT_LANGUAGE,
  languageToString,
  stringToLanguage,
} from "../../lib/services/LanguageService";

const componentName = "App";
const debug = require("debug")(`front:${componentName}`);

// ----------------------------------------------------------------------------- STRUCT

export interface IProps {}

export interface IStates {
  showGrid?: boolean;
}

/**
 * @name App
 * @description First App entry point
 */
class App extends Component<IProps, IStates> {
  // React view stack, showing pages when route changes
  protected _viewStack: ViewStack;

  // --------------------------------------------------------------------------- INIT

  /**
   * Constructor
   * @param props
   * @param context
   */
  constructor(props: IProps, context: any) {
    super(props, context);

    // initialize states
    this.state = {
      showGrid: showGridByDefault,
    } as IStates;
  }

  // --------------------------------------------------------------------------- LIFECYCLE

  componentDidMount() {
    // initialize router
    this.initRouter();
    // toggle grid layout visibility
    this.toggleGridVisibilityHandler();
  }

  componentWillUnmount() {
    Router.onNotFound.remove(this.routeNotFoundHandler);
    Router.onNotFound.remove(this.routeChangedHandler);
  }

  componentDidUpdate(pPrevProps: IProps, pPrevState: IStates) {}

  // --------------------------------------------------------------------------- ROUTER

  /**
   * Initialize Router
   */
  protected initRouter(): void {
    // Setup viewStack to show pages from Router automatically
    Router.registerStack("main", this._viewStack as any);
    // Listen to routes not found
    Router.onNotFound.add(this.routeNotFoundHandler, this);
    Router.onRouteChanged.add(this.routeChangedHandler, this);
    // Enable auto link listening
    Router.listenLinks();
    // Start router
    Router.start();
  }

  // --------------------------------------------------------------------------- HANDLERS

  /**
   * Transition manager between all pages.
   * Useful if you want a custom transition behavior other than PAGE_SEQUENTIAL or PAGE_CROSSED.
   * To enable this feature, set prop transitionType to ETransitionType.CONTROLLED onto ViewStack component.
   * @return {Promise<any>}
   */
  protected transitionControl(
    pOldPage: TPageRegisterObject,
    pNewPage: TPageRegisterObject
  ): Promise<any> {
    return new Promise(async (resolve) => {
      debug({ pOldPage, pNewPage });
      // target ref
      const oldPageRef = pOldPage?.rootRef?.current;
      const newPageRef = pNewPage?.rootRef?.current;

      // hide new page fist
      if (newPageRef != null) newPageRef.style.visibility = "hidden";
      // playOut old page
      pOldPage && (await pOldPage?.playOut?.());

      // show new page
      if (newPageRef != null) newPageRef.style.visibility = "visible";
      // playIn new page
      pNewPage && (await pNewPage?.playIn?.());
      // All done
      resolve();
    });
  }

  /**
   * When route has changed
   */
  protected routeChangedHandler(pRouteMatch: IRouteMatch) {
    debug("pRouteMatch", pRouteMatch);

    if (!Router.currentRouteMatch.parameters.lang) {
      throw new Error("No language parameter passed");
    }

    const language = stringToLanguage(
      Router.currentRouteMatch.parameters.lang as string
    );

    if (language === undefined) {
      debug("Incorrect language", Router.currentRouteMatch.parameters.lang);

      // Show 404 page
      const notFoundPage = () =>
        require("../../pages/notFoundPage/NotFoundPage");

      setTimeout(
        () =>
          this._viewStack.showPage("NotFoundPage", notFoundPage, "index", {}),
        1
      );
    }
  }

  /**
   * When a route is not found
   */
  protected routeNotFoundHandler(...rest) {
    debug("Route not found", Router.currentPath);

    const cleanedPath = (Router.currentPath.endsWith("/")
      ? Router.currentPath.slice(0, -1)
      : Router.currentPath
    )
      // Remove multiple slashs
      .replace(/(https?:\/\/)|(\/)+/g, "$1$2");

    if (cleanedPath !== Router.currentPath) {
      debug("Trying path without ending slash", cleanedPath);

      const cleanedPathRoute = Router.URLToRoute(cleanedPath);

      if (cleanedPathRoute) {
        debug("Redirecting to", cleanedPathRoute);

        // Have to delay openPage call because it won't work if called synchronously
        setTimeout(() => Router.openPage(cleanedPathRoute, false), 10);
        return;
      }
    }

    // TODO: to fix, then replace appBase with process.env.APP_BASE
    const appBase = "";

    let pathWithLanguage = `/${appBase}/${languageToString(
      DEFAULT_LANGUAGE
    )}${cleanedPath.replace(appBase, "")}`
      // Remove multiple slashs
      .replace(/(https?:\/\/)|(\/)+/g, "$1$2");

    debug("Trying with default language", pathWithLanguage);

    const pathWithLanguageRoute = Router.URLToRoute(pathWithLanguage);

    if (pathWithLanguageRoute) {
      debug("Redirecting to", pathWithLanguageRoute);

      // Have to delay openPage call because it won't work if called synchronously
      setTimeout(() => Router.openPage(pathWithLanguageRoute, false), 10);
      return;
    }

    // Show 404 page
    const notFoundPage = () => require("../../pages/notFoundPage/NotFoundPage");
    this._viewStack.showPage("NotFoundPage", notFoundPage, "index", {});
  }

  /**
   * When a page is not found
   * @param {string} pPageName
   */
  protected pageNotFoundHandler(pPageName: string) {
    console.error("PAGE NOT FOUND", pPageName);
  }

  // --------------------------------------------------------------------------- KEY

  protected toggleGridVisibilityHandler() {
    // listen press onkey up
    document.body.onkeyup = (pEvent: KeyboardEvent) => {
      // if code key is G Key // toggle visibility state
      if (pEvent.code === "KeyG")
        this.setState({ showGrid: !this.state.showGrid });
    };
  }

  // --------------------------------------------------------------------------- RENDER

  render() {
    return (
      <div className={css.Root}>
        {isEnv(EEnv.DEV) && this.state.showGrid && (
          <GridLayout
            columnsNumber={atoms.gridColumnNumber}
            gutterSize={atoms.gridGutterSize}
            maxSize={atoms.gridMaxWidth}
          />
        )}
        <div className={css.wrapper}>
          <nav className={css.nav}>
            <a
              className={css.link}
              href={Router.generateURL({ page: "HomePage" })}
              children={"Home"}
              data-internal-link={true}
            />
            <a
              className={css.link}
              href={Router.generateURL({
                page: "WorkPage",
                parameters: {
                  slug: "custom-slug",
                },
              })}
              children={"Work"}
              data-internal-link={true}
            />
          </nav>
          <ViewStack
            ref={(r) => (this._viewStack = r)}
            transitionType={ETransitionType.CONTROLLED}
            transitionControl={this.transitionControl.bind(this)}
            onNotFound={this.pageNotFoundHandler.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default App;
