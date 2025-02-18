import { DocModule } from './base/doc';
import { DpEnvConfigModule } from './base/dpEnvConfig';
import { DpMenuModule } from './base/dpMenu';
import { DpMenuDetailModule } from './base/dpMenuDetail';
import { DpProjectModule } from './base/dpProject';
import { DpProjectInfoModule } from './base/dpProjectInfo';
import { DpTemplateModule } from './base/dpTemplate';
import { DpTemplatePromptModule } from './base/dpTemplatePrompt';
import { NavModule } from './base/nav';

export default [
  DocModule,
  DpEnvConfigModule,
  DpMenuModule,
  DpMenuDetailModule,
  DpProjectModule,
  DpProjectInfoModule,
  DpTemplateModule,
  DpTemplatePromptModule,
  NavModule
];
