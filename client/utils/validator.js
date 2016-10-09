import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
const isEmpty = value => {
  if(isArray(value)) {
    return value.length === 0;
  } else {
    return  value === undefined || value === null || value === '';
  }
};

const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => {
  return !!error
})[0];

export function email(value) {
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
  return '';
}

export function required(error) {
  return value => {
    if (isEmpty(value)) {
      return error || 'Required';
    }
    return '';
  }
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return '';
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return '';
  };
}

export function integer(err) {
  return value => {
    if (value) {
      value = Number(value);
      if(isNaN(value) || !Number.isInteger(value))
        return err || 'Must be number';
    }
    return '';
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
    return '';
  };
}

export function match(field) {
  return (value, data) => {
    if (data && value !== data[field]) {
      return 'Do not match';
    }
    return '';
  };
}

export function regx(pattern, options, error) {
  return (value) => {
    const exp = new RegExp(pattern, options);
    if (exp.test(value)) {
      return error || 'Pattern do not match.';
    }
    return '';
  };
}

function validate(data, rules) {
  const errors = {};
  Object.keys(rules).forEach((key) => {
    const val = get(data, key);
    const rule = rules[key];
    if (isFunction(rule) && rule.name === 'validator') {
      errors[key] = rule(val);
    } else {
      const v = join([].concat(rule).reverse());
      const error = v(val, data);
      if (error) {
        errors[key] = error;
      }
    }
  });
  return errors;
}


export function createValidator(rules) {
  function validator(data) {
    return validate(data, rules);
  }
  return validator;
}

export const requireFields = (...names) => data =>
  names.reduce((errors, name) => {
    const e = errors;
    if (!data[name]) {
      e[name] = 'Required';
    }
    return e;
  }, {});
