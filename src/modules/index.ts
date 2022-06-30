import { DocModule } from './base/doc';
import { DpEnvConfigModule } from './base/dpEnvConfig';
import { DpMenuModule } from './base/dpMenu';
import { DpMenuDetailModule } from './base/dpMenuDetail';
import { DpMetaDatabaseModule } from './base/dpMetaDatabase';
import { DpMetaEntityModule } from './base/dpMetaEntity';
import { DpMetaEntityAttrModule } from './base/dpMetaEntityAttr';
import { DpMetaEnumModule } from './base/dpMetaEnum';
import { DpMetaEnumItemModule } from './base/dpMetaEnumItem';
import { DpProjectModule } from './base/dpProject';
import { DpProjectInfoModule } from './base/dpProjectInfo';
import { DpStoreModule } from './base/dpStore';
import { DpTemplateModule } from './base/dpTemplate';
import { DpTemplatePromptModule } from './base/dpTemplatePrompt';
import { NavModule } from './base/nav';

export default [
  DocModule,
  DpEnvConfigModule,
  DpMenuModule,
  DpMenuDetailModule,
  DpMetaDatabaseModule,
  DpMetaEntityModule,
  DpMetaEntityAttrModule,
  DpMetaEnumModule,
  DpMetaEnumItemModule,
  DpProjectModule,
  DpProjectInfoModule,
  DpStoreModule,
  DpTemplateModule,
  DpTemplatePromptModule,
  NavModule
];
