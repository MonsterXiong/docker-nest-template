CREATE DATABASE IF NOT EXISTS `development_platform` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `development_platform`;


CREATE TABLE IF NOT EXISTS `dp_menu` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `english_name` varchar(50) DEFAULT NULL COMMENT '英文名称',
  `sync_id` varchar(32) DEFAULT NULL COMMENT '同步项目id',
  `code` varchar(32) NOT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `bind_project` varchar(32) NOT NULL COMMENT '所属项目',
  `parent_id` varchar(32) DEFAULT NULL COMMENT '父级',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_active` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '状态',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单';

CREATE TABLE IF NOT EXISTS `dp_menu_detail` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `english_name` varchar(50) DEFAULT NULL COMMENT '英文名称',
  `sync_id` varchar(32) DEFAULT NULL COMMENT '同步项目id',
  `code` varchar(32) NOT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `config_param` longtext COMMENT '配置',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_active` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '状态',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单详情';


CREATE TABLE IF NOT EXISTS `dp_project` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `sync_id` varchar(32) DEFAULT NULL COMMENT '同步项目id',
  `code` varchar(32) DEFAULT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `bind_project_type` varchar(32) NOT NULL COMMENT '所属分类',
  `bind_unit` varchar(32) DEFAULT NULL COMMENT '所属单位',
  `unit_name` varchar(32) NOT NULL COMMENT '单位名称',
  `unit_code` varchar(32) NOT NULL COMMENT '单位标识',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_active` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '状态',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目';


CREATE TABLE IF NOT EXISTS `dp_project_info` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `sync_id` varchar(32) DEFAULT NULL COMMENT '同步项目id',
  `code` varchar(32) DEFAULT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `bind_project` varchar(32) NOT NULL COMMENT '所属项目',
  `db_host` varchar(32) NOT NULL COMMENT '数据库主机',
  `db_user` varchar(32) NOT NULL COMMENT '数据库用户名',
  `db_password` varchar(32) NOT NULL COMMENT '数据库密码',
  `db_port` varchar(32) NOT NULL COMMENT '数据库端口',
  `db_name` varchar(32) NOT NULL COMMENT '数据库名称',
  `git_url` varchar(32) DEFAULT NULL COMMENT '仓库地址',
  `jenkins` varchar(32) DEFAULT NULL COMMENT 'jenkins',
  `api_prefix` varchar(32) DEFAULT NULL COMMENT '接口前缀',
  `output_dir` varchar(32) DEFAULT NULL COMMENT '输出目录',
  `bind_framework` varchar(32) DEFAULT NULL COMMENT '所属框架',
  `port` int(10) DEFAULT NULL COMMENT '项目端口',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_active` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '状态',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目详情';

CREATE TABLE IF NOT EXISTS `nav` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `code` varchar(32) DEFAULT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `bind_project_category` varchar(32) DEFAULT NULL COMMENT '所属分类',
  `bind_unit` varchar(32) DEFAULT NULL COMMENT '所属单位',
  `unit_name` varchar(32) NOT NULL COMMENT '单位名称',
  `unit_code` varchar(32) NOT NULL COMMENT '单位标识',
  `bind_project_type` varchar(32) NOT NULL COMMENT '所属类型(项目、产品)',
  `bind_project` varchar(32) DEFAULT NULL COMMENT '绑定项目',
  `project_url` varchar(255) NOT NULL COMMENT '预览',
  `project_jenkins_url` varchar(255) DEFAULT NULL COMMENT 'jenkins链接',
  `project_git_url` varchar(255) DEFAULT NULL COMMENT 'git链接',
  `project_zentao_url` varchar(255) DEFAULT NULL COMMENT '禅道链接',
  `project_port` int(10) DEFAULT NULL COMMENT '端口',
  `is_preview` varchar(1) DEFAULT '0' COMMENT '是否演示',
  `parent_id` varchar(32) DEFAULT NULL COMMENT '父级',
  `icon` varchar(32) DEFAULT NULL COMMENT '图标',
  `bg_image` varchar(255) DEFAULT NULL COMMENT '背景图片',
  `tag` varchar(255) DEFAULT NULL COMMENT '标签',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_active` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '状态',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='导航';

CREATE TABLE IF NOT EXISTS `nav_tool` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `code` varchar(32) DEFAULT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `bind_nav_tool_category` varchar(32) NOT NULL COMMENT '所属工具导航类别',
  `icon` varchar(32) DEFAULT NULL COMMENT '图标',
  `url` varchar(255) NOT NULL COMMENT '链接',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_active` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '状态',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具导航';

CREATE TABLE IF NOT EXISTS `nav_url` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `code` varchar(32) DEFAULT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `bind_url_type` varchar(32) NOT NULL COMMENT '所属链接类别',
  `bind_nav` varchar(32) DEFAULT NULL COMMENT '所属单位',
  `url` varchar(255) NOT NULL COMMENT '预览',
  `jenkins_url` varchar(255) DEFAULT NULL COMMENT 'jenkins链接',
  `git_url` varchar(255) DEFAULT NULL COMMENT 'git链接',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_active` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '状态',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='导航子链接';


CREATE TABLE IF NOT EXISTS `s_category` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `code` varchar(32) NOT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `bind_category_type` varchar(32) NOT NULL COMMENT '所属分类类别',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_active` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '状态',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类';

INSERT INTO `s_category` (`id`, `name`, `full_name`, `code`, `description`, `bind_category_type`, `sys_remark`, `sys_sort`, `sys_is_active`, `sys_is_del`, `sys_creator`, `sys_create_time`, `sys_create_ip`, `sys_updater`, `sys_update_time`, `sys_update_ip`) VALUES
	('1', '项目', NULL, 'project', NULL, 'project_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('2', '产品', NULL, 'product', NULL, 'project_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('3', '前端', NULL, 'fe', NULL, 'url_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('4', '后端', NULL, 'be', NULL, 'url_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('5', '文档', NULL, 'doc', NULL, 'url_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('6', '日志', NULL, 'log', NULL, 'url_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('7', '构建', NULL, 'jenkins', NULL, 'url_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('8', '代码', NULL, 'code', NULL, 'url_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('9', '禅道', NULL, 'zentao', NULL, 'url_type', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('10', '基于低代码', NULL, 'lowcode', NULL, 'project_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('11', '基于作战概念', NULL, 'zzgn', NULL, 'project_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('12', '基于能力量化', NULL, 'aq', NULL, 'project_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('13', '基于流程执行', NULL, 'flow', NULL, 'project_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('14', '基于南部评估', NULL, 'nbpg', NULL, 'project_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('15', '基于新一代', NULL, 'xyd', NULL, 'project_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('16', '体系', NULL, 'tixi', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('17', '长沙科大3院', NULL, 'cskd3y', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('18', '南京电科28s', NULL, 'njdk28s', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('19', '长沙科大5院', NULL, 'cskd5y', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('20', '广州南部战区', NULL, 'gznbzq', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('21', '武汉航天3部', NULL, 'whht3b', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('22', '北京电科院', NULL, 'bjdky', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('23', '武汉709所', NULL, 'wh709s', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('24', '天津602所', NULL, 'tj602s', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('25', '北京兵科院', NULL, 'bjbky', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('26', '北京航天3部', NULL, 'bjht3b', NULL, 'unit_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('27', '前端', NULL, 'fe_code_catehory', NULL, 'gen_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('28', '后端', NULL, 'be_code_catehory', NULL, 'gen_category', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('29', '实体', NULL, 'entity', NULL, 'be_code_catehory', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('30', '路由', NULL, 'controller', NULL, 'be_code_catehory', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('31', '服务', NULL, 'service', NULL, 'be_code_catehory', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('32', '模块', NULL, 'module', NULL, 'be_code_catehory', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('33', '页面', NULL, 'page', NULL, 'fe_code_catehory', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('34', '路由', NULL, 'router', NULL, 'fe_code_catehory', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('35', '配置', NULL, 'config', NULL, 'fe_code_catehory', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('36', '枚举', NULL, 'enum', NULL, 'fe_code_catehory', NULL, NULL, '0', '0', NULL, NULL, NULL, NULL, NULL, NULL);


CREATE TABLE IF NOT EXISTS `s_category_type` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `code` varchar(32) NOT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `parent_id` varchar(32) DEFAULT NULL COMMENT '父级ID',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类类别';

INSERT INTO `s_category_type` (`id`, `name`, `full_name`, `code`, `description`, `parent_id`, `sys_remark`, `sys_sort`, `sys_is_del`, `sys_creator`, `sys_create_time`, `sys_create_ip`, `sys_updater`, `sys_update_time`, `sys_update_ip`) VALUES
	('1', '项目类型', NULL, 'project_type_category', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('2', '链接类型', NULL, 'url_type_category', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('3', '项目类别', NULL, 'project_category', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('4', '工具导航类别', NULL, 'nav_tool_category', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL),
	('5', '单位类别', NULL, 'unit_category', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('6', '生成代码类别', NULL, 'gen_category', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('7', '前端代码类别', NULL, 'fe_code_catehory', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL),
  ('8', '后端代码类别', NULL, 'be_code_catehory', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL);

CREATE TABLE IF NOT EXISTS `dp_template` (
  `id` varchar(32) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `full_name` varchar(50) DEFAULT NULL COMMENT '全称',
  `code` varchar(32) NOT NULL COMMENT '标识',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `bind_gen` varchar(255) DEFAULT NULL COMMENT '生成类别（前端）',
  `bind_gen_template` varchar(255) DEFAULT NULL COMMENT '生成模板类别（前端后端）',
  `bind_gen_template_type` varchar(255) DEFAULT NULL COMMENT '生成模板类型（前端：页面、配置、路由；后端：接口）',
  `template_code` longtext COMMENT '模板代码',
  `template_algithorm` longtext COMMENT '模板算法',
  `parent_id` varchar(32) DEFAULT NULL COMMENT '父级ID',
  `relative_path` varchar(255) DEFAULT NULL COMMENT '相对路径',
  `sys_remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `sys_sort` int(10) DEFAULT NULL COMMENT '排序',
  `sys_is_del` varchar(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '是否删除',
  `sys_creator` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建人',
  `sys_create_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建时间',
  `sys_create_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '创建ip',
  `sys_updater` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改人',
  `sys_update_time` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改时间',
  `sys_update_ip` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '修改ip',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模板';