import fs from 'fs';

export enum ConfigProperty {
  Gumrua = 'gumruaAddress',
}

const getFilename = (network: string) => `${__dirname}/${network}.json`;

const loadJSON = (network: string) => {
  const filename = getFilename(network);
  return fs.existsSync(filename) ? fs.readFileSync(filename).toString() : '{}';
};

const saveJSON = (network: string, json = '') => {
  const filename = getFilename(network);
  return fs.writeFileSync(filename, JSON.stringify(json, null, 2));
};

export const getDeploymentProperty = (network: string, property: ConfigProperty): string => {
  const obj = JSON.parse(loadJSON(network));
  return obj[property] || 'Not found';
};

export const getDeployment = (network: string) => {
  const obj = JSON.parse(loadJSON(network));
  return obj || 'Not found';
};

export const setDeploymentProperty = (network: string, property: ConfigProperty, value: string) => {
  const obj = JSON.parse(loadJSON(network) || '{}');
  obj[property] = value;
  saveJSON(network, obj);
};

export const removeDeploymentProperty = (network: string, property: ConfigProperty) => {
  const obj = JSON.parse(loadJSON(network) || '{}');
  delete obj[property];
  saveJSON(network, obj);
};
