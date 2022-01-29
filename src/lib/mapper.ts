import {createMapper, SnakeCaseNamingConvention} from '@automapper/core';
import { classes } from '@automapper/classes';

const mapper = createMapper({
  name: 'main',
  pluginInitializer: classes,
  namingConventions: new SnakeCaseNamingConvention()
});

export default mapper;
