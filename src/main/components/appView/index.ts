import AppView from "./AppView";
import { connect } from "react-redux";

/**
 * Map state to component props
 * @param state
 */
const mapStateToProps = (state: any) => {
  return {};
};

/**
 * Map dispatch function to component props
 * @param dispatch
 */
const mapDispatchToProps = dispatch => {
  return {};
};

/**
 * Connector use on default export bellow
 */
const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
});

export default connector(AppView);
