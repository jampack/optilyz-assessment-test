import {createMapper, CamelCaseNamingConvention} from '@automapper/core';
import { classes } from '@automapper/classes';

const mapper = createMapper({
  name: 'main',
  pluginInitializer: classes,
  namingConventions: new CamelCaseNamingConvention()
});

export default mapper;
