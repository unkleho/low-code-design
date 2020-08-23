const publicInstanceToData = new Map();
const privateInstanceToData = new Map();

exports.mount = function (component) {
  if (component.internalInstance.stateNode) {
    publicInstanceToData.set(component.internalInstance.stateNode, component);
  }
  privateInstanceToData.set(component.internalInstance, component);
};

exports.update = function (component) {
  const existing = exports.findInternalComponent(component.internalInstance);
  if (existing) {
    existing.data = component.data;
  }
};

exports.findComponent = function (component) {
  return publicInstanceToData.get(component) || null;
};

exports.findInternalComponent = function (internalComponent) {
  return privateInstanceToData.get(internalComponent) || null;
};

exports.clearAll = function () {
  publicInstanceToData.clear();
};
