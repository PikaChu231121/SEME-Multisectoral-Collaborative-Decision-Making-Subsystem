import global from './global';
import video from './video';
import repair from './repair';
import account from './account';
import task from './task';
import traffic from './traffic';
import decision from './decision';
import detection from './detection';
import colmap from './colmap';
import jscc from './jscc';
import chat from './chat';
import comment from './comment';
import split from './split';
import matp from './matp';
import collaboration from './collaboration';
import timeline from './timeline';
import responseHistory from './responseHistory';
export default [
  ...global,
  ...video,
  ...repair,
  ...account,
  ...task,
  ...decision,
  collaboration,
  // timeline,
  // responseHistory,
  ...detection,
  ...colmap,
  ...traffic,
  ...chat,
  ...comment,
  ...split,
  ...jscc,
  ...matp,
];
