import React, { Component } from "react";
import PropTypes from "prop-types";
import { ifDo } from "../../helpers";
import shallowCompare from "shallow-compare";

const makeFormElement = WrappedComponent => {
  return class DecoratedComponent extends Component {
    static propTypes = {
      id: PropTypes.string.isRequired,
      onChange: PropTypes.func,
    };

    static contextTypes = {
      onChange: PropTypes.func,
      getValue: PropTypes.func,
      state: PropTypes.object,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      const { id } = this.props;

      // only update if the value we got from the context has actually changed, or if props/state has actually changed
      // TODO -- support for deeper state tree
      return shallowCompare(this, nextProps, nextState) || this.context.state[id] !== nextContext.state[id];
    }

    handleChange = (e) => {
      const { id, onChange } = this.props;

      // determine correct value. Checkboxes are a silly exception ¯\_(ツ)_/¯
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

      // internal context change handler sets the values
      this.context.onChange(id, value);

      // handle custom change handlers as well
      ifDo(onChange, id, value);
    }

    render() {
      const { id } = this.props;

      console.log("id, this.context.getValue(id)", id, this.context.getValue(id));
      return (
        <WrappedComponent
          {...this.props}
          value={this.context.getValue(id)}
          onChange={this.handleChange}
        />
      );
    }
  };
};

export default makeFormElement;
