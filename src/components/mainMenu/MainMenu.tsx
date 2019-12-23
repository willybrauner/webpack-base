import css from "./MainMenu.module.less";
import React from "react";
import { Router } from "../../lib/navigation/Router";
import { prepareComponent } from "../../helpers/prepareComponent";
import Main from "../../Main";
import { merge } from "../../helpers/classNameHelper";

interface IProps {
  classNames?: string[];
}

// Prepare
const { component, log } = prepareComponent("MainMenu");

/**
 * @name MainMenu
 */
function MainMenu(props: IProps) {
  // --------------------------------------------------------------------------- PREPARE RENDER

  // --------------------------------------------------------------------------- RENDER

  return (
    <nav className={merge([css.MainMenu, props.classNames])}>
      <ul className={css._items}>
        {/* Map availables routes */}
        {Main.routes.map((el, i) => {
          const parameters = {
            id: el?.parameters?.id,
            slug: el?.parameters?.slug
          };
          return (
            <li key={i} className={css._item}>
              <a
                className={css._link}
                href={Router.generateURL({
                  page: el.page,
                  parameters: el.parameters ? parameters : null
                })}
                children={el.metas.name}
                data-internal-link
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MainMenu;
